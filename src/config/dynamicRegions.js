// Dynamic regions that should be updated periodically
// These are markers that can change based on current events

export const HOTSPOTS = {
  'gaza-conflict': {
    id: 'gaza-conflict',
    name: 'Gaza Conflict',
    location: 'Gaza Strip',
    lat: 31.3547,
    lon: 34.3088,
    severity: 'high',
    category: 'Armed Conflict',
    description: 'Ongoing Israel-Hamas conflict. Humanitarian crisis, ceasefire negotiations, hostage situation, and military operations.',
    keywords: ['gaza', 'hamas', 'israel', 'hostage', 'ceasefire', 'rafah', 'humanitarian', 'netanyahu'],
    startDate: 'Oct 2023',
    status: 'Active Conflict',
    icon: '💥'
  },
  'iran-tensions': {
    id: 'iran-tensions',
    name: 'Iran Nuclear & Regional',
    location: 'Tehran, Iran',
    lat: 35.6892,
    lon: 51.3890,
    severity: 'high',
    category: 'Geopolitical',
    description: 'Nuclear program concerns, regional proxy conflicts, sanctions, and diplomatic tensions with Western powers.',
    keywords: ['iran', 'tehran', 'nuclear', 'irgc', 'sanctions', 'khamenei', 'enrichment', 'proxy'],
    startDate: 'Ongoing',
    status: 'Elevated Tensions',
    icon: '☢'
  },
  'yemen-houthis': {
    id: 'yemen-houthis',
    name: 'Yemen & Houthi Attacks',
    location: 'Sanaa, Yemen',
    lat: 15.3694,
    lon: 44.1910,
    severity: 'high',
    category: 'Armed Conflict',
    description: 'Houthi attacks on Red Sea shipping, ongoing civil war, and humanitarian catastrophe. US/UK military strikes.',
    keywords: ['yemen', 'houthi', 'red sea', 'shipping', 'sanaa', 'aden', 'saudi', 'bab el-mandeb'],
    startDate: '2014',
    status: 'Active Conflict',
    icon: '⚔'
  }
}

