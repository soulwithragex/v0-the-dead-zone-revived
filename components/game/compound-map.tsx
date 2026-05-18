'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useGameStore } from '@/lib/game-store'
import { cn } from '@/lib/utils'

interface Position {
  x: number
  y: number
}

interface MapObject {
  id: string
  type: 'building' | 'resource' | 'survivor' | 'zombie' | 'loot'
  name: string
  position: Position
  width: number
  height: number
  icon: string
  interactable: boolean
}

const TILE_SIZE = 40
const MAP_WIDTH = 800
const MAP_HEIGHT = 600

// Building positions on the map
const buildingPositions: Record<string, Position> = {
  storage: { x: 120, y: 150 },
  barricade: { x: 50, y: 350 },
  workshop: { x: 300, y: 100 },
  medical: { x: 500, y: 150 },
  water: { x: 650, y: 200 },
  farm: { x: 200, y: 400 },
  watchtower: { x: 700, y: 400 },
}

export function CompoundMap() {
  const { 
    buildings, 
    survivors, 
    zombieWaves, 
    isNight,
    setSelectedBuilding,
    setSelectedSurvivor,
    selectedSurvivor,
    setSelectedTab
  } = useGameStore()

  const mapRef = useRef<HTMLDivElement>(null)
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 400, y: 300 })
  const [targetPosition, setTargetPosition] = useState<Position | null>(null)
  const [isMoving, setIsMoving] = useState(false)
  const [playerDirection, setPlayerDirection] = useState<'left' | 'right' | 'up' | 'down'>('down')
  const [walkFrame, setWalkFrame] = useState(0)
  const [clickIndicator, setClickIndicator] = useState<Position | null>(null)
  const animationRef = useRef<number>()
  const walkAnimationRef = useRef<number>()

  // Movement speed (pixels per frame)
  const MOVE_SPEED = 3

  // Handle click on map
  const handleMapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return

    const rect = mapRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Show click indicator
    setClickIndicator({ x, y })
    setTimeout(() => setClickIndicator(null), 500)

    // Set target position
    setTargetPosition({ x, y })
    setIsMoving(true)
  }, [])

  // Movement animation loop
  useEffect(() => {
    if (!isMoving || !targetPosition) return

    const animate = () => {
      setPlayerPosition(current => {
        const dx = targetPosition.x - current.x
        const dy = targetPosition.y - current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Update direction based on movement
        if (Math.abs(dx) > Math.abs(dy)) {
          setPlayerDirection(dx > 0 ? 'right' : 'left')
        } else {
          setPlayerDirection(dy > 0 ? 'down' : 'up')
        }

        // Stop if close enough to target
        if (distance < MOVE_SPEED) {
          setIsMoving(false)
          setTargetPosition(null)
          return targetPosition
        }

        // Calculate new position
        const ratio = MOVE_SPEED / distance
        return {
          x: current.x + dx * ratio,
          y: current.y + dy * ratio
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isMoving, targetPosition])

  // Walk animation frames
  useEffect(() => {
    if (!isMoving) {
      setWalkFrame(0)
      return
    }

    const walkAnimate = () => {
      setWalkFrame(f => (f + 1) % 4)
    }

    walkAnimationRef.current = window.setInterval(walkAnimate, 150)

    return () => {
      if (walkAnimationRef.current) {
        clearInterval(walkAnimationRef.current)
      }
    }
  }, [isMoving])

  // Handle building click
  const handleBuildingClick = (buildingId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedBuilding(buildingId)
    setSelectedTab('base')
  }

  // Handle survivor click on map
  const handleSurvivorClick = (survivorId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedSurvivor(survivorId)
    setSelectedTab('survivors')
  }

  // Get building icon based on type
  const getBuildingSprite = (type: string, level: number) => {
    const sprites: Record<string, { icon: string; color: string }> = {
      storage: { icon: '📦', color: 'bg-amber-900/80' },
      barricade: { icon: '🧱', color: 'bg-stone-700/80' },
      workshop: { icon: '🔧', color: 'bg-zinc-700/80' },
      medical: { icon: '🏥', color: 'bg-red-900/80' },
      water: { icon: '💧', color: 'bg-blue-900/80' },
      farm: { icon: '🌾', color: 'bg-green-900/80' },
      watchtower: { icon: '🗼', color: 'bg-slate-700/80' },
    }
    return sprites[type] || { icon: '🏠', color: 'bg-gray-700/80' }
  }

  // Render player sprite
  const renderPlayer = () => {
    const walkOffsets = [0, -2, 0, 2]
    const yOffset = walkOffsets[walkFrame]

    return (
      <div
        className="absolute transition-none pointer-events-none z-30"
        style={{
          left: playerPosition.x - 20,
          top: playerPosition.y - 40 + yOffset,
          transform: playerDirection === 'left' ? 'scaleX(-1)' : 'scaleX(1)'
        }}
      >
        {/* Player shadow */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-3 bg-black/30 rounded-full blur-sm"
          style={{ transform: 'translateX(-50%) translateY(35px)' }}
        />
        
        {/* Player body */}
        <div className="relative">
          {/* Legs */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1">
            <div 
              className={cn(
                "w-2 h-6 bg-[#3d5a3d] rounded-b",
                isMoving && walkFrame % 2 === 0 && "translate-y-1"
              )}
            />
            <div 
              className={cn(
                "w-2 h-6 bg-[#3d5a3d] rounded-b",
                isMoving && walkFrame % 2 === 1 && "translate-y-1"
              )}
            />
          </div>
          
          {/* Torso */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#4a6741] rounded-lg border-2 border-[#3d5a3d]">
            {/* Arms */}
            <div 
              className={cn(
                "absolute -left-2 top-1 w-2 h-8 bg-[#4a6741] rounded origin-top",
                isMoving && "animate-swing-arm"
              )}
              style={{
                transform: isMoving ? `rotate(${walkFrame % 2 === 0 ? 20 : -20}deg)` : 'rotate(0deg)'
              }}
            />
            <div 
              className={cn(
                "absolute -right-2 top-1 w-2 h-8 bg-[#4a6741] rounded origin-top",
                isMoving && "animate-swing-arm-reverse"
              )}
              style={{
                transform: isMoving ? `rotate(${walkFrame % 2 === 0 ? -20 : 20}deg)` : 'rotate(0deg)'
              }}
            />
          </div>
          
          {/* Head */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#e8c39e] rounded-full border-2 border-[#d4a574]">
            {/* Face */}
            <div className="absolute top-2 left-1 w-1.5 h-1.5 bg-[#2d2d2d] rounded-full" />
            <div className="absolute top-2 right-1 w-1.5 h-1.5 bg-[#2d2d2d] rounded-full" />
            {/* Hair */}
            <div className="absolute -top-1 left-0 right-0 h-3 bg-[#3d2b1f] rounded-t-full" />
          </div>
          
          {/* Selection indicator */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-2 border-2 border-primary rounded-full animate-pulse" />
        </div>
      </div>
    )
  }

  // Render zombie sprites
  const renderZombies = () => {
    const attackingWaves = zombieWaves.filter(w => w.status === 'attacking')
    if (attackingWaves.length === 0) return null

    const totalZombies = attackingWaves.reduce((sum, w) => sum + Math.min(w.zombieCount, 10), 0)
    const zombiePositions = []

    for (let i = 0; i < totalZombies; i++) {
      const angle = (i / totalZombies) * Math.PI * 2
      const radius = 280 + Math.random() * 50
      const x = MAP_WIDTH / 2 + Math.cos(angle) * radius
      const y = MAP_HEIGHT / 2 + Math.sin(angle) * radius
      zombiePositions.push({ x, y, id: i })
    }

    return zombiePositions.map(zombie => (
      <div
        key={zombie.id}
        className="absolute z-20 animate-pulse"
        style={{
          left: zombie.x - 12,
          top: zombie.y - 24,
        }}
      >
        {/* Zombie body */}
        <div className="relative">
          <div className="w-6 h-6 bg-[#4a5d23] rounded-full border border-[#3d4d1f]">
            <div className="absolute top-1 left-0.5 w-1 h-1 bg-red-500 rounded-full" />
            <div className="absolute top-1 right-0.5 w-1 h-1 bg-red-500 rounded-full" />
          </div>
          <div className="w-5 h-6 bg-[#5a6d33] mx-auto rounded-b" />
        </div>
      </div>
    ))
  }

  return (
    <div className="relative w-full h-[500px] lg:h-[600px] overflow-hidden rounded-lg border border-border bg-gradient-to-b from-[#2d3a2d] to-[#1a2419]">
      {/* Map background grid */}
      <div 
        ref={mapRef}
        className="absolute inset-0 cursor-crosshair"
        onClick={handleMapClick}
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
        }}
      >
        {/* Night overlay */}
        {isNight && (
          <div className="absolute inset-0 bg-blue-950/50 pointer-events-none" />
        )}

        {/* Ground texture */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-[#3d4d2d] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2
              }}
            />
          ))}
        </div>

        {/* Perimeter fence */}
        <div className="absolute inset-8 border-4 border-dashed border-[#5c4033]/50 rounded-lg pointer-events-none" />
        <div className="absolute inset-10 border-2 border-[#8b7355]/30 rounded-lg pointer-events-none" />

        {/* Buildings */}
        {buildings.map(building => {
          const pos = buildingPositions[building.type] || { x: 400, y: 300 }
          const sprite = getBuildingSprite(building.type, building.level)
          const size = 60 + building.level * 10

          return (
            <div
              key={building.id}
              className={cn(
                "absolute cursor-pointer transition-all duration-200 hover:scale-105 hover:z-20",
                "flex flex-col items-center justify-center rounded-lg border-2",
                sprite.color,
                building.health < 50 ? "border-destructive" : "border-[#5c4033]"
              )}
              style={{
                left: pos.x - size / 2,
                top: pos.y - size / 2,
                width: size,
                height: size,
              }}
              onClick={(e) => handleBuildingClick(building.id, e)}
            >
              <span className="text-2xl lg:text-3xl">{sprite.icon}</span>
              <span className="text-[10px] text-white/80 font-medium mt-1 text-center px-1 truncate w-full">
                {building.name}
              </span>
              <span className="text-[9px] text-white/60">Lv.{building.level}</span>
              
              {/* Health bar */}
              {building.health < building.maxHealth && (
                <div className="absolute -bottom-3 left-0 right-0 h-1.5 bg-black/50 rounded-full mx-2">
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      building.health > 60 ? "bg-green-500" : building.health > 30 ? "bg-yellow-500" : "bg-red-500"
                    )}
                    style={{ width: `${(building.health / building.maxHealth) * 100}%` }}
                  />
                </div>
              )}
            </div>
          )
        })}

        {/* Other survivors on map */}
        {survivors.slice(1).map((survivor, index) => {
          // Position survivors around the compound
          const angle = (index / (survivors.length - 1)) * Math.PI * 1.5 - Math.PI / 4
          const radius = 150 + Math.random() * 50
          const x = 400 + Math.cos(angle) * radius
          const y = 300 + Math.sin(angle) * radius

          return (
            <div
              key={survivor.id}
              className={cn(
                "absolute cursor-pointer z-10 transition-transform hover:scale-110",
                selectedSurvivor === survivor.id && "ring-2 ring-primary ring-offset-2 ring-offset-transparent rounded-full"
              )}
              style={{
                left: x - 16,
                top: y - 32,
              }}
              onClick={(e) => handleSurvivorClick(survivor.id, e)}
            >
              {/* Survivor shadow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-2 bg-black/20 rounded-full blur-sm" />
              
              {/* Survivor sprite */}
              <div className="relative">
                {/* Body */}
                <div className="w-8 h-8 bg-[#6b7c5a] rounded-lg border border-[#5a6b49] flex items-center justify-center">
                  <span className="text-lg">{survivor.avatar}</span>
                </div>
                
                {/* Status indicator */}
                <div className={cn(
                  "absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white/50",
                  survivor.status === 'idle' && "bg-green-500",
                  survivor.status === 'defending' && "bg-blue-500",
                  survivor.status === 'scavenging' && "bg-yellow-500",
                  survivor.status === 'resting' && "bg-purple-500",
                  survivor.status === 'injured' && "bg-red-500 animate-pulse"
                )} />
                
                {/* Name tag */}
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-[10px] bg-black/60 text-white px-1 rounded">
                    {survivor.name}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        {/* Player character */}
        {renderPlayer()}

        {/* Zombies */}
        {renderZombies()}

        {/* Click indicator */}
        {clickIndicator && (
          <div
            className="absolute pointer-events-none z-50"
            style={{
              left: clickIndicator.x - 15,
              top: clickIndicator.y - 15,
            }}
          >
            <div className="w-[30px] h-[30px] border-2 border-primary rounded-full animate-ping" />
            <div className="absolute inset-0 w-[30px] h-[30px] border-2 border-primary/50 rounded-full" />
          </div>
        )}

        {/* Target indicator */}
        {targetPosition && isMoving && (
          <div
            className="absolute pointer-events-none z-40"
            style={{
              left: targetPosition.x - 8,
              top: targetPosition.y - 8,
            }}
          >
            <div className="w-4 h-4 border-2 border-primary/70 rotate-45 animate-pulse" />
          </div>
        )}
      </div>

      {/* Map controls */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white/80">
          Click anywhere to move
        </div>
      </div>

      {/* Player position indicator */}
      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white/80">
        Position: {Math.round(playerPosition.x)}, {Math.round(playerPosition.y)}
      </div>

      {/* Mini legend */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-2 text-xs text-white/80 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span>Idle</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span>Defending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span>Scavenging</span>
        </div>
      </div>
    </div>
  )
}
