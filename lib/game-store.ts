import { create } from 'zustand'

// Types following The Last Stand: Dead Zone mechanics
export type SurvivorClass = 'leader' | 'fighter' | 'medic' | 'scavenger' | 'engineer' | 'recon'
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'unique'
export type WeaponType = 'melee' | 'pistol' | 'rifle' | 'shotgun' | 'smg' | 'assault'
export type ResourceType = 'metal' | 'wood' | 'cloth' | 'food' | 'water' | 'ammo' | 'fuel'
export type BuildingCategory = 'general' | 'storage' | 'production' | 'security' | 'comfort'
export type MissionStatus = 'available' | 'in_progress' | 'returning' | 'completed' | 'failed'
export type DangerLevel = 'low' | 'moderate' | 'dangerous' | 'high' | 'extreme'

export interface Skills {
  rangedCombat: number
  meleeCombat: number
  healing: number
  movement: number
  scavenging: number
  luck: number
}

export interface Survivor {
  id: string
  name: string
  class: SurvivorClass
  level: number
  xp: number
  xpToNextLevel: number
  health: number
  maxHealth: number
  morale: number
  skills: Skills
  injured: boolean
  injuryType: string | null
  injuryTimeLeft: number
  equipped: {
    offensive: { weapon: Weapon | null; gear: Item | null }
    defensive: { weapon: Weapon | null; gear: Item | null }
  }
  status: 'idle' | 'mission' | 'defending' | 'building' | 'resting' | 'injured'
  position: { x: number; y: number }
  targetPosition: { x: number; y: number } | null
  isMoving: boolean
  direction: 'up' | 'down' | 'left' | 'right'
}

export interface Weapon {
  id: string
  name: string
  type: WeaponType
  level: number
  damage: number
  accuracy: number
  fireRate: number
  magazineSize: number
  rarity: ItemRarity
  dps: number
}

export interface Item {
  id: string
  name: string
  type: 'weapon' | 'gear' | 'medical' | 'component' | 'book'
  level: number
  rarity: ItemRarity
  quantity: number
  effects?: Record<string, number>
}

export interface Building {
  id: string
  category: BuildingCategory
  type: string
  name: string
  level: number
  maxLevel: number
  health: number
  maxHealth: number
  constructing: boolean
  constructionTimeLeft: number
  position: { x: number; y: number }
  size: { width: number; height: number }
  assignedSurvivors: string[]
  productionRate?: number
  storageCapacity?: number
  securityBonus?: number
  comfortBonus?: number
}

export interface Mission {
  id: string
  name: string
  location: string
  locationType: string
  level: number
  dangerLevel: DangerLevel
  duration: number
  returnTime: number
  timeLeft: number
  status: MissionStatus
  assignedSurvivors: string[]
  possibleFinds: ResourceType[]
  ammoRequired: number
  zombieCount: number
  isHighActivity: boolean
  rewards: {
    xp: number
    resources: Partial<Record<ResourceType, { min: number; max: number }>>
  }
}

export interface ZombieHorde {
  id: string
  count: number
  health: number
  damage: number
  timeUntilAttack: number
  status: 'approaching' | 'attacking' | 'defeated'
  position: { x: number; y: number }
}

export interface GameState {
  // Resources (following TLSDZ)
  resources: Record<ResourceType, number>
  maxResources: Record<ResourceType, number>
  
  // Compound stats
  day: number
  time: number
  isNight: boolean
  securityRating: number
  comfortRating: number
  compoundLevel: number
  
  // Collections
  survivors: Survivor[]
  leader: Survivor | null
  inventory: Item[]
  weapons: Weapon[]
  buildings: Building[]
  availableMissions: Mission[]
  activeMissions: Mission[]
  zombieWaves: ZombieHorde[]
  
  // Junk piles (removable debris)
  junkPiles: { id: string; position: { x: number; y: number }; timeToRemove: number }[]
  
  // Game state
  gameStarted: boolean
  gamePaused: boolean
  gameOver: boolean
  gameOverReason: string
  
  // UI state
  selectedTab: 'compound' | 'base' | 'survivors' | 'inventory' | 'missions'
  selectedSurvivor: string | null
  selectedBuilding: string | null
  notifications: { id: string; message: string; type: 'info' | 'warning' | 'danger' | 'success'; timestamp: number }[]
  combatLog: { id: string; message: string; timestamp: number; type: 'kill' | 'damage' | 'heal' | 'event' }[]
  
  // Player position in compound
  playerPosition: { x: number; y: number }
  playerTargetPosition: { x: number; y: number } | null
  playerMoving: boolean
  playerDirection: 'up' | 'down' | 'left' | 'right'
  
  // Actions
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  tick: () => void
  
  // Player movement
  setPlayerTarget: (pos: { x: number; y: number }) => void
  updatePlayerPosition: () => void
  
  // Resource actions
  consumeResources: (resources: Partial<Record<ResourceType, number>>) => boolean
  addResources: (resources: Partial<Record<ResourceType, number>>) => void
  
  // Survivor actions
  selectSurvivor: (id: string | null) => void
  assignSurvivorClass: (id: string, survivorClass: SurvivorClass) => void
  equipWeapon: (survivorId: string, weaponId: string, loadout: 'offensive' | 'defensive') => void
  healSurvivor: (survivorId: string) => void
  moveSurvivor: (survivorId: string, position: { x: number; y: number }) => void
  updateSurvivorState: (id: string, updates: Partial<Survivor>) => void
  
