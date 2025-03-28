class SettingsService {
  constructor() {
    this.loadSettings();
  }

  loadSettings() {
    const settings = localStorage.getItem('settings');
    if (settings) {
      this.settings = JSON.parse(settings);
    } else {
      this.settings = {
        apiKey: null,
        adminContext: `You are an AI assistant for SwiftAssist, a company that provides AI-powered solutions. 
Your role is to help customers by answering questions about our services, pricing, and capabilities.
Be professional, helpful, and accurate in your responses.`,
        customerContexts: {} // Keyed by customer ID/username
      };
      this.saveSettings();
    }
  }

  saveSettings() {
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }

  setApiKey(apiKey) {
    this.settings.apiKey = apiKey;
    this.saveSettings();
  }

  getApiKey() {
    return this.settings.apiKey;
  }

  setAdminContext(context) {
    this.settings.adminContext = context;
    this.saveSettings();
  }

  getAdminContext() {
    return this.settings.adminContext;
  }

  setCustomerContext(customerId, context) {
    this.settings.customerContexts[customerId] = context;
    this.saveSettings();
  }

  getCustomerContext(customerId) {
    return this.settings.customerContexts[customerId] || this.settings.adminContext;
  }

  getContextForUser(user) {
    if (!user) return this.settings.adminContext;
    return this.settings.customerContexts[user.username] || this.settings.adminContext;
  }
}

// Export singleton instance
export const settingsService = new SettingsService();
