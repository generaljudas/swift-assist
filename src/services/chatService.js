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
    // Check if the conversation history already includes a system message
    const hasSystemMessage = conversationHistory.some(msg => msg.role === 'system');
    
    // Format messages properly, ensuring we have the right structure
    const messages = hasSystemMessage 
      ? [...conversationHistory] // Use the provided system message
      : [{ role: 'system', content: SYSTEM_CONTEXT }, ...conversationHistory]; // Add default system context
    
    // Add the current user message if it's not already included in the history
    if (!messages.some(msg => msg.role === 'user' && msg.content === message)) {
      messages.push({ role: 'user', content: message });
    }

    try {
      // Make the API request following OpenAI's guidelines
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: messages,
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

      // Extract the response content following the correct path
      if (response.data && 
          response.data.choices && 
          response.data.choices.length > 0 && 
          response.data.choices[0].message) {
        return response.data.choices[0].message.content;
      } else {
        throw new Error('Unexpected response structure from OpenAI API');
      }
    } catch (error) {
      // Improved error handling with detailed logging
      console.error('OpenAI API Error:', error.response?.data || error.message);
      
      // Check for specific error types
      if (error.response?.status === 401) {
        throw new Error('Authentication error: Please check your API key');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded: Too many requests to the OpenAI API');
      } else if (error.response?.data?.error) {
        throw new Error(`OpenAI API error: ${error.response.data.error.message}`);
      } else {
        throw new Error('Failed to get response from OpenAI. Please try again later.');
      }
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
