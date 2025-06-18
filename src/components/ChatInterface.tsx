import React, { useEffect, useRef, useState } from 'react';
import { createChat } from '@n8n/chat';
import { MessageCircle, Minimize2, Maximize2 } from 'lucide-react';

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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatInstance, setChatInstance] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (chatContainerRef.current && webhookUrl && !chatInstance) {
      try {
        const chat = createChat({
          webhookUrl,
          webhookConfig: {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          },
          chatInputKey: 'chatInput',
          chatSessionKey: 'sessionId',
          metadata: {},
          showWelcomeScreen: false,
          showPoweredBy: false,
          initialMessages: initialMessage ? [
            {
              text: initialMessage,
              sender: 'bot',
              createdAt: new Date().toISOString(),
            }
          ] : [],
          i18n: {
            en: {
              title: 'AI Prompt Assistant',
              subtitle: 'Let me help you create the perfect prompt',
              footer: '',
              getStarted: 'Get Started',
              inputPlaceholder: 'Type your message...',
              sendButtonTooltip: 'Send message',
            },
          },
          theme: {
            primaryColor: '#4f46e5',
            textColor: '#374151',
            backgroundColor: '#ffffff',
            chatWindow: {
              backgroundColor: '#f9fafb',
              height: '400px',
              width: '100%',
            },
          },
        });

        chat.mount(chatContainerRef.current);
        setChatInstance(chat);
        setIsLoaded(true);

        // Listen for chat events if needed
        chat.on('message', (message: any) => {
          console.log('New message:', message);
          // You can handle message events here if needed
        });

      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    }

    return () => {
      if (chatInstance) {
        chatInstance.unmount();
      }
    };
  }, [webhookUrl, initialMessage, chatInstance]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleUsePrompt = () => {
    // This would extract the final prompt from the chat
    // For now, we'll use a placeholder
    const finalPrompt = "Generated prompt from chat conversation";
    onChatComplete?.(finalPrompt);
  };

  return (
    <div className={`border rounded-lg bg-white shadow-sm ${className}`}>
      <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-indigo-600" />
          <h3 className="font-medium text-gray-900">AI Prompt Assistant</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMinimize}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title={isMinimized ? 'Expand chat' : 'Minimize chat'}
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4 text-gray-600" />
            ) : (
              <Minimize2 className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>
      
      <div 
        className={`transition-all duration-300 ${
          isMinimized ? 'h-0 overflow-hidden' : 'h-96'
        }`}
      >
        <div 
          ref={chatContainerRef} 
          className="h-full w-full"
          style={{ minHeight: isMinimized ? '0' : '384px' }}
        />
        
        {!isLoaded && !isMinimized && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Loading chat interface...</p>
            </div>
          </div>
        )}
      </div>
      
      {!isMinimized && isLoaded && (
        <div className="p-3 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={handleUsePrompt}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Use This Prompt
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;