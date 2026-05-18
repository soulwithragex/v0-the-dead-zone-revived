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

export function PanelCombate() {
  const { 
    hordasZombies, 
    supervivientes, 
    registroCombate, 
    defenderCompound,
    nivelSeguridad,
  } = useGameStore()

  const defensores = supervivientes.filter(s => s.estado === 'defendiendo' || s.estado === 'inactivo')
  const hayAtaqueEnCurso = hordasZombies.some(h => h.estado === 'atacando')

  // Calcular seguridad máxima basada en edificios
  const seguridadMaxima = 100

  return (
    <div className="space-y-4">
      {/* Hordas Zombie */}
      {hordasZombies.length > 0 && (
        <Card className={cn(
          "border-2",
          hayAtaqueEnCurso ? "border-destructive animate-pulse" : "border-yellow-600"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-destructive">
              <Skull className="w-4 h-4" />
              {hayAtaqueEnCurso ? '¡ZOMBIES ATACANDO!' : 'Horda Zombie Acercándose'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {hordasZombies.map((horda) => (
              <div key={horda.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl zombie-animate">&#129503;</span>
                    <div>
                      <div className="font-medium text-foreground">
                        {horda.cantidad} Zombies
                      </div>
                      <div className="text-xs text-muted-foreground">
                        PV: {horda.salud} | DMG: {horda.dano}
                      </div>
                    </div>
                  </div>
                  {horda.estado === 'acercandose' && (
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {horda.tiempoHastaAtaque}s
                    </Badge>
                  )}
                  {horda.estado === 'atacando' && (
                    <Badge className="bg-destructive text-destructive-foreground">
                      <Swords className="w-3 h-3 mr-1" />
                      ATACANDO
                    </Badge>
                  )}
                </div>
              </div>
            ))}

            <Button 
              className="w-full gap-2"
              variant="destructive"
              onClick={defenderCompound}
            >
              <Shield className="w-4 h-4" />
              Reunir Defensores ({defensores.length})
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Estado de Defensa */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Defensa de la Base
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Fuerza Defensiva</span>
              <span className={cn(
                "font-mono",
                nivelSeguridad < 30 ? "text-destructive" : "text-foreground"
              )}>
                {Math.floor(nivelSeguridad)}/{seguridadMaxima}
              </span>
            </div>
            <Progress 
              value={(nivelSeguridad / seguridadMaxima) * 100}
              className={cn(
                "h-2",
                nivelSeguridad < 30 && "[&>div]:bg-destructive"
              )}
            />
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-2">Defensores Activos</div>
            {defensores.length === 0 ? (
              <p className="text-xs text-muted-foreground">Ningún superviviente defendiendo</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {defensores.slice(0, 6).map((s) => (
                  <div 
                    key={s.id}
                    className="flex items-center gap-1 bg-secondary/50 rounded px-2 py-1"
                  >
                    <svg viewBox="0 0 20 24" className="w-4 h-5">
                      <ellipse cx="10" cy="6" rx="5" ry="5" fill="#d4a574" />
                      <rect x="4" y="11" width="12" height="10" rx="2" fill="#4a6741" />
                    </svg>
                    <span className="text-xs">{s.nombre.split(' ')[0]}</span>
                    {s.equipado.ofensivo.arma && (
                      <span className="text-xs text-muted-foreground">
                        ({s.equipado.ofensivo.arma.dano})
                      </span>
                    )}
                  </div>
                ))}
                {defensores.length > 6 && (
                  <span className="text-xs text-muted-foreground self-center">
                    +{defensores.length - 6} más
                  </span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Registro de Combate */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Swords className="w-4 h-4 text-muted-foreground" />
            Registro de Combate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {registroCombate.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Sin actividad de combate aún
              </p>
            ) : (
              <div className="space-y-1">
                {registroCombate.slice(0, 20).map((registro) => (
                  <div 
                    key={registro.id}
                    className={cn(
                      "text-xs py-1 border-b border-border/50 last:border-0",
                      registro.tipo === 'eliminacion' && "text-green-400",
                      registro.tipo === 'dano' && "text-red-400",
                      registro.tipo === 'curacion' && "text-blue-400",
                      registro.tipo === 'evento' && "text-muted-foreground"
                    )}
                  >
                    <span className="text-muted-foreground/50 font-mono mr-2">
                      {new Date(registro.timestamp).toLocaleTimeString()}
                    </span>
                    {registro.mensaje}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Consejos */}
      {!hayAtaqueEnCurso && hordasZombies.length === 0 && (
        <Card className="bg-secondary/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Consejos de Supervivencia</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Construye barricadas para aumentar la defensa</li>
                  <li>Equipa armas a tus supervivientes</li>
                  <li>Los ataques zombie son más frecuentes de noche</li>
                  <li>Mantén recursos almacenados para emergencias</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
