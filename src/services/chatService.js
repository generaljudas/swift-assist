import axios from 'axios';

// Configuration for different AI providers
const AI_PROVIDERS = {
  OPENAI: 'openai',
  // Add more providers here as they become available
  // DEEPSEEK: 'deepseek',
};

// System message to provide context about your services
const SYSTEM_CONTEXT = `You are an AI assistant for SwiftAssist, a company that provides AI-powered solutions. 
Your role is to help customers by answering questions about our services, pricing, and capabilities.
Be professional, helpful, and accurate in your responses.`;

class ChatService {
  constructor() {
    this.currentProvider = AI_PROVIDERS.OPENAI;
    this.apiKey = null;
    this.CHAT_HISTORY_KEY = 'swiftassist_chat_history';
  }


  setApiKey(key) {
    this.apiKey = key;
  }

  async sendMessage(message, conversationHistory = []) {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }

    try {
      return await this.sendWithCurrentProvider(message, conversationHistory);
    } catch (error) {
      console.error(`Error with provider ${this.currentProvider}:`, error);
      // Implement fallback logic here when more providers are added
      throw error;
    }
  }

  async sendWithCurrentProvider(message, conversationHistory) {
    switch (this.currentProvider) {
      case AI_PROVIDERS.OPENAI:
        return await this.sendToOpenAI(message, conversationHistory);
      // Add cases for other providers as they become available
      default:
        throw new Error(`Unknown provider: ${this.currentProvider}`);
    }
  }

  async sendToOpenAI(message, conversationHistory) {
    const messages = [
      { role: 'system', content: SYSTEM_CONTEXT },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages,
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || 'Failed to get response from OpenAI');
    }
  }

  // Method to switch providers if needed
  switchProvider(provider) {
    if (!Object.values(AI_PROVIDERS).includes(provider)) {
      throw new Error(`Invalid provider: ${provider}`);
    }
    this.currentProvider = provider;
  }
}

// Export singleton instance
export const chatService = new ChatService();
export { AI_PROVIDERS };