  // Mission actions
  assignToMission: (survivorId: string, missionId: string) => void
  unassignFromMission: (survivorId: string, missionId: string) => void
  launchMission: (missionId: string, automated: boolean) => void
  generateMissions: () => void
  
  // Building actions
  constructBuilding: (type: string, position: { x: number; y: number }) => void
  upgradeBuilding: (id: string) => void
  repairBuilding: (id: string) => void
  assignToBuilding: (survivorId: string, buildingId: string) => void
  
  // Combat
  defendCompound: () => void
  
  // UI actions
  setSelectedTab: (tab: GameState['selectedTab']) => void
  addNotification: (message: string, type: 'info' | 'warning' | 'danger' | 'success') => void
  clearNotification: (id: string) => void
  addCombatLog: (message: string, type: 'kill' | 'damage' | 'heal' | 'event') => void
  
  // Crafting & Recruitment
  craftWeapon: (weaponType: WeaponType) => void
  recruitSurvivor: () => void
  scrapWeapon: (weaponId: string) => void
}

const generateId = () => Math.random().toString(36).substring(2, 11)

// Class skill bonuses (following TLSDZ class system)
const classSkillBonuses: Record<SurvivorClass, Partial<Skills>> = {
  leader: { rangedCombat: 2, meleeCombat: 2, healing: 1, movement: 1, scavenging: 1, luck: 1 },
  fighter: { rangedCombat: 3, meleeCombat: 3, movement: 1, scavenging: 0, healing: 0, luck: 0 },
  medic: { healing: 4, rangedCombat: 1, meleeCombat: 1, movement: 1, scavenging: 1, luck: 0 },
  scavenger: { scavenging: 3, luck: 3, movement: 2, rangedCombat: 0, meleeCombat: 0, healing: 0 },
  engineer: { scavenging: 2, rangedCombat: 1, meleeCombat: 1, movement: 1, healing: 0, luck: 1 },
  recon: { movement: 3, rangedCombat: 2, scavenging: 1, meleeCombat: 1, healing: 0, luck: 1 },
}

const survivorNames = [
  'Marcus Webb', 'Elena Rodriguez', 'Jack Morrison', 'Sarah Chen', 
  'Mike Thompson', 'Lisa Park', 'Tom Bradley', 'Emma Wilson',
  'David Kim', 'Rachel Green', 'Chris Murphy', 'Anna Kowalski',
  'Steve Johnson', 'Maria Santos', 'James Lee', 'Kate Miller',
  'Alex Turner', 'Nina Petrov', 'Ryan Cole', 'Zoe Adams'
]

const locationTypes = [
  { type: 'warehouse', name: 'Warehouse', finds: ['metal', 'wood', 'cloth'] as ResourceType[] },
  { type: 'hospital', name: 'Hospital', finds: ['cloth', 'water'] as ResourceType[] },
  { type: 'police', name: 'Police Station', finds: ['ammo', 'metal'] as ResourceType[] },
  { type: 'supermarket', name: 'Supermarket', finds: ['food', 'water'] as ResourceType[] },
  { type: 'gas_station', name: 'Gas Station', finds: ['fuel', 'food'] as ResourceType[] },
  { type: 'residential', name: 'Residential Area', finds: ['cloth', 'food', 'water'] as ResourceType[] },
  { type: 'office', name: 'Office Building', finds: ['wood', 'cloth'] as ResourceType[] },
  { type: 'factory', name: 'Factory', finds: ['metal', 'fuel'] as ResourceType[] },
  { type: 'military', name: 'Military Outpost', finds: ['ammo', 'metal', 'fuel'] as ResourceType[] },
]

const createSurvivor = (name: string, isLeader: boolean = false): Survivor => {
  const baseSkills: Skills = {
    rangedCombat: Math.floor(Math.random() * 5) + 5,
    meleeCombat: Math.floor(Math.random() * 5) + 5,
    healing: Math.floor(Math.random() * 3) + 2,
    movement: Math.floor(Math.random() * 5) + 8,
    scavenging: Math.floor(Math.random() * 5) + 5,
    luck: Math.floor(Math.random() * 5) + 3,
  }

  return {
    id: generateId(),
    name,
    class: isLeader ? 'leader' : 'fighter',
    level: isLeader ? 1 : 1,
    xp: 0,
    xpToNextLevel: 100,
    health: 100,
    maxHealth: 100,
    morale: 75,
    skills: baseSkills,
    injured: false,
    injuryType: null,
    injuryTimeLeft: 0,
    equipped: {
      offensive: { weapon: null, gear: null },
      defensive: { weapon: null, gear: null },
    },
    status: 'idle',
    position: { x: 400 + Math.random() * 100 - 50, y: 300 + Math.random() * 100 - 50 },
    targetPosition: null,
    isMoving: false,
    direction: 'down',
  }
}

