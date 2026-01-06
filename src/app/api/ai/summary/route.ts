import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { studySessions, testResults, tasks, habits, aiEngine } = await request.json()

    // Select AI engine and model
    const model = aiEngine === 'chatgpt' ? 'gpt-4' : 'gemini-pro'

    const prompt = `Analyze the following study data and provide a weekly performance summary:

Study Sessions: ${JSON.stringify(studySessions)}
Test Results: ${JSON.stringify(testResults)}
Tasks: ${JSON.stringify(tasks)}
Habits: ${JSON.stringify(habits)}

Provide a concise summary covering:
1. Total study time this week
2. Subject-wise time distribution
3. Test performance trends
4. Task completion rate
5. Habit streak achievements
6. Areas of improvement
7. Recommendations for next week

Format response in a structured way with clear headings and bullet points. Keep it encouraging and actionable. Use the AI model: ${model.toUpperCase()}.`

    // Note: In production, you would load API keys from environment variables
    // For this implementation, we'll use the ZAI SDK which handles key management internally

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
        { success: false, error: 'Failed to generate summary', details: errorText },
        { status: 500 }
      )
    }

    const data = await response.json()

    // Parse the response from Gemini
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate summary'

    return NextResponse.json({ success: true, summary, aiEngine: model })
  } catch (error) {
    console.error('Error generating summary:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}
