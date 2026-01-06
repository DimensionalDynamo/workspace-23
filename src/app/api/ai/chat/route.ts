import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { messages, context, aiEngine } = await request.json()

    // Select AI model
    const model = aiEngine === 'chatgpt' ? 'gpt-4' : 'gemini-pro'

    // Build context from stored data
    const contextString = `
Current Context:
- Recent Study Sessions: ${JSON.stringify(context.studySessions || [])}
- Recent Test Results: ${JSON.stringify(context.testResults || [])}
- Syllabus Progress: ${JSON.stringify(context.syllabusProgress || [])}
- Recent Tasks: ${JSON.stringify(context.tasks || [])}

Answer questions about NIMCET 2026 preparation. When suggesting actions (like adding tasks), EXPLICITLY state "I suggest you to add task: [task name]" and ask for confirmation. Do not automatically create tasks or make changes.
    `

    const prompt = messages[messages.length - 1]?.content || ''

    const systemPrompt = `You are a helpful study assistant for NIMCET 2026 exam preparation.
You can help with:
- Mathematics problems and concepts
- Logical reasoning questions
- Computer awareness topics
- English grammar and vocabulary
- Study tips and strategies
- Time management advice
- Test-taking strategies
${contextString}

Be concise, accurate, and encouraging. Keep responses focused on exam preparation.`

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser: ${prompt}`,
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
      console.error('AI Chat Error:', errorText)
      return NextResponse.json(
        { success: false, error: 'Failed to get response', details: errorText },
        { status: 500 }
      )
    }

    const data = await response.json()

    // Parse response and check for action suggestions
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t process that request.'

    // Check if AI is suggesting an action
    const suggestsAction = reply.toLowerCase().includes('i suggest') ||
                           reply.toLowerCase().includes('would you like') ||
                           reply.toLowerCase().includes('should you add') ||
                           reply.toLowerCase().includes('do you want me to')

    return NextResponse.json({
      success: true,
      reply,
      suggestsAction,
      aiEngine: model,
    })
  } catch (error) {
    console.error('Error in chat:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process chat' },
      { status: 500 }
    )
  }
}
