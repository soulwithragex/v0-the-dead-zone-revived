'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useGameStore } from '@/lib/game-store'
import { cn } from '@/lib/utils'

const MAP_WIDTH = 800
const MAP_HEIGHT = 550

// Building visual data
const buildingVisuals: Record<string, { 
  color: string
  borderColor: string
  icon: React.ReactNode
}> = {
  warehouse: {
    color: 'bg-stone-700',
    borderColor: 'border-stone-500',
    icon: <WarehouseIcon />,
  },
  rally_flag: {
    color: 'bg-red-900/80',
    borderColor: 'border-red-700',
    icon: <FlagIcon />,
  },
  small_barricade: {
    color: 'bg-amber-900/80',
    borderColor: 'border-amber-700',
    icon: <BarricadeIcon />,
  },
  large_barricade: {
    color: 'bg-amber-800/80',
    borderColor: 'border-amber-600',
    icon: <BarricadeIcon />,
  },
  watchtower: {
    color: 'bg-slate-700/80',
    borderColor: 'border-slate-500',
    icon: <TowerIcon />,
  },
  bed: {
    color: 'bg-indigo-900/80',
    borderColor: 'border-indigo-700',
    icon: <BedIcon />,
  },
  vegetable_garden: {
    color: 'bg-green-900/80',
    borderColor: 'border-green-700',
    icon: <GardenIcon />,
  },
  water_collector: {
    color: 'bg-cyan-900/80',
    borderColor: 'border-cyan-700',
    icon: <WaterIcon />,
  },
  metal_storage: {
    color: 'bg-zinc-700/80',
    borderColor: 'border-zinc-500',
    icon: <StorageIcon />,
  },
  food_storage: {
    color: 'bg-orange-900/80',
    borderColor: 'border-orange-700',
    icon: <StorageIcon />,
  },
}

function WarehouseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21h18M3 7v14M21 7v14M6 21V10M18 21V10M6 10h12M9 14h6M9 17h6M12 3L3 7h18L12 3z" />
    </svg>
  )
}

function FlagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 21V4M4 4l12 4-12 4" />
    </svg>
  )
}

function BarricadeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="8" width="20" height="12" rx="1" />
      <path d="M6 8V6M12 8V4M18 8V6M2 14h20" />
    </svg>
  )
}

function TowerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L8 6v4l-4 2v10h4v-6h8v6h4V12l-4-2V6l-4-4zM8 12h8" />
    </svg>
  )
}

function BedIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 18v-6a2 2 0 012-2h16a2 2 0 012 2v6M2 18h20M4 10V6a2 2 0 012-2h4v6M6 8a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  )
}

function GardenIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22V12M12 12c-3-3-6 0-6 3 0-3-3-6-6-3M12 12c3-3 6 0 6 3 0-3 3-6 6-3M7 22h10" />
    </svg>
  )
}

function WaterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L6 12a6 6 0 1012 0L12 2z" />
    </svg>
  )
}

function StorageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
  )
}

