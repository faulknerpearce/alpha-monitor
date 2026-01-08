export const REGIONS = {
  northAmerica: { name: 'North America', coords: [-100, 45] },
  southAmerica: { name: 'South America', coords: [-60, -15] },
  europe: { name: 'Europe', coords: [10, 50] },
  middleEast: { name: 'Middle East', coords: [45, 30] },
  africa: { name: 'Africa', coords: [20, 5] },
  asia: { name: 'Asia', coords: [100, 35] },
  oceania: { name: 'Oceania', coords: [155, -25] }
}

export const HOTSPOTS = {}

// Intelligence Hotspots - Major world capitals and strategic locations
export const INTEL_HOTSPOTS = [
  {
    id: 'dc', name: 'DC', subtext: 'Pentagon Pizza Index', lat: 38.9, lon: -77.0,
    keywords: ['pentagon', 'white house', 'washington', 'us military', 'cia', 'nsa', 'trump'],
    description: 'US national security hub. Pentagon, CIA, NSA, State Dept. Monitor for late-night activity spikes.',
    agencies: ['Pentagon', 'CIA', 'NSA', 'State Dept'],
    status: 'Active monitoring'
  },
  {
    id: 'moscow', name: 'Moscow', subtext: 'Kremlin Activity', lat: 55.75, lon: 37.6,
    keywords: ['russia', 'putin', 'kremlin', 'moscow', 'russian'],
    description: 'Russian political and military command center. FSB, GRU, Presidential Administration.',
    agencies: ['FSB', 'GRU', 'SVR', 'Kremlin'],
    status: 'High activity'
  },
  {
    id: 'beijing', name: 'Beijing', subtext: 'PLA/MSS Activity', lat: 39.9, lon: 116.4,
    keywords: ['china', 'beijing', 'chinese', 'xi jinping', 'taiwan strait', 'pla'],
    description: 'Chinese Communist Party headquarters. PLA command, MSS intelligence operations.',
    agencies: ['PLA', 'MSS', 'CCP Politburo'],
    status: 'Elevated posture'
  },
  {
    id: 'kyiv', name: 'Kyiv', subtext: 'Conflict Zone', lat: 50.45, lon: 30.5,
    keywords: ['ukraine', 'kyiv', 'zelensky', 'ukrainian', 'donbas', 'crimea'],
    description: 'Ukrainian capital under wartime conditions. Government, military coordination center.',
    agencies: ['SBU', 'GUR', 'Armed Forces'],
    status: 'Active conflict'
  },
  {
    id: 'taipei', name: 'Taipei', subtext: 'Strait Watch', lat: 25.03, lon: 121.5,
    keywords: ['taiwan', 'taipei', 'taiwanese', 'strait'],
    description: 'Taiwan government and military HQ. ADIZ violations and PLA exercises tracked.',
    agencies: ['NSB', 'MND', 'AIT'],
    status: 'Heightened alert'
  },
  {
    id: 'tehran', name: 'Tehran', subtext: 'IRGC Activity', lat: 35.7, lon: 51.4,
    keywords: ['iran', 'tehran', 'iranian', 'irgc', 'hezbollah', 'nuclear'],
    description: 'Iranian regime center. IRGC Quds Force, nuclear program oversight, proxy coordination.',
    agencies: ['IRGC', 'MOIS', 'AEOI'],
    status: 'Proxy operations active'
  },
  {
    id: 'telaviv', name: 'Tel Aviv', subtext: 'Mossad/IDF', lat: 32.07, lon: 34.78,
    keywords: ['israel', 'israeli', 'gaza', 'hamas', 'idf', 'netanyahu', 'mossad'],
    description: 'Israeli security apparatus. IDF operations, Mossad intel, Shin Bet domestic security.',
    agencies: ['Mossad', 'IDF', 'Shin Bet', 'Aman'],
    status: 'Active operations'
  },
  {
    id: 'pyongyang', name: 'Pyongyang', subtext: 'DPRK Watch', lat: 39.03, lon: 125.75,
    keywords: ['north korea', 'kim jong', 'pyongyang', 'dprk', 'korean missile'],
    description: 'North Korean leadership compound. Nuclear/missile program, regime stability indicators.',
    agencies: ['RGB', 'KPA', 'SSD'],
    status: 'Missile tests ongoing'
  },
  {
    id: 'london', name: 'London', subtext: 'GCHQ/MI6', lat: 51.5, lon: -0.12,
    keywords: ['uk', 'britain', 'british', 'mi6', 'gchq', 'london'],
    description: 'UK intelligence community hub. Five Eyes partner, SIGINT, foreign intelligence.',
    agencies: ['MI6', 'GCHQ', 'MI5'],
    status: 'Normal operations'
  },
  {
    id: 'brussels', name: 'Brussels', subtext: 'NATO HQ', lat: 50.85, lon: 4.35,
    keywords: ['nato', 'eu', 'european union', 'brussels'],
    description: 'NATO headquarters and EU institutions. Alliance coordination, Article 5 readiness.',
    agencies: ['NATO', 'EU Commission', 'EEAS'],
    status: 'Enhanced readiness'
  },
  {
    id: 'caracas', name: 'Caracas', subtext: 'Venezuela Intervention', lat: 10.5, lon: -66.9,
    keywords: ['venezuela', 'maduro', 'caracas', 'venezuelan', 'pdvsa', 'us intervention'],
    description: 'Site of recent US military operation capturing Maduro. Interim government, oil redirection, international condemnation.',
    agencies: ['SEBIN', 'DGCIM', 'GNB'],
    status: 'US-controlled transition'
  },
  {
    id: 'nuuk', name: 'Nuuk', subtext: 'Arctic Dispute', lat: 64.18, lon: -51.7,
    keywords: ['greenland', 'denmark', 'arctic', 'nuuk', 'thule', 'rare earth'],
    description: 'Arctic strategic territory. US military presence, rare earth minerals, sovereignty questions.',
    agencies: ['Danish Defence', 'US Space Force', 'Arctic Council'],
    status: 'Diplomatic tensions'
  }
]

