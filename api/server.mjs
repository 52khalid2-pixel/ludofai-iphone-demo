import http from 'node:http';

const PORT = Number(process.env.PORT || 8787);
const AI_API_URL = (process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions').replace(/\/$/, '');
const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'gpt-4o-mini';

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST,OPTIONS' });
  res.end(JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 204, {});
  if (req.method !== 'POST' || req.url !== '/chat') return json(res, 404, { error: 'Not found' });

  let raw = '';
  req.on('data', chunk => { raw += chunk; if (raw.length > 100_000) req.destroy(); });
  req.on('end', async () => {
    try {
      const body = JSON.parse(raw || '{}');
      const message = String(body.message || '').trim();
      if (!message) return json(res, 400, { error: 'message is required' });
      if (!AI_API_KEY) return json(res, 503, { error: 'AI_API_KEY is not configured' });

      const history = Array.isArray(body.history) ? body.history.slice(-12) : [];
      const messages = [
        { role: 'system', content: 'أنت مساعد ذكي للعبة Ludo Majlis. أجب بالعربية باختصار، وساعد في قواعد اللعبة والاستراتيجيات العامة وتجربة الغرف. لا تدّعي أنك ترى لوحة اللعب إلا إذا أرسل التطبيق حالة اللوحة.' },
        ...history.filter(x => x && ['user','assistant'].includes(x.role) && typeof x.content === 'string'),
        { role: 'user', content: message },
      ];

      const upstream = await fetch(`${AI_API_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${AI_API_KEY}` },
        body: JSON.stringify({ model: AI_MODEL, messages, temperature: 0.4, max_tokens: 500 }),
      });
      const data = await upstream.json();
      if (!upstream.ok) return json(res, upstream.status, { error: data?.error?.message || 'AI provider error' });
      const reply = data?.choices?.[0]?.message?.content;
      if (!reply) return json(res, 502, { error: 'AI provider returned no reply' });
      return json(res, 200, { reply });
    } catch (error) {
      return json(res, 500, { error: error instanceof Error ? error.message : 'Server error' });
    }
  });
});

server.listen(PORT, () => console.log(`Ludo AI API listening on http://localhost:${PORT}`));
