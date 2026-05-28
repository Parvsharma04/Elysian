'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthStore } from '@/store/health-store';
import { ChatBubble } from './ChatBubble';
import { SuggestedPrompts } from './SuggestedPrompts';
import { Send, Sparkles, Loader2, ShieldCheck } from 'lucide-react';

export function CoachScreen() {
  const chatMessages = useHealthStore((s) => s.chatMessages);
  const addChatMessage = useHealthStore((s) => s.addChatMessage);
  const dataSource = useHealthStore((s) => s.dataSource);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  const handleSend = async (text?: string) => {
    const message = text || input.trim();
    if (!message || isTyping) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user' as const,
      content: message,
      timestamp: new Date().toISOString(),
    };

    addChatMessage(userMsg);
    setInput('');
    setIsTyping(true);

    try {
      if (dataSource === 'remote') {
        // Real API call to backend
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const token = localStorage.getItem('elysian-token');
        const res = await fetch(`${API_BASE}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ content: message }),
        });
        if (res.ok) {
          const data = await res.json();
          addChatMessage({
            id: data.id,
            role: 'assistant',
            content: data.content,
            timestamp: data.created_at,
          });
        }
      } else {
        // Local: use template-based reply with delay
        await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800));
        addChatMessage({
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: generateLocalReply(message),
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Chat error:', err);
      addChatMessage({
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I had trouble processing that. Please try again.',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-dvh">
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-4 pt-14 pb-3 flex items-center gap-3"
        style={{
          background: 'linear-gradient(to bottom, var(--bg-primary) 70%, transparent)',
        }}
      >
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(123, 97, 255, 0.1))',
          }}
        >
          <Sparkles size={17} style={{ color: 'var(--accent-primary)' }} />
        </div>
        <div className="flex-1">
          <h1 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            AI Coach
          </h1>
          <p className="text-[10px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
            Your personal fitness copilot
          </p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: 'rgba(0, 230, 118, 0.08)', border: '1px solid rgba(0, 230, 118, 0.1)' }}>
          <ShieldCheck size={10} style={{ color: 'var(--color-success)' }} />
          <span className="text-[9px] font-semibold" style={{ color: 'var(--color-success)' }}>Online</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4">
        <div className="chat-container">
          {/* Suggested prompts */}
          {chatMessages.length <= 3 && (
            <div className="mb-4">
              <SuggestedPrompts onSelect={handleSend} />
            </div>
          )}

          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {chatMessages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 px-4 py-3.5 w-fit rounded-xl rounded-bl-sm"
                style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-subtle)' }}
              >
                <Loader2 size={14} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Analyzing your data...</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-4 pb-1">
        <p className="text-[9px] text-center" style={{ color: 'var(--text-tertiary)' }}>
          AI-generated advice. Not medical advice. Consult healthcare professionals.
        </p>
      </div>

      {/* Input bar */}
      <div
        className="sticky bottom-[var(--nav-height)] left-0 right-0 px-4 py-3"
        style={{
          background: 'linear-gradient(to top, var(--bg-primary) 85%, transparent)',
        }}
      >
        <div className="chat-container">
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{
              background: 'var(--bg-card-solid)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <input
              id="coach-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask your AI coach..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: 'var(--text-primary)' }}
              disabled={isTyping}
            />
            <button
              id="coach-send"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200"
              style={{
                background: input.trim() ? 'var(--gradient-primary)' : 'var(--border-subtle)',
                opacity: input.trim() ? 1 : 0.4,
              }}
            >
              <Send size={14} style={{ color: input.trim() ? '#000' : 'var(--text-tertiary)' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateLocalReply(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (lower.includes('workout') || lower.includes('exercise') || lower.includes('train')) {
    return '💪 Based on your current recovery score and recent training load, here\'s what I recommend today:\n\n**Moderate Upper Body Session** (45 min)\n1. Incline DB Press — 3×10\n2. Cable Rows — 3×12\n3. Lateral Raises — 4×12\n4. Face Pulls — 3×15\n5. Tricep Dips — 3×12\n\nYour HRV suggests moderate intensity is optimal today. Keep RPE at 6-7.\n\n*Not medical advice. Consult a healthcare professional.*';
  }

  if (lower.includes('sleep')) {
    return '😴 Your sleep analysis for the past week:\n\n- **Avg duration**: 7.3h (target: 7.5-8h)\n- **Deep sleep**: Trending up 12% ✅\n- **REM**: Stable at ~1.4h/night\n- **Consistency**: 85%\n\nYour deep sleep improvement correlates with your evening routine changes. Keep it up!\n\n*Not medical advice.*';
  }

  if (lower.includes('weight') || lower.includes('predict')) {
    return '📉 Based on your 30-day data:\n\n- **Current weight**: 76.8kg\n- **30-day projection**: 75.2kg\n- **Required deficit**: ~350 kcal/day\n\nYou\'re on track! Maintaining protein at 140g+ will help preserve lean mass.\n\n*Not medical advice.*';
  }

  if (lower.includes('recovery') || lower.includes('fatigue')) {
    return '🔋 Recovery Status:\n\n- **Recovery Score**: 72/100 (Moderate)\n- **HRV**: Slightly below baseline (-8%)\n- **Resting HR**: 62bpm (normal range)\n\nI\'d suggest one more rest day this week and focusing on sleep quality tonight.\n\n*Not medical advice.*';
  }

  if (lower.includes('meal') || lower.includes('diet') || lower.includes('nutrition') || lower.includes('protein')) {
    return '🥗 Here\'s a sample day optimized for your goals:\n\n**Breakfast**: Greek yogurt + berries + protein granola (35g protein)\n**Lunch**: Grilled chicken bowl with quinoa, greens, avocado (42g protein)\n**Snack**: Protein shake + banana (28g protein)\n**Dinner**: Salmon with sweet potato and roasted veggies (38g protein)\n\n**Total**: ~143g protein | ~2,100 kcal\n\n*Not medical advice.*';
  }

  return '📊 Based on your recent data, things are looking solid overall. Your consistency score is strong, and you\'re making progress toward your goals.\n\nHere\'s what I\'d focus on:\n1. **Keep protein intake above 130g** — you\'re a bit low on rest days\n2. **Sleep timing** — try to maintain your 11PM bedtime\n3. **Active recovery** — add a light yoga or walking session mid-week\n\nAnything specific you\'d like me to dive deeper into?\n\n*Not medical advice. Consult a healthcare professional.*';
}