// US Major Cities for domestic view
export const US_CITIES = [
  // Capital
  {
    id: 'dc', name: 'Washington D.C.', state: 'DC', lat: 38.9072, lon: -77.0369,
    type: 'capital', population: '700K',
    keywords: ['washington', 'capitol', 'congress', 'white house', 'pentagon', 'dc', 'biden', 'trump'],
    description: 'Federal government center. White House, Capitol Hill, Pentagon, and major federal agencies.',
    sectors: ['Government', 'Defense', 'Policy']
  },
  // Major metros
  {
    id: 'nyc', name: 'New York City', state: 'NY', lat: 40.7128, lon: -74.0060,
    type: 'major', population: '8.3M',
    keywords: ['new york', 'nyc', 'manhattan', 'wall street', 'broadway', 'brooklyn'],
    description: 'Financial capital. Wall Street, major media headquarters, UN headquarters.',
    sectors: ['Finance', 'Media', 'Tech']
  },
  {
    id: 'la', name: 'Los Angeles', state: 'CA', lat: 34.0522, lon: -118.2437,
    type: 'major', population: '3.9M',
    keywords: ['los angeles', 'la', 'hollywood', 'california', 'socal'],
    description: 'Entertainment industry hub. Major port, aerospace, and tech presence.',
    sectors: ['Entertainment', 'Tech', 'Aerospace']
  },
  {
    id: 'chicago', name: 'Chicago', state: 'IL', lat: 41.8781, lon: -87.6298,
    type: 'major', population: '2.7M',
    keywords: ['chicago', 'illinois', 'midwest'],
    description: 'Midwest economic hub. Commodities trading, transportation logistics.',
    sectors: ['Finance', 'Logistics', 'Manufacturing']
  },
  {
    id: 'houston', name: 'Houston', state: 'TX', lat: 29.7604, lon: -95.3698,
    type: 'major', population: '2.3M',
    keywords: ['houston', 'texas', 'energy', 'oil', 'nasa'],
    description: 'Energy capital. Oil & gas headquarters, NASA Johnson Space Center.',
    sectors: ['Energy', 'Aerospace', 'Healthcare']
  },
  {
    id: 'sf', name: 'San Francisco', state: 'CA', lat: 37.7749, lon: -122.4194,
    type: 'major', population: '870K',
    keywords: ['san francisco', 'sf', 'bay area', 'silicon valley', 'tech'],
    description: 'Tech industry epicenter. Venture capital, startups, major tech HQs.',
    sectors: ['Tech', 'Finance', 'Biotech']
  },
  {
    id: 'seattle', name: 'Seattle', state: 'WA', lat: 47.6062, lon: -122.3321,
    type: 'major', population: '750K',
    keywords: ['seattle', 'washington', 'amazon', 'microsoft', 'boeing'],
    description: 'Pacific Northwest tech hub. Amazon, Microsoft, Boeing headquarters.',
    sectors: ['Tech', 'Aerospace', 'E-commerce']
  },
  {
    id: 'miami', name: 'Miami', state: 'FL', lat: 25.7617, lon: -80.1918,
    type: 'major', population: '450K',
    keywords: ['miami', 'florida', 'latin america', 'caribbean'],
    description: 'Gateway to Latin America. Finance, real estate, tourism hub.',
    sectors: ['Finance', 'Real Estate', 'Tourism']
  },
  {
    id: 'atlanta', name: 'Atlanta', state: 'GA', lat: 33.7490, lon: -84.3880,
    type: 'major', population: '500K',
    keywords: ['atlanta', 'georgia', 'cdc', 'delta'],
    description: 'Southeast economic center. CDC headquarters, major logistics hub.',
    sectors: ['Logistics', 'Healthcare', 'Media']
  },
  {
    id: 'boston', name: 'Boston', state: 'MA', lat: 42.3601, lon: -71.0589,
    type: 'major', population: '680K',
    keywords: ['boston', 'massachusetts', 'harvard', 'mit', 'biotech'],
    description: 'Education and biotech hub. Harvard, MIT, major hospitals.',
    sectors: ['Education', 'Biotech', 'Finance']
  },
  {
    id: 'denver', name: 'Denver', state: 'CO', lat: 39.7392, lon: -104.9903,
    type: 'regional', population: '720K',
    keywords: ['denver', 'colorado', 'aerospace'],
    description: 'Mountain West hub. Aerospace, tech growth, federal facilities.',
    sectors: ['Aerospace', 'Tech', 'Energy']
  },
  {
    id: 'phoenix', name: 'Phoenix', state: 'AZ', lat: 33.4484, lon: -112.0740,
    type: 'regional', population: '1.6M',
    keywords: ['phoenix', 'arizona', 'semiconductor', 'tsmc'],
    description: 'Fast-growing Sun Belt metro. Semiconductor manufacturing expansion.',
    sectors: ['Manufacturing', 'Tech', 'Real Estate']
  },
  {
    id: 'austin', name: 'Austin', state: 'TX', lat: 30.2672, lon: -97.7431,
    type: 'regional', population: '1M',
    keywords: ['austin', 'texas', 'tesla', 'tech'],
    description: 'Texas tech hub. Tesla, Samsung, major tech company expansions.',
    sectors: ['Tech', 'Manufacturing', 'Entertainment']
  },
  {
    id: 'detroit', name: 'Detroit', state: 'MI', lat: 42.3314, lon: -83.0458,
    type: 'regional', population: '640K',
    keywords: ['detroit', 'michigan', 'auto', 'ev', 'ford', 'gm'],
    description: 'Auto industry center. EV transition, manufacturing renaissance.',
    sectors: ['Auto', 'Manufacturing', 'Tech']
  },
  {
    id: 'vegas', name: 'Las Vegas', state: 'NV', lat: 36.1699, lon: -115.1398,
    type: 'regional', population: '650K',
    keywords: ['las vegas', 'vegas', 'nevada', 'gaming'],
    description: 'Entertainment and convention hub. Growing tech presence.',
    sectors: ['Tourism', 'Entertainment', 'Tech']
  },
  // Strategic locations
  {
    id: 'norfolk', name: 'Norfolk', state: 'VA', lat: 36.8508, lon: -76.2859,
    type: 'military', population: '245K',
    keywords: ['norfolk', 'navy', 'naval', 'fleet'],
    description: 'Largest naval base in world. Atlantic Fleet headquarters.',
    sectors: ['Military', 'Defense', 'Shipbuilding']
  },
  {
    id: 'sandiego', name: 'San Diego', state: 'CA', lat: 32.7157, lon: -117.1611,
    type: 'military', population: '1.4M',
    keywords: ['san diego', 'navy', 'pacific fleet', 'border'],
    description: 'Major military hub. Pacific Fleet, border region.',
    sectors: ['Military', 'Biotech', 'Tourism']
  }
]

