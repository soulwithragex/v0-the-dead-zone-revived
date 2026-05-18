'use client'

import { useGameStore, type Mission } from '@/lib/game-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { 
  MapPin, 
  Clock, 
  Skull, 
  Users,
  Play,
  Loader2,
  CheckCircle,
  XCircle,
  Plus,
  Minus
} from 'lucide-react'

export function MissionPanel() {
  const { 
    availableMissions, 
    activeMissions, 
    survivors,
    startMission, 
    assignSurvivorToMission,
    unassignSurvivorFromMission
  } = useGameStore()

  const idleSurvivors = survivors.filter(s => s.status === 'idle')

  const getDifficultyColor = (difficulty: Mission['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'hard': return 'bg-orange-500/20 text-orange-400 border-orange-500/50'
      case 'extreme': return 'bg-red-500/20 text-red-400 border-red-500/50'
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Active Missions */}
      {activeMissions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            Active Missions ({activeMissions.length})
          </h2>
          
          <div className="space-y-4">
            {activeMissions.map((mission) => {
              const assignedSurvivors = survivors.filter(s => mission.assignedSurvivors.includes(s.id))
              const progress = ((mission.duration - mission.timeLeft) / mission.duration) * 100

              return (
                <Card key={mission.id} className="border-primary/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{mission.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getDifficultyColor(mission.difficulty)}>
                            {mission.difficulty}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {mission.location}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-mono text-primary">
                          {formatTime(mission.timeLeft)}
                        </div>
                        <div className="text-xs text-muted-foreground">remaining</div>
                      </div>
                    </div>

                    <Progress value={progress} className="h-2 mb-3" />

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div className="flex gap-1">
                        {assignedSurvivors.map((s) => (
                          <span key={s.id} className="text-lg">{s.avatar}</span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Available Missions */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">
          Available Missions ({availableMissions.length})
        </h2>

        {availableMissions.length === 0 ? (
          <Card className="bg-secondary/30 border-dashed">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No missions available. Check back tomorrow.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {availableMissions.map((mission) => {
              const assignedSurvivors = survivors.filter(s => mission.assignedSurvivors.includes(s.id))
              const canStart = assignedSurvivors.length > 0

              return (
                <Card key={mission.id} className="hover:border-primary/30 transition-all">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{mission.name}</h3>
                          <Badge className={getDifficultyColor(mission.difficulty)}>
                            {mission.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{mission.description}</p>
                      </div>
                    </div>

                    {/* Mission details */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-secondary/50 rounded-lg p-2 text-center">
                        <MapPin className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                        <div className="text-xs text-muted-foreground">Location</div>
                        <div className="text-sm font-medium truncate">{mission.location}</div>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-2 text-center">
                        <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                        <div className="text-xs text-muted-foreground">Duration</div>
                        <div className="text-sm font-medium">{formatTime(mission.duration)}</div>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-2 text-center">
                        <Skull className="w-4 h-4 mx-auto mb-1 text-destructive" />
                        <div className="text-xs text-muted-foreground">Zombies</div>
                        <div className="text-sm font-medium text-destructive">{mission.zombieCount}</div>
                      </div>
                    </div>

                    {/* Danger level */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Danger Level</span>
                        <span className="text-destructive">{mission.dangerLevel}%</span>
                      </div>
                      <Progress 
                        value={mission.dangerLevel} 
                        className="h-1.5 [&>div]:bg-destructive"
                      />
                    </div>

                    {/* Assign survivors */}
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        Assign Survivors ({assignedSurvivors.length} assigned)
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {/* Assigned survivors */}
                        {assignedSurvivors.map((survivor) => (
                          <Button
                            key={survivor.id}
                            size="sm"
                            variant="default"
                            className="gap-1"
                            onClick={() => unassignSurvivorFromMission(survivor.id, mission.id)}
                          >
                            <span>{survivor.avatar}</span>
                            <span className="truncate max-w-[80px]">{survivor.name}</span>
                            <Minus className="w-3 h-3" />
                          </Button>
                        ))}
                        
                        {/* Available survivors */}
                        {idleSurvivors
                          .filter(s => !mission.assignedSurvivors.includes(s.id))
                          .map((survivor) => (
                            <Button
                              key={survivor.id}
                              size="sm"
                              variant="outline"
                              className="gap-1"
                              onClick={() => assignSurvivorToMission(survivor.id, mission.id)}
                            >
                              <span>{survivor.avatar}</span>
                              <span className="truncate max-w-[80px]">{survivor.name}</span>
                              <Plus className="w-3 h-3" />
                            </Button>
                          ))
                        }
                      </div>
                    </div>

                    {/* Potential loot */}
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-2">Potential Loot</div>
                      <div className="flex flex-wrap gap-2">
                        {mission.loot.map((loot, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {loot.type}: {loot.min}-{loot.max}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Start button */}
                    <Button
                      className="w-full gap-2"
                      disabled={!canStart}
                      onClick={() => startMission(mission.id)}
                    >
                      <Play className="w-4 h-4" />
                      {canStart ? 'Start Mission' : 'Assign Survivors First'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
