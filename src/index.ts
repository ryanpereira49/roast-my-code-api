import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { GoogleGenAI } from '@google/genai'

const app = new Hono()
app.use('/*', cors())
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

app.post('/roast', async (c) => {
  try {
    const body = await c.req.json()
    const code = body.code
    const niceness = body.niceness || 1
    const persona = body.persona || 'Senior Developer'
    const language_hate = body.language_hate === true
    const focus = body.focus || '' // 'performance', 'readability', 'security'
    const one_liner = body.one_liner === true
    const emoji_toxicity = body.emoji_toxicity || 0 // 1, 2, or 3

    if (!code) {
      return c.json({ error: 'Please provide a code snippet to roast ({"code": "..."})' }, 400)
    }

    let systemInstructionOptions = []

    // 1. Base Persona & Niceness Level
    let nicenessPrompt = ''
    if (niceness == 1) {
      nicenessPrompt = "You are absolutely savage. Leave no stone unturned. Destroy their ego. Be brutal, hilarious, and merciless."
    } else if (niceness < 5) {
      nicenessPrompt = "Roast them hard, but with a slight hint of pity. Still very funny and mean."
    } else if (niceness < 8) {
      nicenessPrompt = "Give them a medium roast. Point out the flaws mockingly but keep it somewhat lighthearted."
    } else {
      nicenessPrompt = "Give them a very gentle, friendly ribbing. Like a warm hug with a slight pinch."
    }
    
    systemInstructionOptions.push(`You are acting as the following persona: ${persona}.`)
    systemInstructionOptions.push(`Tone instructions: ${nicenessPrompt}`)

    // 2. Language Hate
    if (language_hate) {
      systemInstructionOptions.push("Identify the programming language being used and brutally mock the user for choosing it. Relentlessly roast the language's known quirks, flaws, and stereotypes.")
    }

    // 3. Focus
    if (focus) {
      systemInstructionOptions.push(`Hyper-fixate your roast specifically on the code's ${focus}. Tear apart their approach to ${focus}.`)
    }

    // 4. Emojis
    if (emoji_toxicity == 1) {
      systemInstructionOptions.push("Include a few passive-aggressive emojis here and there (like 🙄, 😬, 🤦).")
    } else if (emoji_toxicity == 2) {
      systemInstructionOptions.push("Use a lot of condescending and sarcastic emojis throughout your response.")
    } else if (emoji_toxicity == 3) {
      systemInstructionOptions.push("Drown your response in extremely toxic, zoomer/TikTok-comment-section level emojis (like 💀, 😭, 🤡, 🗑️, 📉). Make it painful to look at.")
    }

    // 5. Length Constraint
    if (one_liner) {
      systemInstructionOptions.push("RESTRICTION: Your entire response MUST be exactly one single, punchy, devastating sentence.")
    }

    systemInstructionOptions.push("Respond ONLY with the roast text, nothing else.")

    const systemInstruction = systemInstructionOptions.join('\n\n')

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: code,
      config: {
        systemInstruction,
      }
    })

    return c.json({ roast: response.text })
  } catch (error) {
    console.error('Error roasting code:', error)
    return c.json({ error: 'Failed to roast the code. Did you provide a valid API key?' }, 500)
  }
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
