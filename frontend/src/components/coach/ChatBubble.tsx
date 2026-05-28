'use client';

import { motion } from 'framer-motion';
import type { ChatMessageData } from '@/store/health-store';

interface ChatBubbleProps {
  message: ChatMessageData;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser ? 'rounded-br-md' : 'rounded-bl-md'
        }`}
        style={{
          background: isUser
            ? 'linear-gradient(135deg, rgba(232, 168, 56, 0.12), rgba(232, 168, 56, 0.05))'
            : 'var(--bg-card-solid)',
          border: `1px solid ${isUser ? 'rgba(232, 168, 56, 0.16)' : 'var(--border-subtle)'}`,
          color: 'var(--text-primary)',
        }}
      >
        {message.content.split('\n').map((line, i) => (
          <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
            {formatLine(line)}
          </p>
        ))}

        <p className="mt-2 text-[9px]" style={{ color: 'var(--text-tertiary)' }}>
          {new Date(message.timestamp).toLocaleTimeString('en', {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </p>
      </div>
    </motion.div>
  );
}

function formatLine(line: string): React.ReactNode {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
