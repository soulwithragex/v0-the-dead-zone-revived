'use client'

import { useGameStore, type BuildingType } from '@/lib/game-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Package, 
  Wrench, 
  Plus, 
  Droplets, 
  Wheat, 
  Shield,
  Eye,
  ArrowUp,
  Hammer
} from 'lucide-react'

const buildingIcons: Record<BuildingType, typeof Package> = {
  storage: Package,
  workshop: Wrench,
  medical: Plus,
  water: Droplets,
  farm: Wheat,
  barricade: Shield,
  watchtower: Eye
}

const buildingDescriptions: Record<BuildingType, string> = {
  storage: 'Increases max resource capacity',
  workshop: 'Allows crafting items',
  medical: 'Heals survivors over time',
  water: 'Produces water automatically',
  farm: 'Produces food automatically',
  barricade: 'Increases base defense',
  watchtower: 'Early zombie detection'
}

const buildingCosts: Record<BuildingType, { materials: number; fuel: number }> = {
  storage: { materials: 30, fuel: 5 },
  workshop: { materials: 50, fuel: 10 },
  medical: { materials: 40, fuel: 5 },
  water: { materials: 35, fuel: 10 },
  farm: { materials: 25, fuel: 5 },
  barricade: { materials: 20, fuel: 0 },
  watchtower: { materials: 45, fuel: 5 }
}

export function BuildingPanel() {
  const { 
    buildings, 
    resources,
    buildStructure, 
    upgradeBuilding, 
    repairBuilding,
    selectedBuilding,
    setSelectedBuilding
  } = useGameStore()

  const availableBuildings: BuildingType[] = ['storage', 'barricade', 'watchtower', 'farm', 'water', 'medical', 'workshop']

  const canAfford = (type: BuildingType) => {
    const cost = buildingCosts[type]
    return resources.materials >= cost.materials && resources.fuel >= cost.fuel
  }

  return (
    <div className="space-y-6">
      {/* Current buildings */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Your Base</h2>
        
        {buildings.length === 0 ? (
          <Card className="bg-secondary/30 border-dashed">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No buildings constructed yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {buildings.map((building) => {
              const Icon = buildingIcons[building.type]
              const isSelected = selectedBuilding === building.id
              const needsRepair = building.health < building.maxHealth
              
              return (
                <Card 
                  key={building.id}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary/50",
                    isSelected && "border-primary ring-1 ring-primary/30",
                    needsRepair && "border-destructive/50"
                  )}
                  onClick={() => setSelectedBuilding(building.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        needsRepair ? "bg-destructive/20" : "bg-primary/20"
                      )}>
                        <Icon className={cn(
                          "w-5 h-5",
                          needsRepair ? "text-destructive" : "text-primary"
                        )} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-foreground truncate">{building.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            Lv.{building.level}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground mb-2">
                          {buildingDescriptions[building.type]}
                        </p>

                        {/* Health bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Health</span>
                            <span>{building.health}/{building.maxHealth}</span>
                          </div>
                          <Progress 
                            value={(building.health / building.maxHealth) * 100}
                            className={cn(
                              "h-1.5",
                              needsRepair && "[&>div]:bg-destructive"
                            )}
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-3">
                          {needsRepair && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                repairBuilding(building.id)
                              }}
                            >
                              <Hammer className="w-3 h-3 mr-1" />
                              Repair
                            </Button>
                          )}
                          {building.level < building.maxLevel && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                upgradeBuilding(building.id)
                              }}
                            >
                              <ArrowUp className="w-3 h-3 mr-1" />
                              Upgrade
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Build new structures */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Build New Structures</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {availableBuildings.map((type) => {
            const Icon = buildingIcons[type]
            const cost = buildingCosts[type]
            const affordable = canAfford(type)

            return (
              <Card 
                key={type}
                className={cn(
                  "transition-all",
                  affordable ? "hover:border-primary/50 cursor-pointer" : "opacity-50"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-secondary">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground capitalize">{type}</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {buildingDescriptions[type]}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span className={resources.materials >= cost.materials ? "text-foreground" : "text-destructive"}>
                          🪵 {cost.materials}
                        </span>
                        {cost.fuel > 0 && (
                          <span className={resources.fuel >= cost.fuel ? "text-foreground" : "text-destructive"}>
                            ⛽ {cost.fuel}
                          </span>
                        )}
                      </div>

                      <Button
                        size="sm"
                        className="w-full"
                        disabled={!affordable}
                        onClick={() => buildStructure(type)}
                      >
                        Build
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