const createWeapon = (level: number): Weapon => {
  const weaponTypes: { type: WeaponType; names: string[]; baseDamage: number; baseAccuracy: number }[] = [
    { type: 'melee', names: ['Baseball Bat', 'Machete', 'Fire Axe', 'Combat Knife', 'Crowbar'], baseDamage: 15, baseAccuracy: 90 },
    { type: 'pistol', names: ['9mm Pistol', 'Glock 17', '.357 Magnum', 'M1911', 'Desert Eagle'], baseDamage: 20, baseAccuracy: 75 },
    { type: 'rifle', names: ['Hunting Rifle', 'M14', 'Sniper Rifle', 'M1 Garand'], baseDamage: 45, baseAccuracy: 85 },
    { type: 'shotgun', names: ['Pump Shotgun', 'Double Barrel', 'Combat Shotgun', 'SPAS-12'], baseDamage: 55, baseAccuracy: 60 },
    { type: 'smg', names: ['UZI', 'MP5', 'MAC-10', 'P90'], baseDamage: 18, baseAccuracy: 65 },
    { type: 'assault', names: ['M4A1', 'AK-47', 'SCAR-H', 'M16'], baseDamage: 30, baseAccuracy: 70 },
  ]

  const selectedType = weaponTypes[Math.floor(Math.random() * weaponTypes.length)]
  const name = selectedType.names[Math.floor(Math.random() * selectedType.names.length)]
  const rarity: ItemRarity = Math.random() < 0.6 ? 'common' : Math.random() < 0.85 ? 'uncommon' : Math.random() < 0.97 ? 'rare' : 'unique'
  const rarityMultiplier = rarity === 'common' ? 1 : rarity === 'uncommon' ? 1.2 : rarity === 'rare' ? 1.5 : 2

  const damage = Math.floor(selectedType.baseDamage * (1 + level * 0.1) * rarityMultiplier)
  const accuracy = Math.min(95, Math.floor(selectedType.baseAccuracy * (1 + level * 0.02) * rarityMultiplier))
  const fireRate = selectedType.type === 'melee' ? 1 : selectedType.type === 'rifle' ? 0.8 : selectedType.type === 'shotgun' ? 0.6 : 1.5

  return {
    id: generateId(),
    name,
    type: selectedType.type,
    level,
    damage,
    accuracy,
    fireRate,
    magazineSize: selectedType.type === 'melee' ? 0 : selectedType.type === 'pistol' ? 12 : selectedType.type === 'shotgun' ? 8 : 30,
    rarity,
    dps: Math.floor(damage * fireRate),
  }
}

const createMission = (compoundLevel: number): Mission => {
  const location = locationTypes[Math.floor(Math.random() * locationTypes.length)]
  const level = Math.max(1, compoundLevel + Math.floor(Math.random() * 3) - 1)
  const isHighActivity = Math.random() < 0.15

  const dangerLevels: DangerLevel[] = ['low', 'moderate', 'dangerous', 'high', 'extreme']
  const dangerIndex = Math.min(4, Math.floor(level / 3) + (isHighActivity ? 1 : 0))
  const dangerLevel = dangerLevels[dangerIndex]

  const baseDuration = 5 + level * 2
  const zombieBase = 5 + level * 3

  return {
    id: generateId(),
    name: `${location.name} - Sector ${Math.floor(Math.random() * 9) + 1}`,
    location: location.name,
    locationType: location.type,
    level,
    dangerLevel,
    duration: baseDuration * 60, // seconds
    returnTime: Math.floor(baseDuration * 60 * 0.5), // 50% of mission time
    timeLeft: 0,
    status: 'available',
    assignedSurvivors: [],
    possibleFinds: location.finds,
    ammoRequired: level * 5,
    zombieCount: zombieBase + (isHighActivity ? Math.floor(zombieBase * 0.5) : 0),
    isHighActivity,
    rewards: {
      xp: level * 50 * (isHighActivity ? 1.5 : 1),
      resources: location.finds.reduce((acc, res) => {
        acc[res] = { min: level * 3, max: level * 8 }
        return acc
      }, {} as Partial<Record<ResourceType, { min: number; max: number }>>),
    },
  }
}

const initialBuildings: Building[] = [
  {
    id: generateId(),
    category: 'general',
    type: 'warehouse',
    name: 'Warehouse',
    level: 1,
    maxLevel: 1,
    health: 100,
    maxHealth: 100,
    constructing: false,
    constructionTimeLeft: 0,
    position: { x: 400, y: 280 },
    size: { width: 200, height: 120 },
    assignedSurvivors: [],
  },
  {
    id: generateId(),
    category: 'security',
    type: 'rally_flag',
    name: 'Rally Flag',
    level: 1,
    maxLevel: 5,
    health: 50,
    maxHealth: 50,
    constructing: false,
    constructionTimeLeft: 0,
    position: { x: 350, y: 420 },
    size: { width: 40, height: 40 },
    assignedSurvivors: [],
    securityBonus: 5,
  },
]

const initialResources: Record<ResourceType, number> = {
  metal: 100,
  wood: 100,
  cloth: 50,
  food: 75,
  water: 75,
  ammo: 50,
  fuel: 25,
}

const initialMaxResources: Record<ResourceType, number> = {
  metal: 200,
  wood: 200,
  cloth: 150,
  food: 150,
  water: 150,
  ammo: 100,
  fuel: 50,
}

