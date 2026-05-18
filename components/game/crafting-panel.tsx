'use client'

import { useGameStore, type WeaponType } from '@/lib/game-store'
import { cn } from '@/lib/utils'
import { Hammer, Trash2, UserPlus, Wrench, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const weaponCrafts: { type: WeaponType; name: string; description: string; cost: Record<string, number> }[] = [
  { type: 'melee', name: 'Melee Weapon', description: 'Close combat, no ammo needed', cost: { metal: 15, wood: 10 } },
  { type: 'pistol', name: 'Pistol', description: 'Balanced sidearm', cost: { metal: 30, ammo: 10 } },
  { type: 'rifle', name: 'Rifle', description: 'High accuracy, long range', cost: { metal: 50, wood: 20, ammo: 15 } },
  { type: 'shotgun', name: 'Shotgun', description: 'High damage, close range', cost: { metal: 45, wood: 15, ammo: 20 } },
  { type: 'smg', name: 'SMG', description: 'Fast fire rate', cost: { metal: 40, ammo: 25 } },
  { type: 'assault', name: 'Assault Rifle', description: 'Versatile combat weapon', cost: { metal: 60, ammo: 30 } },
]

const rarityColors = {
  common: 'text-stone-300 border-stone-500',
  uncommon: 'text-blue-400 border-blue-500',
  rare: 'text-purple-400 border-purple-500',
  unique: 'text-orange-400 border-orange-500',
}

export function CraftingPanel() {
  const { 
    resources, 
    weapons, 
    survivors,
    craftWeapon, 
    recruitSurvivor, 
    scrapWeapon 
  } = useGameStore()

  const canAfford = (cost: Record<string, number>) => {
    return Object.entries(cost).every(
      ([res, amount]) => resources[res as keyof typeof resources] >= amount
    )
  }

  const getScrapValue = (rarity: string, level: number) => {
    const values: Record<string, number> = { common: 5, uncommon: 10, rare: 20, unique: 40 }
    return (values[rarity] || 5) * level
  }

  const isWeaponEquipped = (weaponId: string) => {
    return survivors.some(s => 
      s.equipped.offensive.weapon?.id === weaponId ||
      s.equipped.defensive.weapon?.id === weaponId
    )
  }

  return (
    <div className="space-y-6">
      {/* Recruitment Section */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="bg-secondary/50 px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-green-400" />
            Recruit Survivor
          </h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-3">
            Recruit a new survivor to join your group. Current: {survivors.length}/10
          </p>
          <div className="flex items-center justify-between bg-secondary/30 rounded-lg p-3 mb-3">
            <div className="text-sm">
              <span className="text-muted-foreground">Cost: </span>
              <span className={cn(resources.food >= 50 ? 'text-foreground' : 'text-red-400')}>50 Food</span>
              <span className="text-muted-foreground"> + </span>
              <span className={cn(resources.water >= 50 ? 'text-foreground' : 'text-red-400')}>50 Water</span>
            </div>
          </div>
          <Button
            onClick={recruitSurvivor}
            disabled={survivors.length >= 10 || resources.food < 50 || resources.water < 50}
            className="w-full"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {survivors.length >= 10 ? 'Compound Full' : 'Recruit Survivor'}
          </Button>
        </div>
      </div>

      {/* Crafting Section */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="bg-secondary/50 px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Hammer className="w-4 h-4 text-amber-400" />
            Weapon Crafting
          </h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-4">
            Craft weapons using your resources. Quality depends on your compound level.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {weaponCrafts.map((craft) => {
              const affordable = canAfford(craft.cost)
              
              return (
                <button
                  key={craft.type}
                  onClick={() => craftWeapon(craft.type)}
                  disabled={!affordable}
                  className={cn(
                    "text-left p-3 rounded-lg border transition-all",
                    affordable 
                      ? "bg-secondary/30 border-border hover:border-primary cursor-pointer"
                      : "bg-secondary/10 border-border/50 opacity-60 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-sm text-foreground">{craft.name}</div>
                      <div className="text-xs text-muted-foreground">{craft.description}</div>
                    </div>
                    <Wrench className={cn("w-4 h-4", affordable ? "text-amber-400" : "text-muted")} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.entries(craft.cost).map(([res, amount]) => (
                      <span 
                        key={res} 
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded",
                          resources[res as keyof typeof resources] >= amount
                            ? "bg-secondary text-foreground"
                            : "bg-red-900/30 text-red-400"
                        )}
                      >
                        {amount} {res}
                      </span>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Scrap Weapons Section */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="bg-secondary/50 px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-zinc-400" />
            Scrap Weapons
          </h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-3">
            Scrap unneeded weapons for metal. Better weapons give more metal.
          </p>
          {weapons.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No weapons available to scrap
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {weapons.map((weapon) => {
                const equipped = isWeaponEquipped(weapon.id)
                const scrapValue = getScrapValue(weapon.rarity, weapon.level)
                
                return (
                  <div
                    key={weapon.id}
                    className={cn(
                      "flex items-center justify-between bg-secondary/30 rounded-lg p-3 border-l-2",
                      rarityColors[weapon.rarity]
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className={cn("font-medium text-sm truncate", rarityColors[weapon.rarity].split(' ')[0])}>
                        {weapon.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {weapon.type} | Lv.{weapon.level} | DPS: {weapon.dps}
                        {equipped && <span className="ml-2 text-yellow-500">(Equipped)</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400">+{scrapValue} metal</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => scrapWeapon(weapon.id)}
                        disabled={equipped}
                        className={cn(
                          "h-8 w-8 p-0",
                          equipped ? "opacity-50" : "hover:bg-red-900/30 hover:text-red-400"
                        )}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-secondary/30 rounded-lg p-4 border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-2">Workshop Tips</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>- Crafted weapons quality scales with compound level</li>
          <li>- Rare and unique weapons give more metal when scrapped</li>
          <li>- Recruited survivors start at level 1 with random skills</li>
          <li>- Higher compound level unlocks better crafting results</li>
        </ul>
      </div>
    </div>
  )
}
