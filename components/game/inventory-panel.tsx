'use client'

import { useGameStore } from '@/lib/game-store'
import { cn } from '@/lib/utils'
import { Package, Swords } from 'lucide-react'

export function PanelInventario() {
  const { inventario, armas, supervivientes, equiparArma } = useGameStore()

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

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Package className="w-5 h-5" />
        Inventario
      </h2>

      {/* Sección de Armas */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="bg-secondary/50 px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Swords className="w-4 h-4 text-red-400" />
            Armas ({armas.length})
          </h3>
        </div>
        <div className="p-4">
          {armas.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay armas en el inventario. ¡Envía supervivientes a misiones para encontrar más!
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {armas.map((arma) => (
                <div
                  key={arma.id}
                  className={cn(
                    "bg-secondary/30 rounded-lg p-3 border-l-4",
                    coloresRareza[arma.rareza]
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className={cn("font-medium", coloresRareza[arma.rareza].split(' ')[0])}>
                        {arma.nombre}
                      </h4>
                      <div className="text-xs text-muted-foreground capitalize">
                        {nombresTipoArma[arma.tipo] || arma.tipo} | Nv.{arma.nivel}
                      </div>
                    </div>
                    <span className={cn(
                      "text-[10px] uppercase px-1.5 py-0.5 rounded",
                      arma.rareza === 'unico' ? 'bg-orange-500/20' :
                      arma.rareza === 'raro' ? 'bg-purple-500/20' :
                      arma.rareza === 'poco_comun' ? 'bg-blue-500/20' : 'bg-stone-500/20'
                    )}>
                      {nombresRareza[arma.rareza] || arma.rareza}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    <div className="bg-black/20 rounded px-2 py-1">
                      <div className="text-muted-foreground">DMG</div>
                      <div className="font-bold text-red-400">{arma.dano}</div>
                    </div>
                    <div className="bg-black/20 rounded px-2 py-1">
                      <div className="text-muted-foreground">PRE</div>
                      <div className="font-bold text-blue-400">{arma.precision}%</div>
                    </div>
                    <div className="bg-black/20 rounded px-2 py-1">
                      <div className="text-muted-foreground">DPS</div>
                      <div className="font-bold text-green-400">{arma.dps}</div>
                    </div>
                  </div>

                  {/* Botones de equipar rápido */}
                  {supervivientes.filter(s => s.estado !== 'mision').length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {supervivientes.filter(s => s.estado !== 'mision').slice(0, 3).map((superviviente) => (
                        <button
                          key={superviviente.id}
                          onClick={() => equiparArma(superviviente.id, arma.id, 'ofensivo')}
                          className="text-[10px] bg-secondary hover:bg-secondary/80 text-foreground px-2 py-1 rounded transition-colors"
                          title={`Equipar a ${superviviente.nombre}`}
                        >
                          {superviviente.nombre.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sección de Objetos */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="bg-secondary/50 px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" />
            Objetos ({inventario.length})
          </h3>
        </div>
        <div className="p-4">
          {inventario.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Tu inventario está vacío</p>
              <p className="text-xs text-muted-foreground mt-1">
                Envía supervivientes a misiones para recolectar objetos
              </p>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {inventario.map((objeto) => (
                <div
                  key={objeto.id}
                  className={cn(
                    "bg-secondary/30 rounded-lg p-3 border",
                    coloresRareza[objeto.rareza]
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn("font-medium text-sm", coloresRareza[objeto.rareza].split(' ')[0])}>
                      {objeto.nombre}
                    </span>
                    <span className="text-lg font-bold text-foreground">
                      x{objeto.cantidad}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground capitalize mt-1">
                    {objeto.tipo} | Nv.{objeto.nivel}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Consejos */}
      <div className="bg-secondary/30 rounded-lg p-4 border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-2">Consejos de Inventario</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>- Equipa armas a supervivientes para misiones y defensa</li>
          <li>- Las armas de mayor rareza causan más daño</li>
          <li>- Diferentes tipos de armas se adaptan a diferentes clases</li>
          <li>- Los objetos médicos pueden curar supervivientes heridos</li>
        </ul>
      </div>
    </div>
  )
}
