import { z } from 'zod'

export const scoringFactorSchema = z.object({
  name: z.string(),
  impact: z.enum(['positive', 'negative', 'neutral']),
  weight: z.number().min(0).max(100),
  explanation: z.string(),
})

export const scoringResultSchema = z.object({
  score: z.number().int().min(0).max(100),
  rationale: z.string(),
  factors: z.array(scoringFactorSchema).min(1).max(8),
  recommendation: z.enum(['prioritize', 'consider', 'monitor', 'skip']),
})

export type ScoringFactor = z.infer<typeof scoringFactorSchema>
export type ScoringResult = z.infer<typeof scoringResultSchema>
