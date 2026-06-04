const API_URL = (import.meta as any).env.VITE_API_URL as string | undefined;
const OPENAI_KEY = (import.meta as any).env.VITE_OPENAI_KEY as string | undefined;
const OPENAI_MODEL = (import.meta as any).env.VITE_OPENAI_MODEL as string | undefined || 'gpt-3.5-turbo';

export async function sendMessage(
    projectId: string,
    message: string,
    contextMode: string,
    history?: any[]
) {
    if (API_URL) {
        const response = await fetch(`${API_URL}/chat/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                project_id: projectId,
                message: message,
                context_mode: contextMode,
                history: history || []
            })
        });
        return response.json();
    }

    if (!OPENAI_KEY) {
        throw new Error('VITE_OPENAI_KEY não configurada. Defina a variável em um arquivo .env local.');
    }

    // Fallback: chamar diretamente a OpenAI para testes locais.
    const payload = {
        model: OPENAI_MODEL,
        messages: [
            // incluir histórico se disponível (transformar conforme necessário)
            ...((history || []).map((h: any) => ({ role: h.role || 'user', content: h.content || '' }))),
            { role: 'user', content: message }
        ],
        // ajuste as opções conforme necessário
        max_tokens: 1024,
        temperature: 0.2
    };

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify(payload)
    });

    const data = await resp.json();

    // Normaliza o retorno para manter compatibilidade mínima com o backend esperado
    // Aqui retornamos o objeto completo da OpenAI para inspeção. Adapte conforme o backend real.
    return data;
}