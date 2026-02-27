/**
 * الوكيل العائم (Floating Agent)
 * نافذة دردشة عائمة للتفاعل السريع مع المستخدم
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useAnalyzerStore } from '@/store/analyzer-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  Bot, X, Send, Minimize2, Maximize2, Sparkles, 
  Code, Bug, Lightbulb, Zap, MessageSquare
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// ردود ذكية مسبقة
const SMART_RESPONSES = [
  {
    triggers: ['كيف', 'كيف أستخدم', 'طريقة الاستخدام'],
    response: 'يمكنك رفع ملف أو مشروع كامل، ثم اختيار النموذج والشخصية المناسبة، والضغط على "تحليل". سأقوم بتحليل الكود واقتراح التحسينات!'
  },
  {
    triggers: ['خطأ', 'مشكلة', 'لا يعمل', 'فشل'],
    response: 'يمكنني مساعدتك في تشخيص المشكلة! ارفع الكود المسبب للمشكلة وسأقوم بتحليله وتقديم حلول محددة.'
  },
  {
    triggers: ['تحسين', 'أفضل', 'كفاءة', 'أداء'],
    response: 'لتحسين الأداء، أنصحك بـ:\n1. استخدام وضع الأخطبوط للتحليل المزدوج\n2. اختيار نموذج مناسب للتحليل\n3. مراجعة قسم "التطور الذاتي" للاطلاع على الاقتراحات'
  },
  {
    triggers: ['شخصية', 'أفضل شخصية', 'أي شخصية'],
    response: 'لدينا 5 شخصيات:\n🕵️ المحقق - للأخطاء المنطقية\n🛡️ الحارس الأمني - للثغرات\n⛓️ حارس Web3 - للعقود الذكية\n⚡ المحسن - للأداء\n🧹 المنظم - للجودة'
  },
  {
    triggers: ['مرحبا', 'أهلا', 'السلام'],
    response: 'أهلاً بك! 👋 أنا وكيلك الذكي. كيف يمكنني مساعدتك اليوم؟'
  }
]

export function FloatingAgent() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'مرحباً! 👋 أنا وكيلك الذكي. يمكنني مساعدتك في:\n• تحليل الكود واقتراح التحسينات\n• شرح كيفية استخدام المنصة\n• حل المشاكل والأخطاء\n\nكيف يمكنني مساعدتك؟',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const { addLog } = useAnalyzerStore()

  // التمرير التلقائي للرسائل الجديدة
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // إرسال رسالة
  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // محاكاة التفكير
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))

    // البحث عن رد مناسب
    let response = ''
    const lowerInput = userMessage.content.toLowerCase()
    
    for (const item of SMART_RESPONSES) {
      if (item.triggers.some(trigger => lowerInput.includes(trigger))) {
        response = item.response
        break
      }
    }

    // رد افتراضي ذكي
    if (!response) {
      response = generateSmartResponse(userMessage.content)
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)
    addLog('info', `وكيل: رد على "${userMessage.content.substring(0, 30)}..."`, 'agent')
  }

  // توليد رد ذكي
  const generateSmartResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('تحليل') || lowerQuery.includes('analyze')) {
      return 'لتحليل الكود:\n1. ارفع الملفات من تبويب "محلل الكود"\n2. اختر نموذج من الإعدادات\n3. اختر الشخصية المناسبة\n4. اضغط "تحليل"\n\nيمكنني مساعدتك في أي خطوة!'
    }
    
    if (lowerQuery.includes('بيانات') || lowerQuery.includes('data')) {
      return 'مركز البيانات يتيح لك:\n• البحث عن ملفات البيانات (SQLite, JSON, CSV)\n• الاتصال بقواعد بيانات خارجية\n• معاينة وتحرير البيانات\n\nجرب البحث العميق مع وضع الأخطبوط! 🐙'
    }
    
    if (lowerQuery.includes('مختبر') || lowerQuery.includes('lab')) {
      return 'المختبر هو مكان تجربة الكود:\n• محاكاة تنفيذ الكود\n• تحويل الكود التجريبي إلى إنتاجي\n• توليد التوثيق تلقائياً\n\nحاول كتابة كود والضغط على "محاكاة"!'
    }
    
    if (lowerQuery.includes('تطور') || lowerQuery.includes('evolution')) {
      return 'نظام التطور الذاتي يعمل على:\n• مراقبة الأخطاء والأداء\n• اقتراح تحسينات تلقائية\n• زيادة مستوى الثقة مع كل نجاح\n\nيمكنك تشغيل دورة تطور من تبويب "التطور الذاتي"! 🧬'
    }

    // رد عام
    return 'شكراً على سؤالك! يمكنني مساعدتك في:\n• 📁 تحليل الملفات والمشاريع\n• 🔍 اكتشاف البيانات\n• 🧪 تجارب المختبر\n• 🧬 التطور الذاتي\n\nاطرح سؤالك بشكل محدد وسأساعدك!'
  }

  // اقتراحات سريعة
  const quickActions = [
    { icon: Code, label: 'تحليل كود', action: 'كيف أحلل كود؟' },
    { icon: Bug, label: 'إصلاح خطأ', action: 'كيف أصلح خطأ في الكود؟' },
    { icon: Lightbulb, label: 'اقتراحات', action: 'ما هي الاقتراحات لتحسين الكود؟' },
    { icon: Zap, label: 'أداء', action: 'كيف أحسن أداء الكود؟' }
  ]

  return (
    <>
      {/* النافذة العائمة */}
      {isOpen && !isMinimized && (
        <div 
          className={cn(
            "fixed z-50 flex flex-col rounded-2xl shadow-2xl border backdrop-blur-sm",
            "bg-background/95 border-border",
            "bottom-24 left-6",
            "w-[380px] h-[520px]",
            "animate-in fade-in-0 zoom-in-95 duration-200"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-l from-purple-600 to-indigo-600 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">الوكيل الذكي</h3>
                <p className="text-xs text-white/70">مساعدك الشخصي</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5",
                      message.role === 'user'
                        ? "bg-primary text-primary-foreground rounded-bl-none"
                        : "bg-muted rounded-br-none"
                    )}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {/* مؤشر الكتابة */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-br-none px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => {
                      setInput(action.action)
                    }}
                  >
                    <action.icon className="w-3 h-3" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="اسألني أي شيء..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isTyping}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* النافذة المصغرة */}
      {isOpen && isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className={cn(
            "fixed z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg",
            "bg-gradient-to-l from-purple-600 to-indigo-600 text-white",
            "bottom-24 left-6",
            "hover:shadow-xl transition-shadow"
          )}
        >
          <Bot className="w-5 h-5" />
          <span className="text-sm font-medium">الوكيل الذكي</span>
          <Sparkles className="w-4 h-4 opacity-70" />
        </button>
      )}

      {/* زر الفتح */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          setIsMinimized(false)
        }}
        className={cn(
          "fixed z-40 w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-300",
          "bg-gradient-to-l from-purple-600 to-indigo-600",
          "hover:shadow-2xl hover:scale-105",
          "bottom-6 left-6",
          isOpen && "rotate-0"
        )}
      >
        {isOpen ? (
          <X className="w-7 h-7 text-white" />
        ) : (
          <>
            <Bot className="w-7 h-7 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </>
        )}
      </button>
    </>
  )
}
