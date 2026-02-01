import { useState, useEffect, useCallback } from 'react'

interface AppIdea {
  id: string
  name: string
  tagline: string
  description: string
  category: Category
  difficulty: Difficulty
  targetAudience: string
  features: string[]
}

type Category = 'productivity' | 'social' | 'health' | 'entertainment' | 'education' | 'finance' | 'utility' | 'creative'
type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'

const categories: Category[] = ['productivity', 'social', 'health', 'entertainment', 'education', 'finance', 'utility', 'creative']
const difficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced', 'expert']

const categoryColors: Record<Category, string> = {
  productivity: '#ff8c32',
  social: '#f472b6',
  health: '#34d399',
  entertainment: '#a78bfa',
  education: '#60a5fa',
  finance: '#fbbf24',
  utility: '#94a3b8',
  creative: '#f87171'
}

const categoryIcons: Record<Category, string> = {
  productivity: '⚡',
  social: '👥',
  health: '💚',
  entertainment: '🎮',
  education: '📚',
  finance: '💰',
  utility: '🔧',
  creative: '🎨'
}

const difficultyLevels: Record<Difficulty, { label: string; bars: number }> = {
  beginner: { label: 'BEGINNER', bars: 1 },
  intermediate: { label: 'INTERMEDIATE', bars: 2 },
  advanced: { label: 'ADVANCED', bars: 3 },
  expert: { label: 'EXPERT', bars: 4 }
}

