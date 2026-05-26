// PulseAI — API: Chat

import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error('GET /api/chat error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { content } = await request.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: 'Empty message' }, { status: 400 });
    }

    // Save user message
    const { error: userMsgErr } = await supabase
      .from('chat_messages')
      .insert({ user_id: user.id, role: 'user', content });

    if (userMsgErr) throw userMsgErr;

    // Fetch context: recent health data for personalized replies
    const { data: recentDays } = await supabase
      .from('health_days')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(7);

    // Generate AI reply (template-based, ready for LLM swap)
    const reply = generateCoachReply(content, recentDays || []);

    // Save assistant message
    const { data: assistantMsg, error: assistantErr } = await supabase
      .from('chat_messages')
      .insert({ user_id: user.id, role: 'assistant', content: reply })
      .select()
      .single();

    if (assistantErr) throw assistantErr;

    return NextResponse.json(assistantMsg);
  } catch (err) {
    console.error('POST /api/chat error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateCoachReply(prompt: string, recentDays: any[]): string {
  const lower = prompt.toLowerCase();
  const today = recentDays[0];

  // Contextualize replies with actual data when available
  const weight = today?.weight ? `${today.weight}kg` : 'your current weight';
  const steps = today?.steps ? today.steps.toLocaleString() : '~8,000';
  const sleep = today?.sleep_hours ? `${today.sleep_hours}h` : '~7h';

  if (lower.includes('workout') || lower.includes('exercise') || lower.includes('train')) {
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

  if (lower.includes('meal') || lower.includes('diet') || lower.includes('nutrition') || lower.includes('protein')) {
    return `🥗 Here's a sample day optimized for your goals:\n\n**Breakfast**: Greek yogurt + berries + protein granola (35g protein)\n**Lunch**: Grilled chicken bowl with quinoa, greens, avocado (42g protein)\n**Snack**: Protein shake + banana (28g protein)\n**Dinner**: Salmon with sweet potato and roasted veggies (38g protein)\n\n**Total**: ~143g protein | ~2,100 kcal\n\n*Not medical advice.*`;
  }

  return `📊 Based on your recent data, here's a quick summary:\n\n- **Steps today**: ${steps}\n- **Sleep last night**: ${sleep}\n- **Weight**: ${weight}\n\nThings are looking solid. Here's what I'd focus on:\n1. **Keep protein above 130g** on training days\n2. **Maintain sleep consistency** — it's your recovery superpower\n3. **Stay active** — even light movement on rest days helps\n\nAnything specific you'd like to dive into?\n\n*Not medical advice. Consult a healthcare professional.*`;
}
