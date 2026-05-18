'use client'

import { useState } from 'react'
import { useGameStore, type Mision, type NivelPeligro, type TipoRecurso } from '@/lib/game-store'
import { cn } from '@/lib/utils'

const coloresPeligro: Record<NivelPeligro, { bg: string; text: string; etiqueta: string }> = {
  bajo: { bg: 'bg-green-900/50', text: 'text-green-400', etiqueta: 'Amenaza Baja' },
  moderado: { bg: 'bg-yellow-900/50', text: 'text-yellow-400', etiqueta: 'Moderado' },
  peligroso: { bg: 'bg-orange-900/50', text: 'text-orange-400', etiqueta: 'Peligroso' },
  alto: { bg: 'bg-red-900/50', text: 'text-red-400', etiqueta: 'Alto Peligro' },
  extremo: { bg: 'bg-purple-900/50', text: 'text-purple-400', etiqueta: 'Extremo' },
}

const iconosRecursos: Record<string, React.ReactNode> = {
  metal: <IconoMetal />,
  madera: <IconoMadera />,
  tela: <IconoTela />,
  comida: <IconoComida />,
  agua: <IconoAgua />,
  municion: <IconoMunicion />,
  combustible: <IconoCombustible />,
}

function IconoMetal() {
  return <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
}
function IconoMadera() {
  return <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20h16M6 20v-8l6-8 6 8v8" /></svg>
}
function IconoTela() {
  return <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z" /></svg>
}
function IconoComida() {
  return <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" /></svg>
}
function IconoAgua() {
  return <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L6 12a6 6 0 1012 0L12 2z" /></svg>
}
function IconoMunicion() {
  return <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
}
function IconoCombustible() {
  return <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 22h12V6a2 2 0 00-2-2H5a2 2 0 00-2 2v16z" /></svg>
}