export const US_HOTSPOTS = [
  {
    id: 'venezuela-intervention',
    name: 'Venezuela US Intervention',
    location: 'Washington DC / Caracas',
    lat: 38.9072,
    lon: -77.0369,
    level: 'high',
    category: 'Foreign Policy Crisis',
    description: 'US military operation captured Maduro; oil redirection, international condemnation, potential for further strikes.',
    keywords: ['venezuela', 'maduro', 'trump', 'us intervention', 'oil', 'caracas'],
    startDate: '2026-01',
    status: 'Ongoing Crisis',
    icon: '🚨'
  },
  {
    id: 'la-wildfires-recovery',
    name: 'LA Wildfires One-Year Recovery',
    location: 'Los Angeles, CA',
    lat: 34.0522,
    lon: -118.2437,
    level: 'elevated',
    category: 'Disaster Recovery',
    description: 'One year after devastating 2025 wildfires; ongoing rebuilding, insurance disputes, community efforts.',
    keywords: ['california', 'wildfire', 'los angeles', 'recovery', 'palisades', 'eaton', 'altadena'],
    startDate: '2025',
    status: 'Long-term Recovery',
    icon: '🔥'
  },
  {
    id: 'border-enforcement',
    name: 'Enhanced Border Enforcement',
    location: 'El Paso, TX',
    lat: 31.7619,
    lon: -106.4850,
    level: 'high',
    category: 'Immigration Policy',
    description: 'Record-low crossings under new policies; expanded travel bans, deportations, biometric screening.',
    keywords: ['border', 'immigration', 'travel ban', 'deportation', 'cbp', 'ice'],
    startDate: '2025',
    status: 'Intensified Enforcement',
    icon: '🚨'
  },
  {
    id: 'ai-regulation',
    name: 'AI Regulation Conflicts',
    location: 'San Francisco, CA',
    lat: 37.7749,
    lon: -122.4194,
    level: 'high',
    category: 'Technology Policy',
    description: 'New state AI laws effective amid federal challenges; debates over safety, transparency, companion chatbots.',
    keywords: ['ai regulation', 'artificial intelligence', 'california', 'tech policy', 'frontier ai'],
    startDate: '2026',
    status: 'Regulatory Battle',
    icon: '🤖'
  }
]

