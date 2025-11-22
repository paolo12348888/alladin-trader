/**
 * CBOT Command Input Component
 */
import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface CommandInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function CbotCommandInput({ onSendMessage, disabled = false }: CommandInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-card p-4 border-t border-border">
      <div className="relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          placeholder="Scrivi un comando o messaggio..."
          className={`w-full h-12 bg-accent border border-border rounded-lg px-4 pr-14 text-sm text-foreground placeholder-muted-foreground transition-all duration-250 ${
            disabled
              ? 'cursor-not-allowed opacity-50'
              : 'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary'
          }`}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-250 ${
            disabled || !message.trim()
              ? 'bg-accent cursor-not-allowed'
              : 'bg-primary hover:bg-primary/80 active:scale-95'
          }`}
        >
          <Send className="w-4 h-4 text-primary-foreground" />
        </button>
      </div>
      
      {/* Quick commands */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {['/start', '/stop', '/status', '/portfolio', '/risk', '/help'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => setMessage(cmd)}
            className="px-2 py-1 text-xs bg-background border border-border rounded-md text-muted-foreground hover:border-primary/50 hover:text-foreground transition-all duration-150"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
