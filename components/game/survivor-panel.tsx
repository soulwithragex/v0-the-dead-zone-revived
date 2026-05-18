'use client'

import { useState } from 'react'
import { useGameStore, type Superviviente, type ClaseSuperviviete } from '@/lib/game-store'
import { cn } from '@/lib/utils'

const infoClase: Record<ClaseSuperviviete, { nombre: string; descripcion: string; color: string; especializacion: string }> = {
  lider: { 
    nombre: 'Líder', 
    descripcion: 'Superviviente versátil que lidera el grupo',
    color: 'text-yellow-400',
    especializacion: 'Pistola, Rifle, Cuerpo a cuerpo'
  },
  luchador: { 
    nombre: 'Luchador', 
    descripcion: 'Especialista en combate con alto daño',
    color: 'text-red-400',
    especializacion: 'Asalto, Escopeta, Subfusil'
  },
  medico: { 
    nombre: 'Médico', 
    descripcion: 'Puede curar a otros supervivientes en misiones',
    color: 'text-green-400',
    especializacion: 'Pistola, Subfusil'
  },
  recolector: { 
    nombre: 'Recolector', 
    descripcion: 'Encuentra más y mejor botín',
    color: 'text-purple-400',
    especializacion: 'Pistola, Cuerpo a cuerpo'
  },
  ingeniero: { 
    nombre: 'Ingeniero', 
    descripcion: 'Construcción más rápida y desarme de trampas',
    color: 'text-blue-400',
    especializacion: 'Escopeta, Pistola'
  },
  explorador: { 
    nombre: 'Explorador', 
    descripcion: 'Movimiento rápido y detección de trampas',
    color: 'text-cyan-400',
    especializacion: 'Rifle, Pistola'
  },
}

const infoEstado: Record<string, { etiqueta: string; color: string }> = {
  inactivo: { etiqueta: 'Inactivo', color: 'bg-green-500' },
  mision: { etiqueta: 'En Misión', color: 'bg-yellow-500' },
  defendiendo: { etiqueta: 'Defendiendo', color: 'bg-blue-500' },
  construyendo: { etiqueta: 'Construyendo', color: 'bg-purple-500' },
  descansando: { etiqueta: 'Descansando', color: 'bg-indigo-500' },
  herido: { etiqueta: 'Herido', color: 'bg-red-500' },
}

