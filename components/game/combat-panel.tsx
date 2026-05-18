'use client'

import { useGameStore } from '@/lib/game-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { 
  Skull, 
  Shield, 
  Swords,
  Clock,
  AlertTriangle
} from 'lucide-react'

export function CombatPanel() {
  const { 
    zombieWaves, 
    survivors, 
    combatLog, 
    defendCompound,
    securityRating,
  } = useGameStore()

  const defenders = survivors.filter(s => s.status === 'defending' || s.status === 'idle')
  const hasAttackingWave = zombieWaves.some(w => w.status === 'attacking')

  // Calculate max security based on buildings
  const maxSecurityRating = 100

  return (
    <div className="space-y-4">
      {/* Zombie Waves */}
      {zombieWaves.length > 0 && (
        <Card className={cn(
          "border-2",
          hasAttackingWave ? "border-destructive animate-pulse" : "border-yellow-600"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-destructive">
              <Skull className="w-4 h-4" />
              {hasAttackingWave ? 'ZOMBIES ATTACKING!' : 'Zombie Horde Approaching'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {zombieWaves.map((wave) => (
              <div key={wave.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl zombie-animate">&#129503;</span>
                    <div>
                      <div className="font-medium text-foreground">
                        {wave.count} Zombies
                      </div>
                      <div className="text-xs text-muted-foreground">
                        HP: {wave.health} | DMG: {wave.damage}
                      </div>
                    </div>
                  </div>
                  {wave.status === 'approaching' && (
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {wave.timeUntilAttack}s
                    </Badge>
                  )}
                  {wave.status === 'attacking' && (
                    <Badge className="bg-destructive text-destructive-foreground">
                      <Swords className="w-3 h-3 mr-1" />
                      ATTACKING
                    </Badge>
                  )}
                </div>
              </div>
            ))}

            <Button 
              className="w-full gap-2"
              variant="destructive"
              onClick={defendCompound}
            >
              <Shield className="w-4 h-4" />
              Rally Defenders ({defenders.length})
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Defense Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Base Defense
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Defense Strength</span>
              <span className={cn(
                "font-mono",
                securityRating < 30 ? "text-destructive" : "text-foreground"
              )}>
                {Math.floor(securityRating)}/{maxSecurityRating}
              </span>
            </div>
            <Progress 
              value={(securityRating / maxSecurityRating) * 100}
              className={cn(
                "h-2",
                securityRating < 30 && "[&>div]:bg-destructive"
              )}
            />
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-2">Active Defenders</div>
            {defenders.length === 0 ? (
              <p className="text-xs text-muted-foreground">No survivors defending</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {defenders.slice(0, 6).map((s) => (
                  <div 
                    key={s.id}
                    className="flex items-center gap-1 bg-secondary/50 rounded px-2 py-1"
                  >
                    <svg viewBox="0 0 20 24" className="w-4 h-5">
                      <ellipse cx="10" cy="6" rx="5" ry="5" fill="#d4a574" />
                      <rect x="4" y="11" width="12" height="10" rx="2" fill="#4a6741" />
                    </svg>
                    <span className="text-xs">{s.name.split(' ')[0]}</span>
                    {s.equipped.offensive.weapon && (
                      <span className="text-xs text-muted-foreground">
                        ({s.equipped.offensive.weapon.damage})
                      </span>
                    )}
                  </div>
                ))}
                {defenders.length > 6 && (
                  <span className="text-xs text-muted-foreground self-center">
                    +{defenders.length - 6} more
                  </span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Combat Log */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Swords className="w-4 h-4 text-muted-foreground" />
            Combat Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {combatLog.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No combat activity yet
              </p>
            ) : (
              <div className="space-y-1">
                {combatLog.slice(0, 20).map((log) => (
                  <div 
                    key={log.id}
                    className={cn(
                      "text-xs py-1 border-b border-border/50 last:border-0",
                      log.type === 'kill' && "text-green-400",
                      log.type === 'damage' && "text-red-400",
                      log.type === 'heal' && "text-blue-400",
                      log.type === 'event' && "text-muted-foreground"
                    )}
                  >
                    <span className="text-muted-foreground/50 font-mono mr-2">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    {log.message}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Tips */}
      {!hasAttackingWave && zombieWaves.length === 0 && (
        <Card className="bg-secondary/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Survival Tips</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Build barricades to increase base defense</li>
                  <li>Equip weapons to your survivors</li>
                  <li>Zombie attacks are more frequent at night</li>
                  <li>Keep resources stocked for emergencies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
