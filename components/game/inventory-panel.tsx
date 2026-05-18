'use client'

import { useGameStore } from '@/lib/game-store'
import { cn } from '@/lib/utils'
import { Package, Swords } from 'lucide-react'

export function InventoryPanel() {
  const { inventory, weapons, survivors, equipWeapon } = useGameStore()

  const rarityColors = {
    common: 'text-stone-300 border-stone-500',
    uncommon: 'text-blue-400 border-blue-500',
    rare: 'text-purple-400 border-purple-500',
    unique: 'text-orange-400 border-orange-500',
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Package className="w-5 h-5" />
        Inventory
      </h2>

      {/* Weapons Section */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="bg-secondary/50 px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Swords className="w-4 h-4 text-red-400" />
            Weapons ({weapons.length})
          </h3>
        </div>
        <div className="p-4">
          {weapons.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No weapons in inventory. Send survivors on missions to find more!
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {weapons.map((weapon) => (
                <div
                  key={weapon.id}
                  className={cn(
                    "bg-secondary/30 rounded-lg p-3 border-l-4",
                    rarityColors[weapon.rarity]
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className={cn("font-medium", rarityColors[weapon.rarity].split(' ')[0])}>
                        {weapon.name}
                      </h4>
                      <div className="text-xs text-muted-foreground capitalize">
                        {weapon.type} | Lv.{weapon.level}
                      </div>
                    </div>
                    <span className={cn(
                      "text-[10px] uppercase px-1.5 py-0.5 rounded",
                      weapon.rarity === 'unique' ? 'bg-orange-500/20' :
                      weapon.rarity === 'rare' ? 'bg-purple-500/20' :
                      weapon.rarity === 'uncommon' ? 'bg-blue-500/20' : 'bg-stone-500/20'
                    )}>
                      {weapon.rarity}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    <div className="bg-black/20 rounded px-2 py-1">
                      <div className="text-muted-foreground">DMG</div>
                      <div className="font-bold text-red-400">{weapon.damage}</div>
                    </div>
                    <div className="bg-black/20 rounded px-2 py-1">
                      <div className="text-muted-foreground">ACC</div>
                      <div className="font-bold text-blue-400">{weapon.accuracy}%</div>
                    </div>
                    <div className="bg-black/20 rounded px-2 py-1">
                      <div className="text-muted-foreground">DPS</div>
                      <div className="font-bold text-green-400">{weapon.dps}</div>
                    </div>
                  </div>

                  {/* Quick equip buttons */}
                  {survivors.filter(s => s.status !== 'mission').length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {survivors.filter(s => s.status !== 'mission').slice(0, 3).map((survivor) => (
                        <button
                          key={survivor.id}
                          onClick={() => equipWeapon(survivor.id, weapon.id, 'offensive')}
                          className="text-[10px] bg-secondary hover:bg-secondary/80 text-foreground px-2 py-1 rounded transition-colors"
                          title={`Equip to ${survivor.name}`}
                        >
                          {survivor.name.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Items Section */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="bg-secondary/50 px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" />
            Items ({inventory.length})
          </h3>
        </div>
        <div className="p-4">
          {inventory.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Your inventory is empty</p>
              <p className="text-xs text-muted-foreground mt-1">
                Send survivors on missions to gather items
              </p>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "bg-secondary/30 rounded-lg p-3 border",
                    rarityColors[item.rarity]
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn("font-medium text-sm", rarityColors[item.rarity].split(' ')[0])}>
                      {item.name}
                    </span>
                    <span className="text-lg font-bold text-foreground">
                      x{item.quantity}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground capitalize mt-1">
                    {item.type} | Lv.{item.level}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-secondary/30 rounded-lg p-4 border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-2">Inventory Tips</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>- Equip weapons to survivors for missions and defense</li>
          <li>- Higher rarity weapons deal more damage</li>
          <li>- Different weapon types suit different classes</li>
          <li>- Medical items can heal injured survivors</li>
        </ul>
      </div>
    </div>
  )
}
