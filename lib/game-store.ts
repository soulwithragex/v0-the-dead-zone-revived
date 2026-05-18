import { create } from 'zustand'

// Tipos siguiendo las mecánicas de The Last Stand: Dead Zone
export type ClaseSuperviviete = 'lider' | 'luchador' | 'medico' | 'recolector' | 'ingeniero' | 'explorador'
export type RarezaObjeto = 'comun' | 'poco_comun' | 'raro' | 'unico'
export type TipoArma = 'cuerpo_a_cuerpo' | 'pistola' | 'rifle' | 'escopeta' | 'subfusil' | 'asalto'
export type TipoRecurso = 'metal' | 'madera' | 'tela' | 'comida' | 'agua' | 'municion' | 'combustible'
export type CategoriaEdificio = 'general' | 'almacenamiento' | 'produccion' | 'seguridad' | 'confort'
export type EstadoMision = 'disponible' | 'en_progreso' | 'regresando' | 'completada' | 'fallida'
export type NivelPeligro = 'bajo' | 'moderado' | 'peligroso' | 'alto' | 'extremo'

export interface Habilidades {
  combateDistancia: number
  combateCuerpoACuerpo: number
  curacion: number
  movimiento: number
  recoleccion: number
  suerte: number
}

export interface Superviviente {
  id: string
  nombre: string
  clase: ClaseSuperviviete
  nivel: number
  xp: number
  xpSiguienteNivel: number
  salud: number
  saludMaxima: number
  moral: number
  habilidades: Habilidades
  herido: boolean
  tipoHerida: string | null
  tiempoRestanteHerida: number
  equipado: {
    ofensivo: { arma: Arma | null; equipo: Objeto | null }
    defensivo: { arma: Arma | null; equipo: Objeto | null }
  }
  estado: 'inactivo' | 'mision' | 'defendiendo' | 'construyendo' | 'descansando' | 'herido'
  posicion: { x: number; y: number }
  posicionObjetivo: { x: number; y: number } | null
  enMovimiento: boolean
  direccion: 'arriba' | 'abajo' | 'izquierda' | 'derecha'
}

export interface Arma {
  id: string
  nombre: string
  tipo: TipoArma
  nivel: number
  dano: number
  precision: number
  cadencia: number
  tamanoMagazine: number
  rareza: RarezaObjeto
  dps: number
}

export interface Objeto {
  id: string
  nombre: string
  tipo: 'arma' | 'equipo' | 'medico' | 'componente' | 'libro'
  nivel: number
  rareza: RarezaObjeto
  cantidad: number
  efectos?: Record<string, number>
}

export interface Edificio {
  id: string
  categoria: CategoriaEdificio
  tipo: string
  nombre: string
  nivel: number
  nivelMaximo: number
  salud: number
  saludMaxima: number
  construyendo: boolean
  tiempoRestanteConstruccion: number
  posicion: { x: number; y: number }
  tamano: { ancho: number; alto: number }
  supervivientesAsignados: string[]
  tasaProduccion?: number
  capacidadAlmacenamiento?: number
  bonusSeguridad?: number
  bonusConfort?: number
}

export interface Mision {
  id: string
  nombre: string
  ubicacion: string
  tipoUbicacion: string
  nivel: number
  nivelPeligro: NivelPeligro
  duracion: number
  tiempoRetorno: number
  tiempoRestante: number
  estado: EstadoMision
  supervivientesAsignados: string[]
  posiblesHallazgos: TipoRecurso[]
  municionRequerida: number
  cantidadZombies: number
  esZonaAltaActividad: boolean
  recompensas: {
    xp: number
    recursos: Partial<Record<TipoRecurso, { min: number; max: number }>>
  }
}

export interface HordaZombie {
  id: string
  cantidad: number
  salud: number
  dano: number
  tiempoHastaAtaque: number
  estado: 'acercandose' | 'atacando' | 'derrotada'
  posicion: { x: number; y: number }
}

export interface EstadoJuego {
  // Recursos (siguiendo TLSDZ)
  recursos: Record<TipoRecurso, number>
  recursosMaximos: Record<TipoRecurso, number>
  
  // Estadísticas del compound
  dia: number
  hora: number
  esDeNoche: boolean
  nivelSeguridad: number
  nivelConfort: number
  nivelCompound: number
  
  // Colecciones
  supervivientes: Superviviente[]
  lider: Superviviente | null
  inventario: Objeto[]
  armas: Arma[]
  edificios: Edificio[]
  misionesDisponibles: Mision[]
  misionesActivas: Mision[]
  hordasZombies: HordaZombie[]
  
  // Escombros (debris removibles)
  escombros: { id: string; posicion: { x: number; y: number }; tiempoParaRemover: number }[]
  
  // Estado del juego
  juegoIniciado: boolean
  juegoPausado: boolean
  juegoTerminado: boolean
  razonFinJuego: string
  
  // Estado de UI
  pestanaSeleccionada: 'compound' | 'base' | 'supervivientes' | 'inventario' | 'misiones' | 'taller'
  supervivienteSeleccionado: string | null
  edificioSeleccionado: string | null
  notificaciones: { id: string; mensaje: string; tipo: 'info' | 'advertencia' | 'peligro' | 'exito'; timestamp: number }[]
  registroCombate: { id: string; mensaje: string; timestamp: number; tipo: 'eliminacion' | 'dano' | 'curacion' | 'evento' }[]
  
  // Posición del jugador en el compound
  posicionJugador: { x: number; y: number }
  posicionObjetivoJugador: { x: number; y: number } | null
  jugadorEnMovimiento: boolean
  direccionJugador: 'arriba' | 'abajo' | 'izquierda' | 'derecha'
  
  // Acciones
  iniciarJuego: () => void
  pausarJuego: () => void
  reanudarJuego: () => void
  tick: () => void
  
  // Movimiento del jugador
  establecerObjetivoJugador: (pos: { x: number; y: number }) => void
  actualizarPosicionJugador: () => void
  
  // Acciones de recursos
  consumirRecursos: (recursos: Partial<Record<TipoRecurso, number>>) => boolean
  agregarRecursos: (recursos: Partial<Record<TipoRecurso, number>>) => void
  
