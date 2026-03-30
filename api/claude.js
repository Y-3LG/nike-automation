export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OPENROUTER_API_KEY no configurada' });

  const { ref, name } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://nike-automation.vercel.app',
        'X-Title': 'Nike Description Automation'
      },
      body: JSON.stringify({
        model: 'perplexity/sonar',
        messages: [
          {
            role: 'system',
            content: `Eres un asistente que extrae descripciones de productos Nike.
REGLAS ESTRICTAS:
- Devuelve SOLO 4 líneas, cada una empezando con "• "
- Entre cada línea un salto de línea en blanco
- PROHIBIDO usar negritas, markdown, asteriscos, corchetes, numeración
- PROHIBIDO escribir introducciones, conclusiones o disculpas
- Si no encuentras el producto, inventa 4 características realistas basadas en el nombre
- Formato exacto:
- [característica 1]

- [característica 2]

- [característica 3]

- [característica 4]`
          },
          {
            role: 'user',
            content: `Busca en nike.com/es el producto con referencia "${ref}" nombre "${name}". Devuelve sus 4 características principales.`
          }
        ]
      })
    });

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content?.trim() || '';

    // Limpieza automática
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');        // quitar negritas
    text = text.replace(/\[\d+\]/g, '');                 // quitar citas [1][2]
    text = text.replace(/^[-*]\s+/gm, '• ');             // convertir - o * en •
    text = text.replace(/^\d+\.\s+/gm, '• ');            // convertir 1. 2. en •
    text = text.replace(/\n{3,}/g, '\n\n');              // máximo doble salto
    text = text.trim();

    // Si el modelo se quejó o no devolvió bullets, marcar error
    const errorPhrases = ['no puedo', 'no pude', 'lo siento', 'disculpa', 'cannot', 'no tengo acceso'];
    if (errorPhrases.some(p => text.toLowerCase().includes(p)) || !text.includes('•')) {
      return res.status(422).json({ error: 'El modelo no devolvió descripción válida' });
    }

    res.status(200).json({ description: text });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}