const appIdeasDatabase: Omit<AppIdea, 'id'>[] = [
  {
    name: 'MindMap Flow',
    tagline: 'Think visually, create freely',
    description: 'A gesture-based mind mapping tool that converts hand-drawn sketches into organized digital diagrams with AI-powered node suggestions.',
    category: 'productivity',
    difficulty: 'advanced',
    targetAudience: 'Visual thinkers, students, and project managers',
    features: ['Gesture recognition', 'AI node suggestions', 'Export to multiple formats', 'Real-time collaboration']
  },
  {
    name: 'Vibe Check',
    tagline: 'How\'s your circle feeling?',
    description: 'An anonymous mood-sharing app for friend groups that shows collective emotional weather without revealing individual states.',
    category: 'social',
    difficulty: 'intermediate',
    targetAudience: 'Close friend groups and families',
    features: ['Anonymous mood input', 'Group weather visualization', 'Trend tracking', 'Support nudges']
  },
  {
    name: 'Posture Pal',
    tagline: 'Your back\'s best friend',
    description: 'Uses phone camera or webcam to detect slouching and sends gentle reminders with quick stretching exercises.',
    category: 'health',
    difficulty: 'advanced',
    targetAudience: 'Remote workers and students',
    features: ['Real-time posture detection', 'Custom reminder sounds', 'Stretch library', 'Weekly posture reports']
  },
  {
    name: 'Story Dice',
    tagline: 'Roll your next adventure',
    description: 'A collaborative storytelling game where players take turns adding to a story based on random dice prompts.',
    category: 'entertainment',
    difficulty: 'beginner',
    targetAudience: 'Families, writers, and party game enthusiasts',
    features: ['Customizable dice themes', 'Voice recording', 'Story export', 'Multiplayer rooms']
  },
  {
    name: 'CodeKata',
    tagline: 'Daily coding dojo',
    description: 'Bite-sized coding challenges delivered daily with spaced repetition to build programming muscle memory.',
    category: 'education',
    difficulty: 'intermediate',
    targetAudience: 'Aspiring and junior developers',
    features: ['Daily challenges', 'Spaced repetition', 'Multiple languages', 'Progress streaks']
  },
  {
    name: 'Split Smart',
    tagline: 'Fair splits, no drama',
    description: 'An intelligent bill splitter that accounts for who ordered what, tax, tip, and even who forgot their wallet.',
    category: 'finance',
    difficulty: 'beginner',
    targetAudience: 'Anyone who eats out with friends',
    features: ['Receipt scanning', 'Item assignment', 'Payment tracking', 'IOU management']
  },
  {
    name: 'Font Safari',
    tagline: 'Catch fonts in the wild',
    description: 'Point your camera at any text to identify fonts, get similar alternatives, and build a personal font collection.',
    category: 'creative',
    difficulty: 'advanced',
    targetAudience: 'Designers and typography enthusiasts',
    features: ['Font recognition', 'Similar font suggestions', 'Personal collections', 'Font pairing tips']
  },
  {
    name: 'Queue Buddy',
    tagline: 'Wait smarter, not harder',
    description: 'Estimates wait times at local venues using crowdsourced data and suggests the best time to visit.',
    category: 'utility',
    difficulty: 'intermediate',
    targetAudience: 'Anyone who hates waiting in line',
    features: ['Real-time estimates', 'Historical patterns', 'Notifications', 'Venue comparison']
  },
  {
    name: 'Dream Journal AI',
    tagline: 'Decode your subconscious',
    description: 'Voice-record dreams upon waking, get AI-powered pattern analysis and symbolic interpretations over time.',
    category: 'health',
    difficulty: 'intermediate',
    targetAudience: 'Self-reflection enthusiasts and lucid dreamers',
    features: ['Voice recording', 'Pattern detection', 'Symbol dictionary', 'Dream calendar']
  },
  {
    name: 'Micro Mentor',
    tagline: '5 minutes to level up',
    description: 'Connects people for ultra-short mentoring sessions on specific micro-skills, from Excel formulas to plant care.',
    category: 'social',
    difficulty: 'advanced',
    targetAudience: 'Lifelong learners and experts wanting to share',
    features: ['Skill matching', '5-min video calls', 'Rating system', 'Skill badges']
  },
  {
    name: 'Playlist Roulette',
    tagline: 'Spin the musical wheel',
    description: 'Generates mystery playlists based on mood, activity, or random themes. Swipe to keep or skip entire vibes.',
    category: 'entertainment',
    difficulty: 'beginner',
    targetAudience: 'Music lovers tired of the same recommendations',
    features: ['Theme generator', 'Mood matching', 'Spotify integration', 'Social sharing']
  },
  {
    name: 'Carbon Tracker',
    tagline: 'Your daily eco footprint',
    description: 'Automatically estimates carbon footprint from daily activities with gamified challenges to reduce impact.',
    category: 'utility',
    difficulty: 'advanced',
    targetAudience: 'Environmentally conscious individuals',
    features: ['Activity tracking', 'Impact visualization', 'Weekly challenges', 'Offset suggestions']
  },
  {
    name: 'Lullaby Lab',
    tagline: 'Soundscapes for sleep',
    description: 'AI-generated personalized sleep soundscapes that adapt to your sleep patterns and preferences.',
    category: 'health',
    difficulty: 'expert',
    targetAudience: 'People with sleep difficulties',
    features: ['Adaptive audio', 'Sleep tracking integration', 'Sound mixing', 'Alarm fade-in']
  },
  {
    name: 'Vocab Voyage',
    tagline: 'Words through worlds',
    description: 'Learn vocabulary through an adventure game where new words unlock paths, characters, and story elements.',
    category: 'education',
    difficulty: 'intermediate',
    targetAudience: 'Language learners and word game fans',
    features: ['Story-driven learning', 'Spaced repetition', 'Multiple languages', 'Achievement system']
  },
  {
    name: 'Expense Emotion',
    tagline: 'How did that purchase feel?',
    description: 'Track spending alongside emotional state to uncover patterns between mood and money habits.',
    category: 'finance',
    difficulty: 'intermediate',
    targetAudience: 'People wanting to understand spending triggers',
    features: ['Emotion tagging', 'Pattern analysis', 'Spending insights', 'Mood budgeting']
  },
  {
    name: 'Color Capture',
    tagline: 'Palette from anywhere',
    description: 'Extract color palettes from photos, generate harmonious variations, and export for design tools.',
    category: 'creative',
    difficulty: 'beginner',
    targetAudience: 'Designers, artists, and home decorators',
    features: ['Photo analysis', 'Palette generation', 'Harmony rules', 'Export options']
  },
  {
    name: 'Task Tetris',
    tagline: 'Fit your day together',
    description: 'A visual task manager where tasks are blocks you arrange in your day, gamifying time management.',
    category: 'productivity',
    difficulty: 'intermediate',
    targetAudience: 'Visual planners and productivity enthusiasts',
    features: ['Block scheduling', 'Drag and drop', 'Time estimates', 'Daily score']
  },
  {
    name: 'Plant Parent',
    tagline: 'Never forget to water again',
    description: 'Smart plant care reminders with species-specific advice, growth tracking, and troubleshooting.',
    category: 'utility',
    difficulty: 'beginner',
    targetAudience: 'Plant owners and aspiring green thumbs',
    features: ['Care schedules', 'Plant identification', 'Health diagnosis', 'Growth photos']
  },
  {
    name: 'Debate Buddy',
    tagline: 'Sharpen your arguments',
    description: 'Practice debate skills with AI that argues the opposite side of any topic you choose.',
    category: 'education',
    difficulty: 'advanced',
    targetAudience: 'Students, debaters, and critical thinkers',
    features: ['Topic selection', 'AI opponent', 'Argument analysis', 'Logical fallacy detection']
  },
  {
    name: 'Nostalgia Radio',
    tagline: 'Tunes from your timeline',
    description: 'Creates playlists based on specific years or periods of your life using your music history.',
    category: 'entertainment',
    difficulty: 'intermediate',
    targetAudience: 'Anyone who loves musical time travel',
    features: ['Year selection', 'Memory tagging', 'Auto-generated playlists', 'Sharing']
  },
  {
    name: 'Focus Forest',
    tagline: 'Grow trees, grow focus',
    description: 'A pomodoro timer where focused work grows a virtual forest, with multiplayer challenges.',
    category: 'productivity',
    difficulty: 'beginner',
    targetAudience: 'Students and remote workers',
    features: ['Pomodoro timer', 'Virtual forest', 'Friend challenges', 'Statistics']
  },
  {
    name: 'Symptom Saga',
    tagline: 'Your health story, charted',
    description: 'Track symptoms, medications, and lifestyle factors to find correlations and share with doctors.',
    category: 'health',
    difficulty: 'intermediate',
    targetAudience: 'People with chronic conditions',
    features: ['Symptom logging', 'Correlation analysis', 'Doctor reports', 'Medication reminders']
  },
  {
    name: 'Skill Swap',
    tagline: 'Trade what you know',
    description: 'A marketplace where people exchange skills instead of money. Teach guitar, learn coding.',
    category: 'social',
    difficulty: 'advanced',
    targetAudience: 'Lifelong learners with skills to share',
    features: ['Skill listing', 'Matching algorithm', 'Session booking', 'Review system']
  },
  {
    name: 'Pocket Museum',
    tagline: 'Art history in your palm',
    description: 'Daily featured artwork with historical context, artist stories, and zoom-in details.',
    category: 'education',
    difficulty: 'beginner',
    targetAudience: 'Art lovers and culture enthusiasts',
    features: ['Daily artwork', 'Audio guides', 'Virtual exhibitions', 'Personal collection']
  },
  {
    name: 'Subscription Sleuth',
    tagline: 'Find your hidden charges',
    description: 'Scans for recurring charges, shows true cost of subscriptions, and helps cancel unused ones.',
    category: 'finance',
    difficulty: 'intermediate',
    targetAudience: 'Anyone with too many subscriptions',
    features: ['Bank scanning', 'Cost analysis', 'Cancellation guides', 'Renewal alerts']
  },
  {
    name: 'Meme Forge',
    tagline: 'Craft viral moments',
    description: 'A meme creation studio with trending templates, AI caption suggestions, and format library.',
    category: 'creative',
    difficulty: 'beginner',
    targetAudience: 'Social media enthusiasts and content creators',
    features: ['Template library', 'Text tools', 'Trending formats', 'Direct sharing']
  },
  {
    name: 'Commute Companion',
    tagline: 'Make dead time productive',
    description: 'Curates bite-sized content matching your commute length: podcasts, articles, language lessons.',
    category: 'productivity',
    difficulty: 'intermediate',
    targetAudience: 'Commuters wanting to use time wisely',
    features: ['Commute detection', 'Content curation', 'Offline downloads', 'Progress tracking']
  },
  {
    name: 'Recipe Remix',
    tagline: 'What\'s in your fridge?',
    description: 'Input available ingredients and get creative recipe suggestions with substitution ideas.',
    category: 'utility',
    difficulty: 'intermediate',
    targetAudience: 'Home cooks fighting food waste',
    features: ['Ingredient input', 'Recipe matching', 'Substitutions', 'Meal planning']
  },
  {
    name: 'Gratitude Garden',
    tagline: 'Grow thankfulness daily',
    description: 'Daily gratitude journaling that visualizes entries as a growing garden with seasonal themes.',
    category: 'health',
    difficulty: 'beginner',
    targetAudience: 'Anyone wanting to cultivate positivity',
    features: ['Daily prompts', 'Visual garden', 'Streak tracking', 'Memory review']
  },
  {
    name: 'Accent Academy',
    tagline: 'Sound like a local',
    description: 'Practice pronunciation with real-time feedback, comparing your speech to native speakers.',
    category: 'education',
    difficulty: 'expert',
    targetAudience: 'Language learners and accent coaches',
    features: ['Speech analysis', 'Native comparisons', 'Progress tracking', 'Specific sound drills']
  }
]

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

