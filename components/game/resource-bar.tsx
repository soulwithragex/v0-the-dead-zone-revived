'use client'

import { useGameStore } from '@/lib/game-store'
import { cn } from '@/lib/utils'
import { 
  Utensils, 
  Droplets, 
  Hammer, 
  Fuel, 
  Crosshair,
  Pill,
  Shield,
  Heart
} from 'lucide-react'

export function ResourceBar() {
  const { resources, maxResources, baseDefense, maxBaseDefense, morale } = useGameStore()

  const resourceItems = [
    { 
      key: 'food', 
      label: 'Food', 
      value: resources.food, 
      max: maxResources.food, 
      icon: Utensils,
      color: 'bg-amber-500',
      lowThreshold: 20
    },
    { 
      key: 'water', 
      label: 'Water', 
      value: resources.water, 
      max: maxResources.water, 
      icon: Droplets,
      color: 'bg-blue-500',
      lowThreshold: 20
    },
    { 
      key: 'materials', 
      label: 'Materials', 
      value: resources.materials, 
      max: maxResources.materials, 
      icon: Hammer,
      color: 'bg-orange-500',
      lowThreshold: 10
    },
    { 
      key: 'fuel', 
      label: 'Fuel', 
      value: resources.fuel, 
      max: maxResources.fuel, 
      icon: Fuel,
      color: 'bg-yellow-500',
      lowThreshold: 5
    },
    { 
      key: 'ammo', 
      label: 'Ammo', 
      value: resources.ammo, 
      max: maxResources.ammo, 
      icon: Crosshair,
      color: 'bg-red-500',
      lowThreshold: 10
    },
    { 
      key: 'medicine', 
      label: 'Medicine', 
      value: resources.medicine, 
      max: maxResources.medicine, 
      icon: Pill,
      color: 'bg-green-500',
      lowThreshold: 5
    },
  ]

  return (
    <div className="space-y-2">
      {/* Main resources */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {resourceItems.map((item) => {
          const percentage = (item.value / item.max) * 100
          const isLow = item.value <= item.lowThreshold
          const Icon = item.icon

          return (
            <div 
              key={item.key}
              className={cn(
                "bg-secondary/50 rounded-lg p-2 transition-all",
                isLow && "pulse-danger border border-destructive/50"
              )}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={cn(
                  "w-3.5 h-3.5",
                  isLow ? "text-destructive" : "text-muted-foreground"
                )} />
                <span className="text-xs text-muted-foreground truncate">{item.label}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-300 rounded-full",
                    item.color,
                    isLow && "animate-pulse"
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-xs font-mono text-foreground mt-1">
                {Math.floor(item.value)}/{item.max}
              </div>
            </div>
          )
        })}
      </div>

      {/* Defense and Morale */}
      <div className="flex gap-2">
        <div className="flex-1 bg-secondary/50 rounded-lg p-2">
          <div className="flex items-center gap-1.5 mb-1">
            <Shield className={cn(
              "w-3.5 h-3.5",
              baseDefense < 30 ? "text-destructive" : "text-primary"
            )} />
            <span className="text-xs text-muted-foreground">Base Defense</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-300 rounded-full",
                baseDefense < 30 ? "bg-destructive" : "bg-primary"
              )}
              style={{ width: `${(baseDefense / maxBaseDefense) * 100}%` }}
            />
          </div>
          <div className="text-xs font-mono text-foreground mt-1">
            {Math.floor(baseDefense)}/{maxBaseDefense}
          </div>
        </div>

        <div className="flex-1 bg-secondary/50 rounded-lg p-2">
          <div className="flex items-center gap-1.5 mb-1">
            <Heart className={cn(
              "w-3.5 h-3.5",
              morale < 30 ? "text-destructive" : "text-pink-500"
            )} />
            <span className="text-xs text-muted-foreground">Morale</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-300 rounded-full",
                morale < 30 ? "bg-destructive" : "bg-pink-500"
              )}
              style={{ width: `${morale}%` }}
            />
          </div>
          <div className="text-xs font-mono text-foreground mt-1">
            {Math.floor(morale)}%
          </div>
        </div>
      </div>
    </div>
  )
}
