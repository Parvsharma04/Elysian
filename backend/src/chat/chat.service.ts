// Elysian — Chat Service

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './chat-message.entity';
import { HealthDay } from '../health/health-day.entity';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatRepo: Repository<ChatMessage>,
    @InjectRepository(HealthDay)
    private readonly healthDayRepo: Repository<HealthDay>,
  ) {}

  async findByUser(userId: string, limit: number = 100): Promise<ChatMessage[]> {
    return this.chatRepo.find({
      where: { user_id: userId },
      order: { created_at: 'ASC' },
      take: limit,
    });
  }

  async sendMessage(userId: string, content: string): Promise<ChatMessage> {
    // Save user message
    const userMsg = this.chatRepo.create({
      user_id: userId,
      role: 'user',
      content,
    });
    await this.chatRepo.save(userMsg);

    // Fetch context: recent health data for personalized replies
    const recentDays = await this.healthDayRepo.find({
      where: { user_id: userId },
      order: { date: 'DESC' },
      take: 7,
    });

    // Generate AI reply (template-based, ready for LLM swap)
    const reply = this.generateCoachReply(content, recentDays);

    // Save assistant message
    const assistantMsg = this.chatRepo.create({
      user_id: userId,
      role: 'assistant',
      content: reply,
    });

    return this.chatRepo.save(assistantMsg);
  }

  /**
   * Template-based AI coach reply generator.
   * Designed as a plug-in point for future LLM integration (OpenAI, Gemini, etc.)
   */
  private generateCoachReply(prompt: string, recentDays: HealthDay[]): string {
    const lower = prompt.toLowerCase();
    const today = recentDays[0];

    // Contextualize replies with actual data when available
    const weight = today?.weight ? `${today.weight}kg` : 'your current weight';
    const steps = today?.steps ? today.steps.toLocaleString() : '~8,000';
    const sleep = today?.sleep_hours ? `${today.sleep_hours}h` : '~7h';

    if (
      lower.includes('workout') ||
      lower.includes('exercise') ||
      lower.includes('train')
    ) {
      return `💪 Based on your recent data, here's an optimized session for today:\n\n**Moderate Intensity Session** (40 min)\n1. Compound Movement — 4×8 @ RPE 7\n2. Accessory Work — 3×12\n3. Core Circuit — 3 rounds\n4. Cooldown Stretches — 5 min\n\nYour recent activity shows ${today?.active_minutes || '~45'} active minutes yesterday. Keep RPE moderate today.\n\n*Not medical advice. Consult a healthcare professional.*`;
    }

    if (lower.includes('sleep')) {
      return `😴 Your recent sleep analysis:\n\n- **Last night**: ${sleep}\n- **Deep sleep**: ${today?.sleep_deep || '~1.5'}h\n- **REM**: ${today?.sleep_rem || '~1.3'}h\n- **Quality**: ${today?.sleep_quality || '~75'}%\n\nConsistency is key. Try to maintain your bedtime within ±30 minutes each night.\n\n*Not medical advice.*`;
    }

    if (lower.includes('weight') || lower.includes('predict')) {
      return `📉 Weight analysis:\n\n- **Current**: ${weight}\n- **Steps today**: ${steps}\n\nMaintaining a consistent calorie deficit with adequate protein (140g+) will support healthy progress. Want me to create a meal plan?\n\n*Not medical advice.*`;
    }

    if (lower.includes('recovery') || lower.includes('fatigue')) {
      return `🔋 Recovery Status:\n\n- **Resting HR**: ${today?.heart_rate_resting || '~62'}bpm\n- **HRV**: ${today?.hrv || '~50'}ms\n- **Sleep**: ${sleep}\n\nListen to your body. If you're feeling fatigued, an active recovery session (light walking, yoga) can help.\n\n*Not medical advice.*`;
    }

    if (
      lower.includes('meal') ||
      lower.includes('diet') ||
      lower.includes('nutrition') ||
      lower.includes('protein')
    ) {
      return `🥗 Here's a sample day optimized for your goals:\n\n**Breakfast**: Greek yogurt + berries + protein granola (35g protein)\n**Lunch**: Grilled chicken bowl with quinoa, greens, avocado (42g protein)\n**Snack**: Protein shake + banana (28g protein)\n**Dinner**: Salmon with sweet potato and roasted veggies (38g protein)\n\n**Total**: ~143g protein | ~2,100 kcal\n\n*Not medical advice.*`;
    }

    return `📊 Based on your recent data, here's a quick summary:\n\n- **Steps today**: ${steps}\n- **Sleep last night**: ${sleep}\n- **Weight**: ${weight}\n\nThings are looking solid. Here's what I'd focus on:\n1. **Keep protein above 130g** on training days\n2. **Maintain sleep consistency** — it's your recovery superpower\n3. **Stay active** — even light movement on rest days helps\n\nAnything specific you'd like to dive into?\n\n*Not medical advice. Consult a healthcare professional.*`;
  }
}
