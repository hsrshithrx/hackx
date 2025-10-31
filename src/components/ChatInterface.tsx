import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Mic, ArrowLeft, Languages, VolumeX, MessageCircle, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  onBack: () => void;
}

const ChatInterface = ({ onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm VEEVA, your AI-powered health companion that understands your needs — helping you track wellness, analyze reports, and stay on top of your health journey with ease and precision. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState("en");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clean up speech synthesis on component unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopListening();
    };
  }, []);

  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    currentUtteranceRef.current = null;
    setIsSpeaking(false);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech first
      stopSpeaking();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
      };
      
      currentUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Stop any ongoing speech when user sends a new message
    stopSpeaking();

    try {
      const { data, error } = await supabase.functions.invoke("health-chat", {
        body: { message: userMessage, language }
      });

      if (error) throw error;

      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      
      // Speak the response
      speakResponse(data.response);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Connection Error",
        description: "Unable to reach health assistant. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = async () => {
    if (isListening) {
      // Stop recording
      stopListening();
      toast({
        title: "Voice input completed",
        description: "Processing your message..."
      });
    } else {
      // Start speech recognition
      try {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
          throw new Error('Speech recognition not supported');
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = language;
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          // Stop AI speaking when user starts speaking
          stopSpeaking();
          setIsListening(true);
          toast({
            title: "Voice input activated",
            description: "Speak clearly into your microphone..."
          });
        };

        recognition.onresult = async (event: any) => {
          const transcript = event.results[0][0].transcript;
          setMessages(prev => [...prev, { role: "user", content: transcript }]);
          setIsLoading(true);

          try {
            const { data, error } = await supabase.functions.invoke("health-chat", {
              body: { message: transcript, language }
            });

            if (error) throw error;

            setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
            
            // Speak the response
            speakResponse(data.response);
          } catch (error) {
            console.error("Voice chat error:", error);
            toast({
              title: "Processing Error",
              description: "Unable to process voice input. Please try typing your message.",
              variant: "destructive"
            });
          } finally {
            setIsLoading(false);
            setIsListening(false);
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          toast({
            title: "Voice Input Error",
            description: "Microphone access denied or not available. Please try typing instead.",
            variant: "destructive"
          });
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (error) {
        console.error("Speech recognition error:", error);
        toast({
          title: "Feature Unavailable",
          description: "Voice input is not supported in this browser. Please use text input.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div 
      className="min-h-screen p-4 md:p-6 lg:p-8"
      style={{ backgroundColor: '#FDFCF8' }} // Light cream background matching reference
    >
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              size="icon"
              onClick={onBack}
              className="rounded-full border-2 hover:scale-105 transition-all duration-200"
              style={{ 
                borderColor: '#2D2D2D',
                color: '#2D2D2D',
                backgroundColor: 'white'
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
                Health Assistant
              </h1>
              <p className="text-lg" style={{ color: '#6B6B6B' }}>
                Ask me anything about your health — I'm here to help with wellness tracking, 
                report analysis, and personalized health guidance.
              </p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5" style={{ color: '#6B6B6B' }} />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger 
                className="w-[200px] border-2"
                style={{ 
                  borderColor: '#E5E5E5',
                  backgroundColor: 'white',
                  color: '#1A1A1A'
                }}
              >
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: 'white' }}>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                <SelectItem value="te">Telugu (తెలుగు)</SelectItem>
                <SelectItem value="bn">Bengali (বাংলা)</SelectItem>
                <SelectItem value="mr">Marathi (मराठी)</SelectItem>
                <SelectItem value="gu">Gujarati (ગુજરાતી)</SelectItem>
                <SelectItem value="kn">Kannada (ಕನ್ನಡ)</SelectItem>
                <SelectItem value="ml">Malayalam (മലയാളം)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Messages Container */}
        <Card 
          className="h-[calc(100vh-300px)] overflow-y-auto p-6 mb-6 border-2 shadow-sm"
          style={{ 
            backgroundColor: 'white',
            borderColor: '#E5E5E5'
          }}
        >
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                
                {/* Avatar */}
                <div 
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2"
                  style={{ 
                    backgroundColor: message.role === "user" ? '#F8F8F8' : '#1A1A1A',
                    borderColor: message.role === "user" ? '#E5E5E5' : '#1A1A1A'
                  }}
                >
                  {message.role === "user" ? (
                    <User className="w-5 h-5" style={{ color: '#2D2D2D' }} />
                  ) : (
                    <Bot className="w-5 h-5" style={{ color: 'white' }} />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`flex-1 max-w-[75%] ${message.role === "user" ? "text-right" : "text-left"}`}>
                  <div 
                    className="p-4 rounded-2xl text-base leading-relaxed shadow-sm"
                    style={{ 
                      backgroundColor: message.role === "user" ? '#1A1A1A' : '#F8F8F8',
                      color: message.role === "user" ? 'white' : '#1A1A1A',
                      borderRadius: message.role === "user" ? '20px 20px 8px 20px' : '20px 20px 20px 8px'
                    }}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {/* Message timestamp/status */}
                  <div className={`mt-2 text-sm ${message.role === "user" ? "text-right" : "text-left"}`}>
                    <span style={{ color: '#9B9B9B' }}>
                      {message.role === "assistant" ? "VEEVA" : "You"} • Just now
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-4">
                <div 
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2"
                  style={{ 
                    backgroundColor: '#1A1A1A',
                    borderColor: '#1A1A1A'
                  }}
                >
                  <Bot className="w-5 h-5" style={{ color: 'white' }} />
                </div>
                <div 
                  className="p-4 rounded-2xl shadow-sm"
                  style={{ 
                    backgroundColor: '#F8F8F8',
                    borderRadius: '20px 20px 20px 8px'
                  }}
                >
                  <div className="flex gap-2 items-center">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#6B6B6B' }} />
                      <div className="w-2 h-2 rounded-full animate-bounce delay-100" style={{ backgroundColor: '#6B6B6B' }} />
                      <div className="w-2 h-2 rounded-full animate-bounce delay-200" style={{ backgroundColor: '#6B6B6B' }} />
                    </div>
                    <span className="text-sm" style={{ color: '#6B6B6B' }}>
                      VEEVA is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </Card>

        {/* Voice Status Indicator */}
        {isSpeaking && (
          <div 
            className="mb-4 p-4 rounded-2xl border-2"
            style={{ 
              backgroundColor: '#F0F9FF',
              borderColor: '#E0F2FE'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-1 h-6 rounded animate-pulse" style={{ backgroundColor: '#0EA5E9' }} />
                  <div className="w-1 h-6 rounded animate-pulse delay-100" style={{ backgroundColor: '#0EA5E9' }} />
                  <div className="w-1 h-6 rounded animate-pulse delay-200" style={{ backgroundColor: '#0EA5E9' }} />
                </div>
                <span className="font-medium" style={{ color: '#0C4A6E' }}>
                  🔊 VEEVA is speaking...
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={stopSpeaking}
                className="border-2 hover:scale-105 transition-all"
                style={{ 
                  borderColor: '#DC2626',
                  color: '#DC2626',
                  backgroundColor: 'white'
                }}
              >
                <VolumeX className="w-4 h-4 mr-2" />
                Stop Speaking
              </Button>
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="flex gap-3 items-end">
          {/* Voice Button - UPDATED TO GREEN WITH NO LINE */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleVoice}
            disabled={isSpeaking}
            className="rounded-full border-2 h-12 w-12 transition-all duration-200 hover:scale-105"
            style={{ 
              // Green color when listening, gray when not
              borderColor: isListening ? '#10B981' : '#2D2D2D',
              backgroundColor: isListening ? '#ECFDF5' : 'white',
              color: isListening ? '#10B981' : '#2D2D2D'
            }}
          >
            {/* Always show normal Mic icon - NO MicOff */}
            <Mic className="w-5 h-5" />
          </Button>

          {/* Text Input */}
          <div className="flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your health question or concern here..."
              disabled={isLoading}
              className="h-12 text-base border-2 focus:ring-0 rounded-xl"
              style={{ 
                borderColor: '#E5E5E5',
                backgroundColor: '#FAFAFA',
                color: '#1A1A1A'
              }}
              onFocus={() => {
                // Stop speaking when user focuses on input to type
                if (isSpeaking) {
                  stopSpeaking();
                }
              }}
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="rounded-full h-12 w-12 transition-all duration-200 hover:scale-105 disabled:opacity-50"
            style={{ 
              backgroundColor: '#1A1A1A',
              color: 'white'
            }}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>

        {/* Status Messages */}
        {(isListening || isSpeaking) && (
          <div className="mt-4 text-center">
            {isListening && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#10B981' }} />
                <p className="text-base font-medium" style={{ color: '#6B6B6B' }}>
                  🎤 Listening for your voice input... Speak clearly
                </p>
              </div>
            )}
            {isSpeaking && !isListening && (
              <p className="text-base" style={{ color: '#6B6B6B' }}>
                💬 Use the "Stop Speaking" button above to interrupt the AI response
              </p>
            )}
          </div>
        )}

        {/* Helper Text */}
        <div className="mt-4 text-center">
          <p className="text-sm" style={{ color: '#9B9B9B' }}>
            💡 Tip: You can ask about symptoms, medication questions, wellness tips, or request help understanding medical reports
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
