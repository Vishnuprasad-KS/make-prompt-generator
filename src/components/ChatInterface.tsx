import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Minimize2, Maximize2, Check } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatInterfaceProps {
  webhookUrl: string;
  initialMessage?: string;
  onChatComplete?: (finalPrompt: string) => void;
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  webhookUrl,
  initialMessage,
  onChatComplete,
  className = ''
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialMessage) {
      setMessages([{
        id: '1',
        text: initialMessage,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [initialMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          chatHistory: messages,
          sessionId: `session_${Date.now()}`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'I apologize, but I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Check if this looks like a final prompt
      if (data.finalPrompt || data.response?.includes('Here is your customized prompt:')) {
        setFinalPrompt(data.finalPrompt || data.response);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleUsePrompt = () => {
    const lastBotMessage = messages.filter(m => m.sender === 'bot').pop();
    const promptToUse = finalPrompt || lastBotMessage?.text || '';
    onChatComplete?.(promptToUse);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`border rounded-lg bg-white shadow-sm ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-indigo-600" />
          <h3 className="font-medium text-gray-900">AI Prompt Assistant</h3>
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
            {messages.length > 0 ? `${messages.length} messages` : 'Ready to chat'}
          </span>
        </div>
        <button
          onClick={toggleMinimize}
          className="p-1 hover:bg-white/50 rounded transition-colors"
          title={isMinimized ? 'Expand chat' : 'Minimize chat'}
        >
          {isMinimized ? (
            <Maximize2 className="h-4 w-4 text-gray-600" />
          ) : (
            <Minimize2 className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Chat Messages */}
      <div 
        className={`transition-all duration-300 ${
          isMinimized ? 'h-0 overflow-hidden' : 'h-80'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Bot className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Start chatting to create your perfect prompt!</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <Bot className="h-4 w-4 mt-0.5 text-indigo-600" />
                    )}
                    {message.sender === 'user' && (
                      <User className="h-4 w-4 mt-0.5 text-white" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-indigo-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="border-t p-3 bg-gray-50">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Use Prompt Button */}
      {!isMinimized && messages.some(m => m.sender === 'bot') && (
        <div className="p-3 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={handleUsePrompt}
            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <Check className="h-4 w-4 mr-2" />
            Use This Prompt
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;