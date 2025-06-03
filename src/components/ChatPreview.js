import React, { useState } from 'react';
import Chat from './Chat';

// A wrapper for previewing the Chat component with custom context and theme
const ChatPreview = ({ initialContext = '', initialTheme = 'light' }) => {
  const [context, setContext] = useState(initialContext);
  const [theme, setTheme] = useState(initialTheme);

  // Optionally, you could pass context and theme as props to Chat if supported
  // For now, we assume Chat uses global/user settings, so this is a visual wrapper

  return (
    <div className={theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} style={{ minHeight: 400 }}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Preview Context</label>
        <textarea
          className="w-full px-3 py-2 border rounded mb-2"
          rows={3}
          value={context}
          onChange={e => setContext(e.target.value)}
        />
        <label className="block text-sm font-medium mb-1">Theme</label>
        <select
          className="w-full px-3 py-2 border rounded"
          value={theme}
          onChange={e => setTheme(e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      {/* Render the Chat component. In a real implementation, pass context/theme as props or via context API */}
      <div className="border rounded shadow p-2 bg-slate-100 dark:bg-slate-800">
        <Chat key={theme + context} />
      </div>
    </div>
  );
};

export default ChatPreview;
