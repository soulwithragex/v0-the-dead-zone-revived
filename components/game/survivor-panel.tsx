'use client'

import { useState } from 'react'
import { useGameStore, type Survivor, type SurvivorClass } from '@/lib/game-store'
import { cn } from '@/lib/utils'

const classInfo: Record<SurvivorClass, { name: string; description: string; color: string; specialization: string }> = {
  leader: { 
    name: 'Leader', 
    description: 'Well-rounded survivor who leads the group',
    color: 'text-yellow-400',
    specialization: 'Pistol, Rifle, Melee'
  },
  fighter: { 
    name: 'Fighter', 
    description: 'Combat specialist with high damage output',
    color: 'text-red-400',
    specialization: 'Assault, Shotgun, SMG'
  },
  medic: { 
    name: 'Medic', 
    description: 'Can heal other survivors during missions',
    color: 'text-green-400',
    specialization: 'Pistol, SMG'
  },
  scavenger: { 
    name: 'Scavenger', 
    description: 'Finds more and better loot',
    color: 'text-purple-400',
    specialization: 'Pistol, Melee'
  },
  engineer: { 
    name: 'Engineer', 
    description: 'Faster building and trap disarming',
    color: 'text-blue-400',
    specialization: 'Shotgun, Pistol'
  },
  recon: { 
    name: 'Recon', 
    description: 'Fast movement and spot traps easily',
    color: 'text-cyan-400',
    specialization: 'Rifle, Pistol'
  },
}

const statusInfo: Record<string, { label: string; color: string }> = {
  idle: { label: 'Idle', color: 'bg-green-500' },
  mission: { label: 'On Mission', color: 'bg-yellow-500' },
  defending: { label: 'Defending', color: 'bg-blue-500' },
  building: { label: 'Building', color: 'bg-purple-500' },
  resting: { label: 'Resting', color: 'bg-indigo-500' },
  injured: { label: 'Injured', color: 'bg-red-500' },
}

