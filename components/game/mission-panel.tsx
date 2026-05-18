'use client'

import { useState } from 'react'
import { useGameStore, type Mission, type DangerLevel, type ResourceType } from '@/lib/game-store'
import { cn } from '@/lib/utils'

const dangerColors: Record<DangerLevel, { bg: string; text: string; label: string }> = {
  low: { bg: 'bg-green-900/50', text: 'text-green-400', label: 'Low Threat' },
  moderate: { bg: 'bg-yellow-900/50', text: 'text-yellow-400', label: 'Moderate' },
  dangerous: { bg: 'bg-orange-900/50', text: 'text-orange-400', label: 'Dangerous' },
  high: { bg: 'bg-red-900/50', text: 'text-red-400', label: 'High Danger' },
  extreme: { bg: 'bg-purple-900/50', text: 'text-purple-400', label: 'Extreme' },
}

const resourceIcons: Record<string, React.ReactNode> = {
  metal: <MetalIcon />,
  wood: <WoodIcon />,
  cloth: <ClothIcon />,
  food: <FoodIcon />,
  water: <WaterIcon />,
  ammo: <AmmoIcon />,
  fuel: <FuelIcon />,
}

function MetalIcon() {
  return <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
}
function WoodIcon() {
  return <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20h16M6 20v-8l6-8 6 8v8" /></svg>
}
function ClothIcon() {
  return <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z" /></svg>
}
function FoodIcon() {
  return <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" /></svg>
}
function WaterIcon() {
  return <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L6 12a6 6 0 1012 0L12 2z" /></svg>
}
function AmmoIcon() {
  return <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
}
function FuelIcon() {
  return <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 22h12V6a2 2 0 00-2-2H5a2 2 0 00-2 2v16z" /></svg>
}

