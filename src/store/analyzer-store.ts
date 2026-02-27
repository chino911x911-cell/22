import { create } from 'zustand'

// أنواع البيانات
export interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
  path: string
  children?: FileNode[]
  isProcessed?: boolean
  size?: number
}

export interface Persona {
  id: string
  name: string
  nameAr: string
  icon: string
  systemPrompt: string
  focusKeywords: string[]
  tone: 'formal' | 'friendly' | 'technical'
}

export interface AIModel {
  id: string
  name: string
  provider: 'ollama' | 'openrouter' | 'gemini' | 'zai' | 'xai'
  type: 'local' | 'remote'
  contextLength?: number
  features?: string[]
}

export interface AnalysisIssue {
  id: string
  line: number
  type: 'error' | 'warning' | 'info'
  message: string
  suggestion?: string
}

export interface AnalysisResult {
  fileId: string
  fileName: string
  issues: AnalysisIssue[]
  fixedCode?: string
  summary: string
  score: number
}

export interface DiscoveredData {
  id: string
  name: string
  path: string
  type: 'sqlite' | 'json' | 'csv' | 'xml' | 'txt' | 'log'
  size: number
  recordCount?: number
  schema?: Record<string, unknown>
  content?: string
}

export interface LogEntry {
  id: string
  timestamp: Date
  level: 'info' | 'warning' | 'error' | 'success'
  message: string
  source?: string
}

export interface LabResult {
  id: string
  inputCode: string
  outputCode?: string
  executionTime?: number
  issues: string[]
  suggestions: string[]
  testResults: { input: string; output: string; passed: boolean }[]
}

// Project DNA Type
export interface ProjectDNA {
  id: string
  createdAt: Date
  updatedAt: Date
  naming: {
    variables: 'camelCase' | 'snake_case' | 'PascalCase' | 'mixed'
    functions: 'camelCase' | 'snake_case' | 'PascalCase'
    constants: 'UPPER_SNAKE_CASE' | 'camelCase' | 'mixed'
    classes: 'PascalCase' | 'camelCase'
  }
  patterns: {
    prefersArrowFunctions: boolean
    prefersConstOverLet: boolean
    usesSemicolons: boolean
    usesSingleQuotes: boolean
    prefersAsyncAwait: boolean
    usesTryCatch: boolean
    usesOptionalChaining: boolean
    usesDestructuring: boolean
    usesTemplateLiterals: boolean
  }
  imports: {
    style: 'default' | 'named' | 'mixed'
    prefersRelativeImports: boolean
    commonImports: Record<string, number>
  }
  errorHandling: {
    style: 'try-catch' | 'promise-catch' | 'mixed' | 'none'
    prefersCustomErrors: boolean
    logsErrors: boolean
  }
  comments: {
    style: 'jsdoc' | 'inline' | 'minimal' | 'extensive'
    language: 'ar' | 'en' | 'mixed'
  }
  dependencies: {
    frameworks: string[]
    libraries: string[]
    testingFrameworks: string[]
  }
  consistencyScore: number
  stats: {
    totalFiles: number
    totalLines: number
    averageFileLength: number
    complexityScore: number
  }
}

// Vaccine Result Type
export interface VaccineResult {
  totalMutants: number
  killedMutants: number
  survivedMutants: number
  mutationScore: number
  mutants: Mutant[]
  weakSpots: WeakSpot[]
  suggestedTests: string[]
}

export interface Mutant {
  id: string
  type: string
  originalCode: string
  mutatedCode: string
  line: number
  survived: boolean
  killedBy: string[]
}

export interface WeakSpot {
  line: number
  type: string
  message: string
  severity: 'critical' | 'high' | 'medium'
}

