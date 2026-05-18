'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/lib/game-store'
import { ResourceBar } from './resource-bar'
import { SurvivorPanel } from './survivor-panel'
import { BuildingPanel } from './building-panel'
import { MissionPanel } from './mission-panel'
import { InventoryPanel } from './inventory-panel'
import { CombatPanel } from './combat-panel'
import { NotificationSystem } from './notification-system'
import { GameOverScreen } from './game-over-screen'
import { StartScreen } from './start-screen'
import { CompoundMap } from './compound-map'
import { 
  Home, 
  Users, 
  Package, 
  Map,
  Crosshair,
  Shield,
  Sun,
  Moon,
  Pause,
  Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function GameMain() {
  const { 
    gameStarted,
    gamePaused,
    gameOver,
    day,
    time,
    isNight,
    selectedTab,
    setSelectedTab,
    tick,
    pauseGame,
    resumeGame,
    zombieWaves
  } = useGameStore()

  // Game loop
  useEffect(() => {
    if (!gameStarted || gamePaused || gameOver) return

    const interval = setInterval(() => {
      tick()
    }, 1000) // 1 second = 30 in-game minutes

    return () => clearInterval(interval)
  }, [gameStarted, gamePaused, gameOver, tick])

  if (!gameStarted) {
    return <StartScreen />
  }

  if (gameOver) {
    return <GameOverScreen />
  }

  const formatTime = (t: number) => {
    const hours = Math.floor(t)
    const minutes = Math.floor((t % 1) * 60)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  const tabs = [
    { id: 'compound', label: 'Compound', icon: Crosshair },
    { id: 'base', label: 'Base', icon: Home },
    { id: 'survivors', label: 'Survivors', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'missions', label: 'Missions', icon: Map },
  ] as const

  const hasZombieAttack = zombieWaves.some(w => w.status === 'attacking')

  return (
    <div className={cn(
      "min-h-screen flex flex-col transition-colors duration-1000",
      isNight ? "bg-[oklch(0.08_0.015_250)]" : "bg-background"
    )}>
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Game title and day/time */}
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-primary">
                THE DEAD ZONE
                <span className="block text-xs font-normal text-muted-foreground">REVIVED</span>
              </h1>
              
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Day</span>
                  <span className="text-lg font-bold text-foreground">{day}</span>
                </div>
                <div className="w-px h-6 bg-border" />
                <div className="flex items-center gap-2">
                  {isNight ? (
                    <Moon className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-yellow-400" />
                  )}
                  <span className="text-lg font-mono text-foreground">{formatTime(time)}</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {hasZombieAttack && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/20 border border-destructive/50 rounded-lg animate-pulse">
                  <Shield className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">UNDER ATTACK</span>
                </div>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={gamePaused ? resumeGame : pauseGame}
                className="gap-2"
              >
                {gamePaused ? (
                  <>
                    <Play className="w-4 h-4" />
                    <span className="hidden sm:inline">Resume</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    <span className="hidden sm:inline">Pause</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Resource bars */}
          <div className="mt-3">
            <ResourceBar />
          </div>
        </div>
      </header>

      {/* Navigation tabs */}
      <nav className="border-b border-border/50 bg-card/50 sticky top-[140px] sm:top-[120px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={selectedTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedTab(tab.id)}
                className={cn(
                  "gap-2 shrink-0",
                  selectedTab === tab.id && "bg-primary text-primary-foreground"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main panel */}
          <div className="lg:col-span-2">
            {selectedTab === 'compound' && <CompoundMap />}
            {selectedTab === 'base' && <BuildingPanel />}
            {selectedTab === 'survivors' && <SurvivorPanel />}
            {selectedTab === 'inventory' && <InventoryPanel />}
            {selectedTab === 'missions' && <MissionPanel />}
          </div>

          {/* Side panel - Combat log and quick actions */}
          <div className="space-y-4">
            <CombatPanel />
          </div>
        </div>
      </main>

      {/* Notifications */}
      <NotificationSystem />

      {/* Pause overlay */}
      {gamePaused && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">PAUSED</h2>
            <Button onClick={resumeGame} size="lg" className="gap-2">
              <Play className="w-5 h-5" />
              Resume Game
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