  // Acciones de supervivientes
  seleccionarSuperviviente: (id: string | null) => void
  asignarClaseSuperviviente: (id: string, clase: ClaseSuperviviete) => void
  equiparArma: (supervivienteId: string, armaId: string, carga: 'ofensivo' | 'defensivo') => void
  curarSuperviviente: (supervivienteId: string) => void
  moverSuperviviente: (supervivienteId: string, posicion: { x: number; y: number }) => void
  actualizarEstadoSuperviviente: (id: string, actualizaciones: Partial<Superviviente>) => void
  
  // Acciones de misiones
  asignarAMision: (supervivienteId: string, misionId: string) => void
  desasignarDeMision: (supervivienteId: string, misionId: string) => void
  lanzarMision: (misionId: string, automatizada: boolean) => void
  generarMisiones: () => void
  
  // Acciones de edificios
  construirEdificio: (tipo: string, posicion: { x: number; y: number }) => void
  mejorarEdificio: (id: string) => void
  repararEdificio: (id: string) => void
  asignarAEdificio: (supervivienteId: string, edificioId: string) => void
  
  // Combate
  defenderCompound: () => void
  
  // Acciones de UI
  establecerPestanaSeleccionada: (pestana: EstadoJuego['pestanaSeleccionada']) => void
  agregarNotificacion: (mensaje: string, tipo: 'info' | 'advertencia' | 'peligro' | 'exito') => void
  limpiarNotificacion: (id: string) => void
  agregarRegistroCombate: (mensaje: string, tipo: 'eliminacion' | 'dano' | 'curacion' | 'evento') => void
  
  // Fabricación y Reclutamiento
  fabricarArma: (tipoArma: TipoArma) => void
  reclutarSuperviviente: () => void
  desguazarArma: (armaId: string) => void
}

const generarId = () => Math.random().toString(36).substring(2, 11)

// Bonificaciones de habilidades por clase (siguiendo el sistema de clases de TLSDZ)
const bonusHabilidadesClase: Record<ClaseSuperviviete, Partial<Habilidades>> = {
  lider: { combateDistancia: 2, combateCuerpoACuerpo: 2, curacion: 1, movimiento: 1, recoleccion: 1, suerte: 1 },
  luchador: { combateDistancia: 3, combateCuerpoACuerpo: 3, movimiento: 1, recoleccion: 0, curacion: 0, suerte: 0 },
  medico: { curacion: 4, combateDistancia: 1, combateCuerpoACuerpo: 1, movimiento: 1, recoleccion: 1, suerte: 0 },
  recolector: { recoleccion: 3, suerte: 3, movimiento: 2, combateDistancia: 0, combateCuerpoACuerpo: 0, curacion: 0 },
  ingeniero: { recoleccion: 2, combateDistancia: 1, combateCuerpoACuerpo: 1, movimiento: 1, curacion: 0, suerte: 1 },
  explorador: { movimiento: 3, combateDistancia: 2, recoleccion: 1, combateCuerpoACuerpo: 1, curacion: 0, suerte: 1 },
}

const nombresSupervivientes = [
  'Marco García', 'Elena Rodríguez', 'Juan Morales', 'Sara Fernández', 
  'Miguel Torres', 'Laura Martínez', 'Tomás Ruiz', 'Emma Hernández',
  'David López', 'Raquel Sánchez', 'Carlos Díaz', 'Ana Castillo',
  'Esteban Vargas', 'María Santos', 'Jaime Romero', 'Kate Molina',
  'Alex Ramírez', 'Nina Pérez', 'Rodrigo Cruz', 'Zoe Aguilar'
]

const tiposUbicacion = [
  { tipo: 'almacen', nombre: 'Almacén', hallazgos: ['metal', 'madera', 'tela'] as TipoRecurso[] },
  { tipo: 'hospital', nombre: 'Hospital', hallazgos: ['tela', 'agua'] as TipoRecurso[] },
  { tipo: 'comisaria', nombre: 'Comisaría', hallazgos: ['municion', 'metal'] as TipoRecurso[] },
  { tipo: 'supermercado', nombre: 'Supermercado', hallazgos: ['comida', 'agua'] as TipoRecurso[] },
  { tipo: 'gasolinera', nombre: 'Gasolinera', hallazgos: ['combustible', 'comida'] as TipoRecurso[] },
  { tipo: 'residencial', nombre: 'Zona Residencial', hallazgos: ['tela', 'comida', 'agua'] as TipoRecurso[] },
  { tipo: 'oficina', nombre: 'Edificio de Oficinas', hallazgos: ['madera', 'tela'] as TipoRecurso[] },
  { tipo: 'fabrica', nombre: 'Fábrica', hallazgos: ['metal', 'combustible'] as TipoRecurso[] },
  { tipo: 'militar', nombre: 'Puesto Militar', hallazgos: ['municion', 'metal', 'combustible'] as TipoRecurso[] },
]

const crearSuperviviente = (nombre: string, esLider: boolean = false): Superviviente => {
  const habilidadesBase: Habilidades = {
    combateDistancia: Math.floor(Math.random() * 5) + 5,
    combateCuerpoACuerpo: Math.floor(Math.random() * 5) + 5,
    curacion: Math.floor(Math.random() * 3) + 2,
    movimiento: Math.floor(Math.random() * 5) + 8,
    recoleccion: Math.floor(Math.random() * 5) + 5,
    suerte: Math.floor(Math.random() * 5) + 3,
  }

  return {
    id: generarId(),
    nombre,
    clase: esLider ? 'lider' : 'luchador',
    nivel: 1,
    xp: 0,
    xpSiguienteNivel: 100,
    salud: 100,
    saludMaxima: 100,
    moral: 75,
    habilidades: habilidadesBase,
    herido: false,
    tipoHerida: null,
    tiempoRestanteHerida: 0,
    equipado: {
      ofensivo: { arma: null, equipo: null },
      defensivo: { arma: null, equipo: null },
    },
    estado: 'inactivo',
    posicion: { x: 400 + Math.random() * 100 - 50, y: 300 + Math.random() * 100 - 50 },
    posicionObjetivo: null,
    enMovimiento: false,
    direccion: 'abajo',
  }
}

