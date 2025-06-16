export interface PresetPrompt {
  id: string;
  name: string;
  template: string;
  description: string;
}

export const PRESET_PROMPTS: Record<string, PresetPrompt> = {
  // Blog collection preset
  '66a345b2baa543bc5924b256': {
    id: '66a345b2baa543bc5924b256',
    name: 'Blog Post',
    template: `Write a comprehensive blog post about [TOPIC]. The post should be engaging, informative, and optimized for SEO. 

Structure the content as follows:
- Start with a compelling introduction that hooks the reader
- Include 3-5 main sections with clear headings
- Provide relevant examples and actionable insights
- Add a conclusion that encourages reader engagement

Requirements:
- Target word count: [WORD_COUNT] words
- Include relevant keywords naturally throughout the content
- Write in a [TONE] tone (professional, conversational, etc.)
- Ensure the content provides real value to readers interested in [TOPIC]

Please customize this template with your specific topic, target audience, and requirements.`,
    description: 'Template for creating engaging blog posts with SEO optimization'
  },
  
  // Default/Integration preset
  default: {
    id: 'default',
    name: 'General Content',
    template: `Create content for [PURPOSE] that is professional, clear, and aligned with our brand voice.

Content Requirements:
- Target audience: [TARGET_AUDIENCE]
- Content type: [CONTENT_TYPE] (webpage, product description, etc.)
- Tone: [TONE] (professional, friendly, authoritative, etc.)
- Key message: [KEY_MESSAGE]

Structure:
- Clear and compelling headline
- Well-organized sections with logical flow
- Include relevant examples or use cases
- Call-to-action that drives desired user behavior

Please customize this template with your specific purpose, audience, and content requirements.`,
    description: 'General template for various content creation needs'
  }
};

export const getPresetPrompt = (collectionId: string): PresetPrompt => {
  return PRESET_PROMPTS[collectionId] || PRESET_PROMPTS.default;
};