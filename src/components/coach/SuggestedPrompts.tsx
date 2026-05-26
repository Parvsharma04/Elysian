'use client';

import { suggestedPrompts } from '@/lib/local-data';

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="label-small px-1">Suggested</span>
      <div className="flex flex-wrap gap-2">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
            style={{
              background: 'var(--bg-card-solid)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
