# Configuração de Variáveis de Ambiente (testes locais)

Para testar a integração com a OpenAI localmente, crie um arquivo `.env` na raiz do projeto com as variáveis abaixo.

> Observação: Vite expõe variáveis que começam com `VITE_` ao código do frontend.

Exemplo de `.env`:

```
# Se você tiver um backend que encapsula a OpenAI, aponte aqui
VITE_API_URL=http://localhost:8000

# Para chamadas diretas à OpenAI (apenas para testes locais)
VITE_OPENAI_KEY=sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Modelo opcional (padrão: gpt-3.5-turbo)
VITE_OPENAI_MODEL=gpt-3.5-turbo
```

Aviso: colocar sua chave da OpenAI no frontend a torna visível no navegador — use apenas para testes locais. Em produção, sempre roteie chamadas para um backend seguro.

Depois de criar o `.env`, reinicie o servidor de desenvolvimento:

```pwsh
npm install
npm run dev
```

Se preferir que o frontend não faça chamadas diretas, configure `VITE_API_URL` apontando para seu backend que faz as chamadas seguras para a OpenAI.
