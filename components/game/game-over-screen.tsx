'use client'

import { useGameStore } from '@/lib/game-store'
import { Button } from '@/components/ui/button'
import { RefreshCw, Skull } from 'lucide-react'

export function GameOverScreen() {
  const { day, gameOverReason, survivors } = useGameStore()

  const handleRestart = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Skull animation */}
        <div className="mb-8">
          <Skull className="w-24 h-24 mx-auto text-destructive animate-pulse" />
        </div>

        {/* Game over text */}
        <h1 className="text-5xl font-bold text-destructive mb-4">
          GAME OVER
        </h1>

        <p className="text-xl text-foreground mb-2">{gameOverReason}</p>

        {/* Stats */}
        <div className="bg-card border border-border rounded-lg p-6 my-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Final Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="text-3xl font-bold text-primary">{day}</div>
              <div className="text-sm text-muted-foreground">Days Survived</div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="text-3xl font-bold text-destructive">{survivors.length}</div>
              <div className="text-sm text-muted-foreground">Survivors Lost</div>
            </div>
          </div>
        </div>

        {/* Restart button */}
        <Button 
          size="lg" 
          onClick={handleRestart}
          className="gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </Button>

        {/* Quote */}
        <p className="mt-8 text-sm text-muted-foreground italic">
          {"\"In this world, the dead are rising... but so are we.\""}
        </p>
      </div>
    </div>
  )
}