function getRandomIdea(categoryFilter: Category | 'all', difficultyFilter: Difficulty | 'all'): AppIdea {
  let filtered = appIdeasDatabase
  if (categoryFilter !== 'all') {
    filtered = filtered.filter(idea => idea.category === categoryFilter)
  }
  if (difficultyFilter !== 'all') {
    filtered = filtered.filter(idea => idea.difficulty === difficultyFilter)
  }
  if (filtered.length === 0) {
    filtered = appIdeasDatabase
  }
  const randomIdea = filtered[Math.floor(Math.random() * filtered.length)]
  return { ...randomIdea, id: generateId() }
}

function DifficultyMeter({ difficulty }: { difficulty: Difficulty }) {
  const { bars } = difficultyLevels[difficulty]
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4].map(level => (
        <div
          key={level}
          className={`w-2 h-${level + 2} rounded-sm transition-all ${
            level <= bars ? 'bg-amber-400' : 'bg-amber-900/30'
          }`}
          style={{ height: `${(level + 1) * 4}px` }}
        />
      ))}
    </div>
  )
}

function IdeaCard({ idea, onSave, isSaved, isAnimating, isExiting }: {
  idea: AppIdea
  onSave: () => void
  isSaved: boolean
  isAnimating: boolean
  isExiting: boolean
}) {
  const categoryColor = categoryColors[idea.category]
  
  return (
    <div
      className={`relative w-full max-w-lg mx-auto ${
        isAnimating ? 'card-dispense' : ''
      } ${isExiting ? 'card-exit' : ''}`}
    >
      {/* Card glow */}
      <div 
        className="absolute inset-0 rounded-2xl blur-xl opacity-30"
        style={{ background: categoryColor }}
      />
      
      {/* Main card */}
      <div className="relative bg-gradient-to-br from-[#1a1816] to-[#0f0e0c] rounded-2xl border border-amber-900/30 overflow-hidden">
        {/* Header stripe */}
        <div 
          className="h-2"
          style={{ background: `linear-gradient(90deg, ${categoryColor}, ${categoryColor}88)` }}
        />
        
        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Category & Difficulty */}
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{ 
                background: `${categoryColor}20`,
                color: categoryColor,
                border: `1px solid ${categoryColor}40`
              }}
            >
              <span>{categoryIcons[idea.category]}</span>
              <span>{idea.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-600/60 text-xs uppercase tracking-wider">
                {difficultyLevels[idea.difficulty].label}
              </span>
              <DifficultyMeter difficulty={idea.difficulty} />
            </div>
          </div>
          
          {/* Name & Tagline */}
          <div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-amber-50 mb-1">
              {idea.name}
            </h2>
            <p className="text-amber-400/80 italic text-sm">"{idea.tagline}"</p>
          </div>
          
          {/* Description */}
          <p className="text-amber-100/70 text-sm leading-relaxed">
            {idea.description}
          </p>
          
          {/* Target Audience */}
          <div className="flex items-start gap-2">
            <span className="text-amber-500 text-lg">👤</span>
            <div>
              <span className="text-amber-600/60 text-xs uppercase tracking-wider">Target Audience</span>
              <p className="text-amber-100/80 text-sm">{idea.targetAudience}</p>
            </div>
          </div>
          
          {/* Features */}
          <div>
            <span className="text-amber-600/60 text-xs uppercase tracking-wider">Key Features</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {idea.features.map((feature, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-1 bg-amber-900/20 border border-amber-800/30 rounded text-amber-200/80 text-xs"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
          
          {/* Save button */}
          <button
            onClick={onSave}
            className={`w-full py-3 rounded-xl font-display font-semibold text-sm uppercase tracking-wider transition-all btn-press ${
              isSaved 
                ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40' 
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-400 hover:to-orange-400'
            }`}
          >
            {isSaved ? '★ Saved to Collection' : '☆ Save This Idea'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SavedIdeasPanel({ ideas, onRemove, onClose }: {
  ideas: AppIdea[]
  onRemove: (id: string) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-gradient-to-br from-[#1a1816] to-[#0f0e0c] rounded-2xl border border-amber-900/30 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-amber-900/30">
          <div>
            <h2 className="font-display font-bold text-xl text-amber-50">Saved Ideas</h2>
            <p className="text-amber-600/60 text-sm">{ideas.length} ideas in collection</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-amber-900/20 text-amber-400 hover:bg-amber-900/40 transition-colors flex items-center justify-center"
          >
            ✕
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {ideas.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-amber-600/60">No saved ideas yet</p>
              <p className="text-amber-800/60 text-sm mt-1">Generate some ideas and save your favorites!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ideas.map(idea => (
                <div 
                  key={idea.id}
                  className="flex items-start gap-4 p-4 bg-amber-900/10 rounded-xl border border-amber-900/20 hover:border-amber-800/40 transition-colors"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                    style={{ background: `${categoryColors[idea.category]}20` }}
                  >
                    {categoryIcons[idea.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-amber-100 truncate">{idea.name}</h3>
                    <p className="text-amber-600/60 text-sm truncate">{idea.tagline}</p>
                  </div>
                  <button
                    onClick={() => onRemove(idea.id)}
                    className="text-amber-700 hover:text-red-400 transition-colors p-2"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterButton({ 
  active, 
  onClick, 
  children,
  color
}: { 
  active: boolean
  onClick: () => void 
  children: React.ReactNode
  color?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all btn-press ${
        active 
          ? 'text-black' 
          : 'bg-amber-900/20 text-amber-600/80 hover:bg-amber-900/40'
      }`}
      style={active ? { 
        background: color || '#fbbf24',
        boxShadow: `0 0 15px ${color || '#fbbf24'}40`
      } : {}}
    >
      {children}
    </button>
  )
}

export default function App() {
  const [currentIdea, setCurrentIdea] = useState<AppIdea | null>(null)
  const [savedIdeas, setSavedIdeas] = useState<AppIdea[]>(() => {
    const saved = localStorage.getItem('ideaMachine_saved')
    return saved ? JSON.parse(saved) : []
  })
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [leverPulled, setLeverPulled] = useState(false)
  
  useEffect(() => {
    localStorage.setItem('ideaMachine_saved', JSON.stringify(savedIdeas))
  }, [savedIdeas])
  
  const generateNewIdea = useCallback(() => {
    if (isAnimating || isExiting) return
    
    setLeverPulled(true)
    setTimeout(() => setLeverPulled(false), 500)
    
    if (currentIdea) {
      setIsExiting(true)
      setTimeout(() => {
        setIsExiting(false)
        setIsAnimating(true)
        setCurrentIdea(getRandomIdea(categoryFilter, difficultyFilter))
        setTimeout(() => setIsAnimating(false), 600)
      }, 400)
    } else {
      setIsAnimating(true)
      setCurrentIdea(getRandomIdea(categoryFilter, difficultyFilter))
      setTimeout(() => setIsAnimating(false), 600)
    }
  }, [categoryFilter, difficultyFilter, currentIdea, isAnimating, isExiting])
  
  const saveIdea = useCallback(() => {
    if (!currentIdea) return
    const alreadySaved = savedIdeas.some(idea => idea.name === currentIdea.name)
    if (alreadySaved) {
      setSavedIdeas(prev => prev.filter(idea => idea.name !== currentIdea.name))
    } else {
      setSavedIdeas(prev => [...prev, currentIdea])
    }
  }, [currentIdea, savedIdeas])
  
  const removeIdea = useCallback((id: string) => {
    setSavedIdeas(prev => prev.filter(idea => idea.id !== id))
  }, [])
  
  const isCurrentSaved = currentIdea ? savedIdeas.some(idea => idea.name === currentIdea.name) : false
  
  return (
    <div className="min-h-screen grid-pattern flex flex-col">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/3 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="p-6 md:p-8">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl glow-amber float">
                💡
              </div>
              <div>
                <h1 className="font-display font-bold text-xl md:text-2xl text-amber-50">
                  Idea Machine
                </h1>
                <p className="text-amber-600/60 text-xs uppercase tracking-wider">
                  App Concept Generator
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowSaved(true)}
              className="relative flex items-center gap-2 px-4 py-2 bg-amber-900/20 hover:bg-amber-900/40 border border-amber-800/30 rounded-xl transition-all btn-press"
            >
              <span className="text-amber-400">★</span>
              <span className="text-amber-200/80 text-sm font-medium hidden md:inline">Saved</span>
              {savedIdeas.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 rounded-full text-xs font-bold text-black flex items-center justify-center">
                  {savedIdeas.length}
                </span>
              )}
            </button>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 pb-24">
          {/* Filters */}
          <div className="w-full max-w-lg mb-8 space-y-4">
            {/* Category filters */}
            <div>
              <span className="text-amber-600/60 text-xs uppercase tracking-wider mb-2 block">Category</span>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  active={categoryFilter === 'all'}
                  onClick={() => setCategoryFilter('all')}
                >
                  All
                </FilterButton>
                {categories.map(cat => (
                  <FilterButton
                    key={cat}
                    active={categoryFilter === cat}
                    onClick={() => setCategoryFilter(cat)}
                    color={categoryColors[cat]}
                  >
                    {categoryIcons[cat]} {cat}
                  </FilterButton>
                ))}
              </div>
            </div>
            
            {/* Difficulty filters */}
            <div>
              <span className="text-amber-600/60 text-xs uppercase tracking-wider mb-2 block">Difficulty</span>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  active={difficultyFilter === 'all'}
                  onClick={() => setDifficultyFilter('all')}
                >
                  All Levels
                </FilterButton>
                {difficulties.map(diff => (
                  <FilterButton
                    key={diff}
                    active={difficultyFilter === diff}
                    onClick={() => setDifficultyFilter(diff)}
                  >
                    {diff}
                  </FilterButton>
                ))}
              </div>
            </div>
          </div>
          
          {/* Idea Card or Empty State */}
          <div className="w-full max-w-lg min-h-[400px] flex items-center justify-center">
            {currentIdea ? (
              <IdeaCard 
                idea={currentIdea} 
                onSave={saveIdea}
                isSaved={isCurrentSaved}
                isAnimating={isAnimating}
                isExiting={isExiting}
              />
            ) : (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-800/30 flex items-center justify-center pulse-ring">
                  <span className="text-5xl">🎰</span>
                </div>
                <h2 className="font-display font-bold text-xl text-amber-200/80 mb-2">
                  Ready to generate ideas?
                </h2>
                <p className="text-amber-600/60 text-sm">
                  Pull the lever to dispense your next app concept
                </p>
              </div>
            )}
          </div>
          
          {/* Generate Button */}
          <div className="mt-8">
            <button
              onClick={generateNewIdea}
              disabled={isAnimating || isExiting}
              className="group relative"
            >
              {/* Button glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
              
              {/* Button */}
              <div className="relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl font-display font-bold text-lg text-black uppercase tracking-wider transition-all btn-press hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                <span className={`text-2xl transition-transform ${leverPulled ? 'lever-pull' : ''}`}>
                  🎰
                </span>
                <span>{currentIdea ? 'Next Idea' : 'Generate Idea'}</span>
              </div>
            </button>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-amber-800/40 text-xs">
            Requested by <span className="text-amber-700/50">@JustJayJusy</span> · Built by <span className="text-amber-700/50">@clonkbot</span>
          </p>
        </footer>
      </div>
      
      {/* Saved Ideas Panel */}
      {showSaved && (
        <SavedIdeasPanel
          ideas={savedIdeas}
          onRemove={removeIdea}
          onClose={() => setShowSaved(false)}
        />
      )}
    </div>
  )
}