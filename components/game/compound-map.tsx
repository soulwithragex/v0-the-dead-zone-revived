'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useGameStore } from '@/lib/game-store'
import { cn } from '@/lib/utils'

const MAP_WIDTH = 800
const MAP_HEIGHT = 550

export function CompoundMap() {
  const { 
    buildings, 
    survivors, 
    zombieWaves, 
    isNight,
    junkPiles,
    playerPosition,
    playerTargetPosition,
    playerMoving,
    playerDirection,
    setPlayerTarget,
    setSelectedTab,
    selectSurvivor,
    selectedSurvivor,
    day,
  } = useGameStore()

  const mapRef = useRef<SVGSVGElement>(null)
  const [walkFrame, setWalkFrame] = useState(0)
  const [clickIndicator, setClickIndicator] = useState<{ x: number; y: number } | null>(null)
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null)

  // Walk animation
  useEffect(() => {
    if (!playerMoving) {
      setWalkFrame(0)
      return
    }

    const interval = setInterval(() => {
      setWalkFrame(f => (f + 1) % 8)
    }, 100)

    return () => clearInterval(interval)
  }, [playerMoving])

  // Handle click on map
  const handleMapClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!mapRef.current) return

    const rect = mapRef.current.getBoundingClientRect()
    const scaleX = MAP_WIDTH / rect.width
    const scaleY = MAP_HEIGHT / rect.height
    const x = Math.max(40, Math.min(MAP_WIDTH - 40, (e.clientX - rect.left) * scaleX))
    const y = Math.max(40, Math.min(MAP_HEIGHT - 40, (e.clientY - rect.top) * scaleY))

    setClickIndicator({ x, y })
    setTimeout(() => setClickIndicator(null), 400)

    setPlayerTarget({ x, y })
  }, [setPlayerTarget])

  const handleBuildingClick = (buildingId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedTab('base')
  }

  const handleSurvivorClick = (survivorId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    selectSurvivor(survivorId)
    setSelectedTab('survivors')
  }

  // Render survivor sprite (proper humanoid figure)
  const renderSurvivorSprite = (
    survivor: typeof survivors[0], 
    x: number, 
    y: number, 
    isPlayer: boolean = false,
    isMoving: boolean = false,
    direction: string = 'down',
    frame: number = 0
  ) => {
    const statusColors = {
      idle: '#4ade80',
      defending: '#3b82f6',
      mission: '#f59e0b',
      building: '#8b5cf6',
      resting: '#a855f7',
      injured: '#ef4444',
    }

    const bobOffset = isMoving ? Math.sin(frame * 0.8) * 2 : 0
    const legOffset = isMoving ? Math.sin(frame * 1.2) * 4 : 0
    const armOffset = isMoving ? Math.sin(frame * 1.2 + Math.PI) * 15 : 0
    const flipX = direction === 'left' ? -1 : 1

    return (
      <g 
        transform={`translate(${x}, ${y + bobOffset}) scale(${flipX}, 1)`}
        className={cn(
          "cursor-pointer transition-transform",
          isPlayer && "drop-shadow-lg"
        )}
        onClick={(e) => !isPlayer && handleSurvivorClick(survivor.id, e as unknown as React.MouseEvent)}
      >
        {/* Shadow */}
        <ellipse cx="0" cy="24" rx="10" ry="4" fill="rgba(0,0,0,0.3)" />
        
        {/* Legs */}
        <g transform={`translate(0, 10)`}>
          <rect 
            x="-5" y="8" width="4" height="12" rx="1" fill="#3d4a3a"
            transform={`rotate(${legOffset}, -3, 8)`}
          />
          <rect 
            x="1" y="8" width="4" height="12" rx="1" fill="#3d4a3a"
            transform={`rotate(${-legOffset}, 3, 8)`}
          />
          {/* Boots */}
          <rect x="-6" y="18" width="5" height="4" rx="1" fill="#2d2d2d" transform={`rotate(${legOffset * 0.5}, -3, 18)`} />
          <rect x="1" y="18" width="5" height="4" rx="1" fill="#2d2d2d" transform={`rotate(${-legOffset * 0.5}, 3, 18)`} />
        </g>
        
        {/* Body/Torso */}
        <rect x="-8" y="-2" width="16" height="14" rx="2" fill={isPlayer ? "#4a6741" : "#5a5a5a"} />
        <rect x="-7" y="-1" width="14" height="6" rx="1" fill={isPlayer ? "#5a7751" : "#6a6a6a"} />
        
        {/* Arms */}
        <g transform={`translate(-10, 0)`}>
          <rect 
            x="0" y="0" width="4" height="10" rx="1" 
            fill={isPlayer ? "#4a6741" : "#5a5a5a"}
            transform={`rotate(${armOffset}, 2, 0)`}
          />
          <rect x="0" y="8" width="4" height="3" rx="1" fill="#d4a574" transform={`rotate(${armOffset}, 2, 0)`} />
        </g>
        <g transform={`translate(6, 0)`}>
          <rect 
            x="0" y="0" width="4" height="10" rx="1" 
            fill={isPlayer ? "#4a6741" : "#5a5a5a"}
            transform={`rotate(${-armOffset}, 2, 0)`}
          />
          <rect x="0" y="8" width="4" height="3" rx="1" fill="#d4a574" transform={`rotate(${-armOffset}, 2, 0)`} />
        </g>
        
        {/* Head */}
        <ellipse cx="0" cy="-10" rx="7" ry="8" fill="#d4a574" />
        {/* Hair */}
        <path d="M-6 -16 Q0 -20 6 -16 Q7 -12 6 -10 Q0 -12 -6 -10 Q-7 -12 -6 -16" fill={isPlayer ? "#3d2b1f" : "#4a3728"} />
        
        {/* Face */}
        <circle cx="-2" cy="-10" r="1" fill="#2d2d2d" />
        <circle cx="2" cy="-10" r="1" fill="#2d2d2d" />
        
        {/* Status indicator */}
        <circle 
          cx="8" cy="-16" r="4" 
          fill={statusColors[survivor.status]}
          stroke="#1a1a1a"
          strokeWidth="1"
        />
        
        {/* Selection ring for player */}
        {isPlayer && (
          <ellipse 
            cx="0" cy="24" rx="14" ry="5" 
            fill="none" 
            stroke="#22c55e" 
            strokeWidth="2"
            strokeDasharray="4 2"
            className="animate-pulse"
          />
        )}
        
        {/* Selection ring for selected survivor */}
        {selectedSurvivor === survivor.id && !isPlayer && (
          <ellipse 
            cx="0" cy="24" rx="14" ry="5" 
            fill="none" 
            stroke="#f59e0b" 
            strokeWidth="2"
          />
        )}
      </g>
    )
  }

  // Render zombie sprite
  const renderZombieSprite = (x: number, y: number, index: number) => {
    const wobble = Math.sin(Date.now() * 0.003 + index) * 3
    const armWobble = Math.sin(Date.now() * 0.005 + index) * 10

    return (
      <g transform={`translate(${x + wobble}, ${y})`} key={`zombie-${index}`}>
        {/* Shadow */}
        <ellipse cx="0" cy="20" rx="8" ry="3" fill="rgba(0,0,0,0.3)" />
        
        {/* Legs - shambling */}
        <rect x="-4" y="8" width="3" height="10" rx="1" fill="#4a5d23" transform={`rotate(${wobble * 2}, -2, 8)`} />
        <rect x="1" y="8" width="3" height="10" rx="1" fill="#4a5d23" transform={`rotate(${-wobble * 2}, 2, 8)`} />
        
        {/* Body - hunched */}
        <rect x="-6" y="-2" width="12" height="12" rx="2" fill="#5a6d33" />
        
        {/* Arms - reaching forward */}
        <rect x="-10" y="-2" width="4" height="10" rx="1" fill="#5a6d33" transform={`rotate(${-30 + armWobble}, -8, 0)`} />
        <rect x="6" y="-2" width="4" height="10" rx="1" fill="#5a6d33" transform={`rotate(${30 - armWobble}, 8, 0)`} />
        
        {/* Head */}
        <ellipse cx="0" cy="-8" rx="6" ry="7" fill="#4a5d23" />
        
        {/* Glowing red eyes */}
        <circle cx="-2" cy="-8" r="1.5" fill="#ff3333">
          <animate attributeName="opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="2" cy="-8" r="1.5" fill="#ff3333">
          <animate attributeName="opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite" />
        </circle>
        
        {/* Blood stains */}
        <circle cx="3" cy="2" r="2" fill="#8b0000" opacity="0.7" />
        <circle cx="-4" cy="5" r="1.5" fill="#8b0000" opacity="0.6" />
      </g>
    )
  }

  // Get attacking zombies positions
  const getZombiePositions = () => {
    const positions: { x: number; y: number }[] = []
    zombieWaves.filter(h => h.status === 'attacking').forEach(horde => {
      const count = Math.min(horde.count, 15)
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
        const radius = 200 + Math.random() * 80
        positions.push({
          x: MAP_WIDTH / 2 + Math.cos(angle) * radius,
          y: MAP_HEIGHT / 2 + Math.sin(angle) * radius * 0.7,
        })
      }
    })
    return positions
  }

  const leader = survivors.find(s => s.class === 'leader')
  const otherSurvivors = survivors.filter(s => s.class !== 'leader' && s.status !== 'mission')
  const zombiePositions = getZombiePositions()

  return (
    <div className="relative w-full overflow-hidden rounded-lg border-2 border-stone-800 bg-gradient-to-b from-[#2a3328] via-[#252e23] to-[#1d231b]">
      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/60 to-transparent z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-white/80 uppercase tracking-wider">Compound View</span>
        </div>
        <div className="text-xs text-white/60">
          Click to move | Day {day}
        </div>
      </div>

      {/* SVG Map */}
      <svg 
        ref={mapRef}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="w-full h-[500px] lg:h-[550px] cursor-crosshair"
        onClick={handleMapClick}
        style={{ background: 'transparent' }}
      >
        {/* Definitions */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
          </pattern>
        </defs>

        {/* Grid background */}
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Night overlay */}
        {isNight && (
          <rect width="100%" height="100%" fill="rgba(10, 20, 40, 0.5)" />
        )}

        {/* Perimeter fence */}
        <rect 
          x="30" y="30" 
          width={MAP_WIDTH - 60} 
          height={MAP_HEIGHT - 60} 
          fill="none" 
          stroke="#5c4033" 
          strokeWidth="4"
          strokeDasharray="20 5"
          rx="4"
        />
        <rect 
          x="40" y="40" 
          width={MAP_WIDTH - 80} 
          height={MAP_HEIGHT - 80} 
          fill="none" 
          stroke="#4a3525" 
          strokeWidth="2"
          rx="2"
        />

        {/* Junk piles */}
        {junkPiles.map((junk) => (
          <g key={junk.id} transform={`translate(${junk.position.x}, ${junk.position.y})`}>
            <rect x="-15" y="-10" width="30" height="20" rx="2" fill="#4a4035" />
            <rect x="-12" y="-8" width="8" height="6" fill="#5a5045" />
            <rect x="0" y="-6" width="10" height="10" fill="#3a3530" />
            <text x="0" y="25" textAnchor="middle" fontSize="8" fill="#888">Junk</text>
          </g>
        ))}

        {/* Buildings */}
        {buildings.map((building) => {
          const isHovered = hoveredBuilding === building.id

          return (
            <g 
              key={building.id}
              transform={`translate(${building.position.x - building.size.width/2}, ${building.position.y - building.size.height/2})`}
              className="cursor-pointer"
              onClick={(e) => handleBuildingClick(building.id, e as unknown as React.MouseEvent)}
              onMouseEnter={() => setHoveredBuilding(building.id)}
              onMouseLeave={() => setHoveredBuilding(null)}
            >
              {/* Building shadow */}
              <rect 
                x="4" y="4" 
                width={building.size.width} 
                height={building.size.height} 
                rx="4"
                fill="rgba(0,0,0,0.3)"
              />
              
              {/* Building base */}
              <rect 
                width={building.size.width} 
                height={building.size.height} 
                rx="4"
                fill={building.type === 'warehouse' ? '#3a3a3a' : '#4a4035'}
                stroke={isHovered ? '#f59e0b' : '#5c4a3a'}
                strokeWidth={isHovered ? 3 : 2}
              />
              
              {/* Building detail */}
              <rect 
                x="4" y="4" 
                width={building.size.width - 8} 
                height={building.size.height - 8} 
                rx="2"
                fill={building.type === 'warehouse' ? '#4a4a4a' : '#5a5045'}
              />
              
              {/* Icon */}
              <g transform={`translate(${building.size.width/2 - 12}, ${building.size.height/2 - 16})`}>
                {building.type === 'warehouse' && (
                  <g stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none">
                    <rect x="2" y="10" width="20" height="12" />
                    <path d="M12 2L2 10h20L12 2z" />
                  </g>
                )}
                {building.type === 'rally_flag' && (
                  <path d="M4 20V4M4 4l10 4-10 4" fill="none" stroke="#ef4444" strokeWidth="2" />
                )}
              </g>
              
              {/* Building name */}
              <text 
                x={building.size.width/2} 
                y={building.size.height + 14} 
                textAnchor="middle"
                fontSize="10"
                fill="#aaa"
                fontWeight="500"
              >
                {building.name}
              </text>
              
              {/* Level indicator */}
              <text 
                x={building.size.width/2} 
                y={building.size.height + 24} 
                textAnchor="middle"
                fontSize="8"
                fill="#777"
              >
                Lv.{building.level}
              </text>

              {/* Health bar if damaged */}
              {building.health < building.maxHealth && (
                <g transform={`translate(4, ${building.size.height - 8})`}>
                  <rect width={building.size.width - 8} height="4" rx="1" fill="#1a1a1a" />
                  <rect 
                    width={(building.size.width - 8) * (building.health / building.maxHealth)} 
                    height="4" 
                    rx="1" 
                    fill={building.health > 60 ? '#22c55e' : building.health > 30 ? '#f59e0b' : '#ef4444'} 
                  />
                </g>
              )}
            </g>
          )
        })}

        {/* Other survivors */}
        {otherSurvivors.map((survivor) => (
          <g key={survivor.id}>
            {renderSurvivorSprite(
              survivor,
              survivor.position.x,
              survivor.position.y,
              false,
              survivor.isMoving,
              survivor.direction,
              walkFrame
            )}
          </g>
        ))}

        {/* Zombies */}
        {zombiePositions.map((pos, index) => renderZombieSprite(pos.x, pos.y, index))}

        {/* Player/Leader */}
        {leader && renderSurvivorSprite(
          leader,
          playerPosition.x,
          playerPosition.y,
          true,
          playerMoving,
          playerDirection,
          walkFrame
        )}

        {/* Click indicator */}
        {clickIndicator && (
          <g transform={`translate(${clickIndicator.x}, ${clickIndicator.y})`}>
            <circle r="15" fill="none" stroke="#22c55e" strokeWidth="2" className="click-ripple" />
            <circle r="3" fill="#22c55e" />
          </g>
        )}

        {/* Target indicator */}
        {playerTargetPosition && playerMoving && (
          <g transform={`translate(${playerTargetPosition.x}, ${playerTargetPosition.y})`}>
            <circle r="8" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 2">
              <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
            </circle>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-black/60 rounded px-3 py-2 text-[10px] text-white/60">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Idle</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Defending</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>Mission</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>Injured</span>
          </div>
        </div>
      </div>
    </div>
  )
}
