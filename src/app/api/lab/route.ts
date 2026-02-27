import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface LabRequest {
  code: string
  action: 'simulate' | 'transform' | 'document'
  language?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LabRequest = await request.json()
    const { code, action, language = 'javascript' } = body

    const zai = await ZAI.create()

    if (action === 'simulate') {
      return await simulateCode(zai, code, language)
    }

    if (action === 'transform') {
      return await transformCode(zai, code, language)
    }

    if (action === 'document') {
      return await documentCode(zai, code, language)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Lab error:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في المختبر' },
      { status: 500 }
    )
  }
}

async function simulateCode(zai: Awaited<ReturnType<typeof ZAI.create>>, code: string, language: string) {
  const systemPrompt = `أنت محرك محاكاة للكود. مهمتك:
1. تحليل الكود للبحث عن أخطاء محتملة
2. محاكاة تنفيذ الكود مع مدخلات مختلفة
3. اكتشاف السيناريوهات الخطرة (Fuzzing)
4. قياس الأداء المتوقع

أجب بصيغة JSON:
{
  "executionTime": "تقدير زمن التنفيذ",
  "memoryUsage": "تقدير استخدام الذاكرة",
  "issues": ["قائمة المشاكل المكتشفة"],
  "suggestions": ["قائمة الاقتراحات"],
  "testCases": [
    {"input": "مدخل الاختبار", "output": "المخرج المتوقع", "passed": true}
  ],
  "risks": ["المخاطر المحتملة"]
}`

  const response = await zai.chat.completions.create({
    model: 'gemini-2.0-flash',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `لغة البرمجة: ${language}\n\nالكود:\n\`\`\`${language}\n${code}\n\`\`\`` }
    ]
  })

  const responseContent = response.choices?.[0]?.message?.content || ''
  
  let result
  try {
    const jsonMatch = responseContent.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      result = JSON.parse(jsonMatch[0])
    } else {
      result = { summary: responseContent }
    }
  } catch {
    result = { summary: responseContent }
  }

  return NextResponse.json({ success: true, result })
}

async function transformCode(zai: Awaited<ReturnType<typeof ZAI.create>>, code: string, language: string) {
  const systemPrompt = `أنت محول كود احترافي. مهمتك تحويل الكود التجريبي إلى كود إنتاجي:

1. إزالة console.log وdebug statements
2. إضافة معالجة أخطاء شاملة
3. تحسين الأداء
4. إضافة تعليقات توثيقية
5. اتباع أفضل الممارسات

أعد الكود المحسن فقط بدون شرح إضافي.`

  const response = await zai.chat.completions.create({
    model: 'gemini-2.0-flash',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `لغة البرمجة: ${language}\n\nالكود:\n\`\`\`${language}\n${code}\n\`\`\`` }
    ]
  })

  const responseContent = response.choices?.[0]?.message?.content || ''

  // استخراج الكود من الرد
  let transformedCode = responseContent
  const codeMatch = responseContent.match(/```[\w]*\n?([\s\S]*?)```/)
  if (codeMatch) {
    transformedCode = codeMatch[1].trim()
  }

  return NextResponse.json({ 
    success: true, 
    transformedCode,
    originalLength: code.length,
    newLength: transformedCode.length
  })
}

async function documentCode(zai: Awaited<ReturnType<typeof ZAI.create>>, code: string, language: string) {
  const systemPrompt = `أنت موثق كود. مهمتك:
1. إنشاء ملف README.md شامل
2. شرح وظائف الكود
3. توثيق المعاملات والمدخلات
4. إضافة أمثلة استخدام
5. ذكر المتطلبات والتوابع`

  const response = await zai.chat.completions.create({
    model: 'gemini-2.0-flash',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `لغة البرمجة: ${language}\n\nالكود:\n\`\`\`${language}\n${code}\n\`\`\`` }
    ]
  })

  return NextResponse.json({ 
    success: true, 
    documentation: response.choices?.[0]?.message?.content || '' 
  })
}