// Intelligence Hotspots - Major world capitals and strategic locations
export const INTEL_HOTSPOTS = [
  {
    id: 'dc', name: 'DC', subtext: 'US National Security Hub', lat: 38.9072, lon: -77.0369,
    keywords: ['pentagon', 'white house', 'washington', 'd.c.', 'us military', 'cia', 'nsa', 'trump', 'biden', 'us', 'america', 'united states', 'federal', 'government', 'congress', 'senate', 'house of representatives'],
    description: 'US national security and political center. Monitor for domestic and international developments affecting American interests.',
    agencies: ['Pentagon', 'CIA', 'NSA', 'State Dept', 'White House', 'Congress'],
    status: 'Active monitoring'
  },
  {
    id: 'moscow', name: 'Moscow', subtext: 'Kremlin Activity', lat: 55.7558, lon: 37.6173,
    keywords: ['russia', 'putin', 'kremlin', 'moscow', 'russian'],
    description: 'Russian political and military command center. FSB, GRU, Presidential Administration.',
    agencies: ['FSB', 'GRU', 'SVR', 'Kremlin'],
    status: 'High activity'
  },
  {
    id: 'beijing', name: 'Beijing', subtext: 'PLA/MSS Activity', lat: 39.9042, lon: 116.4074,
    keywords: ['china', 'beijing', 'chinese', 'xi jinping', 'taiwan strait', 'pla'],
    description: 'Chinese Communist Party headquarters. PLA command, MSS intelligence operations.',
    agencies: ['PLA', 'MSS', 'CCP Politburo'],
    status: 'Elevated posture'
  },
  {
    id: 'kyiv', name: 'Kyiv', subtext: 'Conflict Zone', lat: 50.4501, lon: 30.5234,
    keywords: ['ukraine', 'kyiv', 'zelensky', 'ukrainian', 'donbas', 'crimea'],
    description: 'Ukrainian capital under wartime conditions. Government, military coordination center.',
    agencies: ['SBU', 'GUR', 'Armed Forces'],
    status: 'Active conflict'
  },
  {
    id: 'taipei', name: 'Taipei', subtext: 'Strait Watch', lat: 25.0330, lon: 121.5654,
    keywords: ['taiwan', 'taipei', 'taiwanese', 'strait'],
    description: 'Taiwan government and military HQ. ADIZ violations and PLA exercises tracked.',
    agencies: ['NSB', 'MND', 'AIT'],
    status: 'Heightened alert'
  },
  {
    id: 'tehran', name: 'Tehran', subtext: 'IRGC Activity', lat: 35.6892, lon: 51.3890,
    keywords: ['iran', 'tehran', 'iranian', 'irgc', 'hezbollah', 'nuclear'],
    description: 'Iranian regime center. IRGC Quds Force, nuclear program oversight, proxy coordination.',
    agencies: ['IRGC', 'MOIS', 'AEOI'],
    status: 'Proxy operations active'
  },
  {
    id: 'telaviv', name: 'Tel Aviv', subtext: 'Mossad/IDF', lat: 32.0853, lon: 34.7818,
    keywords: ['israel', 'israeli', 'gaza', 'hamas', 'idf', 'netanyahu', 'mossad'],
    description: 'Israeli security apparatus. IDF operations, Mossad intel, Shin Bet domestic security.',
    agencies: ['Mossad', 'IDF', 'Shin Bet', 'Aman'],
    status: 'Active operations'
  },
  {
    id: 'pyongyang', name: 'Pyongyang', subtext: 'DPRK Watch', lat: 39.0392, lon: 125.7625,
    keywords: ['north korea', 'kim jong', 'pyongyang', 'dprk', 'korean missile'],
    description: 'North Korean leadership compound. Nuclear/missile program, regime stability indicators.',
    agencies: ['RGB', 'KPA', 'SSD'],
    status: 'Missile tests ongoing'
  },
  {
    id: 'london', name: 'London', subtext: 'GCHQ/MI6', lat: 51.5074, lon: -0.1278,
    keywords: ['uk', 'britain', 'british', 'mi6', 'gchq', 'london'],
    description: 'UK intelligence community hub. Five Eyes partner, SIGINT, foreign intelligence.',
    agencies: ['MI6', 'GCHQ', 'MI5'],
    status: 'Normal operations'
  },
  {
    id: 'brussels', name: 'Brussels', subtext: 'NATO HQ', lat: 50.8503, lon: 4.3517,
    keywords: ['nato', 'eu', 'european union', 'brussels'],
    description: 'NATO headquarters and EU institutions. Alliance coordination, Article 5 readiness.',
    agencies: ['NATO', 'EU Commission', 'EEAS'],
    status: 'Enhanced readiness'
  },
  {
    id: 'caracas', name: 'Caracas', subtext: 'Venezuela Transition', lat: 10.4806, lon: -66.9036,
    keywords: ['venezuela', 'maduro', 'caracas', 'venezuelan', 'pdvsa', 'us intervention'],
    description: 'Site of recent US military operation capturing Maduro. Interim administration, oil sector reforms, international responses.',
    agencies: ['SEBIN', 'DGCIM', 'GNB', 'US Oversight'],
    status: 'US-influenced transition'
  },
  {
    id: 'nuuk', name: 'Nuuk', subtext: 'Arctic Tensions', lat: 64.1750, lon: -51.7388,
    keywords: ['greenland', 'denmark', 'arctic', 'nuuk', 'thule', 'pituffik', 'rare earth'],
    description: 'Arctic strategic territory with US military presence at Pituffik Space Base. Renewed US interest in control, rare earth minerals, sovereignty disputes.',
    agencies: ['Danish Defence', 'US Space Force', 'Arctic Council'],
    status: 'Heightened diplomatic tensions'
  },
  {
    id: 'seoul', name: 'Seoul', subtext: 'Korean Peninsula Watch', lat: 37.5665, lon: 126.9780,
    keywords: ['south korea', 'seoul', 'korean', 'rok', 'usfk', 'missile defense'],
    description: 'South Korean capital and military command center. US-ROK alliance, deterrence against DPRK threats.',
    agencies: ['ROK Ministry of National Defense', 'USFK', 'NSC'],
    status: 'Alliance vigilance'
  },
  {
    id: 'newdelhi', name: 'New Delhi', subtext: 'Indo-Pacific Strategy', lat: 28.6139, lon: 77.2090,
    keywords: ['india', 'new delhi', 'modi', 'indian', 'quad', 'indo-pacific'],
    description: 'Indian political and military hub. Growing strategic partnerships, border tensions monitoring.',
    agencies: ['RAW', 'Indian Armed Forces', 'MEA'],
    status: 'Strategic realignment'
  },
  {
    id: 'riyadh', name: 'Riyadh', subtext: 'Gulf Security Hub', lat: 24.7136, lon: 46.6753,
    keywords: ['saudi arabia', 'riyadh', 'mbs', 'gulf', 'oil', 'yemen'],
    description: 'Saudi Arabian command center. Regional security, energy policy, alliances with US.',
    agencies: ['GID', 'Saudi Armed Forces', 'MOD'],
    status: 'Regional stabilization'
  },
  {
    id: 'ankara', name: 'Ankara', subtext: 'NATO Southern Flank', lat: 39.9334, lon: 32.8597,
    keywords: ['turkey', 'ankara', 'erdogan', 'turkish', 'nato', 'syria'],
    description: 'Turkish government and military headquarters. NATO member dynamics, regional operations.',
    agencies: ['MIT', 'Turkish Armed Forces', 'Presidency'],
    status: 'Alliance coordination'
  },
  {
    id: 'tokyo', name: 'Tokyo', subtext: 'US-Japan Alliance', lat: 35.6762, lon: 139.6503,
    keywords: ['japan', 'tokyo', 'japanese', 'usfj', 'east china sea'],
    description: 'Japanese political and defense center. US alliance, regional deterrence.',
    agencies: ['PSIA', 'JSDF', 'MOD'],
    status: 'Enhanced deterrence'
  },
  {
    id: 'singapore', name: 'Singapore', subtext: 'Malacca Strait Oversight', lat: 1.3521, lon: 103.8198,
    keywords: ['singapore', 'malacca', 'strait', 'maritime', 'asean'],
    description: 'Key maritime hub monitoring critical chokepoint. Regional security and trade flows.',
    agencies: ['ISD', 'RSAF', 'RSN'],
    status: 'Maritime vigilance'
  },
  {
    id: 'cfr', name: 'CFR', subtext: 'Council on Foreign Relations', lat: 40.7128, lon: -74.0060,
    keywords: ['cfr', 'council on foreign relations', 'foreign policy', 'think tank', 'nyc', 'new york'],
    description: 'Premier US foreign policy think tank. Research, analysis, and policy recommendations on global affairs.',
    agencies: ['CFR'],
    status: 'Active research'
  }
]

