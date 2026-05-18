"use client"

import { useGameStore } from '@/lib/game-store'
import { Button } from '@/components/ui/button'
import { 
  Hammer, 
  ArrowUp, 
  Wrench, 
  AlertTriangle,
  CheckCircle,
  Lock,
  Package,
  Shield,
  Eye,
  Droplets,
  Wheat,
  Cross,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

const BUILDING_DESCRIPTIONS: Record<string, string> = {
  storage: "Increases maximum resource capacity for all materials.",
  barricade: "Defensive structure that slows and damages attacking infected.",
  watchtower: "Increases base defense and provides early warning of attacks.",
  farm: "Produces food over time. Higher levels increase production rate.",
  water: "Collects and purifies water. Essential for survivor hydration.",
  medical: "Heals injured survivors and produces medical supplies.",
  workshop: "Required for crafting weapons, gear, and base upgrades.",
}

const BUILDING_ICONS: Record<string, React.ReactNode> = {
  storage: <Package className="w-5 h-5" />,
  barricade: <Shield className="w-5 h-5" />,
  watchtower: <Eye className="w-5 h-5" />,
  farm: <Wheat className="w-5 h-5" />,
  water: <Droplets className="w-5 h-5" />,
  medical: <Cross className="w-5 h-5" />,
  workshop: <Settings className="w-5 h-5" />,
}

export function BuildingPanel() {
  const { 
    buildings, 
    resources,
    upgradeBuilding, 
    repairBuilding,
    day 
  } = useGameStore()

  const canAffordUpgrade = (building: typeof buildings[0]) => {
    const baseCost = 30 + (building.level * 15)
    const fuelCost = 5 + (building.level * 3)
    return resources.materials >= baseCost && resources.fuel >= fuelCost
  }

  const canAffordRepair = (building: typeof buildings[0]) => {
    const repairCost = Math.ceil((building.maxHealth - building.health) * 0.3)
    return resources.materials >= repairCost
  }

  const getUpgradeCost = (building: typeof buildings[0]) => {
    return {
      materials: 30 + (building.level * 15),
      fuel: 5 + (building.level * 3)
    }
  }

  const getRepairCost = (building: typeof buildings[0]) => {
    return Math.ceil((building.maxHealth - building.health) * 0.3)
  }

  const getHealthBarColor = (health: number, maxHealth: number) => {
    const percent = (health / maxHealth) * 100
    if (percent <= 25) return 'bg-red-600'
    if (percent <= 50) return 'bg-orange-500'
    if (percent <= 75) return 'bg-yellow-500'
    return 'bg-green-600'
  }

  const getStatusText = (health: number, maxHealth: number) => {
    const percent = (health / maxHealth) * 100
    if (percent <= 25) return { text: 'CRITICAL', color: 'text-red-500' }
    if (percent <= 50) return { text: 'DAMAGED', color: 'text-orange-500' }
    if (percent <= 75) return { text: 'WORN', color: 'text-yellow-500' }
    return { text: 'OPERATIONAL', color: 'text-green-500' }
  }

  return (
    <div className="bg-zinc-900/95 border border-zinc-700 h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 px-4 py-3 border-b border-zinc-700">
        <div className="flex items-center gap-3">
          <Hammer className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-zinc-100 uppercase tracking-wide">Compound Structures</h2>
        </div>
        <p className="text-xs text-zinc-500 mt-1">Build and upgrade structures to improve your compound</p>
      </div>

      {/* Building List */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {buildings.map((building) => {
            const needsRepair = building.health < building.maxHealth
            const canUpgrade = canAffordUpgrade(building) && building.level < building.maxLevel
            const canRepair = canAffordRepair(building) && needsRepair
            const upgradeCost = getUpgradeCost(building)
            const repairCost = getRepairCost(building)
            const status = getStatusText(building.health, building.maxHealth)
            const healthPercent = (building.health / building.maxHealth) * 100
            
            return (
              <div
                key={building.id}
                className={cn(
                  "bg-zinc-800/80 border rounded-sm overflow-hidden transition-all",
                  needsRepair ? "border-orange-700/50" : "border-zinc-600 hover:border-zinc-500"
                )}
              >
                {/* Building Header */}
                <div className="flex items-start gap-3 p-3 bg-zinc-800/50">
                  <div className={cn(
                    "w-10 h-10 rounded flex items-center justify-center",
                    needsRepair ? "bg-orange-900/50 text-orange-400" : "bg-zinc-700 text-zinc-300"
                  )}>
                    {BUILDING_ICONS[building.type] || <Package className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-zinc-100 text-sm truncate">
                        {building.name}
                      </h3>
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded",
                        building.level >= building.maxLevel 
                          ? "bg-amber-600/30 text-amber-400"
                          : "bg-zinc-700 text-zinc-300"
                      )}>
                        LVL {building.level}{building.level >= building.maxLevel && " MAX"}
                      </span>
                    </div>
                    
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {BUILDING_DESCRIPTIONS[building.type] || "Structure providing bonuses to your compound."}
                    </p>
                  </div>
                </div>

                {/* Health Bar */}
                <div className="px-3 py-2 bg-zinc-900/50 border-t border-zinc-700/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-zinc-400">Structural Integrity</span>
                    <span className={cn("text-xs font-medium", status.color)}>
                      {status.text}
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-700 rounded-sm overflow-hidden">
                    <div 
                      className={cn("h-full transition-all", getHealthBarColor(building.health, building.maxHealth))}
                      style={{ width: `${healthPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-zinc-500">{building.health} / {building.maxHealth} HP</span>
                    {building.health <= building.maxHealth * 0.5 && (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                        <span className="text-xs text-orange-400">Needs repair</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-3 bg-zinc-900/30 border-t border-zinc-700/50 space-y-2">
                  {/* Upgrade */}
                  {building.level < building.maxLevel && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-zinc-400">Upgrade Cost:</span>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={resources.materials >= upgradeCost.materials ? 'text-zinc-300' : 'text-red-400'}>
                            {upgradeCost.materials} Materials
                          </span>
                          <span className={resources.fuel >= upgradeCost.fuel ? 'text-zinc-300' : 'text-red-400'}>
                            {upgradeCost.fuel} Fuel
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => upgradeBuilding(building.id)}
                        disabled={!canUpgrade}
                        className={cn(
                          "w-full h-8 text-xs font-semibold uppercase tracking-wide",
                          canUpgrade 
                            ? "bg-amber-600 hover:bg-amber-500 text-white"
                            : "bg-zinc-700 text-zinc-500"
                        )}
                      >
                        <ArrowUp className="w-3 h-3 mr-1" />
                        Upgrade to Level {building.level + 1}
                      </Button>
                    </div>
                  )}

                  {/* Repair */}
                  {needsRepair && (
                    <Button
                      onClick={() => repairBuilding(building.id)}
                      disabled={!canRepair}
                      variant="outline"
                      className={cn(
                        "w-full h-8 text-xs font-semibold uppercase tracking-wide",
                        canRepair 
                          ? "border-orange-600 text-orange-400 hover:bg-orange-600/20"
                          : "border-zinc-600 text-zinc-500"
                      )}
                    >
                      <Wrench className="w-3 h-3 mr-1" />
                      Repair ({repairCost} Materials)
                    </Button>
                  )}

                  {building.level >= building.maxLevel && !needsRepair && (
                    <div className="flex items-center justify-center gap-2 py-2 text-amber-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">Fully Upgraded</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="bg-zinc-800 border-t border-zinc-700 px-4 py-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400">Total Structures: {buildings.length}</span>
          <span className="text-zinc-400">Day {day}</span>
        </div>
      </div>
    </div>
  )
}