export function PanelMisiones() {
  const { 
    misionesDisponibles, 
    misionesActivas, 
    supervivientes, 
    recursos,
    asignarAMision, 
    desasignarDeMision,
    lanzarMision 
  } = useGameStore()

  const [misionSeleccionada, setMisionSeleccionada] = useState<string | null>(null)
  const [automatizar, setAutomatizar] = useState(false)

  const mision = misionesDisponibles.find(m => m.id === misionSeleccionada)
  const supervivientesDisponibles = supervivientes.filter(s => 
    s.estado === 'inactivo' && !s.herido && s.salud > 20
  )

  const formatearTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60)
    const segs = Math.floor(segundos % 60)
    return `${mins}:${segs.toString().padStart(2, '0')}`
  }

  const calcularProbabilidadExito = (m: Mision) => {
    const asignados = supervivientes.filter(s => m.supervivientesAsignados.includes(s.id))
    if (asignados.length === 0) return 0
    
    const dpsTotal = asignados.reduce((suma, s) => {
      const arma = s.equipado.ofensivo.arma
      return suma + (arma?.dps || 5) + s.habilidades.combateDistancia
    }, 0)
    
    return Math.min(95, Math.floor(50 + (dpsTotal / m.cantidadZombies) * 10))
  }

  const renderizarTarjetaMision = (m: Mision, esActiva: boolean = false) => {
    const peligro = coloresPeligro[m.nivelPeligro]
    const probabilidadExito = calcularProbabilidadExito(m)
    const supervivientesAsignados = supervivientes.filter(s => m.supervivientesAsignados.includes(s.id))

    return (
      <div
        key={m.id}
        onClick={() => !esActiva && setMisionSeleccionada(m.id)}
        className={cn(
          "bg-stone-800/80 rounded-lg p-3 transition-all border-2",
          esActiva 
            ? "border-yellow-600/50" 
            : misionSeleccionada === m.id 
              ? "border-primary cursor-pointer" 
              : "border-transparent hover:border-stone-600 cursor-pointer"
        )}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white truncate">{m.nombre}</h3>
              {m.esZonaAltaActividad && (
                <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold animate-pulse">
                  ALTA ACTIVIDAD
                </span>
              )}
            </div>
            <div className="text-xs text-stone-400">{m.ubicacion}</div>
          </div>
          <div className={cn("px-2 py-0.5 rounded text-xs font-medium", peligro.bg, peligro.text)}>
            {peligro.etiqueta}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs mb-2">
          <div className="bg-stone-900/50 rounded p-1.5">
            <div className="text-stone-500">Nivel</div>
            <div className="text-white font-bold">{m.nivel}</div>
          </div>
          <div className="bg-stone-900/50 rounded p-1.5">
            <div className="text-stone-500">Infectados</div>
            <div className="text-red-400 font-bold">{m.cantidadZombies}</div>
          </div>
          <div className="bg-stone-900/50 rounded p-1.5">
            <div className="text-stone-500">Duración</div>
            <div className="text-white font-bold">{formatearTiempo(esActiva ? m.tiempoRestante : m.duracion)}</div>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-2">
          <span className="text-[10px] text-stone-500">Hallazgos:</span>
          {m.posiblesHallazgos.map(res => (
            <div key={res} className="text-stone-400" title={res}>
              {iconosRecursos[res]}
            </div>
          ))}
        </div>

        {m.supervivientesAsignados.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-[10px] text-stone-500">Equipo:</span>
            {supervivientesAsignados.map(s => (
              <div 
                key={s.id}
                className="w-6 h-6 bg-stone-700 rounded flex items-center justify-center"
                title={s.nombre}
              >
                <svg viewBox="0 0 20 24" className="w-4 h-5">
                  <ellipse cx="10" cy="6" rx="5" ry="5" fill="#d4a574" />
                  <rect x="4" y="11" width="12" height="10" rx="2" fill="#4a6741" />
                </svg>
              </div>
            ))}
            <span className="text-[10px] text-stone-400">({m.supervivientesAsignados.length}/5)</span>
          </div>
        )}

        {esActiva && (
          <div className="mt-2">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-stone-500">Progreso</span>
              <span className={cn(
                m.estado === 'regresando' ? "text-green-400" : "text-yellow-400"
              )}>
                {m.estado === 'regresando' ? 'Regresando...' : 'En Progreso'}
              </span>
            </div>
            <div className="h-1.5 bg-stone-900 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all",
                  m.estado === 'regresando' ? "bg-green-500" : "bg-yellow-500"
                )}
                style={{ 
                  width: `${100 - ((m.tiempoRestante / (m.estado === 'regresando' ? m.tiempoRetorno : m.duracion)) * 100)}%` 
                }}
              />
            </div>
          </div>
        )}

        {!esActiva && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-700">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              <span className={cn(
                "text-xs",
                recursos.municion >= m.municionRequerida ? "text-stone-300" : "text-red-400"
              )}>
                {m.municionRequerida} Munición
              </span>
            </div>
            <div className={cn(
              "text-xs font-bold",
              probabilidadExito >= 70 ? "text-green-400" : 
              probabilidadExito >= 40 ? "text-yellow-400" : "text-red-400"
            )}>
              {probabilidadExito}% Éxito
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-stone-900/50 rounded-lg border border-stone-800 overflow-hidden">
      <div className="bg-stone-800 px-4 py-3 border-b border-stone-700">
        <h2 className="font-bold text-white flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
            <line x1="9" y1="3" x2="9" y2="18" />
            <line x1="15" y1="6" x2="15" y2="21" />
          </svg>
          Misiones
        </h2>
      </div>

      <div className="p-4">
        {misionesActivas.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4 animate-pulse" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
              </svg>
              Misiones Activas ({misionesActivas.length})
            </h3>
            <div className="space-y-2">
              {misionesActivas.map(m => renderizarTarjetaMision(m, true))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-stone-300 mb-2">
              Misiones Disponibles ({misionesDisponibles.length})
            </h3>
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {misionesDisponibles.length === 0 ? (
                <div className="text-center text-stone-500 text-sm py-8">
                  No hay misiones disponibles. Vuelve mañana.
                </div>
              ) : (
                misionesDisponibles.map(m => renderizarTarjetaMision(m))
              )}
            </div>
          </div>

          <div>
            {mision ? (
              <div className="bg-stone-800/50 rounded-lg p-4 space-y-4">
                <div>
                  <h3 className="font-bold text-white">{mision.nombre}</h3>
                  <p className="text-sm text-stone-400 mt-1">
                    Busca suministros en el área. Infectados esperados: {mision.cantidadZombies}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-stone-900/50 rounded p-2">
                    <div className="text-stone-500 text-xs">Tiempo de Retorno</div>
                    <div className="text-white">{formatearTiempo(mision.tiempoRetorno)}</div>
                  </div>
                  <div className="bg-stone-900/50 rounded p-2">
                    <div className="text-stone-500 text-xs">Recompensa XP</div>
                    <div className="text-blue-400">{mision.recompensas.xp} XP</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-stone-300 mb-2">
                    Asignar Supervivientes ({mision.supervivientesAsignados.length}/5)
                  </h4>
                  
                  {mision.supervivientesAsignados.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {supervivientes
                        .filter(s => mision.supervivientesAsignados.includes(s.id))
                        .map(s => (
                          <button
                            key={s.id}
                            onClick={() => desasignarDeMision(s.id, mision.id)}
                            className="flex items-center gap-1 bg-primary/20 text-primary text-xs px-2 py-1 rounded hover:bg-primary/30 transition-colors"
                          >
                            {s.nombre}
                            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </button>
                        ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {supervivientesDisponibles
                      .filter(s => !mision.supervivientesAsignados.includes(s.id))
                      .map(s => (
                        <button
                          key={s.id}
                          onClick={() => asignarAMision(s.id, mision.id)}
                          disabled={mision.supervivientesAsignados.length >= 5}
                          className={cn(
                            "text-xs px-2 py-1 rounded transition-colors",
                            mision.supervivientesAsignados.length >= 5
                              ? "bg-stone-800 text-stone-500 cursor-not-allowed"
                              : "bg-stone-700 text-stone-300 hover:bg-stone-600"
                          )}
                        >
                          {s.nombre} (Nv.{s.nivel})
                        </button>
                      ))}
                  </div>

                  {supervivientesDisponibles.length === 0 && mision.supervivientesAsignados.length === 0 && (
                    <div className="text-xs text-stone-500 text-center py-2">
                      No hay supervivientes disponibles
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between bg-stone-900/50 rounded p-2">
                  <div>
                    <div className="text-sm text-stone-300">Automatizar</div>
                    <div className="text-[10px] text-stone-500">1.5x tiempo de retorno</div>
                  </div>
                  <button
                    onClick={() => setAutomatizar(!automatizar)}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative",
                      automatizar ? "bg-primary" : "bg-stone-700"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all",
                      automatizar ? "left-6" : "left-0.5"
                    )} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    lanzarMision(mision.id, automatizar)
                    setMisionSeleccionada(null)
                  }}
                  disabled={
                    mision.supervivientesAsignados.length === 0 || 
                    recursos.municion < mision.municionRequerida
                  }
                  className={cn(
                    "w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors",
                    mision.supervivientesAsignados.length > 0 && recursos.municion >= mision.municionRequerida
                      ? "bg-green-600 hover:bg-green-500 text-white"
                      : "bg-stone-700 text-stone-500 cursor-not-allowed"
                  )}
                >
                  {recursos.municion < mision.municionRequerida 
                    ? 'Munición Insuficiente'
                    : mision.supervivientesAsignados.length === 0
                      ? 'Asignar Supervivientes'
                      : 'Lanzar Misión'
                  }
                </button>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-stone-500 text-sm bg-stone-800/30 rounded-lg min-h-[200px]">
                Selecciona una misión para ver detalles
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
