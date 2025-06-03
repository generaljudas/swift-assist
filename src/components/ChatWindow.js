import React from 'react';

// Only the chat window (messages + input), no nav, no animated text, no outer layout
const ChatWindow = ({ messages, inputMessage, isLoading, onInputChange, onSend, inputRef, messagesEndRef }) => (
  <div className="w-full max-w-3xl bg-gray-50 rounded-lg shadow-xl overflow-hidden mx-auto">
    {/* Messages container */}
    <div className="h-[500px] sm:h-[550px] lg:h-[600px] overflow-y-auto p-4 sm:p-6">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
        >
          <div
            className={`inline-block max-w-[70%] rounded-lg px-4 py-2 ${
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="text-left mb-4">
          <div className="inline-block bg-gray-200 text-gray-800 rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
    {/* Message input form */}
    <form onSubmit={onSend} className="p-4 border-t border-gray-200">
      <div className="flex space-x-4">
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={onInputChange}
          placeholder="Ask a question..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          disabled={isLoading}
          autoFocus
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </form>
  </div>
);

export default ChatWindow;