export function CompoundMap() {
  const { 
    buildings, 
    survivors, 
    hordes, 
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
  } = useGameStore()

  const mapRef = useRef<HTMLDivElement>(null)
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
  const handleMapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return

    const rect = mapRef.current.getBoundingClientRect()
    const x = Math.max(40, Math.min(MAP_WIDTH - 40, e.clientX - rect.left))
    const y = Math.max(40, Math.min(MAP_HEIGHT - 40, e.clientY - rect.top))

    setClickIndicator({ x, y })
    setTimeout(() => setClickIndicator(null), 400)

    setPlayerTarget({ x, y })
  }, [setPlayerTarget])

  const handleBuildingClick = (buildingId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedTab('buildings')
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
    hordes.filter(h => h.status === 'attacking').forEach(horde => {
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
          Click to move | Day {useGameStore.getState().day}
        </div>
      </div>

      {/* SVG Map */}
      <svg 
        ref={mapRef as unknown as React.Ref<SVGSVGElement>}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="w-full h-[500px] lg:h-[550px] cursor-crosshair"
        onClick={handleMapClick as unknown as React.MouseEventHandler<SVGSVGElement>}
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
          <pattern id="concrete" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="#3a3a3a"/>
            <circle cx="1" cy="1" r="0.5" fill="#444"/>
            <circle cx="3" cy="3" r="0.3" fill="#333"/>
          </pattern>
        </defs>

        {/* Grid background */}
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Night overlay */}
        {isNight && (
          <rect width="100%" height="100%" fill="rgba(10, 20, 40, 0.5)" />
        )}

        {/* Ground details - debris, cracks */}
        <g opacity="0.4">
          {Array.from({ length: 20 }).map((_, i) => (
            <ellipse
              key={`debris-${i}`}
              cx={100 + Math.random() * 600}
              cy={80 + Math.random() * 400}
              rx={3 + Math.random() * 8}
              ry={2 + Math.random() * 4}
              fill="#2a2a2a"
            />
          ))}
        </g>

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

        {/* Road/path around compound */}
        <path
          d={`M 60,${MAP_HEIGHT/2} L 150,${MAP_HEIGHT/2} M ${MAP_WIDTH - 150},${MAP_HEIGHT/2} L ${MAP_WIDTH - 60},${MAP_HEIGHT/2}`}
          stroke="#3a3a3a"
          strokeWidth="30"
          fill="none"
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
          const visual = buildingVisuals[building.type] || {
            color: 'bg-gray-700',
            borderColor: 'border-gray-500',
            icon: <StorageIcon />,
          }
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
                <rect width="24" height="24" fill="none" />
                <g className="text-white/70" transform="scale(0.8)" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {/* Simplified icon representation */}
                  {building.type === 'warehouse' && (
                    <>
                      <rect x="2" y="10" width="20" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M12 2L2 10h20L12 2z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </>
                  )}
                  {building.type === 'rally_flag' && (
                    <path d="M4 20V4M4 4l10 4-10 4" fill="none" stroke="#ef4444" strokeWidth="2" />
                  )}
                  {(building.type === 'small_barricade' || building.type === 'large_barricade') && (
                    <>
                      <rect x="2" y="8" width="20" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M6 8V5M12 8V3M18 8V5" stroke="currentColor" strokeWidth="1.5" />
                    </>
                  )}
                </g>
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
        {otherSurvivors.map((survivor, index) => {
          const angle = (index / Math.max(otherSurvivors.length, 1)) * Math.PI * 1.5 - Math.PI / 4
          const radius = 120 + (index % 3) * 40
          const x = MAP_WIDTH/2 + Math.cos(angle) * radius
          const y = MAP_HEIGHT/2 + Math.sin(angle) * radius * 0.6
          
          return (
            <g key={survivor.id}>
              {renderSurvivorSprite(survivor, x, y, false, survivor.isMoving, survivor.direction, 0)}
              {/* Name tag */}
              <text x={x} y={y + 38} textAnchor="middle" fontSize="9" fill="#ccc" fontWeight="500">
                {survivor.name.split(' ')[0]}
              </text>
            </g>
          )
        })}

        {/* Player character (Leader) */}
        {leader && renderSurvivorSprite(
          leader,
          playerPosition.x,
          playerPosition.y,
          true,
          playerMoving,
          playerDirection,
          walkFrame
        )}

        {/* Zombies */}
        {zombiePositions.map((pos, i) => renderZombieSprite(pos.x, pos.y, i))}

        {/* Click indicator */}
        {clickIndicator && (
          <g transform={`translate(${clickIndicator.x}, ${clickIndicator.y})`}>
            <circle r="15" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.8">
              <animate attributeName="r" from="5" to="20" dur="0.4s" fill="freeze" />
              <animate attributeName="opacity" from="1" to="0" dur="0.4s" fill="freeze" />
            </circle>
            <circle r="3" fill="#22c55e" opacity="0.8">
              <animate attributeName="opacity" from="1" to="0" dur="0.4s" fill="freeze" />
            </circle>
          </g>
        )}

        {/* Target marker */}
        {playerTargetPosition && playerMoving && (
          <g transform={`translate(${playerTargetPosition.x}, ${playerTargetPosition.y})`}>
            <rect x="-6" y="-6" width="12" height="12" fill="none" stroke="#22c55e" strokeWidth="2" transform="rotate(45)" opacity="0.6">
              <animate attributeName="opacity" values="0.6;0.3;0.6" dur="1s" repeatCount="indefinite" />
            </rect>
          </g>
        )}
      </svg>

      {/* Status overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-30 pointer-events-none">
        {/* Controls hint */}
        <div className="bg-black/70 backdrop-blur-sm rounded px-3 py-2 text-xs text-white/70 pointer-events-auto">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            <span>Click to move</span>
          </div>
        </div>

        {/* Mini legend */}
        <div className="bg-black/70 backdrop-blur-sm rounded px-3 py-2 text-xs text-white/70 space-y-1 pointer-events-auto">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span>Idle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Defending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span>On Mission</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Injured</span>
          </div>
        </div>
      </div>

      {/* Alert overlay for hordes */}
      {hordes.length > 0 && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-red-900/90 text-white px-4 py-2 rounded-lg border border-red-700 animate-pulse z-50">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold uppercase tracking-wider text-sm">
              {hordes[0].status === 'approaching' 
                ? `HORDE APPROACHING: ${hordes[0].timeUntilAttack}s`
                : `UNDER ATTACK: ${hordes[0].count} INFECTED`
              }
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