export const useGameStore = create<GameState>((set, get) => ({
  resources: { ...initialResources },
  maxResources: { ...initialMaxResources },
  
  day: 1,
  time: 8,
  isNight: false,
  securityRating: 10,
  comfortRating: 5,
  compoundLevel: 1,
  
  survivors: [],
  leader: null,
  inventory: [],
  weapons: [createWeapon(1), createWeapon(1), createWeapon(1)],
  buildings: [...initialBuildings],
  availableMissions: [],
  activeMissions: [],
  zombieWaves: [],
  junkPiles: [
    { id: generateId(), position: { x: 200, y: 200 }, timeToRemove: 120 },
    { id: generateId(), position: { x: 550, y: 180 }, timeToRemove: 90 },
    { id: generateId(), position: { x: 180, y: 400 }, timeToRemove: 150 },
    { id: generateId(), position: { x: 600, y: 420 }, timeToRemove: 100 },
  ],
  
  gameStarted: false,
  gamePaused: false,
  gameOver: false,
  gameOverReason: '',
  
  selectedTab: 'compound',
  selectedSurvivor: null,
  selectedBuilding: null,
  notifications: [],
  combatLog: [],
  
  playerPosition: { x: 400, y: 350 },
  playerTargetPosition: null,
  playerMoving: false,
  playerDirection: 'down',
  
  startGame: () => {
    const leader = createSurvivor('You', true)
    const survivor1 = createSurvivor(survivorNames[Math.floor(Math.random() * survivorNames.length)])
    
    set({ 
      gameStarted: true, 
      gamePaused: false,
      leader,
      survivors: [leader, survivor1],
      availableMissions: [createMission(1), createMission(1), createMission(1)],
    })
    
    get().addNotification('Welcome to the Dead Zone. Survive.', 'info')
  },
  
  pauseGame: () => set({ gamePaused: true }),
  resumeGame: () => set({ gamePaused: false }),
  
  setPlayerTarget: (pos) => {
    set({ playerTargetPosition: pos, playerMoving: true })
  },
  
  updatePlayerPosition: () => {
    const state = get()
    if (!state.playerMoving || !state.playerTargetPosition) return

    const dx = state.playerTargetPosition.x - state.playerPosition.x
    const dy = state.playerTargetPosition.y - state.playerPosition.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < 3) {
      set({ 
        playerPosition: state.playerTargetPosition, 
        playerMoving: false, 
        playerTargetPosition: null 
      })
      return
    }

    const speed = 4
    const ratio = speed / distance
    const newDirection = Math.abs(dx) > Math.abs(dy) 
      ? (dx > 0 ? 'right' : 'left') 
      : (dy > 0 ? 'down' : 'up')

    set({
      playerPosition: {
        x: state.playerPosition.x + dx * ratio,
        y: state.playerPosition.y + dy * ratio,
      },
      playerDirection: newDirection as 'up' | 'down' | 'left' | 'right',
    })
  },
  
  tick: () => {
    const state = get()
    if (state.gamePaused || state.gameOver || !state.gameStarted) return

    // Update player movement
    get().updatePlayerPosition()

    // Time progression
    let newTime = state.time + 0.1
    let newDay = state.day
    
    if (newTime >= 24) {
      newTime = 0
      newDay += 1
      get().generateMissions()
    }
    
    const isNight = newTime >= 20 || newTime < 6

    // Resource consumption (per game tick, scaled)
    const survivorCount = state.survivors.filter(s => !s.injured).length
    const foodConsumption = survivorCount * 0.05
    const waterConsumption = survivorCount * 0.06

    const newResources = { ...state.resources }
    newResources.food = Math.max(0, newResources.food - foodConsumption)
    newResources.water = Math.max(0, newResources.water - waterConsumption)

    // Resource production from buildings
    state.buildings.forEach(building => {
      if (building.type === 'vegetable_garden' && building.productionRate) {
        newResources.food = Math.min(state.maxResources.food, newResources.food + building.productionRate * 0.01)
      }
      if (building.type === 'water_collector' && building.productionRate) {
        newResources.water = Math.min(state.maxResources.water, newResources.water + building.productionRate * 0.01)
      }
    })

    // Survivor updates
    const newSurvivors = state.survivors.map(survivor => {
      const newSurvivor = { ...survivor }
      
      // Heal over time if resting
      if (survivor.status === 'resting' && survivor.health < survivor.maxHealth) {
        newSurvivor.health = Math.min(survivor.maxHealth, survivor.health + 0.5)
      }
      
      // Injury recovery
      if (survivor.injured && survivor.injuryTimeLeft > 0) {
        newSurvivor.injuryTimeLeft = survivor.injuryTimeLeft - 1
        if (newSurvivor.injuryTimeLeft <= 0) {
          newSurvivor.injured = false
          newSurvivor.injuryType = null
          newSurvivor.status = 'idle'
          get().addNotification(`${survivor.name} has recovered from their injury.`, 'success')
        }
      }
      
      // Low morale from poor conditions
      if (newResources.food < 20 || newResources.water < 20) {
        newSurvivor.morale = Math.max(0, survivor.morale - 0.1)
      }
      
      // Health damage from starvation/dehydration
      if (newResources.food === 0) {
        newSurvivor.health = Math.max(0, survivor.health - 0.2)
      }
      if (newResources.water === 0) {
        newSurvivor.health = Math.max(0, survivor.health - 0.3)
      }
      
      return newSurvivor
    })

    // Update active missions
    const newActiveMissions = state.activeMissions.map(mission => {
      if (mission.status !== 'in_progress' && mission.status !== 'returning') return mission
      
      const newMission = { ...mission, timeLeft: mission.timeLeft - 1 }
      
      if (mission.status === 'in_progress' && newMission.timeLeft <= 0) {
        newMission.status = 'returning'
        newMission.timeLeft = mission.returnTime
        get().addNotification(`Mission to ${mission.location} complete. Survivors returning...`, 'info')
      }
      
      if (mission.status === 'returning' && newMission.timeLeft <= 0) {
        // Calculate mission success
        const assignedSurvivors = newSurvivors.filter(s => mission.assignedSurvivors.includes(s.id))
        const totalDPS = assignedSurvivors.reduce((sum, s) => {
          const weapon = s.equipped.offensive.weapon
          return sum + (weapon?.dps || 5) + s.skills.rangedCombat
        }, 0)
        
        const successChance = Math.min(95, 50 + (totalDPS / mission.zombieCount) * 10)
        const success = Math.random() * 100 < successChance
        
        if (success) {
          // Grant rewards
          Object.entries(mission.rewards.resources).forEach(([res, range]) => {
            if (range) {
              const amount = Math.floor(Math.random() * (range.max - range.min)) + range.min
              get().addResources({ [res as ResourceType]: amount })
            }
          })
          
          // Grant XP
          assignedSurvivors.forEach(s => {
            const newXP = s.xp + mission.rewards.xp
            const levelUp = newXP >= s.xpToNextLevel
            get().updateSurvivorState(s.id, { 
              xp: levelUp ? newXP - s.xpToNextLevel : newXP,
              level: levelUp ? s.level + 1 : s.level,
              xpToNextLevel: levelUp ? Math.floor(s.xpToNextLevel * 1.5) : s.xpToNextLevel,
              status: 'idle'
            })
            if (levelUp) {
              get().addNotification(`${s.name} leveled up to ${s.level + 1}!`, 'success')
            }
          })
          
          newMission.status = 'completed'
          get().addNotification(`Mission to ${mission.location} successful!`, 'success')
        } else {
          // Mission failed - survivors take injuries
          assignedSurvivors.forEach(s => {
            const damage = Math.floor(Math.random() * 40) + 20
            const injured = Math.random() < 0.5
            get().updateSurvivorState(s.id, {
              health: Math.max(1, s.health - damage),
              injured,
              injuryType: injured ? 'wound' : null,
              injuryTimeLeft: injured ? 300 : 0,
              status: injured ? 'injured' : 'idle'
            })
          })
          
          newMission.status = 'failed'
          get().addNotification(`Mission to ${mission.location} failed! Survivors wounded.`, 'danger')
        }
      }
      
      return newMission
    }).filter(m => m.status !== 'completed' && m.status !== 'failed')

    // Zombie horde spawning at night
    if (isNight && Math.random() < 0.01 && state.zombieWaves.length === 0) {
      const hordeSize = Math.floor(10 + state.day * 3 + Math.random() * 10)
      const angle = Math.random() * Math.PI * 2
      const horde: ZombieHorde = {
        id: generateId(),
        count: hordeSize,
        health: 20 + state.day * 2,
        damage: 5 + Math.floor(state.day * 0.5),
        timeUntilAttack: 60,
        status: 'approaching',
        position: {
          x: 400 + Math.cos(angle) * 350,
          y: 300 + Math.sin(angle) * 280,
        },
      }
      set(s => ({ zombieWaves: [...s.zombieWaves, horde] }))
      get().addNotification(`ALERT: Zombie horde detected! ${hordeSize} infected approaching!`, 'danger')
      get().addCombatLog(`Horde of ${hordeSize} zombies approaching from the ${angle < Math.PI ? 'south' : 'north'}`, 'event')
    }

    // Process hordes
    const newHordes = state.zombieWaves.map(horde => {
      if (horde.status === 'approaching') {
        const newTimeUntil = horde.timeUntilAttack - 1
        if (newTimeUntil <= 0) {
          get().addCombatLog('Zombies breaching the perimeter!', 'event')
          return { ...horde, timeUntilAttack: 0, status: 'attacking' as const }
        }
        return { ...horde, timeUntilAttack: newTimeUntil }
      }
      return horde
    })

    // Combat resolution
    const attackingHordes = newHordes.filter(h => h.status === 'attacking')
    let totalSecurityDamage = 0

    attackingHordes.forEach(horde => {
      const defenders = newSurvivors.filter(s => 
        s.status === 'defending' || (s.status === 'idle' && !s.injured)
      )
      
      // Defenders deal damage
      let zombiesKilled = 0
      defenders.forEach(defender => {
        const weapon = defender.equipped.defensive.weapon || defender.equipped.offensive.weapon
        const damage = (weapon?.dps || 5) + defender.skills.rangedCombat
        const kills = Math.floor(damage / horde.health)
        zombiesKilled += kills
      })
      
      horde.count = Math.max(0, horde.count - zombiesKilled)
      
      if (zombiesKilled > 0) {
        get().addCombatLog(`Eliminated ${zombiesKilled} infected!`, 'kill')
      }
      
      // Zombies deal damage to compound
      if (horde.count > 0) {
        totalSecurityDamage += horde.count * horde.damage * 0.05
        get().addCombatLog(`${horde.count} zombies attacking the barricades!`, 'damage')
      }
      
      if (horde.count <= 0) {
        horde.status = 'defeated'
        get().addNotification('Zombie horde eliminated!', 'success')
        get().addCombatLog('All hostiles eliminated. Area secure.', 'event')
        
        // XP reward for defenders
        defenders.forEach(d => {
          get().updateSurvivorState(d.id, { xp: d.xp + 50 })
        })
      }
    })

    // Apply security damage
    const newSecurityRating = Math.max(0, state.securityRating - totalSecurityDamage)
    
    // Game over check
    if (newSecurityRating <= 0 && attackingHordes.length > 0) {
      set({ gameOver: true, gameOverReason: 'The compound has been overrun by the infected.' })
      return
    }
    
    if (newSurvivors.filter(s => s.health > 0).length === 0) {
      set({ gameOver: true, gameOverReason: 'All survivors have perished.' })
      return
    }

    set({
      time: newTime,
      day: newDay,
      isNight,
      resources: newResources,
      survivors: newSurvivors,
      activeMissions: newActiveMissions,
      zombieWaves: newHordes.filter(h => h.status !== 'defeated'),
      securityRating: newSecurityRating,
    })
  },

  updateSurvivorState: (id: string, updates: Partial<Survivor>) => {
    set(state => ({
      survivors: state.survivors.map(s => s.id === id ? { ...s, ...updates } : s)
    }))
  },
  
  consumeResources: (resources) => {
    const state = get()
    const canConsume = Object.entries(resources).every(([key, value]) => {
      return state.resources[key as ResourceType] >= (value || 0)
    })
    
    if (!canConsume) return false
    
    const newResources = { ...state.resources }
    Object.entries(resources).forEach(([key, value]) => {
      newResources[key as ResourceType] -= value || 0
    })
    
    set({ resources: newResources })
    return true
  },
  
  addResources: (resources) => {
    const state = get()
    const newResources = { ...state.resources }
    Object.entries(resources).forEach(([key, value]) => {
      newResources[key as ResourceType] = Math.min(
        state.maxResources[key as ResourceType],
        newResources[key as ResourceType] + (value || 0)
      )
    })
    set({ resources: newResources })
  },
  
  selectSurvivor: (id) => set({ selectedSurvivor: id }),
  
  assignSurvivorClass: (id, survivorClass) => {
    const state = get()
    const survivor = state.survivors.find(s => s.id === id)
    if (!survivor || survivor.class === 'leader') return
    
    const bonuses = classSkillBonuses[survivorClass]
    const newSkills = { ...survivor.skills }
    Object.entries(bonuses).forEach(([skill, bonus]) => {
      newSkills[skill as keyof Skills] += bonus || 0
    })
    
    set({
      survivors: state.survivors.map(s => 
        s.id === id ? { ...s, class: survivorClass, skills: newSkills } : s
      )
    })
    
    get().addNotification(`${survivor.name} is now a ${survivorClass}.`, 'info')
  },
  
  equipWeapon: (survivorId, weaponId, loadout) => {
    const state = get()
    const weapon = state.weapons.find(w => w.id === weaponId)
    if (!weapon) return
    
    set({
      survivors: state.survivors.map(s => {
        if (s.id !== survivorId) return s
        return {
          ...s,
          equipped: {
            ...s.equipped,
            [loadout]: { ...s.equipped[loadout], weapon }
          }
        }
      })
    })
  },
  
  healSurvivor: (survivorId) => {
    const state = get()
    if (!state.consumeResources({ food: 5, water: 5 })) {
      get().addNotification('Not enough resources to heal.', 'warning')
      return
    }
    
    set({
      survivors: state.survivors.map(s => 
        s.id === survivorId 
          ? { ...s, health: Math.min(s.maxHealth, s.health + 30) }
          : s
      )
    })
  },

  moveSurvivor: (survivorId, position) => {
    set({
      survivors: get().survivors.map(s =>
        s.id === survivorId
          ? { ...s, targetPosition: position, isMoving: true }
          : s
      )
    })
  },
  
  assignToMission: (survivorId, missionId) => {
    const state = get()
    const mission = state.availableMissions.find(m => m.id === missionId)
    const survivor = state.survivors.find(s => s.id === survivorId)
    
    if (!mission || !survivor) return
    if (survivor.injured || survivor.status === 'mission') return
    if (mission.assignedSurvivors.length >= 5) return
    if (mission.assignedSurvivors.includes(survivorId)) return
    
    set({
      availableMissions: state.availableMissions.map(m =>
        m.id === missionId
          ? { ...m, assignedSurvivors: [...m.assignedSurvivors, survivorId] }
          : m
      )
    })
  },
  
  unassignFromMission: (survivorId, missionId) => {
    set({
      availableMissions: get().availableMissions.map(m =>
        m.id === missionId
          ? { ...m, assignedSurvivors: m.assignedSurvivors.filter(id => id !== survivorId) }
          : m
      )
    })
  },
  
  launchMission: (missionId, automated) => {
    const state = get()
    const mission = state.availableMissions.find(m => m.id === missionId)
    
    if (!mission || mission.assignedSurvivors.length === 0) {
      get().addNotification('Assign at least one survivor to the mission.', 'warning')
      return
    }
    
    // Check ammo
    if (!state.consumeResources({ ammo: mission.ammoRequired })) {
      get().addNotification('Not enough ammunition for this mission.', 'warning')
      return
    }
    
    const launchedMission: Mission = {
      ...mission,
      status: 'in_progress',
      timeLeft: automated ? Math.floor(mission.duration * 1.5) : mission.duration,
    }
    
    // Update survivor status
    set({
      survivors: state.survivors.map(s =>
        mission.assignedSurvivors.includes(s.id)
          ? { ...s, status: 'mission' }
          : s
      ),
      availableMissions: state.availableMissions.filter(m => m.id !== missionId),
      activeMissions: [...state.activeMissions, launchedMission],
    })
    
    get().addNotification(`Mission to ${mission.location} launched!`, 'info')
    get().addCombatLog(`Team deployed to ${mission.location}`, 'event')
  },
  
  generateMissions: () => {
    const state = get()
    if (state.availableMissions.length >= 6) return
    
    const newMissions = []
    const count = 6 - state.availableMissions.length
    
    for (let i = 0; i < count; i++) {
      newMissions.push(createMission(state.compoundLevel))
    }
    
    set({ availableMissions: [...state.availableMissions, ...newMissions] })
  },
  
  constructBuilding: (type, position) => {
    const state = get()
    
    const buildingCosts: Record<string, Partial<Record<ResourceType, number>>> = {
      small_barricade: { wood: 20, metal: 10 },
      large_barricade: { wood: 40, metal: 25 },
      watchtower: { wood: 50, metal: 30 },
      bed: { wood: 15, cloth: 20 },
      vegetable_garden: { wood: 30 },
      water_collector: { metal: 25, wood: 15 },
      metal_storage: { metal: 40, wood: 20 },
      food_storage: { wood: 35, metal: 15 },
    }
    
    const cost = buildingCosts[type]
    if (!cost || !state.consumeResources(cost)) {
      get().addNotification('Not enough resources to construct this building.', 'warning')
      return
    }
    
    const buildingData: Record<string, Partial<Building>> = {
      small_barricade: { category: 'security', name: 'Small Barricade', maxLevel: 5, securityBonus: 8 },
      large_barricade: { category: 'security', name: 'Large Barricade', maxLevel: 5, securityBonus: 15 },
      watchtower: { category: 'security', name: 'Watchtower', maxLevel: 5, securityBonus: 20 },
      bed: { category: 'comfort', name: 'Bed', maxLevel: 3, comfortBonus: 5 },
      vegetable_garden: { category: 'production', name: 'Vegetable Garden', maxLevel: 3, productionRate: 2 },
      water_collector: { category: 'production', name: 'Water Collector', maxLevel: 3, productionRate: 2 },
      metal_storage: { category: 'storage', name: 'Metal Storage', maxLevel: 3, storageCapacity: 100 },
      food_storage: { category: 'storage', name: 'Food Storage', maxLevel: 3, storageCapacity: 75 },
    }
    
    const data = buildingData[type]
    
    const newBuilding: Building = {
      id: generateId(),
      category: data?.category || 'general',
      type,
      name: data?.name || type,
      level: 1,
      maxLevel: data?.maxLevel || 5,
      health: 100,
      maxHealth: 100,
      constructing: true,
      constructionTimeLeft: 60,
      position,
      size: { width: 60, height: 60 },
      assignedSurvivors: [],
      securityBonus: data?.securityBonus,
      comfortBonus: data?.comfortBonus,
      productionRate: data?.productionRate,
      storageCapacity: data?.storageCapacity,
    }
    
    set({ buildings: [...state.buildings, newBuilding] })
    get().addNotification(`Constructing ${newBuilding.name}...`, 'info')
  },
  
  upgradeBuilding: (id) => {
    const state = get()
    const building = state.buildings.find(b => b.id === id)
    
    if (!building || building.level >= building.maxLevel) return
    
    const upgradeCost = {
      metal: building.level * 20,
      wood: building.level * 15,
    }
    
    if (!state.consumeResources(upgradeCost)) {
      get().addNotification('Not enough resources to upgrade.', 'warning')
      return
    }
    
    set({
      buildings: state.buildings.map(b =>
        b.id === id
          ? { ...b, level: b.level + 1, maxHealth: b.maxHealth + 20 }
          : b
      )
    })
    
    get().addNotification(`${building.name} upgraded to level ${building.level + 1}!`, 'success')
  },

  repairBuilding: (id) => {
    const state = get()
    const building = state.buildings.find(b => b.id === id)
    
    if (!building || building.health >= building.maxHealth) return
    
    const repairCost = Math.ceil((building.maxHealth - building.health) * 0.3)
    
    if (!state.consumeResources({ metal: repairCost })) {
      get().addNotification('Not enough metal to repair.', 'warning')
      return
    }
    
    set({
      buildings: state.buildings.map(b =>
        b.id === id
          ? { ...b, health: b.maxHealth }
          : b
      )
    })
    
    get().addNotification(`${building.name} repaired!`, 'success')
  },
  
  assignToBuilding: (survivorId, buildingId) => {
    const state = get()
    set({
      buildings: state.buildings.map(b =>
        b.id === buildingId
          ? { ...b, assignedSurvivors: [...b.assignedSurvivors, survivorId] }
          : b
      ),
      survivors: state.survivors.map(s =>
        s.id === survivorId
          ? { ...s, status: 'defending' }
          : s
      )
    })
  },
  
  defendCompound: () => {
    const state = get()
    const idleSurvivors = state.survivors.filter(s => s.status === 'idle' && !s.injured)
    
    set({
      survivors: state.survivors.map(s =>
        idleSurvivors.some(idle => idle.id === s.id)
          ? { ...s, status: 'defending' }
          : s
      )
    })
    
    get().addNotification(`${idleSurvivors.length} survivors assigned to defense.`, 'info')
  },
  
  setSelectedTab: (tab) => set({ selectedTab: tab }),
  
  addNotification: (message, type) => {
    const notification = { id: generateId(), message, type, timestamp: Date.now() }
    set(state => ({ notifications: [notification, ...state.notifications].slice(0, 10) }))
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      get().clearNotification(notification.id)
    }, 5000)
  },
  
  clearNotification: (id) => {
    set(state => ({ notifications: state.notifications.filter(n => n.id !== id) }))
  },
  
  addCombatLog: (message, type) => {
    const log = { id: generateId(), message, timestamp: Date.now(), type }
    set(state => ({ combatLog: [log, ...state.combatLog].slice(0, 50) }))
  },

  craftWeapon: (weaponType) => {
    const state = get()
    
    const craftCosts: Record<WeaponType, Partial<Record<ResourceType, number>>> = {
      melee: { metal: 15, wood: 10 },
      pistol: { metal: 30, ammo: 10 },
      rifle: { metal: 50, wood: 20, ammo: 15 },
      shotgun: { metal: 45, wood: 15, ammo: 20 },
      smg: { metal: 40, ammo: 25 },
      assault: { metal: 60, ammo: 30 },
    }
    
    const cost = craftCosts[weaponType]
    if (!cost || !state.consumeResources(cost)) {
      get().addNotification('Not enough resources to craft this weapon.', 'warning')
      return
    }
    
    const newWeapon = createWeapon(state.compoundLevel)
    newWeapon.type = weaponType
    
    // Adjust name based on type
    const weaponNames: Record<WeaponType, string[]> = {
      melee: ['Crafted Machete', 'Makeshift Axe', 'Reinforced Bat'],
      pistol: ['Crafted Pistol', 'Modified 9mm', 'Survivor Handgun'],
      rifle: ['Crafted Rifle', 'Modified Hunting Rifle', 'Survivor Rifle'],
      shotgun: ['Crafted Shotgun', 'Modified Pump', 'Survivor Shotgun'],
      smg: ['Crafted SMG', 'Modified UZI', 'Survivor SMG'],
      assault: ['Crafted AR', 'Modified M4', 'Survivor Assault'],
    }
    newWeapon.name = weaponNames[weaponType][Math.floor(Math.random() * weaponNames[weaponType].length)]
    
    set({ weapons: [...state.weapons, newWeapon] })
    get().addNotification(`Crafted ${newWeapon.name}!`, 'success')
  },

  recruitSurvivor: () => {
    const state = get()
    
    if (state.survivors.length >= 10) {
      get().addNotification('Compound is at maximum capacity (10 survivors).', 'warning')
      return
    }
    
    const recruitCost = { food: 50, water: 50 }
    if (!state.consumeResources(recruitCost)) {
      get().addNotification('Not enough food and water to recruit a survivor.', 'warning')
      return
    }
    
    // Get a name that's not already used
    const usedNames = state.survivors.map(s => s.name)
    const availableNames = survivorNames.filter(n => !usedNames.includes(n))
    const name = availableNames.length > 0 
      ? availableNames[Math.floor(Math.random() * availableNames.length)]
      : `Survivor ${state.survivors.length + 1}`
    
    const newSurvivor = createSurvivor(name)
    
    set({ survivors: [...state.survivors, newSurvivor] })
    get().addNotification(`${name} has joined your group!`, 'success')
  },

  scrapWeapon: (weaponId) => {
    const state = get()
    const weapon = state.weapons.find(w => w.id === weaponId)
    
    if (!weapon) return
    
    // Check if weapon is equipped
    const isEquipped = state.survivors.some(s => 
      s.equipped.offensive.weapon?.id === weaponId ||
      s.equipped.defensive.weapon?.id === weaponId
    )
    
    if (isEquipped) {
      get().addNotification('Cannot scrap an equipped weapon.', 'warning')
      return
    }
    
    // Calculate scrap value based on rarity
    const scrapValues: Record<string, number> = {
      common: 5,
      uncommon: 10,
      rare: 20,
      unique: 40,
    }
    
    const metalGain = scrapValues[weapon.rarity] * weapon.level
    
    set({
      weapons: state.weapons.filter(w => w.id !== weaponId),
    })
    get().addResources({ metal: metalGain })
    get().addNotification(`Scrapped ${weapon.name} for ${metalGain} metal.`, 'info')
  },
}))
