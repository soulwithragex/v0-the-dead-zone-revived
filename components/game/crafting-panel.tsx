'use client'

import { useGameStore, type TipoArma } from '@/lib/game-store'
import { cn } from '@/lib/utils'
import { Hammer, Trash2, UserPlus, Wrench, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const fabricacionesArmas: { tipo: TipoArma; nombre: string; descripcion: string; costo: Record<string, number> }[] = [
  { tipo: 'cuerpo_a_cuerpo', nombre: 'Arma Cuerpo a Cuerpo', descripcion: 'Combate cercano, sin munición', costo: { metal: 15, madera: 10 } },
  { tipo: 'pistola', nombre: 'Pistola', descripcion: 'Arma secundaria equilibrada', costo: { metal: 30, municion: 10 } },
  { tipo: 'rifle', nombre: 'Rifle', descripcion: 'Alta precisión, largo alcance', costo: { metal: 50, madera: 20, municion: 15 } },
  { tipo: 'escopeta', nombre: 'Escopeta', descripcion: 'Alto daño, corto alcance', costo: { metal: 45, madera: 15, municion: 20 } },
  { tipo: 'subfusil', nombre: 'Subfusil', descripcion: 'Alta cadencia de fuego', costo: { metal: 40, municion: 25 } },
  { tipo: 'asalto', nombre: 'Fusil de Asalto', descripcion: 'Arma de combate versátil', costo: { metal: 60, municion: 30 } },
]

const coloresRareza = {
  comun: 'text-stone-300 border-stone-500',
  poco_comun: 'text-blue-400 border-blue-500',
  raro: 'text-purple-400 border-purple-500',
  unico: 'text-orange-400 border-orange-500',
}

const nombresRareza: Record<string, string> = {
  comun: 'Común',
  poco_comun: 'Poco Común',
  raro: 'Raro',
  unico: 'Único',
}

const nombresTipoArma: Record<string, string> = {
  cuerpo_a_cuerpo: 'Cuerpo a cuerpo',
  pistola: 'Pistola',
  rifle: 'Rifle',
  escopeta: 'Escopeta',
  subfusil: 'Subfusil',
  asalto: 'Asalto',
}

export function PanelTaller() {
  const { 
    recursos, 
    armas, 
    supervivientes,
    fabricarArma, 
    reclutarSuperviviente, 
    desguazarArma 
  } = useGameStore()

  const puedePermitir = (costo: Record<string, number>) => {
    return Object.entries(costo).every(
      ([res, cantidad]) => recursos[res as keyof typeof recursos] >= cantidad
    )
  }

  const obtenerValorDesguace = (rareza: string, nivel: number) => {
    const valores: Record<string, number> = { comun: 5, poco_comun: 10, raro: 20, unico: 40 }
    return (valores[rareza] || 5) * nivel
  }

  const estaArmaEquipada = (armaId: string) => {
    return supervivientes.some(s => 
      s.equipado.ofensivo.arma?.id === armaId ||
      s.equipado.defensivo.arma?.id === armaId
    )
  }

  return (
    <div className="space-y-6">
      {/* Sección de Reclutamiento */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="bg-secondary/50 px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-green-400" />
            Reclutar Superviviente
          </h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-3">
            Recluta un nuevo superviviente para tu grupo. Actual: {supervivientes.length}/10
          </p>
          <div className="flex items-center justify-between bg-secondary/30 rounded-lg p-3 mb-3">
            <div className="text-sm">
              <span className="text-muted-foreground">Costo: </span>
              <span className={cn(recursos.comida >= 50 ? 'text-foreground' : 'text-red-400')}>50 Comida</span>
              <span className="text-muted-foreground"> + </span>
              <span className={cn(recursos.agua >= 50 ? 'text-foreground' : 'text-red-400')}>50 Agua</span>
            </div>
          </div>
          <Button
            onClick={reclutarSuperviviente}
            disabled={supervivientes.length >= 10 || recursos.comida < 50 || recursos.agua < 50}
            className="w-full"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {supervivientes.length >= 10 ? 'Compound Lleno' : 'Reclutar Superviviente'}
          </Button>
        </div>
      </div>

      {/* Sección de Fabricación */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="bg-secondary/50 px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Hammer className="w-4 h-4 text-amber-400" />
            Fabricación de Armas
          </h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-4">
            Fabrica armas usando tus recursos. La calidad depende del nivel de tu compound.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {fabricacionesArmas.map((fab) => {
              const asequible = puedePermitir(fab.costo)
              
              return (
                <button
                  key={fab.tipo}
                  onClick={() => fabricarArma(fab.tipo)}
                  disabled={!asequible}
                  className={cn(
                    "text-left p-3 rounded-lg border transition-all",
                    asequible 
                      ? "bg-secondary/30 border-border hover:border-primary cursor-pointer"
                      : "bg-secondary/10 border-border/50 opacity-60 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-sm text-foreground">{fab.nombre}</div>
                      <div className="text-xs text-muted-foreground">{fab.descripcion}</div>
                    </div>
                    <Wrench className={cn("w-4 h-4", asequible ? "text-amber-400" : "text-muted")} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.entries(fab.costo).map(([res, cantidad]) => (
                      <span 
                        key={res} 
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded",
                          recursos[res as keyof typeof recursos] >= cantidad
                            ? "bg-secondary text-foreground"
                            : "bg-red-900/30 text-red-400"
                        )}
                      >
                        {cantidad} {res}
                      </span>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sección de Desguace de Armas */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="bg-secondary/50 px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-zinc-400" />
            Desguazar Armas
          </h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-3">
            Desguaza armas innecesarias por metal. Mejores armas dan más metal.
          </p>
          {armas.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No hay armas disponibles para desguazar
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {armas.map((arma) => {
                const equipada = estaArmaEquipada(arma.id)
                const valorDesguace = obtenerValorDesguace(arma.rareza, arma.nivel)
                
                return (
                  <div
                    key={arma.id}
                    className={cn(
                      "flex items-center justify-between bg-secondary/30 rounded-lg p-3 border-l-2",
                      coloresRareza[arma.rareza]
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className={cn("font-medium text-sm truncate", coloresRareza[arma.rareza].split(' ')[0])}>
                        {arma.nombre}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {nombresTipoArma[arma.tipo] || arma.tipo} | Nv.{arma.nivel} | DPS: {arma.dps}
                        {equipada && <span className="ml-2 text-yellow-500">(Equipada)</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400">+{valorDesguace} metal</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => desguazarArma(arma.id)}
                        disabled={equipada}
                        className={cn(
                          "h-8 w-8 p-0",
                          equipada ? "opacity-50" : "hover:bg-red-900/30 hover:text-red-400"
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

      {/* Consejos */}
      <div className="bg-secondary/30 rounded-lg p-4 border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-2">Consejos del Taller</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>- La calidad de las armas fabricadas escala con el nivel del compound</li>
          <li>- Las armas raras y únicas dan más metal al desguazarlas</li>
          <li>- Los supervivientes reclutados comienzan en nivel 1 con habilidades aleatorias</li>
          <li>- Un nivel de compound más alto desbloquea mejores resultados de fabricación</li>
        </ul>
      </div>
    </div>
  )
}