export const SHIPPING_CHOKEPOINTS = [
  {
    id: 'suez',
    name: 'Suez Canal',
    lat: 30.45,
    lon: 32.35,
    keywords: ['suez', 'red sea', 'houthi', 'canal'],
    desc: 'Critical waterway. ~12% of global trade. Traffic remains ~60% below pre-crisis levels despite end to Houthi attacks.',
    traffic: '~20-30 ships/day (reduced)',
    region: 'Egypt'
  },
  {
    id: 'panama',
    name: 'Panama Canal',
    lat: 9.1,
    lon: -79.7,
    keywords: ['panama canal', 'panama'],
    desc: 'Links Atlantic and Pacific oceans. ~5% of global trade. Facing drought-related capacity restrictions.',
    traffic: '~40 ships/day',
    region: 'Panama'
  },
  {
    id: 'hormuz',
    name: 'Strait of Hormuz',
    lat: 26.5,
    lon: 56.3,
    keywords: ['hormuz', 'strait of hormuz', 'persian gulf'],
    desc: 'Only sea route from Persian Gulf to open ocean. ~21% of global oil passes through daily.',
    traffic: '~20 tankers/day',
    region: 'Iran/Oman'
  },
  {
    id: 'malacca',
    name: 'Malacca Strait',
    lat: 2.5,
    lon: 101.5,
    keywords: ['malacca', 'singapore strait'],
    desc: 'Main shipping route between Indian and Pacific oceans. ~25% of global trade including ~25% of oil.',
    traffic: '~80 ships/day',
    region: 'Malaysia/Singapore'
  },
  {
    id: 'bosphorus',
    name: 'Bosphorus Strait',
    lat: 41.1,
    lon: 29.0,
    keywords: ['bosphorus', 'black sea', 'turkish strait'],
    desc: 'Only route between Black Sea and Mediterranean. Critical for Russian/Ukrainian grain exports.',
    traffic: '~45 ships/day',
    region: 'Turkey'
  }
]