export const US_HOTSPOTS = [
  {
    id: 'mn-daycare-fraud',
    name: 'Minnesota Daycare Fraud',
    location: 'Minneapolis, MN',
    lat: 44.9778,
    lon: -93.2650,
    level: 'high',
    category: 'Federal Investigation',
    description: 'Massive $250M+ fraud scheme involving Feeding Our Future nonprofit. Largest pandemic-era fraud case. Multiple convictions and ongoing trials.',
    keywords: ['minnesota', 'daycare', 'fraud', 'feeding our future', 'minneapolis', 'pandemic fraud', 'child nutrition', 'somali'],
    startDate: '2022',
    status: 'Active Investigation',
    icon: '⚠'
  },
  {
    id: 'la-wildfires',
    name: 'California Wildfires',
    location: 'Los Angeles, CA',
    lat: 34.0522,
    lon: -118.2437,
    level: 'high',
    category: 'Natural Disaster',
    description: 'Ongoing wildfire emergency in Los Angeles area. Multiple fires, evacuations, and widespread destruction.',
    keywords: ['california', 'wildfire', 'los angeles', 'fire', 'evacuation', 'palisades', 'eaton', 'altadena'],
    startDate: '2025',
    status: 'Active Emergency',
    icon: '🔥'
  },
  {
    id: 'border-crisis',
    name: 'Border Enforcement',
    location: 'El Paso, TX',
    lat: 31.7619,
    lon: -106.4850,
    level: 'elevated',
    category: 'Immigration',
    description: 'Ongoing migration and border enforcement actions. Policy changes, deportations, and humanitarian concerns.',
    keywords: ['border', 'immigration', 'migrant', 'el paso', 'texas', 'cbp', 'deportation', 'ice'],
    startDate: '2024',
    status: 'Ongoing',
    icon: '🚨'
  },
  {
    id: 'ai-regulation',
    name: 'AI & Tech Policy',
    location: 'San Francisco, CA',
    lat: 37.7749,
    lon: -122.4194,
    level: 'medium',
    category: 'Technology',
    description: 'Major tech companies facing regulatory scrutiny. AI safety debates, antitrust actions, and policy formation.',
    keywords: ['openai', 'anthropic', 'google ai', 'ai regulation', 'artificial intelligence', 'tech regulation', 'deepseek'],
    startDate: '2024',
    status: 'Developing',
    icon: '🤖'
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
    parties: ['Russia', 'Ukraine', 'NATO/Western support'],
    casualties: 'Hundreds of thousands ongoing',
    displaced: 'Millions internally; millions refugees',
    description: 'Full-scale Russian invasion continues with positional warfare in the east, heavy infrastructure strikes, and drone/missile exchanges. Negotiations for security guarantees and potential ceasefire ongoing amid high casualties.',
    keyEvents: ['Pokrovsk direction advances', 'Energy infrastructure attacks', 'Peacekeeping proposals'],
    keywords: ['ukraine', 'russia', 'zelensky', 'putin', 'donbas', 'crimea', 'kharkiv']
  },
  {
    id: 'gaza',
    name: 'Gaza Conflict',
    intensity: 'medium',
    coords: [
      [34.2, 31.6], [34.6, 31.6], [34.6, 31.2], [34.2, 31.2]
    ],
    labelPos: { lat: 31.4, lon: 34.4 },
    startDate: 'Oct 7, 2023',
    parties: ['Israel (IDF)', 'Hamas'],
    casualties: 'Over 70,000 Palestinian; thousands Israeli (cumulative)',
    displaced: 'Majority of population',
    description: 'Fragile US-brokered ceasefire in effect since October 2025 (phase one). IDF controls ~50-60% of territory; ongoing violations, aid restrictions, humanitarian crisis persist.',
    keyEvents: ['October 2025 ceasefire', 'Hostage releases', 'Yellow Line enforcement'],
    keywords: ['gaza', 'israel', 'hamas', 'idf', 'netanyahu', 'ceasefire', 'yellow line']
  },
  {
    id: 'sudan',
    name: 'Sudan Civil War',
    intensity: 'high',
    coords: [
      [32.0, 16.0], [34.0, 16.5], [35.0, 15.0], [33.5, 13.5],
      [31.5, 14.0], [31.0, 15.5]
    ],
    labelPos: { lat: 15.0, lon: 32.5 },
    startDate: 'Apr 15, 2023',
    parties: ['Sudanese Armed Forces (SAF)', 'Rapid Support Forces (RSF)'],
    casualties: 'Tens of thousands',
    displaced: '11M+ (world\'s largest crisis)',
    description: 'Escalating RSF advances in Darfur and Kordofan; sieges on cities, famine conditions, ethnic targeting in contested areas.',
    keyEvents: ['Fall of El Fasher', 'Heglig oil field capture', 'Famine spread'],
    keywords: ['sudan', 'khartoum', 'rsf', 'saf', 'darfur', 'burhan', 'hemedti']
  },
  {
    id: 'myanmar',
    name: 'Myanmar Civil War',
    intensity: 'high',
    coords: [
      [96.0, 22.0], [98.0, 23.0], [98.5, 21.0], [97.0, 19.5], [95.5, 20.5]
    ],
    labelPos: { lat: 21.0, lon: 96.5 },
    startDate: 'Feb 1, 2021',
    parties: ['Military Junta', 'Ethnic Armed Organizations', 'People\'s Defense Forces'],
    casualties: 'Over 100,000',
    displaced: '3.5M+',
    description: 'Junta conducting controversial phased elections amid ongoing resistance offensives; pro-military party dominating controlled areas while opposition controls significant territory.',
    keyEvents: ['2025-2026 phased elections', 'Resistance territorial gains'],
    keywords: ['myanmar', 'burma', 'junta', 'arakan', 'karen', 'kachin', 'election']
  },
  {
    id: 'taiwan_strait',
    name: 'Taiwan Strait Tensions',
    intensity: 'elevated',
    coords: [
      [119.0, 26.0], [121.5, 26.0], [121.5, 22.5], [119.0, 22.5]
    ],
    labelPos: { lat: 24.5, lon: 120.0 },
    startDate: 'Ongoing',
    parties: ['China (PLA)', 'Taiwan', 'United States'],
    casualties: 'Low (incursions)',
    displaced: 'N/A',
    description: 'Increased PLA blockade simulation exercises and ADIZ incursions; heightened risk of escalation amid regional deterrence.',
    keyEvents: ['Justice Mission 2025 exercises', 'ADIZ violations'],
    keywords: ['taiwan', 'china', 'strait', 'pla', 'adiz', 'blockade']
  },
  {
    id: 'sahel',
    name: 'Sahel Jihadist Insurgencies',
    intensity: 'high',
    coords: [
      [-4.0, 15.0], [0.0, 15.0], [0.0, 12.0], [-4.0, 12.0]
    ],
    labelPos: { lat: 14.0, lon: -2.0 },
    startDate: '2012 (escalated 2020s)',
    parties: ['JNIM (al-Qaeda affiliate)', 'Islamic State Sahel', 'Governments of Mali/Burkina Faso/Niger'],
    casualties: 'Tens of thousands annual',
    displaced: 'Millions',
    description: 'Escalating insurgencies with JNIM and IS-Sahel controlling/contesting large rural areas; sieges on towns, record terrorism deaths.',
    keyEvents: ['JNIM territorial expansion', 'IS-Sahel attacks'],
    keywords: ['sahel', 'mali', 'burkina faso', 'niger', 'jnim', 'islamic state', 'jihadist']
  },
  {
    id: 'yemen_south',
    name: 'Yemen Southern Conflict',
    intensity: 'medium',
    coords: [
      [43.0, 13.0], [54.0, 13.0], [54.0, 17.0], [43.0, 17.0]
    ],
    labelPos: { lat: 15.0, lon: 48.0 },
    startDate: 'Dec 2025 escalation',
    parties: ['Yemeni Government/Saudi-backed', 'Southern Transitional Council (STC/UAE-aligned)'],
    casualties: 'Hundreds recent',
    displaced: 'Thousands',
    description: 'Saudi-backed offensive against UAE-supported separatists; government forces retaking southern territories amid rift in anti-Houthi coalition.',
    keyEvents: ['STC offensive reversal', 'Aden recapture'],
    keywords: ['yemen', 'south yemen', 'stc', 'aden', 'saudi', 'uae', 'separatist']
  }
]
