import { create } from 'zustand'

export type ItemType = 'weapon' | 'food' | 'water' | 'medical' | 'material' | 'ammo'
export type WeaponType = 'melee' | 'pistol' | 'rifle' | 'shotgun'
export type BuildingType = 'storage' | 'workshop' | 'medical' | 'water' | 'farm' | 'barricade' | 'watchtower'

export interface Item {
  id: string
  name: string
  type: ItemType
  quantity: number
  icon: string
  damage?: number
  healing?: number
  weaponType?: WeaponType
}

export interface Survivor {
  id: string
  name: string
  health: number
  maxHealth: number
  hunger: number
  thirst: number
  energy: number
  level: number
  xp: number
  xpToNextLevel: number
  skills: {
    combat: number
    scavenging: number
    medical: number
    engineering: number
  }
  equipped: {
    weapon: Item | null
    armor: Item | null
  }
  status: 'idle' | 'scavenging' | 'defending' | 'crafting' | 'resting' | 'injured'
  avatar: string
}

export interface Building {
  id: string
  type: BuildingType
  name: string
  level: number
  maxLevel: number
  health: number
  maxHealth: number
  productionRate: number
  upgrading: boolean
  upgradeTimeLeft: number
}

export interface Mission {
  id: string
  name: string
  description: string
  location: string
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme'
  duration: number
  timeLeft: number
  zombieCount: number
  loot: { type: ItemType; min: number; max: number }[]
  assignedSurvivors: string[]
  status: 'available' | 'in_progress' | 'completed' | 'failed'
  dangerLevel: number
}

export interface ZombieWave {
  id: string
  zombieCount: number
  zombieHealth: number
  zombieDamage: number
  timeUntilArrival: number
  status: 'approaching' | 'attacking' | 'defeated' | 'breached'
}

export interface GameState {
  // Resources
  resources: {
    food: number
    water: number
    materials: number
    fuel: number
    ammo: number
    medicine: number
  }
  maxResources: {
    food: number
    water: number
    materials: number
    fuel: number
    ammo: number
    medicine: number
  }
  
  // Game stats
  day: number
  time: number // 0-24
  isNight: boolean
  baseDefense: number
  maxBaseDefense: number
  morale: number
  
  // Collections
  survivors: Survivor[]
  inventory: Item[]
  buildings: Building[]
  availableMissions: Mission[]
  activeMissions: Mission[]
  zombieWaves: ZombieWave[]
  
  // Game state
  gameStarted: boolean
  gamePaused: boolean
  gameOver: boolean
  gameOverReason: string
  notifications: { id: string; message: string; type: 'info' | 'warning' | 'danger' | 'success'; timestamp: number }[]
  
  // UI state
  selectedTab: 'base' | 'survivors' | 'inventory' | 'missions' | 'map'
  selectedSurvivor: string | null
  selectedBuilding: string | null
  combatLog: { id: string; message: string; timestamp: number }[]
  
  // Actions
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  tick: () => void
  
  // Resource actions
  consumeResources: (resources: Partial<typeof initialResources>) => boolean
  addResources: (resources: Partial<typeof initialResources>) => void
  
  // Survivor actions
  addSurvivor: (survivor: Survivor) => void
  removeSurvivor: (id: string) => void
  updateSurvivor: (id: string, updates: Partial<Survivor>) => void
  assignSurvivorToMission: (survivorId: string, missionId: string) => void
  unassignSurvivorFromMission: (survivorId: string, missionId: string) => void
  equipItem: (survivorId: string, item: Item) => void
  
  // Building actions
  buildStructure: (type: BuildingType) => void
  upgradeBuilding: (id: string) => void
  repairBuilding: (id: string) => void
  
  // Mission actions
  startMission: (missionId: string) => void
  generateMissions: () => void
  
  // Combat actions
  defendBase: () => void
  
  // Inventory actions
  addItem: (item: Item) => void
  removeItem: (id: string, quantity?: number) => void
  useItem: (id: string, survivorId: string) => void
  
  // UI actions
  setSelectedTab: (tab: GameState['selectedTab']) => void
  setSelectedSurvivor: (id: string | null) => void
  setSelectedBuilding: (id: string | null) => void
  addNotification: (message: string, type: 'info' | 'warning' | 'danger' | 'success') => void
  clearNotification: (id: string) => void
  addCombatLog: (message: string) => void
}

