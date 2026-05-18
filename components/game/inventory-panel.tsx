'use client'

import { useGameStore, type ItemType } from '@/lib/game-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Swords, 
  Utensils, 
  Droplets, 
  Plus, 
  Package,
  Crosshair
} from 'lucide-react'

const typeIcons: Record<ItemType, typeof Package> = {
  weapon: Swords,
  food: Utensils,
  water: Droplets,
  medical: Plus,
  material: Package,
  ammo: Crosshair
}

const typeColors: Record<ItemType, string> = {
  weapon: 'text-red-400 bg-red-500/20',
  food: 'text-amber-400 bg-amber-500/20',
  water: 'text-blue-400 bg-blue-500/20',
  medical: 'text-green-400 bg-green-500/20',
  material: 'text-orange-400 bg-orange-500/20',
  ammo: 'text-yellow-400 bg-yellow-500/20'
}

export function InventoryPanel() {
  const { inventory, survivors, useItem, equipItem } = useGameStore()

  const groupedItems = inventory.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = []
    acc[item.type].push(item)
    return acc
  }, {} as Record<ItemType, typeof inventory>)

  const itemTypes: ItemType[] = ['weapon', 'medical', 'food', 'water', 'ammo', 'material']

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">
        Inventory ({inventory.reduce((sum, i) => sum + i.quantity, 0)} items)
      </h2>

      {inventory.length === 0 ? (
        <Card className="bg-secondary/30 border-dashed">
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Your inventory is empty</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {itemTypes.map((type) => {
            const items = groupedItems[type]
            if (!items || items.length === 0) return null

            const Icon = typeIcons[type]

            return (
              <Card key={type}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 capitalize">
                    <div className={cn("p-1.5 rounded", typeColors[type])}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {type}s
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-secondary/50 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <div className="font-medium text-foreground">{item.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.damage && `Damage: ${item.damage}`}
                              {item.healing && `Healing: +${item.healing}`}
                              {item.weaponType && ` • ${item.weaponType}`}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-lg font-mono">
                          x{item.quantity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Quick use section */}
      {survivors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Use</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Select a survivor from the Survivors tab to use items on them directly.
            </p>
            <div className="flex flex-wrap gap-2">
              {survivors.slice(0, 3).map((survivor) => (
                <div key={survivor.id} className="bg-secondary/50 rounded-lg p-2 flex items-center gap-2">
                  <span className="text-xl">{survivor.avatar}</span>
                  <div>
                    <div className="text-sm font-medium">{survivor.name}</div>
                    <div className="text-xs text-muted-foreground">
                      HP: {Math.floor(survivor.health)}/{survivor.maxHealth}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
