import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Bot, User, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { sendChatMessage, isOpenAIConfigured, type ChatMessage as OpenAIChatMessage } from "@/services/openaiService";

// Tipi per i messaggi
interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface ChatbotProps {
  ticker: string;
  isLive: boolean;
}

// Componente per un singolo messaggio
const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 shadow-md ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          <span className="font-semibold">{isUser ? "You" : "AI Assistant"}</span>
        </div>
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};

// Componente principale del Chatbot
const Chatbot: React.FC<ChatbotProps> = ({ ticker, isLive }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: t("Hello! I'm your AI trading assistant powered by GPT-4. I use advanced language models combined with LSTM, XGBoost, and LightGBM for market analysis. Ask me anything about {{ticker}} or other assets!", { ticker }),
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<OpenAIChatMessage[]>([
    {
      role: "system",
      content: `You are an expert AI trading assistant specialized in financial market analysis, technical indicators, and trading strategies. You have knowledge of LSTM, XGBoost, and LightGBM models for predictions. Currently analyzing: ${ticker}. Provide clear, actionable insights and maintain a professional yet friendly tone.`
    }
  ]);
  // Verifica se OpenAI è configurato
  const isConfigured = isOpenAIConfigured();

  // Funzione per inviare messaggi usando OpenAI reale
  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    if (!isConfigured) {
      toast.error("OpenAI API key non configurata. Configura la chiave nelle impostazioni.");
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      text: input.trim(),
      sender: "user",
    };

    // Aggiunge il messaggio dell'utente
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Aggiorna la cronologia della conversazione
    const updatedHistory: OpenAIChatMessage[] = [
      ...conversationHistory,
      {
        role: "user",
        content: input.trim()
      }
    ];

    try {
      // Chiamata reale all'API OpenAI
      const aiResponse = await sendChatMessage(updatedHistory, 'gpt-4o-mini');

      const botMessage: Message = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: "bot",
      };

      // Aggiorna messaggi e cronologia
      setMessages((prev) => [...prev, botMessage]);
      setConversationHistory([
        ...updatedHistory,
        {
          role: "assistant",
          content: aiResponse
        }
      ]);

      toast.success("Risposta ricevuta dall'AI");
    } catch (error) {
      console.error("Errore comunicazione AI:", error);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Mi dispiace, si è verificato un errore nella comunicazione. Per favore riprova o verifica la configurazione dell'API key.",
        sender: "bot",
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Errore comunicazione con AI Chatbot");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <Card className="border-border flex flex-col h-[500px]">
      <CardHeader className="border-b border-border p-4">
        <CardTitle className="text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {t("AI Chatbot")} {isConfigured && <span className="text-xs text-green-500">(GPT-4 Attivo)</span>}
        </CardTitle>
        {!isConfigured ? (
          <div className="flex items-center gap-2 text-sm text-orange-500">
            <AlertCircle className="h-4 w-4" />
            <span>API key OpenAI non configurata</span>
          </div>
        ) : (
          <p className={`text-sm font-medium ${isLive ? "text-green-500" : "text-red-500"}`}>
            {isLive ? t("Chatbot is live and powered by OpenAI GPT-4.") : t("Chatbot is currently offline.")}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 p-4 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 bg-muted text-muted-foreground shadow-md">
                  <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
                  <span className="text-sm">{t("AI Assistant is thinking...")}</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t border-border p-4">
        <div className="flex w-full space-x-2">
          <Input
            placeholder={t("Type your message...")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || !isLive || !isConfigured}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !isLive || !isConfigured}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">{t("Send")}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Chatbot;