export const CONFLICT_ZONES = [
  {
      id: 'ukraine',
      name: 'Ukraine Conflict',
      intensity: 'high',
      coords: [
          [37.5, 47.0], [38.5, 47.5], [39.0, 48.5], [38.0, 49.5],
          [37.0, 49.0], [36.0, 48.5], [35.5, 47.5], [36.5, 47.0]
      ],
      labelPos: { lat: 48.0, lon: 37.5 },
      startDate: 'Feb 24, 2022',
      parties: ['Russia', 'Ukraine', 'NATO (support)'],
      casualties: 'High ongoing',
      displaced: 'Millions',
      description: 'Ongoing Russian invasion with advances in east; heavy strikes on infrastructure.',
      keyEvents: ['Pokrovsk battles', 'Drone warfare', 'Energy attacks'],
      keywords: ['ukraine', 'russia', 'zelensky', 'putin', 'donbas', 'crimea']
  },
  {
      id: 'gaza',
      name: 'Gaza Conflict',
      intensity: 'high',
      coords: [
          [34.2, 31.6], [34.6, 31.6], [34.6, 31.2], [34.2, 31.2]
      ],
      labelPos: { lat: 31.4, lon: 34.4 },
      startDate: 'Oct 7, 2023',
      parties: ['Israel (IDF)', 'Hamas'],
      casualties: '73,000+',
      displaced: 'Near total population',
      description: 'Ceasefire with ongoing violations; Israeli control expansion, aid restrictions, humanitarian crisis.',
      keyEvents: ['Ceasefire Oct 2025', 'Violations', 'Aid blocks'],
      keywords: ['gaza', 'israel', 'hamas', 'idf', 'netanyahu', 'ceasefire']
  },
  {
      id: 'sudan',
      name: 'Sudan Civil War',
      intensity: 'medium',
      coords: [
          [32.0, 16.0], [34.0, 16.5], [35.0, 15.0], [33.5, 13.5],
          [31.5, 14.0], [31.0, 15.5]
      ],
      labelPos: { lat: 15.0, lon: 32.5 },
      startDate: 'Apr 15, 2023',
      parties: ['Sudanese Armed Forces (SAF)', 'Rapid Support Forces (RSF)'],
      casualties: 'Tens of thousands',
      displaced: '10M+',
      description: 'Escalating violence in Darfur/Kordofan; famine, drone strikes on civilians.',
      keyEvents: ['El Fasher siege', 'Famine persistence'],
      keywords: ['sudan', 'khartoum', 'rsf', 'darfur', 'burhan', 'hemedti']
  },
  {
      id: 'myanmar',
      name: 'Myanmar Civil War',
      intensity: 'medium',
      coords: [
          [96.0, 22.0], [98.0, 23.0], [98.5, 21.0], [97.0, 19.5], [95.5, 20.5]
      ],
      labelPos: { lat: 21.0, lon: 96.5 },
      startDate: 'Feb 1, 2021',
      parties: ['Military Junta', 'Ethnic Armed Organizations', 'Resistance Forces'],
      casualties: '90,000+',
      displaced: '3.5M+',
      description: 'Junta elections amid ongoing fighting; resistance controls significant territory.',
      keyEvents: ['Phased elections 2025-2026', 'Territorial gains'],
      keywords: ['myanmar', 'burma', 'junta', 'arakan', 'karen', 'kachin']
  },
  {
      id: 'taiwan_strait',
      name: 'Taiwan Strait',
      intensity: 'watch',
      coords: [
          [119.0, 26.0], [121.5, 26.0], [121.5, 22.5], [119.0, 22.5]
      ],
      labelPos: { lat: 24.5, lon: 120.0 },
      startDate: 'Ongoing tensions',
      parties: ['China (PLA)', 'Taiwan (ROC)', 'United States'],
      casualties: 'N/A',
      displaced: 'N/A',
      description: 'Heightened PLA activity; risk of escalation.',
      keyEvents: ['Exercises', 'Incursions'],
      keywords: ['taiwan', 'china', 'strait', 'pla', 'invasion']
  }
]

