'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useGameStore } from '@/lib/game-store'
import { cn } from '@/lib/utils'

const ANCHO_MAPA = 800
const ALTO_MAPA = 550

export function MapaCompound() {
  const { 
    edificios, 
    supervivientes, 
    hordasZombies, 
    esDeNoche,
    escombros,
    posicionJugador,
    posicionObjetivoJugador,
    jugadorEnMovimiento,
    direccionJugador,
    establecerObjetivoJugador,
    establecerPestanaSeleccionada,
    seleccionarSuperviviente,
    supervivienteSeleccionado,
    dia,
  } = useGameStore()

  const refMapa = useRef<SVGSVGElement>(null)
  const [cuadroAnimacion, setCuadroAnimacion] = useState(0)
  const [indicadorClick, setIndicadorClick] = useState<{ x: number; y: number } | null>(null)
  const [edificioHover, setEdificioHover] = useState<string | null>(null)

  // Animación de caminar
  useEffect(() => {
    if (!jugadorEnMovimiento) {
      setCuadroAnimacion(0)
      return
    }

    const intervalo = setInterval(() => {
      setCuadroAnimacion(f => (f + 1) % 8)
    }, 100)

    return () => clearInterval(intervalo)
  }, [jugadorEnMovimiento])

  // Manejar click en el mapa
  const manejarClickMapa = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!refMapa.current) return

    const rect = refMapa.current.getBoundingClientRect()
    const escalaX = ANCHO_MAPA / rect.width
    const escalaY = ALTO_MAPA / rect.height
    const x = Math.max(40, Math.min(ANCHO_MAPA - 40, (e.clientX - rect.left) * escalaX))
    const y = Math.max(40, Math.min(ALTO_MAPA - 40, (e.clientY - rect.top) * escalaY))

    setIndicadorClick({ x, y })
    setTimeout(() => setIndicadorClick(null), 400)

    establecerObjetivoJugador({ x, y })
  }, [establecerObjetivoJugador])

  const manejarClickEdificio = (edificioId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    establecerPestanaSeleccionada('base')
  }

  const manejarClickSuperviviente = (supervivienteId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    seleccionarSuperviviente(supervivienteId)
    establecerPestanaSeleccionada('supervivientes')
  }

  // Renderizar sprite de superviviente (figura humanoide)
  const renderizarSpriteSuperviviente = (
    superviviente: typeof supervivientes[0], 
    x: number, 
    y: number, 
    esJugador: boolean = false,
    enMovimiento: boolean = false,
    direccion: string = 'abajo',
    cuadro: number = 0
  ) => {
    const coloresEstado = {
      inactivo: '#4ade80',
      defendiendo: '#3b82f6',
      mision: '#f59e0b',
      construyendo: '#8b5cf6',
      descansando: '#a855f7',
      herido: '#ef4444',
    }

    const offsetBalanceo = enMovimiento ? Math.sin(cuadro * 0.8) * 2 : 0
    const offsetPierna = enMovimiento ? Math.sin(cuadro * 1.2) * 4 : 0
    const offsetBrazo = enMovimiento ? Math.sin(cuadro * 1.2 + Math.PI) * 15 : 0
    const voltearX = direccion === 'izquierda' ? -1 : 1

    return (
      <g 
        transform={`translate(${x}, ${y + offsetBalanceo}) scale(${voltearX}, 1)`}
        className={cn(
          "cursor-pointer transition-transform",
          esJugador && "drop-shadow-lg"
        )}
        onClick={(e) => !esJugador && manejarClickSuperviviente(superviviente.id, e as unknown as React.MouseEvent)}
      >
        {/* Sombra */}
        <ellipse cx="0" cy="24" rx="10" ry="4" fill="rgba(0,0,0,0.3)" />
        
        {/* Piernas */}
        <g transform={`translate(0, 10)`}>
          <rect 
            x="-5" y="8" width="4" height="12" rx="1" fill="#3d4a3a"
            transform={`rotate(${offsetPierna}, -3, 8)`}
          />
          <rect 
            x="1" y="8" width="4" height="12" rx="1" fill="#3d4a3a"
            transform={`rotate(${-offsetPierna}, 3, 8)`}
          />
          {/* Botas */}
          <rect x="-6" y="18" width="5" height="4" rx="1" fill="#2d2d2d" transform={`rotate(${offsetPierna * 0.5}, -3, 18)`} />
          <rect x="1" y="18" width="5" height="4" rx="1" fill="#2d2d2d" transform={`rotate(${-offsetPierna * 0.5}, 3, 18)`} />
        </g>
        
        {/* Cuerpo/Torso */}
        <rect x="-8" y="-2" width="16" height="14" rx="2" fill={esJugador ? "#4a6741" : "#5a5a5a"} />
        <rect x="-7" y="-1" width="14" height="6" rx="1" fill={esJugador ? "#5a7751" : "#6a6a6a"} />
        
        {/* Brazos */}
        <g transform={`translate(-10, 0)`}>
          <rect 
            x="0" y="0" width="4" height="10" rx="1" 
            fill={esJugador ? "#4a6741" : "#5a5a5a"}
            transform={`rotate(${offsetBrazo}, 2, 0)`}
          />
          <rect x="0" y="8" width="4" height="3" rx="1" fill="#d4a574" transform={`rotate(${offsetBrazo}, 2, 0)`} />
        </g>
        <g transform={`translate(6, 0)`}>
          <rect 
            x="0" y="0" width="4" height="10" rx="1" 
            fill={esJugador ? "#4a6741" : "#5a5a5a"}
            transform={`rotate(${-offsetBrazo}, 2, 0)`}
          />
          <rect x="0" y="8" width="4" height="3" rx="1" fill="#d4a574" transform={`rotate(${-offsetBrazo}, 2, 0)`} />
        </g>
        
        {/* Cabeza */}
        <ellipse cx="0" cy="-10" rx="7" ry="8" fill="#d4a574" />
        {/* Cabello */}
        <path d="M-6 -16 Q0 -20 6 -16 Q7 -12 6 -10 Q0 -12 -6 -10 Q-7 -12 -6 -16" fill={esJugador ? "#3d2b1f" : "#4a3728"} />
        
        {/* Cara */}
        <circle cx="-2" cy="-10" r="1" fill="#2d2d2d" />
        <circle cx="2" cy="-10" r="1" fill="#2d2d2d" />
        
        {/* Indicador de estado */}
        <circle 
          cx="8" cy="-16" r="4" 
          fill={coloresEstado[superviviente.estado]}
          stroke="#1a1a1a"
          strokeWidth="1"
        />
        
        {/* Anillo de selección para el jugador */}
        {esJugador && (
          <ellipse 
            cx="0" cy="24" rx="14" ry="5" 
            fill="none" 
            stroke="#22c55e" 
            strokeWidth="2"
            strokeDasharray="4 2"
            className="animate-pulse"
          />
        )}
        
        {/* Anillo de selección para superviviente seleccionado */}
        {supervivienteSeleccionado === superviviente.id && !esJugador && (
          <ellipse 
            cx="0" cy="24" rx="14" ry="5" 
            fill="none" 
            stroke="#f59e0b" 
            strokeWidth="2"
          />
        )}
      </g>
    )
  }

  // Renderizar sprite de zombie
  const renderizarSpriteZombie = (x: number, y: number, indice: number) => {
    const tambaleo = Math.sin(Date.now() * 0.003 + indice) * 3
    const tambaleoBrazo = Math.sin(Date.now() * 0.005 + indice) * 10

    return (
      <g transform={`translate(${x + tambaleo}, ${y})`} key={`zombie-${indice}`}>
        {/* Sombra */}
        <ellipse cx="0" cy="20" rx="8" ry="3" fill="rgba(0,0,0,0.3)" />
        
        {/* Piernas - tambaleantes */}
        <rect x="-4" y="8" width="3" height="10" rx="1" fill="#4a5d23" transform={`rotate(${tambaleo * 2}, -2, 8)`} />
        <rect x="1" y="8" width="3" height="10" rx="1" fill="#4a5d23" transform={`rotate(${-tambaleo * 2}, 2, 8)`} />
        
        {/* Cuerpo - encorvado */}
        <rect x="-6" y="-2" width="12" height="12" rx="2" fill="#5a6d33" />
        
        {/* Brazos - extendidos hacia adelante */}
        <rect x="-10" y="-2" width="4" height="10" rx="1" fill="#5a6d33" transform={`rotate(${-30 + tambaleoBrazo}, -8, 0)`} />
        <rect x="6" y="-2" width="4" height="10" rx="1" fill="#5a6d33" transform={`rotate(${30 - tambaleoBrazo}, 8, 0)`} />
        
        {/* Cabeza */}
        <ellipse cx="0" cy="-8" rx="6" ry="7" fill="#4a5d23" />
        
        {/* Ojos rojos brillantes */}
        <circle cx="-2" cy="-8" r="1.5" fill="#ff3333">
          <animate attributeName="opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="2" cy="-8" r="1.5" fill="#ff3333">
          <animate attributeName="opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite" />
        </circle>
        
        {/* Manchas de sangre */}
        <circle cx="3" cy="2" r="2" fill="#8b0000" opacity="0.7" />
        <circle cx="-4" cy="5" r="1.5" fill="#8b0000" opacity="0.6" />
      </g>
    )
  }

  // Obtener posiciones de zombies atacantes
  const obtenerPosicionesZombies = () => {
    const posiciones: { x: number; y: number }[] = []
    hordasZombies.filter(h => h.estado === 'atacando').forEach(horda => {
      const cantidad = Math.min(horda.cantidad, 15)
      for (let i = 0; i < cantidad; i++) {
        const angulo = (i / cantidad) * Math.PI * 2 + Math.random() * 0.5
        const radio = 200 + Math.random() * 80
        posiciones.push({
          x: ANCHO_MAPA / 2 + Math.cos(angulo) * radio,
          y: ALTO_MAPA / 2 + Math.sin(angulo) * radio * 0.7,
        })
      }
    })
    return posiciones
  }

  const lider = supervivientes.find(s => s.clase === 'lider')
  const otrosSupervivientes = supervivientes.filter(s => s.clase !== 'lider' && s.estado !== 'mision')
  const posicionesZombies = obtenerPosicionesZombies()

  return (
    <div className="relative w-full overflow-hidden rounded-lg border-2 border-stone-800 bg-gradient-to-b from-[#2a3328] via-[#252e23] to-[#1d231b]">
      {/* Barra de encabezado */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/60 to-transparent z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-white/80 uppercase tracking-wider">Vista del Compound</span>
        </div>
        <div className="text-xs text-white/60">
          Haz clic para moverte | Día {dia}
        </div>
      </div>

      {/* Mapa SVG */}
      <svg 
        ref={refMapa}
        viewBox={`0 0 ${ANCHO_MAPA} ${ALTO_MAPA}`}
        className="w-full h-[500px] lg:h-[550px] cursor-crosshair"
        onClick={manejarClickMapa}
        style={{ background: 'transparent' }}
      >
        {/* Definiciones */}
        <defs>
          <filter id="brillo">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <pattern id="rejilla" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
          </pattern>
        </defs>

        {/* Fondo de rejilla */}
        <rect width="100%" height="100%" fill="url(#rejilla)" />

        {/* Overlay de noche */}
        {esDeNoche && (
          <rect width="100%" height="100%" fill="rgba(10, 20, 40, 0.5)" />
        )}

        {/* Valla perimetral */}
        <rect 
          x="30" y="30" 
          width={ANCHO_MAPA - 60} 
          height={ALTO_MAPA - 60} 
          fill="none" 
          stroke="#5c4033" 
          strokeWidth="4"
          strokeDasharray="20 5"
          rx="4"
        />
        <rect 
          x="40" y="40" 
          width={ANCHO_MAPA - 80} 
          height={ALTO_MAPA - 80} 
          fill="none" 
          stroke="#4a3525" 
          strokeWidth="2"
          rx="2"
        />

        {/* Escombros */}
        {escombros.map((escombro) => (
          <g key={escombro.id} transform={`translate(${escombro.posicion.x}, ${escombro.posicion.y})`}>
            <rect x="-15" y="-10" width="30" height="20" rx="2" fill="#4a4035" />
            <rect x="-12" y="-8" width="8" height="6" fill="#5a5045" />
            <rect x="0" y="-6" width="10" height="10" fill="#3a3530" />
            <text x="0" y="25" textAnchor="middle" fontSize="8" fill="#888">Escombros</text>
          </g>
        ))}

        {/* Edificios */}
        {edificios.map((edificio) => {
          const tieneHover = edificioHover === edificio.id

          return (
            <g 
              key={edificio.id}
              transform={`translate(${edificio.posicion.x - edificio.tamano.ancho/2}, ${edificio.posicion.y - edificio.tamano.alto/2})`}
              className="cursor-pointer"
              onClick={(e) => manejarClickEdificio(edificio.id, e as unknown as React.MouseEvent)}
              onMouseEnter={() => setEdificioHover(edificio.id)}
              onMouseLeave={() => setEdificioHover(null)}
            >
              {/* Sombra del edificio */}
              <rect 
                x="4" y="4" 
                width={edificio.tamano.ancho} 
                height={edificio.tamano.alto} 
                rx="4"
                fill="rgba(0,0,0,0.3)"
              />
              
              {/* Base del edificio */}
              <rect 
                width={edificio.tamano.ancho} 
                height={edificio.tamano.alto} 
                rx="4"
                fill={edificio.tipo === 'almacen' ? '#3a3a3a' : '#4a4035'}
                stroke={tieneHover ? '#f59e0b' : '#5c4a3a'}
                strokeWidth={tieneHover ? 3 : 2}
              />
              
              {/* Detalle del edificio */}
              <rect 
                x="4" y="4" 
                width={edificio.tamano.ancho - 8} 
                height={edificio.tamano.alto - 8} 
                rx="2"
                fill={edificio.tipo === 'almacen' ? '#4a4a4a' : '#5a5045'}
              />
              
              {/* Icono */}
              <g transform={`translate(${edificio.tamano.ancho/2 - 12}, ${edificio.tamano.alto/2 - 16})`}>
                {edificio.tipo === 'almacen' && (
                  <g stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none">
                    <rect x="2" y="10" width="20" height="12" />
                    <path d="M12 2L2 10h20L12 2z" />
                  </g>
                )}
                {edificio.tipo === 'bandera_punto_reunion' && (
                  <path d="M4 20V4M4 4l10 4-10 4" fill="none" stroke="#ef4444" strokeWidth="2" />
                )}
              </g>
              
              {/* Nombre del edificio */}
              <text 
                x={edificio.tamano.ancho/2} 
                y={edificio.tamano.alto + 14} 
                textAnchor="middle"
                fontSize="10"
                fill="#aaa"
                fontWeight="500"
              >
                {edificio.nombre}
              </text>
              
              {/* Indicador de nivel */}
              <text 
                x={edificio.tamano.ancho/2} 
                y={edificio.tamano.alto + 24} 
                textAnchor="middle"
                fontSize="8"
                fill="#777"
              >
                Nv.{edificio.nivel}
              </text>

              {/* Barra de salud si está dañado */}
              {edificio.salud < edificio.saludMaxima && (
                <g transform={`translate(4, ${edificio.tamano.alto - 8})`}>
                  <rect width={edificio.tamano.ancho - 8} height="4" rx="1" fill="#1a1a1a" />
                  <rect 
                    width={(edificio.tamano.ancho - 8) * (edificio.salud / edificio.saludMaxima)} 
                    height="4" 
                    rx="1" 
                    fill={edificio.salud > 60 ? '#22c55e' : edificio.salud > 30 ? '#f59e0b' : '#ef4444'} 
                  />
                </g>
              )}
            </g>
          )
        })}

        {/* Otros supervivientes */}
        {otrosSupervivientes.map((superviviente) => (
          <g key={superviviente.id}>
            {renderizarSpriteSuperviviente(
              superviviente,
              superviviente.posicion.x,
              superviviente.posicion.y,
              false,
              superviviente.enMovimiento,
              superviviente.direccion,
              cuadroAnimacion
            )}
          </g>
        ))}

        {/* Zombies */}
        {posicionesZombies.map((pos, indice) => renderizarSpriteZombie(pos.x, pos.y, indice))}

        {/* Jugador/Líder */}
        {lider && renderizarSpriteSuperviviente(
          lider,
          posicionJugador.x,
          posicionJugador.y,
          true,
          jugadorEnMovimiento,
          direccionJugador,
          cuadroAnimacion
        )}

        {/* Indicador de click */}
        {indicadorClick && (
          <g transform={`translate(${indicadorClick.x}, ${indicadorClick.y})`}>
            <circle r="15" fill="none" stroke="#22c55e" strokeWidth="2" className="click-ripple" />
            <circle r="3" fill="#22c55e" />
          </g>
        )}

        {/* Indicador de objetivo */}
        {posicionObjetivoJugador && jugadorEnMovimiento && (
          <g transform={`translate(${posicionObjetivoJugador.x}, ${posicionObjetivoJugador.y})`}>
            <circle r="8" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 2">
              <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
            </circle>
          </g>
        )}
      </svg>

      {/* Leyenda */}
      <div className="absolute bottom-2 left-2 bg-black/60 rounded px-3 py-2 text-[10px] text-white/60">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Inactivo</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Defendiendo</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>Misión</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>Herido</span>
          </div>
        </div>
      </div>
    </div>
  )
}
