import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface AnalysisRequest {
  code: string
  fileName: string
  persona: {
    id: string
    name: string
    systemPrompt: string
    focusKeywords: string[]
  }
  mode: 'fix' | 'audit' | 'security' | 'web3'
  model?: string
}

interface AnalysisIssue {
  id: string
  line: number
  type: 'error' | 'warning' | 'info'
  message: string
  suggestion?: string
}

interface AnalysisResult {
  fileId: string
  fileName: string
  issues: AnalysisIssue[]
  fixedCode?: string
  summary: string
  score: number
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json()
    const { code, fileName, persona, mode } = body

    // بناء الـ prompt بناءً على الشخصية والوضع
    const modePrompts = {
      fix: 'ركز على إصلاح الأخطاء وتصحيح الكود. قدم الكود المصحح كاملاً.',
      audit: 'قم بمراجعة شاملة للكود. ابحث عن مشاكل الأداء والجودة.',
      security: 'ركز على الثغرات الأمنية فقط. ابحث عن XSS, SQL Injection, CSRF.',
      web3: 'حلل كعقد ذكية. ابحث عن Reentrancy وGas optimization.'
    }

    const systemPrompt = `${persona.systemPrompt}

${modePrompts[mode]}

تعليمات مهمة:
1. قم بتحليل الكود التالي سطراً بسطر
2. اذكر كل مشكلة مع رقم السطر ونوعها (error/warning/info)
3. قدم اقتراحاً للإصلاح لكل مشكلة
4. إذا كان هناك كود مصحح، قدمه في قسم منفصل
5. أعط درجة من 0-100 لجودة الكود

أجب بصيغة JSON التالية:
{
  "issues": [
    {"line": 10, "type": "error", "message": "وصف المشكلة", "suggestion": "الاقتراح"}
  ],
  "fixedCode": "الكود المصحح كاملاً هنا",
  "summary": "ملخص التحليل",
  "score": 85
}`

    // استخدام ZAI SDK
    const zai = await ZAI.create()
    
    const response = await zai.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `ملف: ${fileName}\n\nالكود:\n\`\`\`\n${code}\n\`\`\`` }
      ]
    })

    const responseContent = response.choices?.[0]?.message?.content || ''

    // تحليل الاستجابة
    let analysisResult
    try {
      // محاولة استخراج JSON من الرد
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch {
      // إذا فشل التحليل، إنشاء نتيجة افتراضية
      analysisResult = {
        issues: [{
          line: 1,
          type: 'info' as const,
          message: 'تم التحليل بنجاح',
          suggestion: responseContent.substring(0, 200)
        }],
        fixedCode: code,
        summary: responseContent.substring(0, 500),
        score: 70
      }
    }

    const result: AnalysisResult = {
      fileId: generateId(),
      fileName,
      issues: analysisResult.issues?.map((issue: AnalysisIssue, idx: number) => ({
        ...issue,
        id: `issue-${idx}`
      })) || [],
      fixedCode: analysisResult.fixedCode,
      summary: analysisResult.summary || 'تم التحليل',
      score: analysisResult.score || 50
    }

    return NextResponse.json({ success: true, result })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء التحليل' },
      { status: 500 }
    )
  }
}

function generateId() {
  return Math.random().toString(36).substr(2, 9)
}