// الشخصيات الافتراضية
export const DEFAULT_PERSONAS: Persona[] = [
  {
    id: 'detective',
    name: 'Detective',
    nameAr: 'المحقق',
    icon: '🕵️',
    systemPrompt: 'أنت محقق خبير في تحليل الكود. مهمتك البحث عن الأخطاء المنطقية وتدفق البيانات والمشاكل الخفية. كن دقيقاً ومفصلاً في تحليلك.',
    focusKeywords: ['bug', 'error', 'logic', 'flow', 'variable', 'null', 'undefined'],
    tone: 'formal'
  },
  {
    id: 'guardian',
    name: 'Guardian',
    nameAr: 'الحارس الأمني',
    icon: '🛡️',
    systemPrompt: 'أنت خبير أمني متخصص في اكتشاف الثغرات الأمنية. ابحث عن XSS, SQL Injection, CSRF, ومشاكل المصادقة. قدم حلول أمنية عملية.',
    focusKeywords: ['password', 'token', 'auth', 'injection', 'xss', 'csrf', 'secret', 'api_key'],
    tone: 'technical'
  },
  {
    id: 'web3',
    name: 'Web3 Sentinel',
    nameAr: 'حارس الويب 3',
    icon: '⛓️',
    systemPrompt: 'أنت مدقق عقود ذكية متخصص في Solidity. ابحث عن Reentrancy, Integer Overflow, Access Control Issues, وGas Optimization.',
    focusKeywords: ['reentrancy', 'gas', 'balance', 'owner', 'modifier', 'payable', 'external'],
    tone: 'technical'
  },
  {
    id: 'optimizer',
    name: 'Optimizer',
    nameAr: 'المحسن',
    icon: '⚡',
    systemPrompt: 'أنت خبير أداء. ركز على تحسين تعقيد الخوارزميات (Big O), إدارة الذاكرة, والعمليات غير المتزامنة.',
    focusKeywords: ['loop', 'complexity', 'async', 'await', 'cache', 'memory', 'performance'],
    tone: 'friendly'
  },
  {
    id: 'cleaner',
    name: 'Cleaner',
    nameAr: 'المنظم',
    icon: '🧹',
    systemPrompt: 'أنت خبير في جودة الكود ونظافته. ابحث عن الكود الميت, المتغيرات غير المستخدمة, وأسماء المتغيرات السيئة. اتبع مبادئ Clean Code.',
    focusKeywords: ['unused', 'dead_code', 'naming', 'duplicate', 'console.log', 'todo', 'fixme'],
    tone: 'friendly'
  }
]

// أنماط الاستبعاد
export const IGNORE_PATTERNS = [
  'node_modules', '.git', 'dist', 'build', '.next', '__pycache__', 
  '.DS_Store', '.env', 'package-lock.json', 'bun.lock', 'yarn.lock',
  '.min.js', '.min.css', 'coverage', '.nuxt', '.cache'
]

// أنواع نظام التطور
export interface EvolutionStats {
  trustLevel: number
  stage: 'infant' | 'child' | 'adolescent' | 'adult' | 'sage'
  stageDescription: string
  totalEvolutions: number
  successfulEvolutions: number
  failedEvolutions: number
  pendingProposals: number
  isRunning: boolean
  canAutoEvolve: boolean
}

export interface EvolutionProposal {
  id: string
  targetFile: string
  reason: string
  proposedChanges: string
  expectedBenefits: string[]
  potentialRisks: string[]
  trustRequired: number
}

export interface DiaryEntry {
  timestamp: Date
  type: 'observation' | 'idea' | 'experiment' | 'result' | 'lesson'
  entry: string
  importance: number
}

// واجهة المتجر
interface AnalyzerStore {
  // حالة التنقل
  activeTab: 'analyzer' | 'data' | 'lab' | 'settings' | 'evolution'
  setActiveTab: (tab: 'analyzer' | 'data' | 'lab' | 'settings' | 'evolution') => void
  
  // الملفات
  files: FileNode[]
  selectedFile: FileNode | null
  setFiles: (files: FileNode[]) => void
  addFiles: (files: FileNode[]) => void
  setSelectedFile: (file: FileNode | null) => void
  updateFileContent: (id: string, content: string) => void
  clearFiles: () => void
  
  // الشخصيات
  personas: Persona[]
  activePersona: Persona
  setActivePersona: (persona: Persona) => void
  setPersonas: (personas: Persona[]) => void
  addPersona: (persona: Persona) => void
  updatePersona: (persona: Persona) => void
  deletePersona: (id: string) => void
  
  // النماذج
  models: AIModel[]
  selectedModel: AIModel | null
  setModels: (models: AIModel[]) => void
  addModel: (model: AIModel) => void
  addModels: (models: AIModel[]) => void
  removeModelsByProvider: (provider: string) => void
  setSelectedModel: (model: AIModel | null) => void
  
  // حالات الاتصال
  isOllamaRunning: boolean
  setIsOllamaRunning: (status: boolean) => void
  
  // نتائج التحليل
  analysisResults: Map<string, AnalysisResult>
  setAnalysisResult: (fileId: string, result: AnalysisResult) => void
  clearAnalysisResults: () => void
  
