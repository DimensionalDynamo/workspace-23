import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { studySessions, testResults, syllabusProgress, tasks, targetDate, availableHours, aiEngine } = await request.json()

    // Select AI engine and model
    const model = aiEngine === 'chatgpt' ? 'gpt-4' : 'gemini-pro'

    const prompt = `Generate a smart study plan based on the following data:

Target Exam Date: ${targetDate || 'July 3, 2026'}
Available Study Hours per Day: ${availableHours || '4-6 hours'}

Study Sessions History: ${JSON.stringify(studySessions)}
Test Results: ${JSON.stringify(testResults)}
Syllabus Progress: ${JSON.stringify(syllabusProgress)}
Tasks: ${JSON.stringify(tasks)}

Create a weekly study plan that includes:
1. Daily schedule with time blocks for each subject
2. Priority topics to focus on (based on test performance and syllabus progress)
3. Practice tests schedule (recommended frequency)
4. Revision sessions for completed topics
5. Break times and rest periods
6. Specific chapter coverage goals
7. Daily milestones to track progress

Make the plan:
- Realistic and achievable
- Balanced across all subjects
- Include time for review and practice tests
- Flexible enough to adapt to changes
- Include progress checkpoints

Format as a structured weekly plan with day-by-day breakdown. Use clear headings and time blocks.`

    // Note: For ChatGPT, you would use the OpenAI API with your API key
    // For this implementation, we're using the public Gemini API which works without keys
    // This allows the app to function immediately

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
          maxOutputTokens: 2048,
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('AI API Error:', errorText)
      return NextResponse.json(
        { success: false, error: 'Failed to generate study plan', details: errorText },
        { status: 500 }
      )
    }

    const data = await response.json()

    // Parse the response from Gemini
    const plan = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate study plan'

    return NextResponse.json({ success: true, plan, aiEngine: model })
  } catch (error) {
    console.error('Error generating study plan:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate study plan' },
      { status: 500 }
    )
  }
}