export const MILITARY_BASES = [
  { id: 'ramstein', name: 'Ramstein AB', lat: 49.44, lon: 7.6, type: 'us-nato' },
  { id: 'diego_garcia', name: 'Diego Garcia', lat: -7.32, lon: 72.42, type: 'us-nato' },
  { id: 'guam', name: 'Andersen AFB', lat: 13.58, lon: 144.92, type: 'us-nato' },
  { id: 'okinawa', name: 'Kadena AB', lat: 26.35, lon: 127.77, type: 'us-nato' },
  { id: 'yokosuka', name: 'Yokosuka', lat: 35.28, lon: 139.67, type: 'us-nato' },
  { id: 'bahrain', name: 'NSA Bahrain', lat: 26.23, lon: 50.65, type: 'us-nato' },
  { id: 'qatar', name: 'Al Udeid', lat: 25.12, lon: 51.31, type: 'us-nato' },
  { id: 'djibouti', name: 'Camp Lemonnier', lat: 11.55, lon: 43.15, type: 'us-nato' },
  { id: 'incirlik', name: 'Incirlik AB', lat: 37.0, lon: 35.43, type: 'us-nato' },
  { id: 'rota', name: 'NS Rota', lat: 36.62, lon: -6.35, type: 'us-nato' },
  { id: 'djibouti_cn', name: 'PLA Djibouti', lat: 11.59, lon: 43.05, type: 'china' },
  { id: 'woody_island', name: 'Woody Island', lat: 16.83, lon: 112.33, type: 'china' },
  { id: 'fiery_cross', name: 'Fiery Cross', lat: 9.55, lon: 112.89, type: 'china' },
  { id: 'mischief_reef', name: 'Mischief Reef', lat: 9.90, lon: 115.53, type: 'china' },
  { id: 'ream', name: 'Ream (Cambodia)', lat: 10.52, lon: 103.63, type: 'china' },
  { id: 'kaliningrad', name: 'Kaliningrad', lat: 54.71, lon: 20.51, type: 'russia' },
  { id: 'sevastopol', name: 'Sevastopol', lat: 44.62, lon: 33.53, type: 'russia' },
  { id: 'tartus', name: 'Tartus (Syria)', lat: 34.89, lon: 35.87, type: 'russia' },
  { id: 'hmeimim', name: 'Hmeimim AB', lat: 35.41, lon: 35.95, type: 'russia' },
  { id: 'cam_ranh', name: 'Cam Ranh', lat: 11.99, lon: 109.22, type: 'russia' }
]

export const NUCLEAR_FACILITIES = [
  { id: 'zaporizhzhia', name: 'Zaporizhzhia NPP', lat: 47.51, lon: 34.58, type: 'plant', status: 'contested' },
  { id: 'fukushima', name: 'Fukushima', lat: 37.42, lon: 141.03, type: 'plant', status: 'decommissioning' },
  { id: 'flamanville', name: 'Flamanville', lat: 49.54, lon: -1.88, type: 'plant', status: 'active' },
  { id: 'bruce', name: 'Bruce Power', lat: 44.33, lon: -81.60, type: 'plant', status: 'active' },
  { id: 'natanz', name: 'Natanz', lat: 33.72, lon: 51.73, type: 'enrichment', status: 'active' },
  { id: 'fordow', name: 'Fordow', lat: 34.88, lon: 51.0, type: 'enrichment', status: 'active' },
  { id: 'yongbyon', name: 'Yongbyon', lat: 39.80, lon: 125.75, type: 'weapons', status: 'active' },
  { id: 'dimona', name: 'Dimona', lat: 31.0, lon: 35.15, type: 'weapons', status: 'active' },
  { id: 'los_alamos', name: 'Los Alamos', lat: 35.88, lon: -106.30, type: 'weapons', status: 'active' },
  { id: 'sellafield', name: 'Sellafield', lat: 54.42, lon: -3.50, type: 'reprocessing', status: 'active' },
  { id: 'la_hague', name: 'La Hague', lat: 49.68, lon: -1.88, type: 'reprocessing', status: 'active' }
]

