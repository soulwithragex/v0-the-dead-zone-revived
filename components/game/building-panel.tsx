'use client'

import { useGameStore, type Building } from '@/lib/game-store'
import { Button } from '@/components/ui/button'
import { 
  Hammer, 
  ArrowUp, 
  Wrench, 
  AlertTriangle,
  CheckCircle,
  Package,
  Shield,
  Eye,
  Droplets,
  Wheat,
  Plus,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

const BUILDING_DESCRIPTIONS: Record<string, string> = {
  warehouse: "Main storage facility for all resources.",
  rally_flag: "Rally point for defenders during attacks.",
  small_barricade: "Basic defensive structure that slows zombies.",
  large_barricade: "Heavy defensive structure with high durability.",
  watchtower: "Increases base defense and provides early warning.",
  bed: "Allows survivors to rest and recover health faster.",
  vegetable_garden: "Produces food over time. Higher levels increase production.",
  water_collector: "Collects and purifies water for survivors.",
  metal_storage: "Increases maximum metal storage capacity.",
  food_storage: "Increases maximum food storage capacity.",
}

const BUILDING_ICONS: Record<string, React.ReactNode> = {
  warehouse: <Package className="w-5 h-5" />,
  rally_flag: <Shield className="w-5 h-5" />,
  small_barricade: <Shield className="w-5 h-5" />,
  large_barricade: <Shield className="w-5 h-5" />,
  watchtower: <Eye className="w-5 h-5" />,
  bed: <Plus className="w-5 h-5" />,
  vegetable_garden: <Wheat className="w-5 h-5" />,
  water_collector: <Droplets className="w-5 h-5" />,
  metal_storage: <Package className="w-5 h-5" />,
  food_storage: <Package className="w-5 h-5" />,
}

export function BuildingPanel() {
  const { 
    buildings, 
    resources,
    upgradeBuilding, 
    repairBuilding,
    constructBuilding,
    day 
  } = useGameStore()

  const canAffordUpgrade = (building: Building) => {
    const metalCost = building.level * 20
    const woodCost = building.level * 15
    return resources.metal >= metalCost && resources.wood >= woodCost
  }

  const canAffordRepair = (building: Building) => {
    const repairCost = Math.ceil((building.maxHealth - building.health) * 0.3)
    return resources.metal >= repairCost
  }

  const getUpgradeCost = (building: Building) => {
    return {
      metal: building.level * 20,
      wood: building.level * 15
    }
  }

  const getRepairCost = (building: Building) => {
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

  // Available buildings to construct
  const buildableStructures = [
    { type: 'small_barricade', name: 'Small Barricade', cost: { wood: 20, metal: 10 } },
    { type: 'large_barricade', name: 'Large Barricade', cost: { wood: 40, metal: 25 } },
    { type: 'watchtower', name: 'Watchtower', cost: { wood: 50, metal: 30 } },
    { type: 'bed', name: 'Bed', cost: { wood: 15, cloth: 20 } },
    { type: 'vegetable_garden', name: 'Vegetable Garden', cost: { wood: 30 } },
    { type: 'water_collector', name: 'Water Collector', cost: { metal: 25, wood: 15 } },
  ]

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-secondary/50 px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <Hammer className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-foreground uppercase tracking-wide">Compound Structures</h2>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Build and upgrade structures to improve your compound</p>
      </div>

      {/* Building List */}
      <div className="p-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mb-6">
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
                  "bg-secondary/30 border rounded-lg overflow-hidden transition-all",
                  needsRepair ? "border-orange-700/50" : "border-border hover:border-border/80"
                )}
              >
                {/* Building Header */}
                <div className="flex items-start gap-3 p-3 bg-secondary/20">
                  <div className={cn(
                    "w-10 h-10 rounded flex items-center justify-center",
                    needsRepair ? "bg-orange-900/50 text-orange-400" : "bg-muted text-muted-foreground"
                  )}>
                    {BUILDING_ICONS[building.type] || <Settings className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground text-sm truncate">
                        {building.name}
                      </h3>
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded",
                        building.level >= building.maxLevel 
                          ? "bg-amber-600/30 text-amber-400"
                          : "bg-muted text-muted-foreground"
                      )}>
                        LVL {building.level}{building.level >= building.maxLevel && " MAX"}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {BUILDING_DESCRIPTIONS[building.type] || "Structure providing bonuses to your compound."}
                    </p>
                  </div>
                </div>

                {/* Health Bar */}
                <div className="px-3 py-2 bg-background/50 border-t border-border/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Structural Integrity</span>
                    <span className={cn("text-xs font-medium", status.color)}>
                      {status.text}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-sm overflow-hidden">
                    <div 
                      className={cn("h-full transition-all", getHealthBarColor(building.health, building.maxHealth))}
                      style={{ width: `${healthPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">{building.health} / {building.maxHealth} HP</span>
                    {building.health <= building.maxHealth * 0.5 && (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                        <span className="text-xs text-orange-400">Needs repair</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-3 bg-background/30 border-t border-border/50 space-y-2">
                  {/* Upgrade */}
                  {building.level < building.maxLevel && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">Upgrade Cost:</span>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={resources.metal >= upgradeCost.metal ? 'text-foreground' : 'text-red-400'}>
                            {upgradeCost.metal} Metal
                          </span>
                          <span className={resources.wood >= upgradeCost.wood ? 'text-foreground' : 'text-red-400'}>
                            {upgradeCost.wood} Wood
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
                            : "bg-muted text-muted-foreground"
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
                          : "border-muted text-muted-foreground"
                      )}
                    >
                      <Wrench className="w-3 h-3 mr-1" />
                      Repair ({repairCost} Metal)
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

        {/* Build New Structures */}
        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Build New Structure
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {buildableStructures.map((structure) => {
              const canAfford = Object.entries(structure.cost).every(
                ([res, amount]) => resources[res as keyof typeof resources] >= (amount as number)
              )
              
              return (
                <Button
                  key={structure.type}
                  variant="outline"
                  size="sm"
                  disabled={!canAfford}
                  onClick={() => constructBuilding(structure.type, { x: 300 + Math.random() * 200, y: 200 + Math.random() * 200 })}
                  className={cn(
                    "h-auto py-2 flex-col items-start",
                    !canAfford && "opacity-50"
                  )}
                >
                  <span className="text-xs font-medium">{structure.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {Object.entries(structure.cost).map(([res, amount]) => `${amount} ${res}`).join(', ')}
                  </span>
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="bg-secondary/30 border-t border-border px-4 py-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Total Structures: {buildings.length}</span>
          <span className="text-muted-foreground">Day {day}</span>
        </div>
      </div>
    </div>
  )
}