export function MissionPanel() {
  const { 
    availableMissions, 
    activeMissions, 
    survivors, 
    resources,
    assignToMission, 
    unassignFromMission,
    launchMission 
  } = useGameStore()

  const [selectedMission, setSelectedMission] = useState<string | null>(null)
  const [automate, setAutomate] = useState(false)

  const mission = availableMissions.find(m => m.id === selectedMission)
  const availableSurvivors = survivors.filter(s => 
    s.status === 'idle' && !s.injured && s.health > 20
  )

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const calculateSuccessChance = (m: Mission) => {
    const assigned = survivors.filter(s => m.assignedSurvivors.includes(s.id))
    if (assigned.length === 0) return 0
    
    const totalDPS = assigned.reduce((sum, s) => {
      const weapon = s.equipped.offensive.weapon
      return sum + (weapon?.dps || 5) + s.skills.rangedCombat
    }, 0)
    
    return Math.min(95, Math.floor(50 + (totalDPS / m.zombieCount) * 10))
  }

  const renderMissionCard = (m: Mission, isActive: boolean = false) => {
    const danger = dangerColors[m.dangerLevel]
    const successChance = calculateSuccessChance(m)
    const assignedSurvivors = survivors.filter(s => m.assignedSurvivors.includes(s.id))

    return (
      <div
        key={m.id}
        onClick={() => !isActive && setSelectedMission(m.id)}
        className={cn(
          "bg-stone-800/80 rounded-lg p-3 transition-all border-2",
          isActive 
            ? "border-yellow-600/50" 
            : selectedMission === m.id 
              ? "border-primary cursor-pointer" 
              : "border-transparent hover:border-stone-600 cursor-pointer"
        )}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white truncate">{m.name}</h3>
              {m.isHighActivity && (
                <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold animate-pulse">
                  HIGH ACTIVITY
                </span>
              )}
            </div>
            <div className="text-xs text-stone-400">{m.location}</div>
          </div>
          <div className={cn("px-2 py-0.5 rounded text-xs font-medium", danger.bg, danger.text)}>
            {danger.label}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs mb-2">
          <div className="bg-stone-900/50 rounded p-1.5">
            <div className="text-stone-500">Level</div>
            <div className="text-white font-bold">{m.level}</div>
          </div>
          <div className="bg-stone-900/50 rounded p-1.5">
            <div className="text-stone-500">Infected</div>
            <div className="text-red-400 font-bold">{m.zombieCount}</div>
          </div>
          <div className="bg-stone-900/50 rounded p-1.5">
            <div className="text-stone-500">Duration</div>
            <div className="text-white font-bold">{formatTime(isActive ? m.timeLeft : m.duration)}</div>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-2">
          <span className="text-[10px] text-stone-500">Finds:</span>
          {m.possibleFinds.map(res => (
            <div key={res} className="text-stone-400" title={res}>
              {resourceIcons[res]}
            </div>
          ))}
        </div>

        {m.assignedSurvivors.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-[10px] text-stone-500">Team:</span>
            {assignedSurvivors.map(s => (
              <div 
                key={s.id}
                className="w-6 h-6 bg-stone-700 rounded flex items-center justify-center"
                title={s.name}
              >
                <svg viewBox="0 0 20 24" className="w-4 h-5">
                  <ellipse cx="10" cy="6" rx="5" ry="5" fill="#d4a574" />
                  <rect x="4" y="11" width="12" height="10" rx="2" fill="#4a6741" />
                </svg>
              </div>
            ))}
            <span className="text-[10px] text-stone-400">({m.assignedSurvivors.length}/5)</span>
          </div>
        )}

        {isActive && (
          <div className="mt-2">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-stone-500">Progress</span>
              <span className={cn(
                m.status === 'returning' ? "text-green-400" : "text-yellow-400"
              )}>
                {m.status === 'returning' ? 'Returning...' : 'In Progress'}
              </span>
            </div>
            <div className="h-1.5 bg-stone-900 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all",
                  m.status === 'returning' ? "bg-green-500" : "bg-yellow-500"
                )}
                style={{ 
                  width: `${100 - ((m.timeLeft / (m.status === 'returning' ? m.returnTime : m.duration)) * 100)}%` 
                }}
              />
            </div>
          </div>
        )}

        {!isActive && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-700">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              <span className={cn(
                "text-xs",
                resources.ammo >= m.ammoRequired ? "text-stone-300" : "text-red-400"
              )}>
                {m.ammoRequired} Ammo
              </span>
            </div>
            <div className={cn(
              "text-xs font-bold",
              successChance >= 70 ? "text-green-400" : 
              successChance >= 40 ? "text-yellow-400" : "text-red-400"
            )}>
              {successChance}% Success
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-stone-900/50 rounded-lg border border-stone-800 overflow-hidden">
      <div className="bg-stone-800 px-4 py-3 border-b border-stone-700">
        <h2 className="font-bold text-white flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
            <line x1="9" y1="3" x2="9" y2="18" />
            <line x1="15" y1="6" x2="15" y2="21" />
          </svg>
          Missions
        </h2>
      </div>

      <div className="p-4">
        {activeMissions.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4 animate-pulse" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
              </svg>
              Active Missions ({activeMissions.length})
            </h3>
            <div className="space-y-2">
              {activeMissions.map(m => renderMissionCard(m, true))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-stone-300 mb-2">
              Available Missions ({availableMissions.length})
            </h3>
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {availableMissions.length === 0 ? (
                <div className="text-center text-stone-500 text-sm py-8">
                  No missions available. Check back tomorrow.
                </div>
              ) : (
                availableMissions.map(m => renderMissionCard(m))
              )}
            </div>
          </div>

          <div>
            {mission ? (
              <div className="bg-stone-800/50 rounded-lg p-4 space-y-4">
                <div>
                  <h3 className="font-bold text-white">{mission.name}</h3>
                  <p className="text-sm text-stone-400 mt-1">
                    Search the area for supplies. Expected infected: {mission.zombieCount}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-stone-900/50 rounded p-2">
                    <div className="text-stone-500 text-xs">Return Time</div>
                    <div className="text-white">{formatTime(mission.returnTime)}</div>
                  </div>
                  <div className="bg-stone-900/50 rounded p-2">
                    <div className="text-stone-500 text-xs">XP Reward</div>
                    <div className="text-blue-400">{mission.rewards.xp} XP</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-stone-300 mb-2">
                    Assign Survivors ({mission.assignedSurvivors.length}/5)
                  </h4>
                  
                  {mission.assignedSurvivors.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {survivors
                        .filter(s => mission.assignedSurvivors.includes(s.id))
                        .map(s => (
                          <button
                            key={s.id}
                            onClick={() => unassignFromMission(s.id, mission.id)}
                            className="flex items-center gap-1 bg-primary/20 text-primary text-xs px-2 py-1 rounded hover:bg-primary/30 transition-colors"
                          >
                            {s.name}
                            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </button>
                        ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {availableSurvivors
                      .filter(s => !mission.assignedSurvivors.includes(s.id))
                      .map(s => (
                        <button
                          key={s.id}
                          onClick={() => assignToMission(s.id, mission.id)}
                          disabled={mission.assignedSurvivors.length >= 5}
                          className={cn(
                            "text-xs px-2 py-1 rounded transition-colors",
                            mission.assignedSurvivors.length >= 5
                              ? "bg-stone-800 text-stone-500 cursor-not-allowed"
                              : "bg-stone-700 text-stone-300 hover:bg-stone-600"
                          )}
                        >
                          {s.name} (Lv.{s.level})
                        </button>
                      ))}
                  </div>

                  {availableSurvivors.length === 0 && mission.assignedSurvivors.length === 0 && (
                    <div className="text-xs text-stone-500 text-center py-2">
                      No available survivors
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between bg-stone-900/50 rounded p-2">
                  <div>
                    <div className="text-sm text-stone-300">Automate</div>
                    <div className="text-[10px] text-stone-500">1.5x return time</div>
                  </div>
                  <button
                    onClick={() => setAutomate(!automate)}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative",
                      automate ? "bg-primary" : "bg-stone-700"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all",
                      automate ? "left-6" : "left-0.5"
                    )} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    launchMission(mission.id, automate)
                    setSelectedMission(null)
                  }}
                  disabled={
                    mission.assignedSurvivors.length === 0 || 
                    resources.ammo < mission.ammoRequired
                  }
                  className={cn(
                    "w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors",
                    mission.assignedSurvivors.length > 0 && resources.ammo >= mission.ammoRequired
                      ? "bg-green-600 hover:bg-green-500 text-white"
                      : "bg-stone-700 text-stone-500 cursor-not-allowed"
                  )}
                >
                  {resources.ammo < mission.ammoRequired 
                    ? 'Not Enough Ammo'
                    : mission.assignedSurvivors.length === 0
                      ? 'Assign Survivors'
                      : 'Launch Mission'
                  }
                </button>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-stone-500 text-sm bg-stone-800/30 rounded-lg min-h-[200px]">
                Select a mission to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
