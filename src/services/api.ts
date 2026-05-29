export async function sendMessage(
    projectId: string,
    message: string,
    contextMode: string,
    history?: any[]
) {
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