const crearArma = (nivel: number): Arma => {
  const tiposArmas: { tipo: TipoArma; nombres: string[]; danoBase: number; precisionBase: number }[] = [
    { tipo: 'cuerpo_a_cuerpo', nombres: ['Bate de Béisbol', 'Machete', 'Hacha de Bombero', 'Cuchillo de Combate', 'Palanca'], danoBase: 15, precisionBase: 90 },
    { tipo: 'pistola', nombres: ['Pistola 9mm', 'Glock 17', '.357 Magnum', 'M1911', 'Desert Eagle'], danoBase: 20, precisionBase: 75 },
    { tipo: 'rifle', nombres: ['Rifle de Caza', 'M14', 'Rifle de Francotirador', 'M1 Garand'], danoBase: 45, precisionBase: 85 },
    { tipo: 'escopeta', nombres: ['Escopeta de Bombeo', 'Doble Cañón', 'Escopeta de Combate', 'SPAS-12'], danoBase: 55, precisionBase: 60 },
    { tipo: 'subfusil', nombres: ['UZI', 'MP5', 'MAC-10', 'P90'], danoBase: 18, precisionBase: 65 },
    { tipo: 'asalto', nombres: ['M4A1', 'AK-47', 'SCAR-H', 'M16'], danoBase: 30, precisionBase: 70 },
  ]

  const tipoSeleccionado = tiposArmas[Math.floor(Math.random() * tiposArmas.length)]
  const nombre = tipoSeleccionado.nombres[Math.floor(Math.random() * tipoSeleccionado.nombres.length)]
  const rareza: RarezaObjeto = Math.random() < 0.6 ? 'comun' : Math.random() < 0.85 ? 'poco_comun' : Math.random() < 0.97 ? 'raro' : 'unico'
  const multiplicadorRareza = rareza === 'comun' ? 1 : rareza === 'poco_comun' ? 1.2 : rareza === 'raro' ? 1.5 : 2

  const dano = Math.floor(tipoSeleccionado.danoBase * (1 + nivel * 0.1) * multiplicadorRareza)
  const precision = Math.min(95, Math.floor(tipoSeleccionado.precisionBase * (1 + nivel * 0.02) * multiplicadorRareza))
  const cadencia = tipoSeleccionado.tipo === 'cuerpo_a_cuerpo' ? 1 : tipoSeleccionado.tipo === 'rifle' ? 0.8 : tipoSeleccionado.tipo === 'escopeta' ? 0.6 : 1.5

  return {
    id: generarId(),
    nombre,
    tipo: tipoSeleccionado.tipo,
    nivel,
    dano,
    precision,
    cadencia,
    tamanoMagazine: tipoSeleccionado.tipo === 'cuerpo_a_cuerpo' ? 0 : tipoSeleccionado.tipo === 'pistola' ? 12 : tipoSeleccionado.tipo === 'escopeta' ? 8 : 30,
    rareza,
    dps: Math.floor(dano * cadencia),
  }
}

const crearMision = (nivelCompound: number): Mision => {
  const ubicacion = tiposUbicacion[Math.floor(Math.random() * tiposUbicacion.length)]
  const nivel = Math.max(1, nivelCompound + Math.floor(Math.random() * 3) - 1)
  const esAltaActividad = Math.random() < 0.15

  const nivelesPeligro: NivelPeligro[] = ['bajo', 'moderado', 'peligroso', 'alto', 'extremo']
  const indicePeligro = Math.min(4, Math.floor(nivel / 3) + (esAltaActividad ? 1 : 0))
  const nivelPeligro = nivelesPeligro[indicePeligro]

  const duracionBase = 5 + nivel * 2
  const zombiesBase = 5 + nivel * 3

  return {
    id: generarId(),
    nombre: `${ubicacion.nombre} - Sector ${Math.floor(Math.random() * 9) + 1}`,
    ubicacion: ubicacion.nombre,
    tipoUbicacion: ubicacion.tipo,
    nivel,
    nivelPeligro,
    duracion: duracionBase * 60,
    tiempoRetorno: Math.floor(duracionBase * 60 * 0.5),
    tiempoRestante: 0,
    estado: 'disponible',
    supervivientesAsignados: [],
    posiblesHallazgos: ubicacion.hallazgos,
    municionRequerida: nivel * 5,
    cantidadZombies: zombiesBase + (esAltaActividad ? Math.floor(zombiesBase * 0.5) : 0),
    esZonaAltaActividad: esAltaActividad,
    recompensas: {
      xp: nivel * 50 * (esAltaActividad ? 1.5 : 1),
      recursos: ubicacion.hallazgos.reduce((acc, res) => {
        acc[res] = { min: nivel * 3, max: nivel * 8 }
        return acc
      }, {} as Partial<Record<TipoRecurso, { min: number; max: number }>>),
    },
  }
}

const edificiosIniciales: Edificio[] = [
  {
    id: generarId(),
    categoria: 'general',
    tipo: 'almacen',
    nombre: 'Almacén Principal',
    nivel: 1,
    nivelMaximo: 1,
    salud: 100,
    saludMaxima: 100,
    construyendo: false,
    tiempoRestanteConstruccion: 0,
    posicion: { x: 400, y: 280 },
    tamano: { ancho: 200, alto: 120 },
    supervivientesAsignados: [],
  },
  {
    id: generarId(),
    categoria: 'seguridad',
    tipo: 'bandera_punto_reunion',
    nombre: 'Punto de Reunión',
    nivel: 1,
    nivelMaximo: 5,
    salud: 50,
    saludMaxima: 50,
    construyendo: false,
    tiempoRestanteConstruccion: 0,
    posicion: { x: 350, y: 420 },
    tamano: { ancho: 40, alto: 40 },
    supervivientesAsignados: [],
    bonusSeguridad: 5,
  },
]

const recursosIniciales: Record<TipoRecurso, number> = {
  metal: 100,
  madera: 100,
  tela: 50,
  comida: 75,
  agua: 75,
  municion: 50,
  combustible: 25,
}

const recursosMaximosIniciales: Record<TipoRecurso, number> = {
  metal: 200,
  madera: 200,
  tela: 150,
  comida: 150,
  agua: 150,
  municion: 100,
  combustible: 50,
}

