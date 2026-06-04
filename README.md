# 🚀 ARIA - Plataforma de Assessment Inteligente

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![DeepSeek](https://img.shields.io/badge/DeepSeek-API-4A6FA5?logo=deepseek)](https://deepseek.com/)

---

> **📌 Uso Interno Keeggo**  
> Esta aplicação é de uso exclusivo da equipe interna da **Keeggo** para fins de assessment e consultoria.  
> Não autorizado para distribuição externa ou uso por terceiros sem permissão explícita.

---

## 📋 **Sobre o Projeto**

**ARIA** é uma plataforma de assessment inteligente desenvolvida para automatizar e potencializar o processo de avaliação de maturidade em dois contextos principais de TI:

- **Business Process Discovery & GRC** - Focado em ISO 27001, LGPD, COBIT, RIPD e BPM
- **DevOps & Platform Engineering** - Focado em Well-Architected, DORA Metrics, CIS Controls, DevSecOps e FinOps
- **Full Spectrum** - Visão integrada que combina ambos os contextos para uma avaliação completa

### 🎯 **Por que o ARIA foi criado?**

O ARIA nasceu da necessidade real da **Keeggo** de otimizar os processos de assessment realizados para clientes, enfrentando desafios como:

- **Trabalho manual repetitivo** - Análise de documentos, criação de relatórios, identificação de gaps
- **Perda de conhecimento** - Especialistas levam consigo o entendimento de cada cliente
- **Inconsistência nas avaliações** - Cada consultor tem seu próprio método e critérios
- **Dificuldade de rastreabilidade** - Como provar que uma recomendação veio de uma evidência concreta?
- **Tempo de resposta** - Clientes esperam dias ou semanas por um relatório

O ARIA resolve estes problemas ao:
- **Automatizar a extração** de informações de documentos
- **Fornecer respostas baseadas em evidências** (citando fontes)
- **Gerar relatórios personalizados** em minutos, não dias
- **Manter o histórico** de todas as análises por projeto
- **Garantir consistência** usando frameworks reconhecidos (ISO, DORA, COBIT)

### 👥 **Público-alvo interno**

- Consultores de Governança de TI
- Especialistas em Qualidade de Software
- Arquitetos de Qualidade
- Profissionais de DevOps e Cloud
- Líderes técnicos e gestores

---

## ✨ **Funcionalidades Principais**

### 📁 **Gestão de Projetos**
- Criar, editar e excluir projetos de assessment
- Cada projeto guarda: nome, cliente, contexto, observações
- Progresso automático baseado nas ações realizadas

### 📄 **Processamento de Documentos**
- Upload de múltiplos formatos (PDF, DOCX, TXT, XLSX)
- Extração automática de texto e metadados
- Seleção granular de quais documentos usar em cada análise

### 💬 **Chat Inteligente (Estilo NotebookLM)**
- Pergunte sobre os documentos carregados
- Respostas baseadas em evidências com citação das fontes
- Três modos de especialidade:
  - **Governança** - Tom formal, foco em compliance e normas
  - **DevOps** - Tom técnico, foco em métricas e automação
  - **Full Spectrum** - Visão equilibrada e estratégica

### 🎨 **Estúdio de Documentos**
- Templates prontos para geração de relatórios
- Documentos 100% baseados nos arquivos do cliente (sem invenções)
- Formatos: Markdown, DOCX, PDF

### 🌓 **Tema Claro/Escuro**
- Interface adaptável à preferência do usuário
- Cores dinâmicas que mudam conforme o modo selecionado

---

## 🛠️ **Tecnologias Utilizadas**

| Camada | Tecnologia | Versão | Finalidade |
|--------|------------|--------|------------|
| **Frontend** | React | 18.3 | Interface de usuário |
| | TypeScript | 5.0 | Tipagem estática |
| | Vite | 5.0 | Build tool |
| | Tailwind CSS | 3.4 | Estilização |
| | shadcn/ui | latest | Componentes UI |
| | Lucide React | latest | Ícones |
| **Backend** | FastAPI | 0.115 | API REST |
| | DeepSeek API | - | IA para chat e análises |
| | ChromaDB | 0.4 | Vector database para RAG |
| | SQLAlchemy | 2.0 | ORM |
| | python-docx | 1.1 | Geração de documentos Word |
| | WeasyPrint | 62.0 | Geração de PDF |

---

## 📦 **Pré-requisitos**

Antes de começar, você precisa ter instalado:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **Python** (versão 3.11 ou superior) - [Download](https://www.python.org/downloads/)
- **Git** (opcional, para clonar o repositório)
- **API Key do DeepSeek** (gratuita) - [Obter chave](https://platform.deepseek.com/)

---

## 🚀 **Como Rodar o Projeto pela Primeira Vez**

### **Passo 1: Clone o repositório**

```bash
git clone https://github.com/keeggo/aria.git
cd aria