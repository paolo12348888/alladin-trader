/**
 * CBOT Chat Bubble Component
 */
import { ChatMessage } from '../../types/cbot';

interface ChatBubbleProps {
  message: ChatMessage;
}

export function CbotChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 animate-in fade-in slide-in-from-bottom-2`}
    >
      <div
        className={`max-w-[85%] rounded-lg p-4 shadow-sm border transition-all duration-250 hover:border-primary/30 hover:scale-[1.01] ${
          isUser
            ? 'bg-primary/10 border-primary/20'
            : 'bg-card border-border'
        }`}
      >
        <div className="text-sm text-foreground whitespace-pre-wrap">
          {message.message}
        </div>
        <div className="text-xs font-mono text-muted-foreground mt-2">
          {new Date(message.timestamp).toLocaleTimeString('it-IT')}
        </div>
      </div>
    </div>
  );
}