  // البيانات المكتشفة
  discoveredData: DiscoveredData[]
  selectedData: DiscoveredData | null
  setDiscoveredData: (data: DiscoveredData[]) => void
  addDiscoveredData: (data: DiscoveredData) => void
  setSelectedData: (data: DiscoveredData | null) => void
  
  // السجلات
  logs: LogEntry[]
  addLog: (level: LogEntry['level'], message: string, source?: string) => void
  clearLogs: () => void
  
  // حالة التحميل
  isLoading: boolean
  setIsLoading: (status: boolean) => void
  loadingMessage: string
  setLoadingMessage: (message: string) => void
  
  // نظام الأخطبوط
  octopusModeEnabled: boolean
  setOctopusModeEnabled: (enabled: boolean) => void
  
  // نتائج المختبر
  labResults: LabResult[]
  addLabResult: (result: LabResult) => void
  clearLabResults: () => void
  
  // Project DNA
  projectDNA: ProjectDNA | null
  setProjectDNA: (dna: ProjectDNA | null) => void
  dnaAnalysis: string
  setDNAAnalysis: (analysis: string) => void
  
  // Vaccine Results
  vaccineResult: VaccineResult | null
  setVaccineResult: (result: VaccineResult | null) => void
  vaccineRecommendations: string
  setVaccineRecommendations: (recs: string) => void
  
  // مفاتيح API
  apiKeys: { openrouter: string; gemini: string; zai: string; xai: string }
  setApiKey: (provider: 'openrouter' | 'gemini' | 'zai' | 'xai', key: string) => void
  
  // وضع التحليل
  analysisMode: 'fix' | 'audit' | 'security' | 'web3'
  setAnalysisMode: (mode: 'fix' | 'audit' | 'security' | 'web3') => void
  
  // نظام التطور الذاتي
  evolutionStats: EvolutionStats | null
  setEvolutionStats: (stats: EvolutionStats | null) => void
  evolutionProposals: EvolutionProposal[]
  addEvolutionProposal: (proposal: EvolutionProposal) => void
  removeEvolutionProposal: (id: string) => void
  clearEvolutionProposals: () => void
  evolutionDiary: DiaryEntry[]
  setEvolutionDiary: (diary: DiaryEntry[]) => void
  isEvolutionRunning: boolean
  setIsEvolutionRunning: (running: boolean) => void
  
  // الثيم واللغة
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  language: 'ar' | 'en'
  setLanguage: (language: 'ar' | 'en') => void
}

