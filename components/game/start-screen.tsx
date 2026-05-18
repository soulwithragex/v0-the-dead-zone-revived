'use client'

import { useGameStore } from '@/lib/game-store'
import { Button } from '@/components/ui/button'
import { Play, Skull, Shield, Users, Package, Map } from 'lucide-react'

export function StartScreen() {
  const { startGame } = useGameStore()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-destructive/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/20 rounded-full mb-4">
            <Skull className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground tracking-tight">
            THE DEAD ZONE
          </h1>
          <p className="text-2xl sm:text-3xl font-light text-primary mt-2">
            REVIVED
          </p>
        </div>

        {/* Tagline */}
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Survive the apocalypse. Build your base. Lead your survivors. 
          How long can you last in the dead zone?
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-sm font-medium text-foreground">Defend</div>
            <div className="text-xs text-muted-foreground">Your Base</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-sm font-medium text-foreground">Manage</div>
            <div className="text-xs text-muted-foreground">Survivors</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-sm font-medium text-foreground">Gather</div>
            <div className="text-xs text-muted-foreground">Resources</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <Map className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-sm font-medium text-foreground">Explore</div>
            <div className="text-xs text-muted-foreground">The Wasteland</div>
          </div>
        </div>

        {/* Start button */}
        <Button 
          size="lg" 
          onClick={startGame}
          className="gap-2 text-lg px-8 py-6 h-auto"
        >
          <Play className="w-6 h-6" />
          Start Survival
        </Button>

        {/* Instructions */}
        <div className="mt-8 bg-card/50 border border-border rounded-lg p-4 text-left max-w-md mx-auto">
          <h3 className="text-sm font-semibold text-foreground mb-2">Quick Start Guide:</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>- <strong className="text-foreground">Base:</strong> Build structures to improve your compound</li>
            <li>- <strong className="text-foreground">Survivors:</strong> Manage health, hunger, and assign tasks</li>
            <li>- <strong className="text-foreground">Missions:</strong> Send survivors to scavenge for supplies</li>
            <li>- <strong className="text-foreground">Combat:</strong> Defend against zombie hordes at night</li>
          </ul>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-muted-foreground">
          Inspired by The Last Stand: Dead Zone
        </p>
      </div>
    </div>
  )
}