const initialResources = {
  food: 50,
  water: 50,
  materials: 30,
  fuel: 20,
  ammo: 25,
  medicine: 15
}

const initialMaxResources = {
  food: 100,
  water: 100,
  materials: 100,
  fuel: 50,
  ammo: 100,
  medicine: 50
}

const survivorNames = [
  'Marcus', 'Elena', 'Jack', 'Sarah', 'Mike', 'Lisa', 'Tom', 'Emma',
  'David', 'Rachel', 'Chris', 'Anna', 'Steve', 'Maria', 'James', 'Kate'
]

const survivorAvatars = ['👨', '👩', '👴', '👵', '🧔', '👱‍♀️', '👨‍🦰', '👩‍🦰']

const locationNames = [
  'Abandoned Warehouse', 'Old Hospital', 'Police Station', 'Supermarket',
  'Gas Station', 'Residential Area', 'School', 'Factory', 'Military Base',
  'Shopping Mall', 'Parking Garage', 'Office Building', 'Pharmacy', 'Gun Store'
]

const generateId = () => Math.random().toString(36).substr(2, 9)

const createInitialSurvivor = (name?: string): Survivor => ({
  id: generateId(),
  name: name || survivorNames[Math.floor(Math.random() * survivorNames.length)],
  health: 100,
  maxHealth: 100,
  hunger: 100,
  thirst: 100,
  energy: 100,
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  skills: {
    combat: Math.floor(Math.random() * 3) + 1,
    scavenging: Math.floor(Math.random() * 3) + 1,
    medical: Math.floor(Math.random() * 3) + 1,
    engineering: Math.floor(Math.random() * 3) + 1
  },
  equipped: {
    weapon: null,
    armor: null
  },
  status: 'idle',
  avatar: survivorAvatars[Math.floor(Math.random() * survivorAvatars.length)]
})

const createMission = (difficulty: Mission['difficulty']): Mission => {
  const difficultySettings = {
    easy: { zombies: [3, 8], duration: [30, 60], danger: 20, lootMultiplier: 1 },
    medium: { zombies: [8, 15], duration: [60, 120], danger: 45, lootMultiplier: 1.5 },
    hard: { zombies: [15, 25], duration: [120, 180], danger: 70, lootMultiplier: 2 },
    extreme: { zombies: [25, 40], duration: [180, 300], danger: 90, lootMultiplier: 3 }
  }
  
  const settings = difficultySettings[difficulty]
  const zombieCount = Math.floor(Math.random() * (settings.zombies[1] - settings.zombies[0])) + settings.zombies[0]
  const duration = Math.floor(Math.random() * (settings.duration[1] - settings.duration[0])) + settings.duration[0]
  
  return {
    id: generateId(),
    name: `Scavenge ${locationNames[Math.floor(Math.random() * locationNames.length)]}`,
    description: `Search the area for supplies. Expected zombie presence: ${zombieCount}`,
    location: locationNames[Math.floor(Math.random() * locationNames.length)],
    difficulty,
    duration,
    timeLeft: duration,
    zombieCount,
    loot: [
      { type: 'food', min: Math.floor(5 * settings.lootMultiplier), max: Math.floor(15 * settings.lootMultiplier) },
      { type: 'water', min: Math.floor(3 * settings.lootMultiplier), max: Math.floor(12 * settings.lootMultiplier) },
      { type: 'material', min: Math.floor(5 * settings.lootMultiplier), max: Math.floor(20 * settings.lootMultiplier) },
      { type: 'ammo', min: Math.floor(2 * settings.lootMultiplier), max: Math.floor(10 * settings.lootMultiplier) }
    ],
    assignedSurvivors: [],
    status: 'available',
    dangerLevel: settings.danger
  }
}