export const UNDERSEA_CABLES = [
  {
      id: 'transatlantic_1',
      name: 'Transatlantic (TAT-14)',
      major: true,
      points: [[-74.0, 40.7], [-30.0, 45.0], [-9.0, 52.0]]
  },
  {
      id: 'transpacific_1',
      name: 'Transpacific (Unity)',
      major: true,
      points: [[-122.4, 37.8], [-155.0, 25.0], [139.7, 35.7]]
  },
  {
      id: 'sea_me_we_5',
      name: 'SEA-ME-WE 5',
      major: true,
      points: [[103.8, 1.3], [80.0, 10.0], [55.0, 25.0], [35.0, 30.0], [12.0, 37.0], [-5.0, 36.0]]
  },
  {
      id: 'aae1',
      name: 'Asia-Africa-Europe 1',
      major: true,
      points: [[121.0, 25.0], [103.8, 1.3], [73.0, 15.0], [44.0, 12.0], [35.0, 30.0], [28.0, 41.0]]
  },
  {
      id: 'curie',
      name: 'Curie (Google)',
      major: false,
      points: [[-122.4, 37.8], [-80.0, 0.0], [-70.0, -33.0]]
  },
  {
      id: 'marea',
      name: 'MAREA (Microsoft)',
      major: true,
      points: [[-73.8, 39.4], [-9.0, 37.0]]
  }
]

export const CYBER_REGIONS = [
  {
      id: 'cyber_russia',
      name: 'RU',
      fullName: 'Russia',
      lat: 55.75,
      lon: 45.0,
      group: 'APT28/29',
      aka: 'Fancy Bear / Cozy Bear',
      sponsor: 'GRU / FSB',
      desc: 'State-sponsored groups linked to Russian intelligence. Known for election interference, government espionage, and critical infrastructure attacks.',
      targets: ['Government', 'Defense', 'Energy', 'Elections', 'Media']
  },
  {
      id: 'cyber_china',
      name: 'CN',
      fullName: 'China',
      lat: 35.0,
      lon: 105.0,
      group: 'APT41',
      aka: 'Double Dragon / Winnti',
      sponsor: 'MSS',
      desc: 'Hybrid espionage and financially motivated group. Conducts state-sponsored intelligence and supply chain attacks.',
      targets: ['Tech', 'Telecom', 'Healthcare', 'Gaming', 'Supply Chain']
  },
  {
      id: 'cyber_nk',
      name: 'NK',
      fullName: 'North Korea',
      lat: 39.0,
      lon: 127.0,
      group: 'Lazarus',
      aka: 'Hidden Cobra / APT38',
      sponsor: 'RGB',
      desc: 'Financially motivated attacks to fund regime. Known for cryptocurrency theft, SWIFT banking attacks, and ransomware.',
      targets: ['Crypto', 'Banks', 'Defense', 'Media', 'Critical Infra']
  },
  {
      id: 'cyber_iran',
      name: 'IR',
      fullName: 'Iran',
      lat: 32.0,
      lon: 53.0,
      group: 'APT33/35',
      aka: 'Charming Kitten / Elfin',
      sponsor: 'IRGC',
      desc: 'Focus on regional adversaries and dissidents. Known for destructive wiper malware and spear-phishing campaigns.',
      targets: ['Energy', 'Aviation', 'Government', 'Dissidents', 'Israel']
  }
]
