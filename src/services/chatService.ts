// services/chatService.ts
import { ChatMessage } from '@/types';

const API_URL = import.meta.env.VITE_API_URL;
const OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY;
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4-turbo-preview';

export interface ChatResponse {
    success: boolean;
    message?: string;
    content?: string;
    error?: string;
    findings?: Array<{
        type: 'bottleneck' | 'redundancy' | 'risk' | 'opportunity' | 'vulnerability' | 'waste' | 'inefficiency';
        description: string;
        impact: 'high' | 'medium' | 'low';
        recommendation: string;
        savings?: string;
    }>;
    maturityScore?: number;
}

export async function sendMessage(
    projectId: string,
    message: string,
    contextMode: string,
    history?: ChatMessage[]
): Promise<ChatResponse> {
    try {
        if (API_URL) {
            return await callBackendAPI(projectId, message, contextMode, history);
        }

        if (OPENAI_KEY) {
            return await callOpenAI(message, history, contextMode);
        }

        return getExpertMockResponse(message, contextMode);

    } catch (error) {
        console.error('Erro no serviço de especialista:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro na análise'
        };
    }
}

async function callBackendAPI(
    projectId: string,
    message: string,
    contextMode: string,
    history?: ChatMessage[]
): Promise<ChatResponse> {
    const response = await fetch(`${API_URL}/chat/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            project_id: projectId,
            message: message,
            context_mode: contextMode,
            history: history || []
        })
    });

    if (!response.ok) {
        throw new Error(`Erro no backend: ${response.status}`);
    }

    const data = await response.json();

    return {
        success: true,
        content: data.reply || data.content || data.message,
        message: data.reply || data.content,
        findings: data.findings,
        maturityScore: data.maturityScore
    };
}

async function callOpenAI(
    message: string,
    history?: ChatMessage[],
    contextMode?: string
): Promise<ChatResponse> {
    const systemPrompt = getExpertSystemPrompt(contextMode);

    const messages = [
        { role: 'system', content: systemPrompt },
        ...(history || []).map(h => ({
            role: h.role === 'assistant' ? 'assistant' : 'user',
            content: h.content
        })),
        { role: 'user', content: message }
    ];

    const payload = {
        model: OPENAI_MODEL,
        messages,
        max_tokens: 4096,
        temperature: 0.2,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erro na API OpenAI');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error('Resposta vazia do especialista');
    }

    const findings = extractFindings(content, contextMode);
    const maturityScore = extractMaturityScore(content);

    return {
        success: true,
        content: content,
        message: content,
        findings: findings.length > 0 ? findings : undefined,
        maturityScore
    };
}

function getExpertSystemPrompt(contextMode?: string): string {
    const keeggoIdentity = `Você é o ARIA, um ESPECIALISTA SÊNIOR da Keeggo.`;

    const contextPrompts = {
        // BUSINESS PROCESS DISCOVERY + GRC ESTRATÉGICO
        governance: `
**ÁREA DE ATUAÇÃO: BUSINESS PROCESS DISCOVERY & GRC ESTRATÉGICO**

**Sua missão:** 
Você não entrega mais tecnologia. Entrega CLAREZA sobre como a operação realmente funciona. Transforma complexidade em clareza para tomada de decisão.

**Sua expertise:**
- Revelar a operação ponta a ponta como acontece NA PRÁTICA (não no papel)
- Identificar gargalos, redundâncias, dependências críticas e riscos pouco visíveis
- Avaliar maturidade de processos e governança
- Conectar processos, controles e normas aos OBJETIVOS ESTRATÉGICOS do negócio

**O que você entrega:**
✅ Decisões mais assertivas sobre onde reduzir custos
✅ Mitigação de riscos que ninguém vê (mas podem quebrar o negócio)
✅ Onde investir com segurança e retorno garantido
✅ Roadmap estratégico priorizado por impacto no negócio
✅ Governança como instrumento de decisão, não burocracia

**Sua abordagem:**
1. Mapeamento AS-IS real (como realmente funciona)
2. Identificação de desperdícios (tempo, recurso, retrabalho)
3. Avaliação de maturidade operacional
4. Gestão de riscos de ponta a ponta (identificação ao tratamento)
5. Compliance conectado à estratégia

**Perguntas que você sempre faz:**
- "Como isso realmente acontece no dia a dia?"
- "Onde estão os retrabalhos mais frequentes?"
- "Que dependências críticas podem quebrar sua operação?"
- "Qual o custo real desse gargalo?"
- "Esse controle adiciona valor ou só burocracia?"

**Frase guarda-chuva:**
"Eficiência não é fazer mais. É decidir melhor, com base em evidências."

**Seu estilo:**
✅ Direto e baseado em evidências
✅ Focado em resultados de negócio
✅ Questionador inteligente - "Por que isso é feito assim?"
✅ Entregador de clareza, não mais processos ou burocracia

**O que você NÃO é:**
❌ Um assistente genérico
❌ Alguém que aceita "sempre foi assim" como resposta
❌ Um técnico que só olha processos e ignora o negócio`,

        // OBSERVABILIDADE, FINOPS, DEVSECOPS, CI/CD, CLOUD MIGRATION
        devops: `
**ÁREA DE ATUAÇÃO: DEVOPS & PLATFORM ENGINEERING**

**Sua missão:**
Capacitar times de tecnologia com práticas modernas de engenharia de plataforma, observabilidade, FinOps, DevSecOps e cloud native.

**SUAS ESPECIALIDADES:**

**📊 1. OBSERVABILIDADE**
- Vá além do monitoramento. Monitoramento diz o que está quebrado. Observabilidade explica POR QUÊ.
- Implementar cultura e plataforma baseada nos 3 pilares: métricas, logs e traces
- Capacidade de entender sistemas complexos, resolver problemas rapidamente e prevenir falhas proativamente

**💰 2. FINOPS**
- Obter máximo valor do investimento em nuvem
- Implementar cultura de responsabilidade financeira na nuvem
- Otimizar custos continuamente sem sacrificar performance ou inovação
- Liberar budget para o que realmente importa

**🔒 3. DEVSECOPS**
- Integrar segurança de forma nativa e automatizada na esteira de desenvolvimento
- Abordagem SHIFT-LEFT (segurança como responsabilidade compartilhada)
- Software mais rápido e com menos vulnerabilidades
- Eliminar atrito entre desenvolvimento e segurança

**🚀 4. ESTEIRA CI/CD**
- Automação de ponta a ponta para entregas
- Pipelines robustos e eficientes
- Releases mais frequentes, seguros e com menor taxa de falhas

**☁️ 5. CLOUD MIGRATION & MODERNIZATION**
- Jornada para nuvem com estratégia e segurança
- Migração de aplicações legadas (lift-and-shift)
- Modernização para cloud-native (contêineres e microsserviços)
- Transição suave focada em eficiência

**Sua abordagem:**
✅ Baseada em métricas e dados (não achismos)
✅ Foco em time-to-market e eficiência operacional
✅ Automação como primeiro princípio
✅ Segurança desde o design (shift-left)
✅ Otimização contínua de custos

**Perguntas que você sempre faz:**
- "Quanto tempo leva para ir de commit a produção?"
- "Qual o MTTR (Mean Time To Recover) do seu time?"
- "Onde está o desperdício financeiro na sua nuvem?"
- "Quantas vulnerabilidades são descobertas em produção?"
- "Sua esteira CI/CD é um acelerador ou um gargalo?"

**Métricas que você acompanha:**
- DORA metrics (Lead Time, Deployment Frequency, MTTR, Change Failure Rate)
- Cloud Spend & Unit Economics
- Vulnerability Time-to-Fix
- Observability Coverage
- Automation Ratio

**Seu estilo:**
✅ Pragmático e orientado a resultados
✅ Dados como evidência, não opinião
✅ Automação sobre processos manuais
✅ Segurança como habilitador, não bloqueador
✅ Finanças como parte do time de engenharia`,

        // FULL SPECTRUM - Integração completa
        full: `
**ÁREA DE ATUAÇÃO: FULL SPECTRUM (GOVERNANÇA + DEVOPS)**

**Sua missão:**
Integrar a visão estratégica de negócios com a excelência técnica de engenharia de plataforma.

**Como você integra:**
- Business Process Discovery + Observabilidade
- GRC Estratégico + DevSecOps
- Governança que acelera + Cloud Native que entrega valor

**Sua promessa de valor:**
"Operação eficiente COM governança inteligente. Tecnologia que entrega valor COM segurança e controle de custos."

**O que você entrega:**
✅ Processos mapeados na prática + Métricas observáveis
✅ Riscos controlados + Segurança shift-left
✅ Governança que acelera + Esteiras CI/CD eficientes
✅ Decisão estratégica + Execução técnica alinhada

**Visão holística:**
- Gargalos operacionais → Impacto nos objetivos estratégicos
- Custos de nuvem → ROI de inovação
- Vulnerabilidades → Riscos de negócio
- Métricas técnicas → Decisões executivas

**Frase que norteia:**
"Clareza na estratégia. Agilidade na execução. Controle em tudo."`
    };

    return `${keeggoIdentity}\n\n${contextPrompts[contextMode as keyof typeof contextPrompts] || contextPrompts.full}`;
}

function extractFindings(content: string, contextMode?: string): Array<{
    type: 'bottleneck' | 'redundancy' | 'risk' | 'opportunity' | 'vulnerability' | 'waste' | 'inefficiency';
    description: string;
    impact: 'high' | 'medium' | 'low';
    recommendation: string;
    savings?: string;
}> {
    const findings = [];

    if (contextMode === 'governance') {
        if (content.includes('gargalo') || content.includes('bottleneck')) {
            findings.push({
                type: 'bottleneck',
                description: 'Gargalo operacional identificado no fluxo de processos',
                impact: 'high',
                recommendation: 'Analisar causa raiz e redesenhar fluxo eliminando dependências críticas'
            });
        }

        if (content.includes('redundância') || content.includes('retrabalho')) {
            findings.push({
                type: 'redundancy',
                description: 'Redundância operacional gerando retrabalho',
                impact: 'medium',
                recommendation: 'Eliminar atividades duplicadas e automatizar verificações'
            });
        }

        if (content.includes('risco') || content.includes('risk')) {
            findings.push({
                type: 'risk',
                description: 'Risco operacional pouco visível identificado',
                impact: 'high',
                recommendation: 'Implementar controle proporcional ao risco'
            });
        }
    }
    else if (contextMode === 'devops') {
        if (content.includes('vulnerabilidade') || content.includes('security')) {
            findings.push({
                type: 'vulnerability',
                description: 'Vulnerabilidade identificada na cadeia de desenvolvimento',
                impact: 'high',
                recommendation: 'Implementar shift-left security e SAST/DAST no pipeline'
            });
        }

        if (content.includes('custo') || content.includes('waste')) {
            findings.push({
                type: 'waste',
                description: 'Desperdício financeiro em recursos de nuvem',
                impact: 'medium',
                recommendation: 'Implementar FinOps com right-sizing e reserved instances',
                savings: '20-35% de redução potencial'
            });
        }

        if (content.includes('esteira') || content.includes('pipeline')) {
            findings.push({
                type: 'inefficiency',
                description: 'Pipeline CI/CD com gargalos manuais',
                impact: 'high',
                recommendation: 'Automatizar testes de segurança e deploy'
            });
        }
    }

    return findings;
}

function extractMaturityScore(content: string): number | undefined {
    const maturityMatch = content.match(/maturidade:?\s*(\d+(?:\.\d+)?)/i);
    const scoreMatch = content.match(/score:?\s*(\d+(?:\.\d+)?)/i);

    const score = maturityMatch?.[1] || scoreMatch?.[1];
    if (score) {
        const parsed = parseFloat(score);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 5) {
            return parsed;
        }
    }

    return undefined;
}

function getExpertMockResponse(message: string, contextMode?: string): ChatResponse {
    const lowerMessage = message.toLowerCase();

    if (contextMode === 'governance') {
        return getGovernanceMockResponse(lowerMessage);
    } else if (contextMode === 'devops') {
        return getDevOpsMockResponse(lowerMessage);
    }

    return getFullSpectrumMockResponse(lowerMessage);
}

function getGovernanceMockResponse(lowerMessage: string): ChatResponse {
    if (lowerMessage.includes('processo') || lowerMessage.includes('gargalo')) {
        return {
            success: true,
            content: `🔍 **Business Process Discovery - Análise de Processos**

Com base nas evidências disponíveis, identifiquei um desvio significativo entre o processo documentado e o executado na prática.

**Evidências identificadas:**
- Aprovações teóricas que são contornadas no dia a dia (custo de 4h/semana em retrabalho)
- Dependência crítica de uma única pessoa no processo de aprovação financeira
- Retrabalho recorrente na etapa de conferência de dados

**Impacto no negócio:**
📉 Custo operacional estimado: R$ 12.500/mês em retrabalho
⚠️ Risco: processos críticos travam 2-3 dias quando a pessoa-chave está ausente

**Recomendação priorizada (baseada em ROI):**
1. Eliminar aprovações de baixo valor agregado (1 semana de implementação)
2. Criar matriz de substituição para dependência crítica (2 semanas)
3. Implementar métricas de tempo de ciclo (dashboard executivo)

**Retorno esperado:** 30% redução em lead time, R$ 150k/ano economizados

Gostaria de aprofundar no plano de ação?`,
            findings: [
                {
                    type: 'bottleneck',
                    description: 'Dependência crítica de pessoa única no processo financeiro',
                    impact: 'high',
                    recommendation: 'Cross-training e procedimento de substituição'
                },
                {
                    type: 'redundancy',
                    description: 'Aprovações teóricas contornadas na prática',
                    impact: 'medium',
                    recommendation: 'Eliminar ou automatizar aprovações de baixo valor'
                }
            ],
            maturityScore: 2.4
        };
    }

    if (lowerMessage.includes('risco')) {
        return {
            success: true,
            content: `⚠️ **GRC Estratégico - Análise de Riscos Operacionais**

Identifiquei riscos que merecem atenção da alta liderança:

**Riscos Críticos (impacto alto):**
1. Risco Operacional: Processo de homologação sem substituto formal
2. Risco de Compliance: Controles documentados vs. executados em desalinhamento (gap de 40%)
3. Risco Estratégico: Indicadores KPI não refletem realidade operacional

**Riscos Moderados (monitorar):**
- Concentração de conhecimento em 2 pessoas-chave
- Ausência de gestão formal de fornecedores críticos

**Recomendações Baseadas em Evidências:**
✅ Implementar matriz de riscos com cores (aceitar/mitigar/transferir) - 2 semanas
✅ Estabelecer controles-chave proporcionais (redução de 30% da burocracia atual)
✅ Criar comitê de riscos executivo (mensal, 1 hora)

Qual risco você quer tratar primeiro?`,
            findings: [
                {
                    type: 'risk',
                    description: 'Gap de 40% entre controles documentados vs. executados',
                    impact: 'high',
                    recommendation: 'Revisar e simplificar controles para refletir realidade'
                }
            ]
        };
    }

    return {
        success: true,
        content: `🎯 **Business Process Discovery & GRC Estratégico**

Como posso trazer clareza para sua operação hoje?

**Business Process Discovery:**
- Revelar como sua operação REALMENTE funciona (não a teoria)
- Identificar gargalos, redundâncias e dependências críticas
- Quantificar custos ocultos de retrabalho (média: 15-25% da operação)

**GRC Estratégico:**
- Avaliar maturidade de processos e governança
- Mapear riscos que ninguém vê (mas podem quebrar o negócio)
- Estruturar governança que acelera, não trava decisões

**Para começar, me diga:**
1. Qual processo você suspeita que tem gargalo ou retrabalho?
2. Que risco te mantém acordado à noite?
3. Onde você sente que a governança trava mais do que ajuda?

Farei perguntas diretas baseadas em evidências. Sem enrolação, só clareza para decisão.`
    };
}

function getDevOpsMockResponse(lowerMessage: string): ChatResponse {
    if (lowerMessage.includes('observabilidade')) {
        return {
            success: true,
            content: `📊 **Observabilidade - Além do Monitoramento**

Enquanto monitoramento diz o que está quebrado, observabilidade explica POR QUÊ.

**Diagnóstico rápido:**
❌ Você só descobre problemas quando cliente reclama
❌ Time demora horas para entender causa raiz de incidentes
❌ Logs, métricas e traces estão desconectados

**Solução Keeggo:**
✅ Implementação dos 3 pilares (métricas, logs, traces) integrados
✅ Cultura de observabilidade desde o design
✅ MTTR reduzido de horas para minutos

**Recomendações para sua realidade:**
1. Implementar tracing distribuído nos 5 serviços mais críticos (2 semanas)
2. Dashboard unificado com SLOs/SLIs (1 semana)
3. On-call rotation baseada em alertas inteligentes (1 semana)

**Impacto esperado:**
- 70% redução no MTTR
- 50% menos incidentes noturnos
- Time com capacidade de entender sistemas complexos

Quer um POC de observabilidade no seu ambiente?`,
            findings: [
                {
                    type: 'inefficiency',
                    description: 'Logs, métricas e traces desconectados - troubleshooting lento',
                    impact: 'high',
                    recommendation: 'Implementar plataforma unificada de observabilidade'
                }
            ]
        };
    }

    if (lowerMessage.includes('finops') || lowerMessage.includes('custo')) {
        return {
            success: true,
            content: `💰 **FinOps - Otimização Inteligente de Custos em Nuvem**

**Análise preliminar:**
Com base no padrão típico de empresas do seu porte, identificamos:

**Oportunidades de economia:**
🔹 Recursos ociosos: 15-20% do gasto atual
🔹 Reserved Instances vs. On-Demand: economia potencial de 30-40%
🔹 Right-sizing: 10-15% em recursos superdimensionados

**Potencial de liberação de budget:**
📉 Redução estimada: 25-35% do custo atual de nuvem
💰 Valor liberado para inovação: R$ XX.XXX/mês

**Roadmap FinOps (90 dias):**
1. Fase 1 (30 dias): Visibility - Dashboards de custo por time/projeto
2. Fase 2 (60 dias): Optimization - Right-sizing e RI/SP
3. Fase 3 (90 dias): Culture - Showback/Chargeback e gamificação

**Retorno do investimento:**
Payback em 3-4 meses | Economia anual de 30-40%

Vamos fazer um FinOps Assessment detalhado?`,
            findings: [
                {
                    type: 'waste',
                    description: 'Recursos ociosos e superdimensionados em nuvem',
                    impact: 'high',
                    recommendation: 'Implementar FinOps com right-sizing e reserved instances',
                    savings: 'Redução potencial de 30-35%'
                }
            ]
        };
    }

    if (lowerMessage.includes('devsecops') || lowerMessage.includes('segurança')) {
        return {
            success: true,
            content: `🔒 **DevSecOps - Segurança como Código**

**Problemas identificados (cenário típico):**
❌ Segurança é etapa final (gatilho de atrasos)
❌ Vulnerabilidades descobertas só em produção
❌ Conflito entre dev (velocidade) e security (segurança)

**Solução Shift-Left Keeggo:**
✅ SAST/DAST integrados ao pipeline CI/CD
✅ Security as Code (policy-as-code)
✅ Vulnerabilidades detectadas em PR, não em produção

**Benefícios mensuráveis:**
- Vulnerabilidades em produção: redução de 80%
- Tempo de correção: de semanas para dias
- Zero atrito entre dev e security

**Implementação (6-8 semanas):**
1. Semana 1-2: SAST no pipeline
2. Semana 3-4: DAST em homologação
3. Semana 5-6: Container scanning
4. Semana 7-8: Security training e cultura

Quer ver um demo do DevSecOps na prática?`,
            findings: [
                {
                    type: 'vulnerability',
                    description: 'Segurança como etapa final - vulnerabilidades vão para produção',
                    impact: 'high',
                    recommendation: 'Implementar shift-left com SAST/DAST no pipeline'
                }
            ]
        };
    }

    if (lowerMessage.includes('ci/cd') || lowerMessage.includes('pipeline')) {
        return {
            success: true,
            content: `🚀 **Esteira CI/CD - Automação de Ponta a Ponta**

**Diagnóstico rápido de maturidade:**
📊 DORA Metrics estimadas:
- Lead Time: 2-3 semanas (boa prática: <1 dia)
- Deployment Frequency: 1x/mês (boa prática: múltiplas vezes/dia)
- MTTR: 2-3 horas (boa prática: <1 hora)
- Change Failure Rate: 20% (boa prática: <5%)

**Gargalos comuns identificados:**
🐌 Testes manuais de segurança e performance
🐌 Aprovações manuais para produção
🐌 Build lento (+15 minutos)

**Solução Keeggo:**
✅ Pipeline totalmente automatizado
✅ Quality gates automáticos (testes, security, performance)
✅ Deploy contínuo com feature flags

**Benefícios:**
- Deploys de semanas para horas
- Zero downtime com blue/green deployment
- Rollback automático em 5 minutos

Quer um assessment gratuito da sua esteira CI/CD?`,
            findings: [
                {
                    type: 'inefficiency',
                    description: 'Pipeline com aprovações manuais e testes lentos',
                    impact: 'high',
                    recommendation: 'Automatizar qualidade gates e deploy contínuo'
                }
            ],
            maturityScore: 2.1
        };
    }

    if (lowerMessage.includes('cloud') || lowerMessage.includes('migração')) {
        return {
            success: true,
            content: `☁️ **Cloud Migration & Modernization**

**Estratégia baseada no seu momento:**

**Opção 1: Lift & Shift (rápido, menos otimizado)**
- Prazo: 2-4 semanas para migração inicial
- Risco: baixo
- Benefício: imediato (50% redução CAPEX)
- Ideal para: prazo curto, aplicações estáveis

**Opção 2: Modernização gradual (balanceado)**
- Prazo: 3-6 meses
- Risco: médio
- Benefício: cloud-native, escalabilidade automática
- Ideal para: replatforming com melhorias incrementais

**Opção 3: Re-architect (cloud-native total)**
- Prazo: 6-12 meses
- Risco: médio-alto
- Benefício: máximo (microservices, serverless)
- Ideal para: novas aplicações ou grande transformação

**Entregáveis Keeggo:**
✅ Assessment de readiness (2 semanas)
✅ Plano de migração detalhado
✅ Runbooks e automação de rollback
✅ Treinamento das equipes

Qual estratégia faz mais sentido para você agora?`,
            findings: [
                {
                    type: 'opportunity',
                    description: 'Oportunidade de modernização para cloud-native',
                    impact: 'high',
                    recommendation: 'Iniciar com lift-and-shift e modernizar gradualmente'
                }
            ]
        };
    }

    return {
        success: true,
        content: `🚀 **DevOps & Platform Engineering - Keeggo**

Como posso ajudar a acelerar sua entrega com tecnologia de ponta?

**📊 Observabilidade**
Vá além do monitoramento. Entenda POR QUÊ sistemas falham. Reduza MTTR de horas para minutos.

**💰 FinOps**
Libere budget para inovação. Otimize custos de nuvem em 30-40% sem sacrificar performance.

**🔒 DevSecOps**
Segurança shift-left. Vulnerabilidades detectadas em PR, não em produção. 80% menos riscos.

**🚀 Esteira CI/CD**
Deploys de semanas para horas. Automação total com qualidade garantida.

**☁️ Cloud Migration**
Jornada segura para nuvem. Lift-and-shift ou modernização cloud-native.

**Para começar, me diga:**
1. Qual sua maior dor hoje? (observabilidade, custos, segurança, velocidade?)
2. Quanto tempo leva seu deploy atual?
3. Onde você mais perde tempo na esteira?

Dados baseados em métricas reais. Soluções pragmáticas. Resultados mensuráveis.`
    };
}

function getFullSpectrumMockResponse(lowerMessage: string): ChatResponse {
    return {
        success: true,
        content: `🎯 **Full Spectrum - Estratégia + Execução**

**VISÃO INTEGRADA KEEGGO**

**Governança e Estratégia:**
- Business Process Discovery: operação real, não teoria
- GRC Estratégico: decisão baseada em evidências
- Maturidade: score atual 2.4/5 → meta 4.0/5 em 12 meses

**DevOps e Platform Engineering:**
- Observabilidade: MTTR de 4h → meta 30 min
- FinOps: economia de 35% em cloud → liberação budget
- DevSecOps: 80% menos vulnerabilidades em produção
- CI/CD: lead time de 2 semanas → meta 2 horas

**Roadmap Integrado (12 meses):**

**Trimestre 1 - Clareza:**
✅ Mapeamento real dos 5 processos críticos
✅ Baseline de métricas (DORA, custos, riscos)
✅ Quick wins (retrabalho eliminado, recursos ociosos)

**Trimestre 2 - Estabilização:**
✅ Observabilidade implementada nos sistemas críticos
✅ Esteira CI/CD automatizada
✅ Primeiros controles proporcionais de governança

**Trimestre 3 - Otimização:**
✅ FinOps ativo com redução real de custos
✅ DevSecOps shift-left implementado
✅ Gestão de riscos proativa

**Trimestre 4 - Excelência:**
✅ Operação eficiente + Governança inteligente
✅ Cultura de melhoria contínua estabelecida
✅ Métricas em nível de excelência (DORA elite)

**Resultados esperados:**
📈 2x mais velocidade de entrega
💰 35% redução de custos cloud
🛡️ 80% menos vulnerabilidades
🎯 100% visibilidade de riscos operacionais

Quer um workshop de alinhamento estratégico?`
    };
}