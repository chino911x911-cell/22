import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { VaccineEngine, formatVaccineResult, type MutationResult } from '@/lib/vaccine-engine'

interface VaccineRequest {
  code: string
  language?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: VaccineRequest = await request.json()
    const { code, language = 'javascript' } = body

    // إنشاء محرك اللقاح
    const engine = new VaccineEngine(code)
    
    // توليد الطفرات
    const mutants = engine.generateMutants()
    
    // محاكاة تشغيل الاختبارات
    const result = engine.simulateTestRun()
    
    // تحليل النتائج باستخدام AI
    const zai = await ZAI.create()
    const analysisResponse = await zai.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [
        { 
          role: 'system', 
          content: `أنت خبير اختبارات برمجية. قم بتحليل نتائج Mutation Testing وقدم توصيات عملية لتحسين جودة الاختبارات.`
        },
        { 
          role: 'user', 
          content: `نتائج اختبار اللقاح:
- درجة المناعة: ${result.mutationScore}%
- إجمالي الطفرات: ${result.totalMutants}
- الطفرات المكتشفة: ${result.killedMutants}
- الطفرات الناجية: ${result.survivedMutants}

نقاط الضعف:
${result.weakSpots.map(s => `- [${s.severity}] السطر ${s.line}: ${s.message}`).join('\n')}

قدم توصيات مختصرة لتحسين الاختبارات.` 
        }
      ]
    })

    const recommendations = analysisResponse.choices?.[0]?.message?.content || ''

    return NextResponse.json({ 
      success: true, 
      result,
      formattedResult: formatVaccineResult(result),
      recommendations
    })

  } catch (error) {
    console.error('Vaccine error:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في المختبر' },
      { status: 500 }
    )
  }
}
