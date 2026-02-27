import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { DNAEngine, checkCodeAgainstDNA, formatDNAForDisplay, type ProjectDNA } from '@/lib/dna-engine'

interface AnalyzeRequest {
  files: { name: string; content: string; path: string }[]
  action: 'extract-dna' | 'check-consistency'
  code?: string
  fileName?: string
  existingDNA?: ProjectDNA
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json()
    const { files, action, code, fileName, existingDNA } = body

    if (action === 'extract-dna') {
      // استخراج DNA المشروع
      const engine = new DNAEngine(files)
      const dna = engine.extract()
      
      // تحليل DNA باستخدام AI للحصول على توصيات
      const zai = await ZAI.create()
      const analysisResponse = await zai.chat.completions.create({
        model: 'gemini-2.0-flash',
        messages: [
          { 
            role: 'system', 
            content: `أنت خبير في تحليل أنماط الكود. قم بتحليل الـ DNA واستخراج:
1. أنماط مميزة في المشروع
2. نقاط القوة
3. نقاط تحتاج تحسين
4. توصيات لتحسين جودة الكود`
          },
          { 
            role: 'user', 
            content: `تحليل الـ DNA:\n${JSON.stringify(formatDNAForDisplay(dna), null, 2)}` 
          }
        ]
      })

      const analysis = analysisResponse.choices?.[0]?.message?.content || ''

      return NextResponse.json({ 
        success: true, 
        dna,
        formattedDNA: formatDNAForDisplay(dna),
        analysis
      })
    }

    if (action === 'check-consistency' && code && fileName && existingDNA) {
      // فحص تطابق الكود مع DNA
      const result = checkCodeAgainstDNA(code, fileName, existingDNA)
      
      return NextResponse.json({ 
        success: true, 
        result 
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('DNA Analysis error:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تحليل DNA' },
      { status: 500 }
    )
  }
}
