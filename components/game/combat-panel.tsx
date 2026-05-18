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
    defendBase,
    baseDefense,
    maxBaseDefense
  } = useGameStore()

  const defenders = survivors.filter(s => s.status === 'defending' || s.status === 'idle')
  const hasAttackingWave = zombieWaves.some(w => w.status === 'attacking')
  const approachingWave = zombieWaves.find(w => w.status === 'approaching')

  return (
    <div className="space-y-4">
      {/* Zombie Waves */}
      {zombieWaves.length > 0 && (
        <Card className={cn(
          "border-2",
          hasAttackingWave ? "border-destructive animate-pulse" : "border-warning"
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
                    <span className="text-2xl zombie-animate">🧟</span>
                    <div>
                      <div className="font-medium text-foreground">
                        {wave.zombieCount} Zombies
                      </div>
                      <div className="text-xs text-muted-foreground">
                        HP: {wave.zombieHealth} • DMG: {wave.zombieDamage}
                      </div>
                    </div>
                  </div>
                  {wave.status === 'approaching' && (
                    <Badge variant="outline" className="text-warning border-warning">
                      <Clock className="w-3 h-3 mr-1" />
                      {wave.timeUntilArrival}s
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
              onClick={defendBase}
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
                baseDefense < 30 ? "text-destructive" : "text-foreground"
              )}>
                {Math.floor(baseDefense)}/{maxBaseDefense}
              </span>
            </div>
            <Progress 
              value={(baseDefense / maxBaseDefense) * 100}
              className={cn(
                "h-2",
                baseDefense < 30 && "[&>div]:bg-destructive"
              )}
            />
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-2">Active Defenders</div>
            {defenders.length === 0 ? (
              <p className="text-xs text-muted-foreground">No survivors defending</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {defenders.map((s) => (
                  <div 
                    key={s.id}
                    className="flex items-center gap-1 bg-secondary/50 rounded px-2 py-1"
                  >
                    <span>{s.avatar}</span>
                    <span className="text-xs">{s.name}</span>
                    {s.equipped.weapon && (
                      <span className="text-xs text-muted-foreground">
                        ({s.equipped.weapon.damage} DMG)
                      </span>
                    )}
                  </div>
                ))}
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
                {combatLog.slice().reverse().map((log) => (
                  <div 
                    key={log.id}
                    className="text-xs text-muted-foreground py-1 border-b border-border/50 last:border-0"
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
              <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
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