export function SurvivorPanel() {
  const { survivors, selectedSurvivor, selectSurvivor, weapons, equipWeapon, assignSurvivorClass, healSurvivor } = useGameStore()
  const [showClassSelect, setShowClassSelect] = useState<string | null>(null)

  const selected = survivors.find(s => s.id === selectedSurvivor)

  const updateSurvivorStatus = (id: string, status: Survivor['status']) => {
    const store = useGameStore.getState()
    store.survivors = store.survivors.map(s => s.id === id ? { ...s, status } : s)
  }

  const renderSurvivorCard = (survivor: Survivor) => {
    const classData = classInfo[survivor.class]
    const status = statusInfo[survivor.status]
    const healthPercent = (survivor.health / survivor.maxHealth) * 100

    return (
      <div
        key={survivor.id}
        onClick={() => selectSurvivor(survivor.id)}
        className={cn(
          "relative bg-stone-800/80 rounded-lg p-3 cursor-pointer transition-all border-2",
          selectedSurvivor === survivor.id 
            ? "border-primary ring-1 ring-primary/50" 
            : "border-transparent hover:border-stone-600"
        )}
      >
        {/* Status indicator */}
        <div className={cn("absolute top-2 right-2 w-2.5 h-2.5 rounded-full", status.color)} />

        {/* Avatar & Basic Info */}
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-14 h-14 bg-stone-700 rounded-lg flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 40 50" className="w-10 h-12">
                <ellipse cx="20" cy="12" rx="9" ry="10" fill="#d4a574" />
                <path d="M11 8 Q20 2 29 8 Q30 12 29 14 Q20 10 11 14 Q10 12 11 8" fill="#3d2b1f" />
                <rect x="8" y="22" width="24" height="18" rx="3" fill="#4a6741" />
                <circle cx="16" cy="12" r="1.5" fill="#2d2d2d" />
                <circle cx="24" cy="12" r="1.5" fill="#2d2d2d" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-stone-900 rounded-full flex items-center justify-center border-2 border-stone-700">
              <span className="text-xs font-bold text-white">{survivor.level}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white truncate">{survivor.name}</h3>
            </div>
            <div className={cn("text-xs font-medium", classData.color)}>
              {classData.name}
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">
              {status.label}
            </div>
          </div>
        </div>

        {/* Health bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-stone-400 mb-1">
            <span>Health</span>
            <span>{Math.floor(survivor.health)}/{survivor.maxHealth}</span>
          </div>
          <div className="h-2 bg-stone-900 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all",
                healthPercent > 60 ? "bg-green-500" : healthPercent > 30 ? "bg-yellow-500" : "bg-red-500"
              )}
              style={{ width: `${healthPercent}%` }}
            />
          </div>
        </div>

        {/* XP bar */}
        <div className="mt-2">
          <div className="flex justify-between text-[10px] text-stone-400 mb-1">
            <span>XP</span>
            <span>{survivor.xp}/{survivor.xpToNextLevel}</span>
          </div>
          <div className="h-1.5 bg-stone-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${(survivor.xp / survivor.xpToNextLevel) * 100}%` }}
            />
          </div>
        </div>

        {survivor.injured && (
          <div className="mt-2 flex items-center gap-1.5 text-red-400 text-xs">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Injured - {Math.ceil(survivor.injuryTimeLeft / 60)}m recovery</span>
          </div>
        )}
      </div>
    )
  }

  const renderDetailPanel = (survivor: Survivor) => {
    const classData = classInfo[survivor.class]
    const offensiveWeapon = survivor.equipped.offensive.weapon
    const defensiveWeapon = survivor.equipped.defensive.weapon

    return (
      <div className="bg-stone-800/50 rounded-lg p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">{survivor.name}</h3>
            <div className={cn("text-sm", classData.color)}>{classData.name}</div>
            <div className="text-xs text-stone-400 mt-1">{classData.description}</div>
          </div>
          {survivor.class !== 'leader' && (
            <button
              onClick={() => setShowClassSelect(survivor.id)}
              className="text-xs bg-stone-700 hover:bg-stone-600 text-white px-2 py-1 rounded transition-colors"
            >
              Change Class
            </button>
          )}
        </div>

        {showClassSelect === survivor.id && (
          <div className="bg-stone-900 rounded-lg p-3 space-y-2">
            <div className="text-sm text-stone-400 mb-2">Select Class:</div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(classInfo) as [SurvivorClass, typeof classInfo[SurvivorClass]][])
                .filter(([key]) => key !== 'leader')
                .map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => {
                      assignSurvivorClass(survivor.id, key)
                      setShowClassSelect(null)
                    }}
                    className={cn(
                      "p-2 rounded text-left transition-colors",
                      survivor.class === key 
                        ? "bg-primary/20 border border-primary" 
                        : "bg-stone-800 hover:bg-stone-700"
                    )}
                  >
                    <div className={cn("font-medium text-sm", info.color)}>{info.name}</div>
                    <div className="text-[10px] text-stone-400">{info.specialization}</div>
                  </button>
                ))}
            </div>
            <button
              onClick={() => setShowClassSelect(null)}
              className="w-full text-xs text-stone-400 hover:text-white py-1"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Morale */}
        <div className="bg-stone-900/50 rounded p-2">
          <div className="flex justify-between text-xs text-stone-400 mb-1">
            <span>Morale</span>
            <span>{Math.floor(survivor.morale)}%</span>
          </div>
          <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all",
                survivor.morale > 60 ? "bg-green-500" : survivor.morale > 30 ? "bg-yellow-500" : "bg-red-500"
              )}
              style={{ width: `${survivor.morale}%` }}
            />
          </div>
        </div>

        {/* Skills */}
        <div>
          <h4 className="text-sm font-semibold text-stone-300 mb-2">Skills</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(survivor.skills).map(([skill, value]) => (
              <div key={skill} className="bg-stone-900/50 rounded px-2 py-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-stone-400 capitalize">
                    {skill.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={cn(
                    "text-xs font-bold",
                    value >= 15 ? "text-green-400" : value >= 10 ? "text-yellow-400" : "text-stone-300"
                  )}>
                    {value}
                  </span>
                </div>
                <div className="h-1 bg-stone-800 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${Math.min(100, (value / 20) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment */}
        <div>
          <h4 className="text-sm font-semibold text-stone-300 mb-2">Equipment</h4>
          
          <div className="bg-stone-900/50 rounded p-2 mb-2">
            <div className="text-xs text-red-400 mb-1.5 font-medium">Offensive Loadout</div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-stone-800 rounded flex items-center justify-center">
                <svg viewBox="0 0 24 24" className={cn("w-6 h-6", offensiveWeapon ? "text-red-400" : "text-stone-600")} fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14.5 4.5L20 10M22 12l-5 5-9-9-4 4-2.5-2.5M9 4L4 9" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                {offensiveWeapon ? (
                  <>
                    <div className={cn(
                      "text-sm font-medium truncate",
                      offensiveWeapon.rarity === 'unique' ? "text-orange-400" :
                      offensiveWeapon.rarity === 'rare' ? "text-purple-400" :
                      offensiveWeapon.rarity === 'uncommon' ? "text-blue-400" : "text-stone-300"
                    )}>
                      {offensiveWeapon.name}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      DMG: {offensiveWeapon.damage} | ACC: {offensiveWeapon.accuracy}% | DPS: {offensiveWeapon.dps}
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-stone-500">No weapon equipped</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-stone-900/50 rounded p-2">
            <div className="text-xs text-blue-400 mb-1.5 font-medium">Defensive Loadout</div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-stone-800 rounded flex items-center justify-center">
                <svg viewBox="0 0 24 24" className={cn("w-6 h-6", defensiveWeapon ? "text-blue-400" : "text-stone-600")} fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                {defensiveWeapon ? (
                  <>
                    <div className="text-sm font-medium text-stone-300 truncate">{defensiveWeapon.name}</div>
                    <div className="text-[10px] text-stone-400">
                      DMG: {defensiveWeapon.damage} | ACC: {defensiveWeapon.accuracy}%
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-stone-500">No weapon equipped</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Available weapons */}
        {weapons.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-stone-300 mb-2">Available Weapons</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {weapons.map(weapon => (
                <div 
                  key={weapon.id}
                  className="flex items-center justify-between bg-stone-900/50 rounded p-2"
                >
                  <div>
                    <div className={cn(
                      "text-sm",
                      weapon.rarity === 'unique' ? "text-orange-400" :
                      weapon.rarity === 'rare' ? "text-purple-400" :
                      weapon.rarity === 'uncommon' ? "text-blue-400" : "text-stone-300"
                    )}>
                      {weapon.name}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Lv.{weapon.level} | {weapon.type} | DPS: {weapon.dps}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => equipWeapon(survivor.id, weapon.id, 'offensive')}
                      className="text-[10px] bg-red-900/50 hover:bg-red-800/50 text-red-300 px-2 py-1 rounded"
                    >
                      OFF
                    </button>
                    <button
                      onClick={() => equipWeapon(survivor.id, weapon.id, 'defensive')}
                      className="text-[10px] bg-blue-900/50 hover:bg-blue-800/50 text-blue-300 px-2 py-1 rounded"
                    >
                      DEF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => healSurvivor(survivor.id)}
            disabled={survivor.health >= survivor.maxHealth}
            className={cn(
              "flex-1 py-2 rounded text-sm font-medium transition-colors",
              survivor.health < survivor.maxHealth
                ? "bg-green-600 hover:bg-green-500 text-white"
                : "bg-stone-700 text-stone-500 cursor-not-allowed"
            )}
          >
            Heal
          </button>
          <button
            onClick={() => {
              const store = useGameStore.getState()
              const newSurvivors = store.survivors.map(s => 
                s.id === survivor.id ? { ...s, status: (survivor.status === 'resting' ? 'idle' : 'resting') as Survivor['status'] } : s
              )
              useGameStore.setState({ survivors: newSurvivors })
            }}
            disabled={survivor.status === 'mission' || survivor.injured}
            className={cn(
              "flex-1 py-2 rounded text-sm font-medium transition-colors",
              survivor.status !== 'mission' && !survivor.injured
                ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                : "bg-stone-700 text-stone-500 cursor-not-allowed"
            )}
          >
            {survivor.status === 'resting' ? 'Stop Rest' : 'Rest'}
          </button>
          <button
            onClick={() => {
              const store = useGameStore.getState()
              const newSurvivors = store.survivors.map(s => 
                s.id === survivor.id ? { ...s, status: (survivor.status === 'defending' ? 'idle' : 'defending') as Survivor['status'] } : s
              )
              useGameStore.setState({ survivors: newSurvivors })
            }}
            disabled={survivor.status === 'mission' || survivor.injured}
            className={cn(
              "flex-1 py-2 rounded text-sm font-medium transition-colors",
              survivor.status !== 'mission' && !survivor.injured
                ? "bg-blue-600 hover:bg-blue-500 text-white"
                : "bg-stone-700 text-stone-500 cursor-not-allowed"
            )}
          >
            {survivor.status === 'defending' ? 'Stand Down' : 'Defend'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-stone-900/50 rounded-lg border border-stone-800 overflow-hidden">
      <div className="bg-stone-800 px-4 py-3 border-b border-stone-700">
        <h2 className="font-bold text-white flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
          Survivors ({survivors.length}/10)
        </h2>
      </div>

      <div className="p-4">
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
            {survivors.map(renderSurvivorCard)}
          </div>

          <div>
            {selected ? (
              renderDetailPanel(selected)
            ) : (
              <div className="h-full flex items-center justify-center text-stone-500 text-sm bg-stone-800/30 rounded-lg min-h-[200px]">
                Select a survivor to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