const createInitialBuildings = (): Building[] => [
  {
    id: generateId(),
    type: 'storage',
    name: 'Storage Room',
    level: 1,
    maxLevel: 5,
    health: 100,
    maxHealth: 100,
    productionRate: 0,
    upgrading: false,
    upgradeTimeLeft: 0
  },
  {
    id: generateId(),
    type: 'barricade',
    name: 'Barricade',
    level: 1,
    maxLevel: 5,
    health: 100,
    maxHealth: 100,
    productionRate: 10,
    upgrading: false,
    upgradeTimeLeft: 0
  }
]

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  resources: { ...initialResources },
  maxResources: { ...initialMaxResources },
  day: 1,
  time: 8,
  isNight: false,
  baseDefense: 50,
  maxBaseDefense: 100,
  morale: 75,
  survivors: [createInitialSurvivor('You'), createInitialSurvivor()],
  inventory: [
    { id: generateId(), name: 'Pistol', type: 'weapon', quantity: 1, icon: '🔫', damage: 15, weaponType: 'pistol' },
    { id: generateId(), name: 'Baseball Bat', type: 'weapon', quantity: 1, icon: '🏏', damage: 10, weaponType: 'melee' },
    { id: generateId(), name: 'First Aid Kit', type: 'medical', quantity: 3, icon: '🩹', healing: 30 },
    { id: generateId(), name: 'Canned Food', type: 'food', quantity: 5, icon: '🥫' },
    { id: generateId(), name: 'Water Bottle', type: 'water', quantity: 5, icon: '💧' }
  ],
  buildings: createInitialBuildings(),
  availableMissions: [createMission('easy'), createMission('easy'), createMission('medium')],
  activeMissions: [],
  zombieWaves: [],
  gameStarted: false,
  gamePaused: false,
  gameOver: false,
  gameOverReason: '',
  notifications: [],
  selectedTab: 'base',
  selectedSurvivor: null,
  selectedBuilding: null,
  combatLog: [],
  
  // Game control actions
  startGame: () => set({ gameStarted: true, gamePaused: false }),
  pauseGame: () => set({ gamePaused: true }),
  resumeGame: () => set({ gamePaused: false }),
  
  tick: () => {
    const state = get()
    if (state.gamePaused || state.gameOver) return
    
    let newTime = state.time + 0.5
    let newDay = state.day
    let isNight = false
    
    if (newTime >= 24) {
      newTime = 0
      newDay += 1
    }
    
    isNight = newTime >= 20 || newTime < 6
    
    // Consume resources
    const foodConsumption = state.survivors.length * 0.3
    const waterConsumption = state.survivors.length * 0.4
    
    const newResources = {
      ...state.resources,
      food: Math.max(0, state.resources.food - foodConsumption),
      water: Math.max(0, state.resources.water - waterConsumption)
    }
    
    // Update survivors
    const newSurvivors = state.survivors.map(survivor => {
      let newHunger = survivor.hunger - 1
      let newThirst = survivor.thirst - 1.5
      let newEnergy = survivor.energy
      let newHealth = survivor.health
      let newStatus = survivor.status
      
      if (survivor.status === 'resting') {
        newEnergy = Math.min(100, survivor.energy + 5)
        newHealth = Math.min(survivor.maxHealth, survivor.health + 1)
        if (newEnergy >= 100) newStatus = 'idle'
      }
      
      if (newHunger <= 0) {
        newHealth -= 2
        newHunger = 0
      }
      if (newThirst <= 0) {
        newHealth -= 3
        newThirst = 0
      }
      
      if (newHealth <= 0) {
        newStatus = 'injured'
        newHealth = 0
      }
      
      return {
        ...survivor,
        hunger: Math.max(0, Math.min(100, newHunger)),
        thirst: Math.max(0, Math.min(100, newThirst)),
        energy: Math.max(0, Math.min(100, newEnergy)),
        health: Math.max(0, newHealth),
        status: newStatus
      }
    })
    
    // Check for dead survivors
    const deadSurvivors = newSurvivors.filter(s => s.health <= 0)
    if (deadSurvivors.length > 0) {
      deadSurvivors.forEach(s => {
        get().addNotification(`${s.name} has died!`, 'danger')
      })
    }
    
    const aliveSurvivors = newSurvivors.filter(s => s.health > 0)
    
    // Check game over conditions
    if (aliveSurvivors.length === 0) {
      set({ gameOver: true, gameOverReason: 'All survivors have perished.' })
      return
    }
    
    // Update missions
    const newActiveMissions = state.activeMissions.map(mission => {
      if (mission.status !== 'in_progress') return mission
      
      const newTimeLeft = mission.timeLeft - 1
      if (newTimeLeft <= 0) {
        // Mission complete - calculate success
        const assignedSurvivors = aliveSurvivors.filter(s => mission.assignedSurvivors.includes(s.id))
        const totalCombat = assignedSurvivors.reduce((sum, s) => sum + s.skills.combat, 0)
        const successChance = Math.min(90, 50 + totalCombat * 5 - mission.dangerLevel / 2)
        const success = Math.random() * 100 < successChance
        
        if (success) {
          // Add loot
          mission.loot.forEach(loot => {
            const amount = Math.floor(Math.random() * (loot.max - loot.min)) + loot.min
            if (loot.type === 'food') get().addResources({ food: amount })
            else if (loot.type === 'water') get().addResources({ water: amount })
            else if (loot.type === 'material') get().addResources({ materials: amount })
            else if (loot.type === 'ammo') get().addResources({ ammo: amount })
          })
          
          // Add XP to survivors
          assignedSurvivors.forEach(s => {
            const xpGain = mission.difficulty === 'easy' ? 20 : mission.difficulty === 'medium' ? 40 : mission.difficulty === 'hard' ? 70 : 100
            get().updateSurvivor(s.id, { 
              xp: s.xp + xpGain,
              status: 'idle'
            })
          })
          
          get().addNotification(`Mission "${mission.name}" completed successfully!`, 'success')
          return { ...mission, status: 'completed' as const, timeLeft: 0 }
        } else {
          // Mission failed - survivors take damage
          assignedSurvivors.forEach(s => {
            const damage = Math.floor(Math.random() * 30) + 10
            get().updateSurvivor(s.id, { 
              health: Math.max(0, s.health - damage),
              status: s.health - damage <= 0 ? 'injured' : 'idle'
            })
          })
          
          get().addNotification(`Mission "${mission.name}" failed! Survivors took damage.`, 'danger')
          return { ...mission, status: 'failed' as const, timeLeft: 0 }
        }
      }
      
      return { ...mission, timeLeft: newTimeLeft }
    })
    
    // Remove completed/failed missions and free survivors
    const completedMissions = newActiveMissions.filter(m => m.status === 'completed' || m.status === 'failed')
    completedMissions.forEach(mission => {
      mission.assignedSurvivors.forEach(sId => {
        const survivor = aliveSurvivors.find(s => s.id === sId)
        if (survivor) {
          get().updateSurvivor(sId, { status: 'idle' })
        }
      })
    })
    
    // Random zombie wave at night
    if (isNight && Math.random() < 0.05 && state.zombieWaves.length === 0) {
      const waveSize = Math.floor(5 + state.day * 2 + Math.random() * 10)
      const wave: ZombieWave = {
        id: generateId(),
        zombieCount: waveSize,
        zombieHealth: 20 + state.day * 2,
        zombieDamage: 5 + state.day,
        timeUntilArrival: 30,
        status: 'approaching'
      }
      get().addNotification(`Zombie horde detected! ${waveSize} zombies approaching!`, 'danger')
      set(s => ({ zombieWaves: [...s.zombieWaves, wave] }))
    }
    
    // Update zombie waves
    const newZombieWaves = state.zombieWaves.map(wave => {
      if (wave.status === 'approaching') {
        const newTime = wave.timeUntilArrival - 1
        if (newTime <= 0) {
          get().addNotification('Zombies are attacking the base!', 'danger')
          return { ...wave, timeUntilArrival: 0, status: 'attacking' as const }
        }
        return { ...wave, timeUntilArrival: newTime }
      }
      return wave
    })
    
    // Process attacking waves
    const attackingWaves = newZombieWaves.filter(w => w.status === 'attacking')
    let newBaseDefense = state.baseDefense
    
    attackingWaves.forEach(wave => {
      // Defenders fight back
      const defenders = aliveSurvivors.filter(s => s.status === 'defending' || s.status === 'idle')
      const totalDamageToZombies = defenders.reduce((sum, s) => {
        const weaponDamage = s.equipped.weapon?.damage || 5
        return sum + weaponDamage + s.skills.combat * 2
      }, 0)
      
      // Zombies attack base
      const damageToBase = wave.zombieCount * wave.zombieDamage * 0.1
      newBaseDefense = Math.max(0, newBaseDefense - damageToBase)
      
      // Kill zombies
      const zombiesKilled = Math.floor(totalDamageToZombies / wave.zombieHealth)
      wave.zombieCount = Math.max(0, wave.zombieCount - zombiesKilled)
      
      if (zombiesKilled > 0) {
        get().addCombatLog(`Killed ${zombiesKilled} zombies!`)
      }
      
      if (wave.zombieCount <= 0) {
        wave.status = 'defeated'
        get().addNotification('Zombie wave defeated!', 'success')
        // Reward survivors
        defenders.forEach(s => {
          get().updateSurvivor(s.id, { xp: s.xp + 30 })
        })
      }
    })
    
    // Check if base is breached
    if (newBaseDefense <= 0) {
      set({ gameOver: true, gameOverReason: 'The base defenses have been breached!' })
      return
    }
    
    // Update morale based on conditions
    let newMorale = state.morale
    if (state.resources.food < 20) newMorale -= 1
    if (state.resources.water < 20) newMorale -= 1
    if (deadSurvivors.length > 0) newMorale -= 10
    if (attackingWaves.length > 0) newMorale -= 2
    newMorale = Math.max(0, Math.min(100, newMorale))
    
    set({
      time: newTime,
      day: newDay,
      isNight,
      resources: newResources,
      survivors: aliveSurvivors,
      activeMissions: newActiveMissions.filter(m => m.status === 'in_progress'),
      zombieWaves: newZombieWaves.filter(w => w.status !== 'defeated'),
      baseDefense: newBaseDefense,
      morale: newMorale
    })
    
    // Generate new missions occasionally
    if (newTime === 8 && state.availableMissions.length < 5) {
      get().generateMissions()
    }
  },
  
  // Resource actions
  consumeResources: (resources) => {
    const state = get()
    const canConsume = Object.entries(resources).every(([key, value]) => {
      return state.resources[key as keyof typeof initialResources] >= (value || 0)
    })
    
    if (!canConsume) return false
    
    set({
      resources: {
        food: state.resources.food - (resources.food || 0),
        water: state.resources.water - (resources.water || 0),
        materials: state.resources.materials - (resources.materials || 0),
        fuel: state.resources.fuel - (resources.fuel || 0),
        ammo: state.resources.ammo - (resources.ammo || 0),
        medicine: state.resources.medicine - (resources.medicine || 0)
      }
    })
    return true
  },
  
  addResources: (resources) => {
    const state = get()
    set({
      resources: {
        food: Math.min(state.maxResources.food, state.resources.food + (resources.food || 0)),
        water: Math.min(state.maxResources.water, state.resources.water + (resources.water || 0)),
        materials: Math.min(state.maxResources.materials, state.resources.materials + (resources.materials || 0)),
        fuel: Math.min(state.maxResources.fuel, state.resources.fuel + (resources.fuel || 0)),
        ammo: Math.min(state.maxResources.ammo, state.resources.ammo + (resources.ammo || 0)),
        medicine: Math.min(state.maxResources.medicine, state.resources.medicine + (resources.medicine || 0))
      }
    })
  },
  
  // Survivor actions
  addSurvivor: (survivor) => set(state => ({ survivors: [...state.survivors, survivor] })),
  
  removeSurvivor: (id) => set(state => ({ 
    survivors: state.survivors.filter(s => s.id !== id) 
  })),
  
  updateSurvivor: (id, updates) => set(state => ({
    survivors: state.survivors.map(s => s.id === id ? { ...s, ...updates } : s)
  })),
  
  assignSurvivorToMission: (survivorId, missionId) => {
    const state = get()
    const mission = state.availableMissions.find(m => m.id === missionId) || 
                    state.activeMissions.find(m => m.id === missionId)
    
    if (!mission || mission.assignedSurvivors.includes(survivorId)) return
    
    if (mission.status === 'available') {
      set({
        availableMissions: state.availableMissions.map(m => 
          m.id === missionId 
            ? { ...m, assignedSurvivors: [...m.assignedSurvivors, survivorId] }
            : m
        )
      })
    }
    
    get().updateSurvivor(survivorId, { status: 'scavenging' })
  },
  
  unassignSurvivorFromMission: (survivorId, missionId) => {
    const state = get()
    
    set({
      availableMissions: state.availableMissions.map(m => 
        m.id === missionId 
          ? { ...m, assignedSurvivors: m.assignedSurvivors.filter(id => id !== survivorId) }
          : m
      )
    })
    
    get().updateSurvivor(survivorId, { status: 'idle' })
  },
  
  equipItem: (survivorId, item) => {
    if (item.type !== 'weapon') return
    
    set(state => ({
      survivors: state.survivors.map(s => 
        s.id === survivorId 
          ? { ...s, equipped: { ...s.equipped, weapon: item } }
          : s
      )
    }))
  },
  
  // Building actions
  buildStructure: (type) => {
    const state = get()
    const buildingCosts: Record<BuildingType, { materials: number; fuel: number }> = {
      storage: { materials: 30, fuel: 5 },
      workshop: { materials: 50, fuel: 10 },
      medical: { materials: 40, fuel: 5 },
      water: { materials: 35, fuel: 10 },
      farm: { materials: 25, fuel: 5 },
      barricade: { materials: 20, fuel: 0 },
      watchtower: { materials: 45, fuel: 5 }
    }
    
    const cost = buildingCosts[type]
    if (!get().consumeResources({ materials: cost.materials, fuel: cost.fuel })) {
      get().addNotification('Not enough resources to build!', 'warning')
      return
    }
    
    const buildingNames: Record<BuildingType, string> = {
      storage: 'Storage Room',
      workshop: 'Workshop',
      medical: 'Medical Bay',
      water: 'Water Collector',
      farm: 'Farm',
      barricade: 'Barricade',
      watchtower: 'Watchtower'
    }
    
    const newBuilding: Building = {
      id: generateId(),
      type,
      name: buildingNames[type],
      level: 1,
      maxLevel: 5,
      health: 100,
      maxHealth: 100,
      productionRate: type === 'barricade' ? 10 : type === 'watchtower' ? 5 : 0,
      upgrading: false,
      upgradeTimeLeft: 0
    }
    
    set(s => ({ buildings: [...s.buildings, newBuilding] }))
    get().addNotification(`${buildingNames[type]} has been built!`, 'success')
    
    // Update max resources if storage
    if (type === 'storage') {
      set(s => ({
        maxResources: {
          ...s.maxResources,
          food: s.maxResources.food + 50,
          water: s.maxResources.water + 50,
          materials: s.maxResources.materials + 50
        }
      }))
    }
    
    // Update base defense if barricade/watchtower
    if (type === 'barricade' || type === 'watchtower') {
      const bonus = type === 'barricade' ? 15 : 10
      set(s => ({
        baseDefense: Math.min(s.maxBaseDefense, s.baseDefense + bonus),
        maxBaseDefense: s.maxBaseDefense + bonus
      }))
    }
  },
  
  upgradeBuilding: (id) => {
    const state = get()
    const building = state.buildings.find(b => b.id === id)
    if (!building || building.level >= building.maxLevel) return
    
    const upgradeCost = { materials: building.level * 20, fuel: building.level * 5 }
    if (!get().consumeResources(upgradeCost)) {
      get().addNotification('Not enough resources to upgrade!', 'warning')
      return
    }
    
    set({
      buildings: state.buildings.map(b => 
        b.id === id 
          ? { ...b, level: b.level + 1, maxHealth: b.maxHealth + 20, health: b.maxHealth + 20 }
          : b
      )
    })
    
    get().addNotification(`${building.name} upgraded to level ${building.level + 1}!`, 'success')
  },
  
  repairBuilding: (id) => {
    const state = get()
    const building = state.buildings.find(b => b.id === id)
    if (!building || building.health >= building.maxHealth) return
    
    const repairCost = Math.ceil((building.maxHealth - building.health) / 10)
    if (!get().consumeResources({ materials: repairCost })) {
      get().addNotification('Not enough materials to repair!', 'warning')
      return
    }
    
    set({
      buildings: state.buildings.map(b => 
        b.id === id ? { ...b, health: b.maxHealth } : b
      )
    })
    
    get().addNotification(`${building.name} repaired!`, 'success')
  },
  
  // Mission actions
  startMission: (missionId) => {
    const state = get()
    const mission = state.availableMissions.find(m => m.id === missionId)
    
    if (!mission || mission.assignedSurvivors.length === 0) {
      get().addNotification('Assign at least one survivor to this mission!', 'warning')
      return
    }
    
    set({
      availableMissions: state.availableMissions.filter(m => m.id !== missionId),
      activeMissions: [...state.activeMissions, { ...mission, status: 'in_progress' }]
    })
    
    get().addNotification(`Mission "${mission.name}" has started!`, 'info')
  },
  
  generateMissions: () => {
    const state = get()
    const difficulties: Mission['difficulty'][] = ['easy', 'easy', 'medium', 'medium', 'hard']
    if (state.day > 5) difficulties.push('hard')
    if (state.day > 10) difficulties.push('extreme')
    
    const newMissions = Array.from({ length: 2 }, () => {
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)]
      return createMission(difficulty)
    })
    
    set(s => ({ 
      availableMissions: [...s.availableMissions.slice(-3), ...newMissions].slice(0, 5)
    }))
  },
  
  defendBase: () => {
    const state = get()
    const idleSurvivors = state.survivors.filter(s => s.status === 'idle')
    
    idleSurvivors.forEach(s => {
      get().updateSurvivor(s.id, { status: 'defending' })
    })
    
    if (idleSurvivors.length > 0) {
      get().addNotification(`${idleSurvivors.length} survivors are now defending the base!`, 'info')
    }
  },
  
  // Inventory actions
  addItem: (item) => set(state => {
    const existing = state.inventory.find(i => i.name === item.name)
    if (existing) {
      return {
        inventory: state.inventory.map(i => 
          i.name === item.name ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      }
    }
    return { inventory: [...state.inventory, item] }
  }),
  
  removeItem: (id, quantity = 1) => set(state => {
    const item = state.inventory.find(i => i.id === id)
    if (!item) return state
    
    if (item.quantity <= quantity) {
      return { inventory: state.inventory.filter(i => i.id !== id) }
    }
    return {
      inventory: state.inventory.map(i => 
        i.id === id ? { ...i, quantity: i.quantity - quantity } : i
      )
    }
  }),
  
  useItem: (itemId, survivorId) => {
    const state = get()
    const item = state.inventory.find(i => i.id === itemId)
    const survivor = state.survivors.find(s => s.id === survivorId)
    
    if (!item || !survivor) return
    
    if (item.type === 'medical' && item.healing) {
      get().updateSurvivor(survivorId, {
        health: Math.min(survivor.maxHealth, survivor.health + item.healing)
      })
      get().removeItem(itemId, 1)
      get().addNotification(`${survivor.name} used ${item.name}`, 'info')
    } else if (item.type === 'food') {
      get().updateSurvivor(survivorId, {
        hunger: Math.min(100, survivor.hunger + 30)
      })
      get().removeItem(itemId, 1)
    } else if (item.type === 'water') {
      get().updateSurvivor(survivorId, {
        thirst: Math.min(100, survivor.thirst + 30)
      })
      get().removeItem(itemId, 1)
    } else if (item.type === 'weapon') {
      get().equipItem(survivorId, item)
    }
  },
  
  // UI actions
  setSelectedTab: (tab) => set({ selectedTab: tab }),
  setSelectedSurvivor: (id) => set({ selectedSurvivor: id }),
  setSelectedBuilding: (id) => set({ selectedBuilding: id }),
  
  addNotification: (message, type) => {
    const id = generateId()
    set(state => ({
      notifications: [...state.notifications, { id, message, type, timestamp: Date.now() }].slice(-5)
    }))
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      get().clearNotification(id)
    }, 5000)
  },
  
  clearNotification: (id) => set(state => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  addCombatLog: (message) => {
    const id = generateId()
    set(state => ({
      combatLog: [...state.combatLog, { id, message, timestamp: Date.now() }].slice(-20)
    }))
  }
}))
