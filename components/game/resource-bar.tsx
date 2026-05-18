'use client'

import { useGameStore } from '@/lib/game-store'
import { cn } from '@/lib/utils'

const resourceConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  metal: { 
    label: 'Metal', 
    color: 'bg-zinc-500', 
    bgColor: 'bg-zinc-900/50',
    icon: <MetalIcon />
  },
  wood: { 
    label: 'Wood', 
    color: 'bg-amber-600', 
    bgColor: 'bg-amber-900/50',
    icon: <WoodIcon />
  },
  cloth: { 
    label: 'Cloth', 
    color: 'bg-purple-500', 
    bgColor: 'bg-purple-900/50',
    icon: <ClothIcon />
  },
  food: { 
    label: 'Food', 
    color: 'bg-green-500', 
    bgColor: 'bg-green-900/50',
    icon: <FoodIcon />
  },
  water: { 
    label: 'Water', 
    color: 'bg-cyan-500', 
    bgColor: 'bg-cyan-900/50',
    icon: <WaterIcon />
  },
  ammo: { 
    label: 'Ammo', 
    color: 'bg-yellow-500', 
    bgColor: 'bg-yellow-900/50',
    icon: <AmmoIcon />
  },
  fuel: { 
    label: 'Fuel', 
    color: 'bg-orange-500', 
    bgColor: 'bg-orange-900/50',
    icon: <FuelIcon />
  },
}

function MetalIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 12h16M12 4v16" />
    </svg>
  )
}

function WoodIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 20h16M6 20v-8l6-8 6 8v8" />
      <circle cx="12" cy="14" r="2" />
    </svg>
  )
}

function ClothIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16v16H4zM4 8h16M8 4v16" />
    </svg>
  )
}

function FoodIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" />
      <path d="M12 12v10M4 7l8 5 8-5" />
    </svg>
  )
}

function WaterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L6 12a6 6 0 1012 0L12 2z" />
    </svg>
  )
}

function AmmoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
      <path d="M8 8h8M8 12h8" />
    </svg>
  )
}

function FuelIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 22h12V6a2 2 0 00-2-2H5a2 2 0 00-2 2v16zM7 4V2M11 4V2M15 12h4a2 2 0 012 2v4a2 2 0 01-2 2h-4" />
    </svg>
  )
}

export function ResourceBar() {
  const { resources, maxResources, securityRating, comfortRating, survivors } = useGameStore()

  const aliveSurvivors = survivors.filter(s => s.health > 0)

  return (
    <div className="space-y-3">
      {/* Top info bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Survivors count */}
          <div className="flex items-center gap-2 bg-black/40 rounded px-3 py-1.5">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            <span className="text-sm text-white">
              <span className="font-bold">{aliveSurvivors.length}</span>
              <span className="text-white/60"> Survivors</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Security Rating */}
          <div className="flex items-center gap-2 bg-black/40 rounded px-3 py-1.5">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-sm text-white">
              <span className="font-bold">{Math.round(securityRating)}</span>
              <span className="text-white/60 text-xs ml-1">SEC</span>
            </span>
          </div>

          {/* Comfort Rating */}
          <div className="flex items-center gap-2 bg-black/40 rounded px-3 py-1.5">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-sm text-white">
              <span className="font-bold">{Math.round(comfortRating)}</span>
              <span className="text-white/60 text-xs ml-1">CMF</span>
            </span>
          </div>
        </div>
      </div>

      {/* Resource bars */}
      <div className="grid grid-cols-7 gap-2">
        {Object.entries(resources).map(([key, value]) => {
          const config = resourceConfig[key]
          if (!config) return null
          const max = maxResources[key as keyof typeof maxResources]
          const percentage = Math.min(100, (value / max) * 100)
          const isLow = percentage < 25
          const isCritical = percentage < 10

          return (
            <div 
              key={key}
              className={cn(
                "relative rounded overflow-hidden",
                config.bgColor
              )}
            >
              <div className="flex items-center gap-1.5 px-2 py-1.5 relative z-10">
                <div className={cn(
                  "text-white/70",
                  isCritical && "text-red-400 animate-pulse"
                )}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-white/50 uppercase tracking-wider truncate">
                    {config.label}
                  </div>
                  <div className={cn(
                    "text-xs font-bold",
                    isCritical ? "text-red-400" : isLow ? "text-yellow-400" : "text-white"
                  )}>
                    {Math.floor(value)}/{max}
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
                <div 
                  className={cn(
                    "h-full transition-all duration-300",
                    config.color,
                    isCritical && "animate-pulse"
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
