import Anthropic from '@anthropic-ai/sdk'

let cached: Anthropic | null = null

export function getAnthropic(): Anthropic {
  if (cached) return cached
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('Missing ANTHROPIC_API_KEY')
  cached = new Anthropic({ apiKey: key })
  return cached
}

export const SCORING_MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-opus-4-8'