export function PanelSupervivientes() {
  const { supervivientes, supervivienteSeleccionado, seleccionarSuperviviente, armas, equiparArma, asignarClaseSuperviviente, curarSuperviviente, actualizarEstadoSuperviviente } = useGameStore()
  const [mostrarSeleccionClase, setMostrarSeleccionClase] = useState<string | null>(null)

  const seleccionado = supervivientes.find(s => s.id === supervivienteSeleccionado)

  const renderizarTarjetaSuperviviente = (superviviente: Superviviente) => {
    const datosClase = infoClase[superviviente.clase]
    const estado = infoEstado[superviviente.estado]
    const porcentajeSalud = (superviviente.salud / superviviente.saludMaxima) * 100

    return (
      <div
        key={superviviente.id}
        onClick={() => seleccionarSuperviviente(superviviente.id)}
        className={cn(
          "relative bg-stone-800/80 rounded-lg p-3 cursor-pointer transition-all border-2",
          supervivienteSeleccionado === superviviente.id 
            ? "border-primary ring-1 ring-primary/50" 
            : "border-transparent hover:border-stone-600"
        )}
      >
        {/* Indicador de estado */}
        <div className={cn("absolute top-2 right-2 w-2.5 h-2.5 rounded-full", estado.color)} />

        {/* Avatar e Info Básica */}
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-14 h-14 bg-stone-700 rounded-lg flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 40 50" className="w-10 h-12">
                <ellipse cx="20" cy="12" rx="9" ry="10" fill="#d4a574" />
                <path d="M11 8 Q20 2 29 8 Q30 12 29 14 Q20 10 11 14 Q10 12 11 8" fill="#3d2b1f" />
                <rect x="8" y="22" width="24" height="18" rx="3" fill="#4a6741" />
                <circle cx="16" cy="12" r="1.5" fill="#2d2d2d" />
                <circle cx="24" cy="12" r="1.5" fill="#2d2d2d" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-stone-900 rounded-full flex items-center justify-center border-2 border-stone-700">
              <span className="text-xs font-bold text-white">{superviviente.nivel}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white truncate">{superviviente.nombre}</h3>
            </div>
            <div className={cn("text-xs font-medium", datosClase.color)}>
              {datosClase.nombre}
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">
              {estado.etiqueta}
            </div>
          </div>
        </div>

        {/* Barra de salud */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-stone-400 mb-1">
            <span>Salud</span>
            <span>{Math.floor(superviviente.salud)}/{superviviente.saludMaxima}</span>
          </div>
          <div className="h-2 bg-stone-900 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all",
                porcentajeSalud > 60 ? "bg-green-500" : porcentajeSalud > 30 ? "bg-yellow-500" : "bg-red-500"
              )}
              style={{ width: `${porcentajeSalud}%` }}
            />
          </div>
        </div>

        {/* Barra de XP */}
        <div className="mt-2">
          <div className="flex justify-between text-[10px] text-stone-400 mb-1">
            <span>XP</span>
            <span>{superviviente.xp}/{superviviente.xpSiguienteNivel}</span>
          </div>
          <div className="h-1.5 bg-stone-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${(superviviente.xp / superviviente.xpSiguienteNivel) * 100}%` }}
            />
          </div>
        </div>

        {superviviente.herido && (
          <div className="mt-2 flex items-center gap-1.5 text-red-400 text-xs">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Herido - {Math.ceil(superviviente.tiempoRestanteHerida / 60)}m recuperación</span>
          </div>
        )}
      </div>
    )
  }

  const renderizarPanelDetalles = (superviviente: Superviviente) => {
    const datosClase = infoClase[superviviente.clase]
    const armaOfensiva = superviviente.equipado.ofensivo.arma
    const armaDefensiva = superviviente.equipado.defensivo.arma

    return (
      <div className="bg-stone-800/50 rounded-lg p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">{superviviente.nombre}</h3>
            <div className={cn("text-sm", datosClase.color)}>{datosClase.nombre}</div>
            <div className="text-xs text-stone-400 mt-1">{datosClase.descripcion}</div>
          </div>
          {superviviente.clase !== 'lider' && (
            <button
              onClick={() => setMostrarSeleccionClase(superviviente.id)}
              className="text-xs bg-stone-700 hover:bg-stone-600 text-white px-2 py-1 rounded transition-colors"
            >
              Cambiar Clase
            </button>
          )}
        </div>

        {mostrarSeleccionClase === superviviente.id && (
          <div className="bg-stone-900 rounded-lg p-3 space-y-2">
            <div className="text-sm text-stone-400 mb-2">Seleccionar Clase:</div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(infoClase) as [ClaseSuperviviete, typeof infoClase[ClaseSuperviviete]][])
                .filter(([clave]) => clave !== 'lider')
                .map(([clave, info]) => (
                  <button
                    key={clave}
                    onClick={() => {
                      asignarClaseSuperviviente(superviviente.id, clave)
                      setMostrarSeleccionClase(null)
                    }}
                    className={cn(
                      "p-2 rounded text-left transition-colors",
                      superviviente.clase === clave 
                        ? "bg-primary/20 border border-primary" 
                        : "bg-stone-800 hover:bg-stone-700"
                    )}
                  >
                    <div className={cn("font-medium text-sm", info.color)}>{info.nombre}</div>
                    <div className="text-[10px] text-stone-400">{info.especializacion}</div>
                  </button>
                ))}
            </div>
            <button
              onClick={() => setMostrarSeleccionClase(null)}
              className="w-full text-xs text-stone-400 hover:text-white py-1"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Moral */}
        <div className="bg-stone-900/50 rounded p-2">
          <div className="flex justify-between text-xs text-stone-400 mb-1">
            <span>Moral</span>
            <span>{Math.floor(superviviente.moral)}%</span>
          </div>
          <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all",
                superviviente.moral > 60 ? "bg-green-500" : superviviente.moral > 30 ? "bg-yellow-500" : "bg-red-500"
              )}
              style={{ width: `${superviviente.moral}%` }}
            />
          </div>
        </div>

        {/* Habilidades */}
        <div>
          <h4 className="text-sm font-semibold text-stone-300 mb-2">Habilidades</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(superviviente.habilidades).map(([habilidad, valor]) => {
              const nombresHabilidades: Record<string, string> = {
                combateDistancia: 'Combate Distancia',
                combateCuerpoACuerpo: 'Cuerpo a Cuerpo',
                curacion: 'Curación',
                movimiento: 'Movimiento',
                recoleccion: 'Recolección',
                suerte: 'Suerte'
              }
              return (
                <div key={habilidad} className="bg-stone-900/50 rounded px-2 py-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-stone-400">
                      {nombresHabilidades[habilidad] || habilidad}
                    </span>
                    <span className={cn(
                      "text-xs font-bold",
                      valor >= 15 ? "text-green-400" : valor >= 10 ? "text-yellow-400" : "text-stone-300"
                    )}>
                      {valor}
                    </span>
                  </div>
                  <div className="h-1 bg-stone-800 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-primary"
                      style={{ width: `${Math.min(100, (valor / 20) * 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Equipamiento */}
        <div>
          <h4 className="text-sm font-semibold text-stone-300 mb-2">Equipamiento</h4>
          
          <div className="bg-stone-900/50 rounded p-2 mb-2">
            <div className="text-xs text-red-400 mb-1.5 font-medium">Carga Ofensiva</div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-stone-800 rounded flex items-center justify-center">
                <svg viewBox="0 0 24 24" className={cn("w-6 h-6", armaOfensiva ? "text-red-400" : "text-stone-600")} fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14.5 4.5L20 10M22 12l-5 5-9-9-4 4-2.5-2.5M9 4L4 9" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                {armaOfensiva ? (
                  <>
                    <div className={cn(
                      "text-sm font-medium truncate",
                      armaOfensiva.rareza === 'unico' ? "text-orange-400" :
                      armaOfensiva.rareza === 'raro' ? "text-purple-400" :
                      armaOfensiva.rareza === 'poco_comun' ? "text-blue-400" : "text-stone-300"
                    )}>
                      {armaOfensiva.nombre}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      DMG: {armaOfensiva.dano} | PRE: {armaOfensiva.precision}% | DPS: {armaOfensiva.dps}
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-stone-500">Sin arma equipada</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-stone-900/50 rounded p-2">
            <div className="text-xs text-blue-400 mb-1.5 font-medium">Carga Defensiva</div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-stone-800 rounded flex items-center justify-center">
                <svg viewBox="0 0 24 24" className={cn("w-6 h-6", armaDefensiva ? "text-blue-400" : "text-stone-600")} fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                {armaDefensiva ? (
                  <>
                    <div className="text-sm font-medium text-stone-300 truncate">{armaDefensiva.nombre}</div>
                    <div className="text-[10px] text-stone-400">
                      DMG: {armaDefensiva.dano} | PRE: {armaDefensiva.precision}%
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-stone-500">Sin arma equipada</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Armas disponibles */}
        {armas.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-stone-300 mb-2">Armas Disponibles</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {armas.map(arma => (
                <div 
                  key={arma.id}
                  className="flex items-center justify-between bg-stone-900/50 rounded p-2"
                >
                  <div>
                    <div className={cn(
                      "text-sm",
                      arma.rareza === 'unico' ? "text-orange-400" :
                      arma.rareza === 'raro' ? "text-purple-400" :
                      arma.rareza === 'poco_comun' ? "text-blue-400" : "text-stone-300"
                    )}>
                      {arma.nombre}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Nv.{arma.nivel} | {arma.tipo} | DPS: {arma.dps}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => equiparArma(superviviente.id, arma.id, 'ofensivo')}
                      className="text-[10px] bg-red-900/50 hover:bg-red-800/50 text-red-300 px-2 py-1 rounded"
                    >
                      OFE
                    </button>
                    <button
                      onClick={() => equiparArma(superviviente.id, arma.id, 'defensivo')}
                      className="text-[10px] bg-blue-900/50 hover:bg-blue-800/50 text-blue-300 px-2 py-1 rounded"
                    >
                      DEF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-2">
          <button
            onClick={() => curarSuperviviente(superviviente.id)}
            disabled={superviviente.salud >= superviviente.saludMaxima}
            className={cn(
              "flex-1 py-2 rounded text-sm font-medium transition-colors",
              superviviente.salud < superviviente.saludMaxima
                ? "bg-green-600 hover:bg-green-500 text-white"
                : "bg-stone-700 text-stone-500 cursor-not-allowed"
            )}
          >
            Curar
          </button>
          <button
            onClick={() => {
              actualizarEstadoSuperviviente(superviviente.id, { 
                estado: superviviente.estado === 'descansando' ? 'inactivo' : 'descansando'
              })
            }}
            disabled={superviviente.estado === 'mision' || superviviente.herido}
            className={cn(
              "flex-1 py-2 rounded text-sm font-medium transition-colors",
              superviviente.estado !== 'mision' && !superviviente.herido
                ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                : "bg-stone-700 text-stone-500 cursor-not-allowed"
            )}
          >
            {superviviente.estado === 'descansando' ? 'Levantar' : 'Descansar'}
          </button>
          <button
            onClick={() => {
              actualizarEstadoSuperviviente(superviviente.id, { 
                estado: superviviente.estado === 'defendiendo' ? 'inactivo' : 'defendiendo'
              })
            }}
            disabled={superviviente.estado === 'mision' || superviviente.herido}
            className={cn(
              "flex-1 py-2 rounded text-sm font-medium transition-colors",
              superviviente.estado !== 'mision' && !superviviente.herido
                ? "bg-blue-600 hover:bg-blue-500 text-white"
                : "bg-stone-700 text-stone-500 cursor-not-allowed"
            )}
          >
            {superviviente.estado === 'defendiendo' ? 'Retirar' : 'Defender'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-stone-900/50 rounded-lg border border-stone-800 overflow-hidden">
      <div className="bg-stone-800 px-4 py-3 border-b border-stone-700">
        <h2 className="font-bold text-white flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
          Supervivientes ({supervivientes.length}/10)
        </h2>
      </div>

      <div className="p-4">
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
            {supervivientes.map(renderizarTarjetaSuperviviente)}
          </div>

          <div>
            {seleccionado ? (
              renderizarPanelDetalles(seleccionado)
            ) : (
              <div className="h-full flex items-center justify-center text-stone-500 text-sm bg-stone-800/30 rounded-lg min-h-[200px]">
                Selecciona un superviviente para ver detalles
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