// إنشاء المتجر
export const useAnalyzerStore = create<AnalyzerStore>((set, get) => ({
  // التنقل
  activeTab: 'analyzer',
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  // الملفات
  files: [],
  selectedFile: null,
  setFiles: (files) => set({ files }),
  addFiles: (newFiles) => set((state) => ({ files: [...state.files, ...newFiles] })),
  setSelectedFile: (file) => set({ selectedFile: file }),
  updateFileContent: (id, content) => set((state) => ({
    files: state.files.map(f => f.id === id ? { ...f, content } : f)
  })),
  clearFiles: () => set({ files: [], selectedFile: null, analysisResults: new Map() }),
  
  // الشخصيات
  personas: DEFAULT_PERSONAS,
  activePersona: DEFAULT_PERSONAS[0],
  setActivePersona: (persona) => set({ activePersona: persona }),
  setPersonas: (personas) => set({ personas }),
  addPersona: (persona) => set((state) => ({ personas: [...state.personas, persona] })),
  updatePersona: (persona) => set((state) => ({
    personas: state.personas.map(p => p.id === persona.id ? persona : p)
  })),
  deletePersona: (id) => set((state) => ({
    personas: state.personas.filter(p => p.id !== id),
    activePersona: state.activePersona.id === id ? DEFAULT_PERSONAS[0] : state.activePersona
  })),
  
  // النماذج
  models: [],
  selectedModel: null,
  setModels: (models) => set({ models }),
  addModel: (model) => set((state) => ({ models: [...state.models, model] })),
  addModels: (newModels) => set((state) => ({ models: [...state.models, ...newModels] })),
  removeModelsByProvider: (provider) => set((state) => ({ 
    models: state.models.filter(m => !m.id.startsWith(provider)) 
  })),
  setSelectedModel: (model) => set({ selectedModel: model }),
  
  // الاتصال
  isOllamaRunning: false,
  setIsOllamaRunning: (status) => set({ isOllamaRunning: status }),
  
  // نتائج التحليل
  analysisResults: new Map(),
  setAnalysisResult: (fileId, result) => set((state) => {
    const newResults = new Map(state.analysisResults)
    newResults.set(fileId, result)
    return { analysisResults: newResults }
  }),
  clearAnalysisResults: () => set({ analysisResults: new Map() }),
  
  // البيانات المكتشفة
  discoveredData: [],
  selectedData: null,
  setDiscoveredData: (data) => set({ discoveredData: data }),
  addDiscoveredData: (data) => set((state) => ({ 
    discoveredData: [...state.discoveredData.filter(d => d.path !== data.path), data] 
  })),
  setSelectedData: (data) => set({ selectedData: data }),
  
  // السجلات
  logs: [],
  addLog: (level, message, source) => set((state) => ({
    logs: [...state.logs.slice(-100), {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      level,
      message,
      source
    }]
  })),
  clearLogs: () => set({ logs: [] }),
  
  // التحميل
  isLoading: false,
  setIsLoading: (status) => set({ isLoading: status }),
  loadingMessage: '',
  setLoadingMessage: (message) => set({ loadingMessage: message }),
  
  // الأخطبوط
  octopusModeEnabled: false,
  setOctopusModeEnabled: (enabled) => set({ octopusModeEnabled: enabled }),
  
  // المختبر
  labResults: [],
  addLabResult: (result) => set((state) => ({ labResults: [...state.labResults, result] })),
  clearLabResults: () => set({ labResults: [] }),
  
  // Project DNA
  projectDNA: null,
  setProjectDNA: (dna) => set({ projectDNA: dna }),
  dnaAnalysis: '',
  setDNAAnalysis: (analysis) => set({ dnaAnalysis: analysis }),
  
  // Vaccine Results
  vaccineResult: null,
  setVaccineResult: (result) => set({ vaccineResult: result }),
  vaccineRecommendations: '',
  setVaccineRecommendations: (recs) => set({ vaccineRecommendations: recs }),
  
  // API Keys
  apiKeys: { openrouter: '', gemini: '', zai: '', xai: '' },
  setApiKey: (provider, key) => set((state) => ({
    apiKeys: { ...state.apiKeys, [provider]: key }
  })),
  
  // وضع التحليل
  analysisMode: 'fix',
  setAnalysisMode: (mode) => set({ analysisMode: mode }),
  
  // نظام التطور الذاتي
  evolutionStats: null,
  setEvolutionStats: (stats) => set({ evolutionStats: stats }),
  evolutionProposals: [],
  addEvolutionProposal: (proposal) => set((state) => ({ 
    evolutionProposals: [...state.evolutionProposals, proposal] 
  })),
  removeEvolutionProposal: (id) => set((state) => ({ 
    evolutionProposals: state.evolutionProposals.filter(p => p.id !== id) 
  })),
  clearEvolutionProposals: () => set({ evolutionProposals: [] }),
  evolutionDiary: [],
  setEvolutionDiary: (diary) => set({ evolutionDiary: diary }),
  isEvolutionRunning: false,
  setIsEvolutionRunning: (running) => set({ isEvolutionRunning: running }),
  
  // الثيم واللغة
  theme: 'system',
  setTheme: (theme) => {
    set({ theme })
    // حفظ في localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme)
    }
  },
  language: 'ar',
  setLanguage: (language) => {
    set({ language })
    // حفظ في localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language)
    }
  }
}))

// تهيئة الثيم واللغة من localStorage
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
  const savedLanguage = localStorage.getItem('language') as 'ar' | 'en' | null
  
  if (savedTheme) {
    useAnalyzerStore.getState().setTheme(savedTheme)
  }
  if (savedLanguage) {
    useAnalyzerStore.getState().setLanguage(savedLanguage)
  }
}

// دوال مساعدة
export const generateId = () => Math.random().toString(36).substr(2, 9)

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase()
}

export const detectFileType = (filename: string): 'source' | 'data' | 'config' | 'other' => {
  const ext = getFileExtension(filename)
  const sourceExts = ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'go', 'rs', 'c', 'cpp', 'h', 'sol']
  const dataExts = ['json', 'csv', 'xml', 'yaml', 'yml', 'toml', 'db', 'sqlite', 'sql']
  const configExts = ['config', 'env', 'gitignore', 'dockerignore', 'eslintrc', 'prettierrc']
  
  if (sourceExts.includes(ext)) return 'source'
  if (dataExts.includes(ext)) return 'data'
  if (configExts.includes(ext)) return 'config'
  return 'other'
}

export const shouldIgnoreFile = (path: string): boolean => {
  return IGNORE_PATTERNS.some(pattern => path.includes(pattern))
}
