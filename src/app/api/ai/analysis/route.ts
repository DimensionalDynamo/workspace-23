import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { testResults, syllabusProgress, aiEngine } = await request.json()

    // Select AI engine and model
    const model = aiEngine === 'chatgpt' ? 'gpt-4' : 'gemini-pro'

    const prompt = `Analyze the following test results and syllabus progress to identify strengths and weaknesses:

Test Results: ${JSON.stringify(testResults)}
Syllabus Progress: ${JSON.stringify(syllabusProgress)}

Provide an analysis covering:
1. Strong subjects/topics (consistently high scores)
2. Weak subjects/topics (consistently low scores or incomplete)
3. Subjects/topics that need more practice
4. Prioritized learning recommendations
5. Suggested focus areas for improvement

Format response in a structured way with clear headings and bullet points. Be constructive and specific.`

    // Note: For ChatGPT, you would use the OpenAI API
    // For this implementation, we're using Gemini API for both engines

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('AI API Error:', errorText)
      return NextResponse.json(
        { success: false, error: 'Failed to generate analysis' },
        { status: 500 }
      )
    }

    const data = await response.json()

    // Parse the response from Gemini
    const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate analysis'

    return NextResponse.json({ success: true, analysis, aiEngine: model })
  } catch (error) {
    console.error('Error generating analysis:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate analysis' },
      { status: 500 }
    )
  }
}
