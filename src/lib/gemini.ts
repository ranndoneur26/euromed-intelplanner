// Re-export all functions from Groq implementation
// This allows us to switch AI providers without changing imports in API routes

// TEMPORARY: Using Groq for all features due to Gemini API quota exhaustion
// TODO: Switch back to google-gemini once quota is resolved or billing is enabled

export {
  generateChannelMix,
  generateROIAnalysis,
  generateTimelineRoadmap,
  // Temporarily using Groq for these instead of google-gemini
  generateStrategyAnalysis,
  generateCompetitorAnalysis,
  generateDeepDive,
  generateGapDetection
} from "./groq";

// ORIGINAL (commented out until Gemini quota is resolved):
// export {
//   generateStrategyAnalysis,
//   generateCompetitorAnalysis,
//   generateDeepDive,
//   generateGapDetection
// } from "./google-gemini";
