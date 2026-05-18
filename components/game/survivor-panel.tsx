'use client'

import { useGameStore, type Survivor } from '@/lib/game-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Heart, 
  Utensils, 
  Droplets, 
  Zap,
  Swords,
  Search,
  Plus,
  Bed,
  Shield
} from 'lucide-react'

export function SurvivorPanel() {
  const { 
    survivors, 
    inventory,
    selectedSurvivor,
    setSelectedSurvivor,
    updateSurvivor,
    useItem,
    equipItem
  } = useGameStore()

  const selectedSurvivorData = survivors.find(s => s.id === selectedSurvivor)

  const getStatusColor = (status: Survivor['status']) => {
    switch (status) {
      case 'idle': return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'scavenging': return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      case 'defending': return 'bg-orange-500/20 text-orange-400 border-orange-500/50'
      case 'crafting': return 'bg-purple-500/20 text-purple-400 border-purple-500/50'
      case 'resting': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
      case 'injured': return 'bg-red-500/20 text-red-400 border-red-500/50'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const weapons = inventory.filter(i => i.type === 'weapon')
  const medicalItems = inventory.filter(i => i.type === 'medical')
  const foodItems = inventory.filter(i => i.type === 'food')
  const waterItems = inventory.filter(i => i.type === 'water')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Survivors ({survivors.length})</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {survivors.map((survivor) => (
          <Card 
            key={survivor.id}
            className={cn(
              "cursor-pointer transition-all hover:border-primary/50",
              selectedSurvivor === survivor.id && "border-primary ring-1 ring-primary/30"
            )}
            onClick={() => setSelectedSurvivor(survivor.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="text-4xl">{survivor.avatar}</div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground truncate">{survivor.name}</h3>
                    <Badge className={cn("text-xs", getStatusColor(survivor.status))}>
                      {survivor.status}
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground mb-2">
                    Level {survivor.level} • {survivor.xp}/{survivor.xpToNextLevel} XP
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-500" />
                        <span className="text-xs">{Math.floor(survivor.health)}</span>
                      </div>
                      <Progress 
                        value={(survivor.health / survivor.maxHealth) * 100} 
                        className="h-1"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs">{Math.floor(survivor.energy)}</span>
                      </div>
                      <Progress value={survivor.energy} className="h-1" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Utensils className="w-3 h-3 text-amber-500" />
                        <span className="text-xs">{Math.floor(survivor.hunger)}</span>
                      </div>
                      <Progress value={survivor.hunger} className="h-1" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-blue-500" />
                        <span className="text-xs">{Math.floor(survivor.thirst)}</span>
                      </div>
                      <Progress value={survivor.thirst} className="h-1" />
                    </div>
                  </div>

                  {/* Equipped */}
                  {survivor.equipped.weapon && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      🔫 {survivor.equipped.weapon.name} (DMG: {survivor.equipped.weapon.damage})
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected survivor details */}
      {selectedSurvivorData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedSurvivorData.avatar}</span>
              {selectedSurvivorData.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Skills */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Skills</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2">
                  <Swords className="w-4 h-4 text-red-400" />
                  <span className="text-sm">Combat: {selectedSurvivorData.skills.combat}</span>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2">
                  <Search className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">Scavenging: {selectedSurvivorData.skills.scavenging}</span>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2">
                  <Plus className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Medical: {selectedSurvivorData.skills.medical}</span>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Engineering: {selectedSurvivorData.skills.engineering}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Actions</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={selectedSurvivorData.status !== 'idle'}
                  onClick={() => updateSurvivor(selectedSurvivorData.id, { status: 'resting' })}
                >
                  <Bed className="w-4 h-4 mr-1" />
                  Rest
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={selectedSurvivorData.status !== 'idle'}
                  onClick={() => updateSurvivor(selectedSurvivorData.id, { status: 'defending' })}
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Defend
                </Button>
              </div>
            </div>

            {/* Equip weapons */}
            {weapons.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Equip Weapon</h4>
                <div className="flex flex-wrap gap-2">
                  {weapons.map((weapon) => (
                    <Button
                      key={weapon.id}
                      size="sm"
                      variant={selectedSurvivorData.equipped.weapon?.id === weapon.id ? "default" : "outline"}
                      onClick={() => equipItem(selectedSurvivorData.id, weapon)}
                    >
                      {weapon.icon} {weapon.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Use items */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Use Item</h4>
              <div className="flex flex-wrap gap-2">
                {medicalItems.map((item) => (
                  <Button
                    key={item.id}
                    size="sm"
                    variant="outline"
                    disabled={selectedSurvivorData.health >= selectedSurvivorData.maxHealth}
                    onClick={() => useItem(item.id, selectedSurvivorData.id)}
                  >
                    {item.icon} {item.name} ({item.quantity})
                  </Button>
                ))}
                {foodItems.map((item) => (
                  <Button
                    key={item.id}
                    size="sm"
                    variant="outline"
                    disabled={selectedSurvivorData.hunger >= 100}
                    onClick={() => useItem(item.id, selectedSurvivorData.id)}
                  >
                    {item.icon} {item.name} ({item.quantity})
                  </Button>
                ))}
                {waterItems.map((item) => (
                  <Button
                    key={item.id}
                    size="sm"
                    variant="outline"
                    disabled={selectedSurvivorData.thirst >= 100}
                    onClick={() => useItem(item.id, selectedSurvivorData.id)}
                  >
                    {item.icon} {item.name} ({item.quantity})
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
