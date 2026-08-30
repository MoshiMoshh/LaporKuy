'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, HelpCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Halo! Ada yang bisa kami bantu terkait laporan, poin, atau cara kerja LaporKuy?',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman secara paksa
    
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Memeriksa apakah ini response JSON (Mock) atau Stream
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message || data.error || 'Terjadi kesalahan.',
        }]);
      } else {
        // Menangani stream dari Vercel AI SDK
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let botResponse = '';
        const botMessageId = (Date.now() + 1).toString();
        
        setMessages(prev => [...prev, { id: botMessageId, role: 'assistant', content: '' }]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            // Vercel stream format usually starts with '0:'
            const lines = chunk.split('\n').filter(line => line.trim() !== '');
            for (const line of lines) {
              if (line.startsWith('0:')) {
                try {
                  const text = JSON.parse(line.substring(2));
                  botResponse += text;
                  setMessages(prev => prev.map(msg => 
                    msg.id === botMessageId ? { ...msg, content: botResponse } : msg
                  ));
                } catch (e) {
                  // Ignore parsing errors for partial chunks
                }
              }
            }
          }
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Maaf, sistem AI sedang mengalami gangguan koneksi.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isOpen || e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { x: position.x, y: position.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPosition({
      x: initialPos.current.x + dx,
      y: initialPos.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    // Prevent opening if the user was just dragging it
    const moveX = Math.abs(position.x - initialPos.current.x);
    const moveY = Math.abs(position.y - initialPos.current.y);
    if (isDragging || moveX > 5 || moveY > 5) {
      e.preventDefault();
      // Reset the initialPos so we can click again without moving
      initialPos.current = { x: position.x, y: position.y };
      return;
    }
    setIsOpen(true);
  };

  return (
    <div 
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 touch-none"
      style={!isOpen ? { transform: `translate(${position.x}px, ${position.y}px)` } : {}}
    >
      {isOpen ? (
        <Card className="w-80 sm:w-[400px] shadow-2xl border border-white/20 dark:border-white/10 bg-background/70 backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300 overflow-hidden flex flex-col">
          <CardHeader className="bg-gradient-to-r from-[#0057B8] to-cyan-500 text-white p-4 flex flex-row items-center justify-between border-b border-white/10 relative">
            <div className="absolute inset-0 bg-white/5 mix-blend-overlay" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white shadow-inner backdrop-blur-md">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold tracking-wide">Bantuan LaporKuy</CardTitle>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  <p className="text-[10px] font-medium text-white/90 uppercase tracking-wider">
                    Online 24/7
                  </p>
                </div>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:bg-white/20 rounded-full transition-colors relative z-10"
              onClick={() => {
                setIsOpen(false);
                // Reset position when closed if desired, or keep it. Let's keep it.
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-4 h-[350px] overflow-y-auto space-y-4 bg-transparent scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-[#0057B8] to-cyan-500 text-white rounded-br-sm'
                      : 'bg-white/90 dark:bg-slate-800/90 border border-slate-100 dark:border-white/5 text-slate-800 dark:text-slate-200 rounded-bl-sm backdrop-blur-md'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white/90 dark:bg-slate-800/90 border border-slate-100 dark:border-white/5 text-foreground rounded-2xl rounded-bl-sm backdrop-blur-md px-4 py-3 shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0057B8]/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0057B8]/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0057B8]/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          
          <CardFooter className="p-3 border-t border-border/40 bg-background/50 backdrop-blur-md">
            <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
              <Input
                placeholder="Ketik pesan..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                autoFocus
                autoComplete="off"
                className="h-10 text-sm bg-white/50 dark:bg-slate-900/50 border-border/50 focus-visible:ring-[#0057B8]/50 rounded-full px-4"
              />
              <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="h-10 w-10 shrink-0 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 bg-[#0057B8] hover:bg-[#003B73] text-white">
                <Send className="h-4 w-4 ml-0.5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button
          onClick={handleButtonClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="h-14 w-14 rounded-full shadow-[0_0_20px_rgba(0,87,184,0.3)] hover:shadow-[0_0_30px_rgba(0,87,184,0.5)] hover:-translate-y-1 transition-all bg-gradient-to-br from-[#0057B8] to-cyan-500 text-white flex items-center justify-center group cursor-move"
        >
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform duration-300 pointer-events-none" />
        </Button>
      )}
    </div>
  );
}