export const useGameStore = create<EstadoJuego>((set, get) => ({
  recursos: { ...recursosIniciales },
  recursosMaximos: { ...recursosMaximosIniciales },
  
  dia: 1,
  hora: 8,
  esDeNoche: false,
  nivelSeguridad: 10,
  nivelConfort: 5,
  nivelCompound: 1,
  
  supervivientes: [],
  lider: null,
  inventario: [],
  armas: [crearArma(1), crearArma(1), crearArma(1)],
  edificios: [...edificiosIniciales],
  misionesDisponibles: [],
  misionesActivas: [],
  hordasZombies: [],
  escombros: [
    { id: generarId(), posicion: { x: 200, y: 200 }, tiempoParaRemover: 120 },
    { id: generarId(), posicion: { x: 550, y: 180 }, tiempoParaRemover: 90 },
    { id: generarId(), posicion: { x: 180, y: 400 }, tiempoParaRemover: 150 },
    { id: generarId(), posicion: { x: 600, y: 420 }, tiempoParaRemover: 100 },
  ],
  
  juegoIniciado: false,
  juegoPausado: false,
  juegoTerminado: false,
  razonFinJuego: '',
  
  pestanaSeleccionada: 'compound',
  supervivienteSeleccionado: null,
  edificioSeleccionado: null,
  notificaciones: [],
  registroCombate: [],
  
  posicionJugador: { x: 400, y: 350 },
  posicionObjetivoJugador: null,
  jugadorEnMovimiento: false,
  direccionJugador: 'abajo',
  
  iniciarJuego: () => {
    const lider = crearSuperviviente('Tú', true)
    const superviviente1 = crearSuperviviente(nombresSupervivientes[Math.floor(Math.random() * nombresSupervivientes.length)])
    
    set({ 
      juegoIniciado: true, 
      juegoPausado: false,
      lider,
      supervivientes: [lider, superviviente1],
      misionesDisponibles: [crearMision(1), crearMision(1), crearMision(1)],
    })
    
    get().agregarNotificacion('Bienvenido a la Zona Muerta. Sobrevive.', 'info')
  },
  
  pausarJuego: () => set({ juegoPausado: true }),
  reanudarJuego: () => set({ juegoPausado: false }),
  
  establecerObjetivoJugador: (pos) => {
    set({ posicionObjetivoJugador: pos, jugadorEnMovimiento: true })
  },
  
  actualizarPosicionJugador: () => {
    const estado = get()
    if (!estado.jugadorEnMovimiento || !estado.posicionObjetivoJugador) return

    const dx = estado.posicionObjetivoJugador.x - estado.posicionJugador.x
    const dy = estado.posicionObjetivoJugador.y - estado.posicionJugador.y
    const distancia = Math.sqrt(dx * dx + dy * dy)

    if (distancia < 3) {
      set({ 
        posicionJugador: estado.posicionObjetivoJugador, 
        jugadorEnMovimiento: false, 
        posicionObjetivoJugador: null 
      })
      return
    }

    const velocidad = 4
    const ratio = velocidad / distancia
    const nuevaDireccion = Math.abs(dx) > Math.abs(dy) 
      ? (dx > 0 ? 'derecha' : 'izquierda') 
      : (dy > 0 ? 'abajo' : 'arriba')

    set({
      posicionJugador: {
        x: estado.posicionJugador.x + dx * ratio,
        y: estado.posicionJugador.y + dy * ratio,
      },
      direccionJugador: nuevaDireccion as 'arriba' | 'abajo' | 'izquierda' | 'derecha',
    })
  },
  
  tick: () => {
    const estado = get()
    if (estado.juegoPausado || estado.juegoTerminado || !estado.juegoIniciado) return

    // Actualizar movimiento del jugador
    get().actualizarPosicionJugador()

    // Progresión del tiempo
    let nuevaHora = estado.hora + 0.1
    let nuevoDia = estado.dia
    
    if (nuevaHora >= 24) {
      nuevaHora = 0
      nuevoDia += 1
      get().generarMisiones()
    }
    
    const esDeNoche = nuevaHora >= 20 || nuevaHora < 6

    // Consumo de recursos (por tick de juego, escalado)
    const cantidadSupervivientes = estado.supervivientes.filter(s => !s.herido).length
    const consumoComida = cantidadSupervivientes * 0.05
    const consumoAgua = cantidadSupervivientes * 0.06

    const nuevosRecursos = { ...estado.recursos }
    nuevosRecursos.comida = Math.max(0, nuevosRecursos.comida - consumoComida)
    nuevosRecursos.agua = Math.max(0, nuevosRecursos.agua - consumoAgua)

    // Producción de recursos desde edificios
    estado.edificios.forEach(edificio => {
      if (edificio.tipo === 'huerto' && edificio.tasaProduccion) {
        nuevosRecursos.comida = Math.min(estado.recursosMaximos.comida, nuevosRecursos.comida + edificio.tasaProduccion * 0.01)
      }
      if (edificio.tipo === 'colector_agua' && edificio.tasaProduccion) {
        nuevosRecursos.agua = Math.min(estado.recursosMaximos.agua, nuevosRecursos.agua + edificio.tasaProduccion * 0.01)
      }
    })

    // Actualizaciones de supervivientes
    const nuevosSupervivientes = estado.supervivientes.map(superviviente => {
      const nuevoSuperviviente = { ...superviviente }
      
      // Curar con el tiempo si está descansando
      if (superviviente.estado === 'descansando' && superviviente.salud < superviviente.saludMaxima) {
        nuevoSuperviviente.salud = Math.min(superviviente.saludMaxima, superviviente.salud + 0.5)
      }
      
      // Recuperación de heridas
      if (superviviente.herido && superviviente.tiempoRestanteHerida > 0) {
        nuevoSuperviviente.tiempoRestanteHerida = superviviente.tiempoRestanteHerida - 1
        if (nuevoSuperviviente.tiempoRestanteHerida <= 0) {
          nuevoSuperviviente.herido = false
          nuevoSuperviviente.tipoHerida = null
          nuevoSuperviviente.estado = 'inactivo'
          get().agregarNotificacion(`${superviviente.nombre} se ha recuperado de su herida.`, 'exito')
        }
      }
      
      // Moral baja por malas condiciones
      if (nuevosRecursos.comida < 20 || nuevosRecursos.agua < 20) {
        nuevoSuperviviente.moral = Math.max(0, superviviente.moral - 0.1)
      }
      
      // Daño a la salud por inanición/deshidratación
      if (nuevosRecursos.comida === 0) {
        nuevoSuperviviente.salud = Math.max(0, superviviente.salud - 0.2)
      }
      if (nuevosRecursos.agua === 0) {
        nuevoSuperviviente.salud = Math.max(0, superviviente.salud - 0.3)
      }
      
      return nuevoSuperviviente
    })

    // Actualizar misiones activas
    const nuevasMisionesActivas = estado.misionesActivas.map(mision => {
      if (mision.estado !== 'en_progreso' && mision.estado !== 'regresando') return mision
      
      const nuevaMision = { ...mision, tiempoRestante: mision.tiempoRestante - 1 }
      
      if (mision.estado === 'en_progreso' && nuevaMision.tiempoRestante <= 0) {
        nuevaMision.estado = 'regresando'
        nuevaMision.tiempoRestante = mision.tiempoRetorno
        get().agregarNotificacion(`Misión a ${mision.ubicacion} completada. Supervivientes regresando...`, 'info')
      }
      
      if (mision.estado === 'regresando' && nuevaMision.tiempoRestante <= 0) {
        // Calcular éxito de la misión
        const supervivientesAsignados = nuevosSupervivientes.filter(s => mision.supervivientesAsignados.includes(s.id))
        const dpsTotal = supervivientesAsignados.reduce((suma, s) => {
          const arma = s.equipado.ofensivo.arma
          return suma + (arma?.dps || 5) + s.habilidades.combateDistancia
        }, 0)
        
        const probabilidadExito = Math.min(95, 50 + (dpsTotal / mision.cantidadZombies) * 10)
        const exito = Math.random() * 100 < probabilidadExito
        
        if (exito) {
          // Otorgar recompensas
          Object.entries(mision.recompensas.recursos).forEach(([res, rango]) => {
            if (rango) {
              const cantidad = Math.floor(Math.random() * (rango.max - rango.min)) + rango.min
              get().agregarRecursos({ [res as TipoRecurso]: cantidad })
            }
          })
          
          // Otorgar XP
          supervivientesAsignados.forEach(s => {
            const nuevaXP = s.xp + mision.recompensas.xp
            const subirNivel = nuevaXP >= s.xpSiguienteNivel
            get().actualizarEstadoSuperviviente(s.id, { 
              xp: subirNivel ? nuevaXP - s.xpSiguienteNivel : nuevaXP,
              nivel: subirNivel ? s.nivel + 1 : s.nivel,
              xpSiguienteNivel: subirNivel ? Math.floor(s.xpSiguienteNivel * 1.5) : s.xpSiguienteNivel,
              estado: 'inactivo'
            })
            if (subirNivel) {
              get().agregarNotificacion(`¡${s.nombre} subió al nivel ${s.nivel + 1}!`, 'exito')
            }
          })
          
          nuevaMision.estado = 'completada'
          get().agregarNotificacion(`¡Misión a ${mision.ubicacion} exitosa!`, 'exito')
        } else {
          // Misión fallida - supervivientes heridos
          supervivientesAsignados.forEach(s => {
            const dano = Math.floor(Math.random() * 40) + 20
            const herido = Math.random() < 0.5
            get().actualizarEstadoSuperviviente(s.id, {
              salud: Math.max(1, s.salud - dano),
              herido,
              tipoHerida: herido ? 'herida' : null,
              tiempoRestanteHerida: herido ? 300 : 0,
              estado: herido ? 'herido' : 'inactivo'
            })
          })
          
          nuevaMision.estado = 'fallida'
          get().agregarNotificacion(`¡Misión a ${mision.ubicacion} fallida! Supervivientes heridos.`, 'peligro')
        }
      }
      
      return nuevaMision
    }).filter(m => m.estado !== 'completada' && m.estado !== 'fallida')

    // Aparición de horda zombie durante la noche
    if (esDeNoche && Math.random() < 0.01 && estado.hordasZombies.length === 0) {
      const tamanoHorda = Math.floor(10 + estado.dia * 3 + Math.random() * 10)
      const angulo = Math.random() * Math.PI * 2
      const horda: HordaZombie = {
        id: generarId(),
        cantidad: tamanoHorda,
        salud: 20 + estado.dia * 2,
        dano: 5 + Math.floor(estado.dia * 0.5),
        tiempoHastaAtaque: 60,
        estado: 'acercandose',
        posicion: {
          x: 400 + Math.cos(angulo) * 350,
          y: 300 + Math.sin(angulo) * 280,
        },
      }
      set(s => ({ hordasZombies: [...s.hordasZombies, horda] }))
      get().agregarNotificacion(`¡ALERTA: Horda zombie detectada! ${tamanoHorda} infectados acercándose!`, 'peligro')
      get().agregarRegistroCombate(`Horda de ${tamanoHorda} zombies acercándose desde el ${angulo < Math.PI ? 'sur' : 'norte'}`, 'evento')
    }

    // Procesar hordas
    const nuevasHordas = estado.hordasZombies.map(horda => {
      if (horda.estado === 'acercandose') {
        const nuevoTiempoHasta = horda.tiempoHastaAtaque - 1
        if (nuevoTiempoHasta <= 0) {
          get().agregarRegistroCombate('¡Zombies rompiendo el perímetro!', 'evento')
          return { ...horda, tiempoHastaAtaque: 0, estado: 'atacando' as const }
        }
        return { ...horda, tiempoHastaAtaque: nuevoTiempoHasta }
      }
      return horda
    })

    // Resolución de combate
    const hordasAtacando = nuevasHordas.filter(h => h.estado === 'atacando')
    let danoSeguridadTotal = 0

    hordasAtacando.forEach(horda => {
      const defensores = nuevosSupervivientes.filter(s => 
        s.estado === 'defendiendo' || (s.estado === 'inactivo' && !s.herido)
      )
      
      // Defensores causan daño
      let zombiesEliminados = 0
      defensores.forEach(defensor => {
        const arma = defensor.equipado.defensivo.arma || defensor.equipado.ofensivo.arma
        const dano = (arma?.dps || 5) + defensor.habilidades.combateDistancia
        const eliminaciones = Math.floor(dano / horda.salud)
        zombiesEliminados += eliminaciones
      })
      
      horda.cantidad = Math.max(0, horda.cantidad - zombiesEliminados)
      
      if (zombiesEliminados > 0) {
        get().agregarRegistroCombate(`¡Eliminados ${zombiesEliminados} infectados!`, 'eliminacion')
      }
      
      // Zombies causan daño al compound
      if (horda.cantidad > 0) {
        danoSeguridadTotal += horda.cantidad * horda.dano * 0.05
        get().agregarRegistroCombate(`¡${horda.cantidad} zombies atacando las barricadas!`, 'dano')
      }
      
      if (horda.cantidad <= 0) {
        horda.estado = 'derrotada'
        get().agregarNotificacion('¡Horda zombie eliminada!', 'exito')
        get().agregarRegistroCombate('Todos los hostiles eliminados. Área asegurada.', 'evento')
        
        // Recompensa de XP para defensores
        defensores.forEach(d => {
          get().actualizarEstadoSuperviviente(d.id, { xp: d.xp + 50 })
        })
      }
    })

    // Aplicar daño a seguridad
    const nuevoNivelSeguridad = Math.max(0, estado.nivelSeguridad - danoSeguridadTotal)
    
    // Verificación de fin de juego
    if (nuevoNivelSeguridad <= 0 && hordasAtacando.length > 0) {
      set({ juegoTerminado: true, razonFinJuego: 'El compound ha sido invadido por los infectados.' })
      return
    }
    
    if (nuevosSupervivientes.filter(s => s.salud > 0).length === 0) {
      set({ juegoTerminado: true, razonFinJuego: 'Todos los supervivientes han perecido.' })
      return
    }

    set({
      hora: nuevaHora,
      dia: nuevoDia,
      esDeNoche,
      recursos: nuevosRecursos,
      supervivientes: nuevosSupervivientes,
      misionesActivas: nuevasMisionesActivas,
      hordasZombies: nuevasHordas.filter(h => h.estado !== 'derrotada'),
      nivelSeguridad: nuevoNivelSeguridad,
    })
  },

  actualizarEstadoSuperviviente: (id: string, actualizaciones: Partial<Superviviente>) => {
    set(estado => ({
      supervivientes: estado.supervivientes.map(s => s.id === id ? { ...s, ...actualizaciones } : s)
    }))
  },
  
  consumirRecursos: (recursos) => {
    const estado = get()
    const puedeConsumir = Object.entries(recursos).every(([clave, valor]) => {
      return estado.recursos[clave as TipoRecurso] >= (valor || 0)
    })
    
    if (!puedeConsumir) return false
    
    const nuevosRecursos = { ...estado.recursos }
    Object.entries(recursos).forEach(([clave, valor]) => {
      nuevosRecursos[clave as TipoRecurso] -= valor || 0
    })
    
    set({ recursos: nuevosRecursos })
    return true
  },
  
  agregarRecursos: (recursos) => {
    const estado = get()
    const nuevosRecursos = { ...estado.recursos }
    Object.entries(recursos).forEach(([clave, valor]) => {
      nuevosRecursos[clave as TipoRecurso] = Math.min(
        estado.recursosMaximos[clave as TipoRecurso],
        nuevosRecursos[clave as TipoRecurso] + (valor || 0)
      )
    })
    set({ recursos: nuevosRecursos })
  },
  
  seleccionarSuperviviente: (id) => set({ supervivienteSeleccionado: id }),
  
  asignarClaseSuperviviente: (id, clase) => {
    const estado = get()
    const superviviente = estado.supervivientes.find(s => s.id === id)
    if (!superviviente || superviviente.clase === 'lider') return
    
    const bonificaciones = bonusHabilidadesClase[clase]
    const nuevasHabilidades = { ...superviviente.habilidades }
    Object.entries(bonificaciones).forEach(([habilidad, bonus]) => {
      nuevasHabilidades[habilidad as keyof Habilidades] += bonus || 0
    })
    
    set({
      supervivientes: estado.supervivientes.map(s => 
        s.id === id ? { ...s, clase, habilidades: nuevasHabilidades } : s
      )
    })
    
    const nombresClases: Record<ClaseSuperviviete, string> = {
      lider: 'Líder',
      luchador: 'Luchador',
      medico: 'Médico',
      recolector: 'Recolector',
      ingeniero: 'Ingeniero',
      explorador: 'Explorador'
    }
    
    get().agregarNotificacion(`${superviviente.nombre} ahora es ${nombresClases[clase]}.`, 'info')
  },
  
  equiparArma: (supervivienteId, armaId, carga) => {
    const estado = get()
    const arma = estado.armas.find(a => a.id === armaId)
    if (!arma) return
    
    set({
      supervivientes: estado.supervivientes.map(s => {
        if (s.id !== supervivienteId) return s
        return {
          ...s,
          equipado: {
            ...s.equipado,
            [carga]: { ...s.equipado[carga], arma }
          }
        }
      })
    })
  },
  
  curarSuperviviente: (supervivienteId) => {
    const estado = get()
    if (!estado.consumirRecursos({ comida: 5, agua: 5 })) {
      get().agregarNotificacion('No hay suficientes recursos para curar.', 'advertencia')
      return
    }
    
    set({
      supervivientes: estado.supervivientes.map(s => 
        s.id === supervivienteId 
          ? { ...s, salud: Math.min(s.saludMaxima, s.salud + 30) }
          : s
      )
    })
  },

  moverSuperviviente: (supervivienteId, posicion) => {
    set({
      supervivientes: get().supervivientes.map(s =>
        s.id === supervivienteId
          ? { ...s, posicionObjetivo: posicion, enMovimiento: true }
          : s
      )
    })
  },
  
  asignarAMision: (supervivienteId, misionId) => {
    const estado = get()
    const mision = estado.misionesDisponibles.find(m => m.id === misionId)
    const superviviente = estado.supervivientes.find(s => s.id === supervivienteId)
    
    if (!mision || !superviviente) return
    if (superviviente.herido || superviviente.estado === 'mision') return
    if (mision.supervivientesAsignados.length >= 5) return
    if (mision.supervivientesAsignados.includes(supervivienteId)) return
    
    set({
      misionesDisponibles: estado.misionesDisponibles.map(m =>
        m.id === misionId
          ? { ...m, supervivientesAsignados: [...m.supervivientesAsignados, supervivienteId] }
          : m
      )
    })
  },
  
  desasignarDeMision: (supervivienteId, misionId) => {
    set({
      misionesDisponibles: get().misionesDisponibles.map(m =>
        m.id === misionId
          ? { ...m, supervivientesAsignados: m.supervivientesAsignados.filter(id => id !== supervivienteId) }
          : m
      )
    })
  },
  
  lanzarMision: (misionId, automatizada) => {
    const estado = get()
    const mision = estado.misionesDisponibles.find(m => m.id === misionId)
    
    if (!mision || mision.supervivientesAsignados.length === 0) {
      get().agregarNotificacion('Asigna al menos un superviviente a la misión.', 'advertencia')
      return
    }
    
    // Verificar munición
    if (!estado.consumirRecursos({ municion: mision.municionRequerida })) {
      get().agregarNotificacion('No hay suficiente munición para esta misión.', 'advertencia')
      return
    }
    
    const misionLanzada: Mision = {
      ...mision,
      estado: 'en_progreso',
      tiempoRestante: automatizada ? Math.floor(mision.duracion * 1.5) : mision.duracion,
    }
    
    // Actualizar estado de supervivientes
    set({
      supervivientes: estado.supervivientes.map(s =>
        mision.supervivientesAsignados.includes(s.id)
          ? { ...s, estado: 'mision' }
          : s
      ),
      misionesDisponibles: estado.misionesDisponibles.filter(m => m.id !== misionId),
      misionesActivas: [...estado.misionesActivas, misionLanzada],
    })
    
    get().agregarNotificacion(`¡Misión a ${mision.ubicacion} lanzada!`, 'info')
    get().agregarRegistroCombate(`Equipo desplegado a ${mision.ubicacion}`, 'evento')
  },
  
  generarMisiones: () => {
    const estado = get()
    if (estado.misionesDisponibles.length >= 6) return
    
    const nuevasMisiones = []
    const cantidad = 6 - estado.misionesDisponibles.length
    
    for (let i = 0; i < cantidad; i++) {
      nuevasMisiones.push(crearMision(estado.nivelCompound))
    }
    
    set({ misionesDisponibles: [...estado.misionesDisponibles, ...nuevasMisiones] })
  },
  
  construirEdificio: (tipo, posicion) => {
    const estado = get()
    
    const costosEdificios: Record<string, Partial<Record<TipoRecurso, number>>> = {
      barricada_pequena: { madera: 20, metal: 10 },
      barricada_grande: { madera: 40, metal: 25 },
      torre_vigilancia: { madera: 50, metal: 30 },
      cama: { madera: 15, tela: 20 },
      huerto: { madera: 30 },
      colector_agua: { metal: 25, madera: 15 },
      almacen_metal: { metal: 40, madera: 20 },
      almacen_comida: { madera: 35, metal: 15 },
    }
    
    const costo = costosEdificios[tipo]
    if (!costo || !estado.consumirRecursos(costo)) {
      get().agregarNotificacion('No hay suficientes recursos para construir este edificio.', 'advertencia')
      return
    }
    
    const datosEdificio: Record<string, Partial<Edificio>> = {
      barricada_pequena: { categoria: 'seguridad', nombre: 'Barricada Pequeña', nivelMaximo: 5, bonusSeguridad: 8 },
      barricada_grande: { categoria: 'seguridad', nombre: 'Barricada Grande', nivelMaximo: 5, bonusSeguridad: 15 },
      torre_vigilancia: { categoria: 'seguridad', nombre: 'Torre de Vigilancia', nivelMaximo: 5, bonusSeguridad: 20 },
      cama: { categoria: 'confort', nombre: 'Cama', nivelMaximo: 3, bonusConfort: 5 },
      huerto: { categoria: 'produccion', nombre: 'Huerto', nivelMaximo: 3, tasaProduccion: 2 },
      colector_agua: { categoria: 'produccion', nombre: 'Colector de Agua', nivelMaximo: 3, tasaProduccion: 2 },
      almacen_metal: { categoria: 'almacenamiento', nombre: 'Almacén de Metal', nivelMaximo: 3, capacidadAlmacenamiento: 100 },
      almacen_comida: { categoria: 'almacenamiento', nombre: 'Almacén de Comida', nivelMaximo: 3, capacidadAlmacenamiento: 75 },
    }
    
    const datos = datosEdificio[tipo]
    
    const nuevoEdificio: Edificio = {
      id: generarId(),
      categoria: datos?.categoria || 'general',
      tipo,
      nombre: datos?.nombre || tipo,
      nivel: 1,
      nivelMaximo: datos?.nivelMaximo || 5,
      salud: 100,
      saludMaxima: 100,
      construyendo: true,
      tiempoRestanteConstruccion: 60,
      posicion,
      tamano: { ancho: 60, alto: 60 },
      supervivientesAsignados: [],
      bonusSeguridad: datos?.bonusSeguridad,
      bonusConfort: datos?.bonusConfort,
      tasaProduccion: datos?.tasaProduccion,
      capacidadAlmacenamiento: datos?.capacidadAlmacenamiento,
    }
    
    set({ edificios: [...estado.edificios, nuevoEdificio] })
    get().agregarNotificacion(`Construyendo ${nuevoEdificio.nombre}...`, 'info')
  },
  
  mejorarEdificio: (id) => {
    const estado = get()
    const edificio = estado.edificios.find(e => e.id === id)
    
    if (!edificio || edificio.nivel >= edificio.nivelMaximo) return
    
    const costoMejora = {
      metal: edificio.nivel * 20,
      madera: edificio.nivel * 15,
    }
    
    if (!estado.consumirRecursos(costoMejora)) {
      get().agregarNotificacion('No hay suficientes recursos para mejorar.', 'advertencia')
      return
    }
    
    set({
      edificios: estado.edificios.map(e =>
        e.id === id
          ? { ...e, nivel: e.nivel + 1, saludMaxima: e.saludMaxima + 20 }
          : e
      )
    })
    
    get().agregarNotificacion(`¡${edificio.nombre} mejorado al nivel ${edificio.nivel + 1}!`, 'exito')
  },

  repararEdificio: (id) => {
    const estado = get()
    const edificio = estado.edificios.find(e => e.id === id)
    
    if (!edificio || edificio.salud >= edificio.saludMaxima) return
    
    const costoReparacion = Math.ceil((edificio.saludMaxima - edificio.salud) * 0.3)
    
    if (!estado.consumirRecursos({ metal: costoReparacion })) {
      get().agregarNotificacion('No hay suficiente metal para reparar.', 'advertencia')
      return
    }
    
    set({
      edificios: estado.edificios.map(e =>
        e.id === id
          ? { ...e, salud: e.saludMaxima }
          : e
      )
    })
    
    get().agregarNotificacion(`¡${edificio.nombre} reparado!`, 'exito')
  },
  
  asignarAEdificio: (supervivienteId, edificioId) => {
    const estado = get()
    set({
      edificios: estado.edificios.map(e =>
        e.id === edificioId
          ? { ...e, supervivientesAsignados: [...e.supervivientesAsignados, supervivienteId] }
          : e
      ),
      supervivientes: estado.supervivientes.map(s =>
        s.id === supervivienteId
          ? { ...s, estado: 'defendiendo' }
          : s
      )
    })
  },
  
  defenderCompound: () => {
    const estado = get()
    const supervivientesInactivos = estado.supervivientes.filter(s => s.estado === 'inactivo' && !s.herido)
    
    set({
      supervivientes: estado.supervivientes.map(s =>
        supervivientesInactivos.some(inactivo => inactivo.id === s.id)
          ? { ...s, estado: 'defendiendo' }
          : s
      )
    })
    
    get().agregarNotificacion(`${supervivientesInactivos.length} supervivientes asignados a la defensa.`, 'info')
  },
  
  establecerPestanaSeleccionada: (pestana) => set({ pestanaSeleccionada: pestana }),
  
  agregarNotificacion: (mensaje, tipo) => {
    const notificacion = { id: generarId(), mensaje, tipo, timestamp: Date.now() }
    set(estado => ({ notificaciones: [notificacion, ...estado.notificaciones].slice(0, 10) }))
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
      get().limpiarNotificacion(notificacion.id)
    }, 5000)
  },
  
  limpiarNotificacion: (id) => {
    set(estado => ({ notificaciones: estado.notificaciones.filter(n => n.id !== id) }))
  },
  
  agregarRegistroCombate: (mensaje, tipo) => {
    const registro = { id: generarId(), mensaje, timestamp: Date.now(), tipo }
    set(estado => ({ registroCombate: [registro, ...estado.registroCombate].slice(0, 50) }))
  },

  fabricarArma: (tipoArma) => {
    const estado = get()
    
    const costosFabricacion: Record<TipoArma, Partial<Record<TipoRecurso, number>>> = {
      cuerpo_a_cuerpo: { metal: 15, madera: 10 },
      pistola: { metal: 30, municion: 10 },
      rifle: { metal: 50, madera: 20, municion: 15 },
      escopeta: { metal: 45, madera: 15, municion: 20 },
      subfusil: { metal: 40, municion: 25 },
      asalto: { metal: 60, municion: 30 },
    }
    
    const costo = costosFabricacion[tipoArma]
    if (!costo || !estado.consumirRecursos(costo)) {
      get().agregarNotificacion('No hay suficientes recursos para fabricar esta arma.', 'advertencia')
      return
    }
    
    const nuevaArma = crearArma(estado.nivelCompound)
    nuevaArma.tipo = tipoArma
    
    // Ajustar nombre según el tipo
    const nombresArmas: Record<TipoArma, string[]> = {
      cuerpo_a_cuerpo: ['Machete Fabricado', 'Hacha Improvisada', 'Bate Reforzado'],
      pistola: ['Pistola Fabricada', '9mm Modificada', 'Revólver Superviviente'],
      rifle: ['Rifle Fabricado', 'Rifle de Caza Modificado', 'Rifle Superviviente'],
      escopeta: ['Escopeta Fabricada', 'Escopeta Modificada', 'Escopeta Superviviente'],
      subfusil: ['Subfusil Fabricado', 'UZI Modificada', 'Subfusil Superviviente'],
      asalto: ['Fusil Fabricado', 'M4 Modificado', 'Fusil Superviviente'],
    }
    nuevaArma.nombre = nombresArmas[tipoArma][Math.floor(Math.random() * nombresArmas[tipoArma].length)]
    
    set({ armas: [...estado.armas, nuevaArma] })
    get().agregarNotificacion(`¡Fabricado ${nuevaArma.nombre}!`, 'exito')
  },

  reclutarSuperviviente: () => {
    const estado = get()
    
    if (estado.supervivientes.length >= 10) {
      get().agregarNotificacion('El compound está a máxima capacidad (10 supervivientes).', 'advertencia')
      return
    }
    
    const costoReclutamiento = { comida: 50, agua: 50 }
    if (!estado.consumirRecursos(costoReclutamiento)) {
      get().agregarNotificacion('No hay suficiente comida y agua para reclutar.', 'advertencia')
      return
    }
    
    // Obtener un nombre que no esté ya usado
    const nombresUsados = estado.supervivientes.map(s => s.nombre)
    const nombresDisponibles = nombresSupervivientes.filter(n => !nombresUsados.includes(n))
    const nombre = nombresDisponibles.length > 0 
      ? nombresDisponibles[Math.floor(Math.random() * nombresDisponibles.length)]
      : `Superviviente ${estado.supervivientes.length + 1}`
    
    const nuevoSuperviviente = crearSuperviviente(nombre)
    
    set({ supervivientes: [...estado.supervivientes, nuevoSuperviviente] })
    get().agregarNotificacion(`¡${nombre} se ha unido a tu grupo!`, 'exito')
  },

  desguazarArma: (armaId) => {
    const estado = get()
    const arma = estado.armas.find(a => a.id === armaId)
    
    if (!arma) return
    
    // Verificar si el arma está equipada
    const estaEquipada = estado.supervivientes.some(s => 
      s.equipado.ofensivo.arma?.id === armaId ||
      s.equipado.defensivo.arma?.id === armaId
    )
    
    if (estaEquipada) {
      get().agregarNotificacion('No se puede desguazar un arma equipada.', 'advertencia')
      return
    }
    
    // Calcular valor de desguace según rareza
    const valoresDesguace: Record<string, number> = {
      comun: 5,
      poco_comun: 10,
      raro: 20,
      unico: 40,
    }
    
    const metalObtenido = valoresDesguace[arma.rareza] * arma.nivel
    
    set({
      armas: estado.armas.filter(a => a.id !== armaId),
    })
    get().agregarRecursos({ metal: metalObtenido })
    get().agregarNotificacion(`Desguazado ${arma.nombre} por ${metalObtenido} metal.`, 'info')
  },
}))
