declare const process: { env: Record<string, string | undefined> };

export type AIMessage = { role: 'user' | 'assistant' | 'system'; content: string };

const API_URL = (process.env.EXPO_PUBLIC_AI_API_URL || '').replace(/\/$/, '');

export async function askAI(message: string, history: AIMessage[] = []): Promise<string> {
  if (!API_URL) return localLudoAI(message);

  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) throw new Error(`AI service returned ${response.status}`);
  const data = await response.json() as { reply?: string };
  if (!data.reply) throw new Error('AI service returned an empty reply');
  return data.reply;
}

function localLudoAI(message: string): string {
  const q = message.trim().toLowerCase();
  if (/استرات|خطة|حركة|حركات|win|فوز|يفوز/.test(q)) {
    return 'أقدر أساعدك في تحليل الحركة. بشكل عام: أخرج قطعة بالـ6، ثم حافظ على القطع متقاربة عندما يكون ذلك مفيدًا، وراقب القطع القريبة من الخصم قبل اختيار الحركة.';
  }
  if (/غرفة|دعوة|رمز/.test(q)) {
    return 'من تبويب الغرف تقدر تنشئ غرفة، وبعد الدخول اضغط «دعوة صديق» لمشاركة رمز الغرفة.';
  }
  if (/قواعد|كيف ألعب|اللعب/.test(q)) {
    return 'ارمِ النرد، وإذا ظهر 6 تستطيع إخراج قطعة من البيت. بعد ذلك اختر قطعة قابلة للحركة، والدور ينتقل للاعب التالي عندما لا تكون الرمية 6.';
  }
  return 'أنا مساعد Ludo Majlis 🤖. اسألني عن قواعد اللعبة، الغرف، أو أفضل طريقة للتعامل مع حركة معينة.';
}
