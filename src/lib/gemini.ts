// Re-export all functions from Groq implementation
// This allows us to switch AI providers without changing imports in API routes

export {
  generateChannelMix,
  generateROIAnalysis,
  generateTimelineRoadmap
} from "./groq";

export {
  generateStrategyAnalysis,
  generateCompetitorAnalysis,
  generateDeepDive,
  generateGapDetection
} from "./google-gemini";
