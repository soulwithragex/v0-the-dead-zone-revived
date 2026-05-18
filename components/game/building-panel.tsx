'use client'

import { useGameStore, type Edificio } from '@/lib/game-store'
import { Button } from '@/components/ui/button'
import { 
  Hammer, 
  ArrowUp, 
  Wrench, 
  AlertTriangle,
  CheckCircle,
  Package,
  Shield,
  Eye,
  Droplets,
  Wheat,
  Plus,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

const DESCRIPCIONES_EDIFICIOS: Record<string, string> = {
  almacen: "Instalación principal de almacenamiento para todos los recursos.",
  bandera_punto_reunion: "Punto de reunión para defensores durante ataques.",
  barricada_pequena: "Estructura defensiva básica que ralentiza zombies.",
  barricada_grande: "Estructura defensiva pesada con alta durabilidad.",
  torre_vigilancia: "Aumenta la defensa de la base y proporciona alerta temprana.",
  cama: "Permite a los supervivientes descansar y recuperar salud más rápido.",
  huerto: "Produce comida con el tiempo. Niveles más altos aumentan producción.",
  colector_agua: "Recolecta y purifica agua para los supervivientes.",
  almacen_metal: "Aumenta la capacidad máxima de almacenamiento de metal.",
  almacen_comida: "Aumenta la capacidad máxima de almacenamiento de comida.",
}

const ICONOS_EDIFICIOS: Record<string, React.ReactNode> = {
  almacen: <Package className="w-5 h-5" />,
  bandera_punto_reunion: <Shield className="w-5 h-5" />,
  barricada_pequena: <Shield className="w-5 h-5" />,
  barricada_grande: <Shield className="w-5 h-5" />,
  torre_vigilancia: <Eye className="w-5 h-5" />,
  cama: <Plus className="w-5 h-5" />,
  huerto: <Wheat className="w-5 h-5" />,
  colector_agua: <Droplets className="w-5 h-5" />,
  almacen_metal: <Package className="w-5 h-5" />,
  almacen_comida: <Package className="w-5 h-5" />,
}

export function PanelConstruccion() {
  const { 
    edificios, 
    recursos,
    mejorarEdificio, 
    repararEdificio,
    construirEdificio,
    dia 
  } = useGameStore()

  const puedePermitirMejora = (edificio: Edificio) => {
    const costoMetal = edificio.nivel * 20
    const costoMadera = edificio.nivel * 15
    return recursos.metal >= costoMetal && recursos.madera >= costoMadera
  }

  const puedePermitirReparacion = (edificio: Edificio) => {
    const costoReparacion = Math.ceil((edificio.saludMaxima - edificio.salud) * 0.3)
    return recursos.metal >= costoReparacion
  }

  const obtenerCostoMejora = (edificio: Edificio) => {
    return {
      metal: edificio.nivel * 20,
      madera: edificio.nivel * 15
    }
  }

  const obtenerCostoReparacion = (edificio: Edificio) => {
    return Math.ceil((edificio.saludMaxima - edificio.salud) * 0.3)
  }

  const obtenerColorBarraSalud = (salud: number, saludMaxima: number) => {
    const porcentaje = (salud / saludMaxima) * 100
    if (porcentaje <= 25) return 'bg-red-600'
    if (porcentaje <= 50) return 'bg-orange-500'
    if (porcentaje <= 75) return 'bg-yellow-500'
    return 'bg-green-600'
  }

  const obtenerTextoEstado = (salud: number, saludMaxima: number) => {
    const porcentaje = (salud / saludMaxima) * 100
    if (porcentaje <= 25) return { texto: 'CRÍTICO', color: 'text-red-500' }
    if (porcentaje <= 50) return { texto: 'DAÑADO', color: 'text-orange-500' }
    if (porcentaje <= 75) return { texto: 'DESGASTADO', color: 'text-yellow-500' }
    return { texto: 'OPERACIONAL', color: 'text-green-500' }
  }

  // Edificios disponibles para construir
  const estructurasConstruibles = [
    { tipo: 'barricada_pequena', nombre: 'Barricada Pequeña', costo: { madera: 20, metal: 10 } },
    { tipo: 'barricada_grande', nombre: 'Barricada Grande', costo: { madera: 40, metal: 25 } },
    { tipo: 'torre_vigilancia', nombre: 'Torre de Vigilancia', costo: { madera: 50, metal: 30 } },
    { tipo: 'cama', nombre: 'Cama', costo: { madera: 15, tela: 20 } },
    { tipo: 'huerto', nombre: 'Huerto', costo: { madera: 30 } },
    { tipo: 'colector_agua', nombre: 'Colector de Agua', costo: { metal: 25, madera: 15 } },
  ]

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Encabezado */}
      <div className="bg-secondary/50 px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <Hammer className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-foreground uppercase tracking-wide">Estructuras del Compound</h2>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Construye y mejora estructuras para mejorar tu compound</p>
      </div>

      {/* Lista de Edificios */}
      <div className="p-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mb-6">
          {edificios.map((edificio) => {
            const necesitaReparacion = edificio.salud < edificio.saludMaxima
            const puedeMejorar = puedePermitirMejora(edificio) && edificio.nivel < edificio.nivelMaximo
            const puedeReparar = puedePermitirReparacion(edificio) && necesitaReparacion
            const costoMejora = obtenerCostoMejora(edificio)
            const costoReparacion = obtenerCostoReparacion(edificio)
            const estado = obtenerTextoEstado(edificio.salud, edificio.saludMaxima)
            const porcentajeSalud = (edificio.salud / edificio.saludMaxima) * 100
            
            return (
              <div
                key={edificio.id}
                className={cn(
                  "bg-secondary/30 border rounded-lg overflow-hidden transition-all",
                  necesitaReparacion ? "border-orange-700/50" : "border-border hover:border-border/80"
                )}
              >
                {/* Encabezado del Edificio */}
                <div className="flex items-start gap-3 p-3 bg-secondary/20">
                  <div className={cn(
                    "w-10 h-10 rounded flex items-center justify-center",
                    necesitaReparacion ? "bg-orange-900/50 text-orange-400" : "bg-muted text-muted-foreground"
                  )}>
                    {ICONOS_EDIFICIOS[edificio.tipo] || <Settings className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground text-sm truncate">
                        {edificio.nombre}
                      </h3>
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded",
                        edificio.nivel >= edificio.nivelMaximo 
                          ? "bg-amber-600/30 text-amber-400"
                          : "bg-muted text-muted-foreground"
                      )}>
                        NVL {edificio.nivel}{edificio.nivel >= edificio.nivelMaximo && " MÁX"}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {DESCRIPCIONES_EDIFICIOS[edificio.tipo] || "Estructura que proporciona bonificaciones a tu compound."}
                    </p>
                  </div>
                </div>

                {/* Barra de Salud */}
                <div className="px-3 py-2 bg-background/50 border-t border-border/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Integridad Estructural</span>
                    <span className={cn("text-xs font-medium", estado.color)}>
                      {estado.texto}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-sm overflow-hidden">
                    <div 
                      className={cn("h-full transition-all", obtenerColorBarraSalud(edificio.salud, edificio.saludMaxima))}
                      style={{ width: `${porcentajeSalud}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">{edificio.salud} / {edificio.saludMaxima} PV</span>
                    {edificio.salud <= edificio.saludMaxima * 0.5 && (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                        <span className="text-xs text-orange-400">Necesita reparación</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="p-3 bg-background/30 border-t border-border/50 space-y-2">
                  {/* Mejorar */}
                  {edificio.nivel < edificio.nivelMaximo && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">Costo de Mejora:</span>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={recursos.metal >= costoMejora.metal ? 'text-foreground' : 'text-red-400'}>
                            {costoMejora.metal} Metal
                          </span>
                          <span className={recursos.madera >= costoMejora.madera ? 'text-foreground' : 'text-red-400'}>
                            {costoMejora.madera} Madera
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => mejorarEdificio(edificio.id)}
                        disabled={!puedeMejorar}
                        className={cn(
                          "w-full h-8 text-xs font-semibold uppercase tracking-wide",
                          puedeMejorar 
                            ? "bg-amber-600 hover:bg-amber-500 text-white"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <ArrowUp className="w-3 h-3 mr-1" />
                        Mejorar al Nivel {edificio.nivel + 1}
                      </Button>
                    </div>
                  )}

                  {/* Reparar */}
                  {necesitaReparacion && (
                    <Button
                      onClick={() => repararEdificio(edificio.id)}
                      disabled={!puedeReparar}
                      variant="outline"
                      className={cn(
                        "w-full h-8 text-xs font-semibold uppercase tracking-wide",
                        puedeReparar 
                          ? "border-orange-600 text-orange-400 hover:bg-orange-600/20"
                          : "border-muted text-muted-foreground"
                      )}
                    >
                      <Wrench className="w-3 h-3 mr-1" />
                      Reparar ({costoReparacion} Metal)
                    </Button>
                  )}

                  {edificio.nivel >= edificio.nivelMaximo && !necesitaReparacion && (
                    <div className="flex items-center justify-center gap-2 py-2 text-amber-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">Completamente Mejorado</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Construir Nuevas Estructuras */}
        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Construir Nueva Estructura
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {estructurasConstruibles.map((estructura) => {
              const puedePermitir = Object.entries(estructura.costo).every(
                ([res, cantidad]) => recursos[res as keyof typeof recursos] >= (cantidad as number)
              )
              
              return (
                <Button
                  key={estructura.tipo}
                  variant="outline"
                  size="sm"
                  disabled={!puedePermitir}
                  onClick={() => construirEdificio(estructura.tipo, { x: 300 + Math.random() * 200, y: 200 + Math.random() * 200 })}
                  className={cn(
                    "h-auto py-2 flex-col items-start",
                    !puedePermitir && "opacity-50"
                  )}
                >
                  <span className="text-xs font-medium">{estructura.nombre}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {Object.entries(estructura.costo).map(([res, cantidad]) => `${cantidad} ${res}`).join(', ')}
                  </span>
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Estadísticas del Pie */}
      <div className="bg-secondary/30 border-t border-border px-4 py-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Total de Estructuras: {edificios.length}</span>
          <span className="text-muted-foreground">Día {dia}</span>
        </div>
      </div>
    </div>
  )
}
