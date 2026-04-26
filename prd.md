# PRD — Quiz Claude Code

## 1. Visão Geral

**Nome do produto:** Claude Code Quiz  
**Tagline:** "Quanto você realmente sabe sobre o Claude Code?"  
**Idioma:** Português  
**Data de criação:** 2026-04-26  

### Problema

Devs que já utilizam Claude Code no dia a dia não têm uma forma rápida e envolvente de validar seu nível de conhecimento sobre a ferramenta, nem de se comparar com outros usuários.

### Solução

Um quiz web gamificado de verdadeiro ou falso, com 20 perguntas ordenadas por dificuldade crescente, timer por questão, sistema de pontuação e leaderboard público.

---

## 2. Objetivos de Negócio

- Engajar a comunidade de desenvolvedores que já usa Claude Code.
- Criar um instrumento de aprendizado ativo (o usuário descobre o que não sabe ao ver as explicações).
- Gerar competição saudável via ranking público.
- Servir como vitrine de conhecimento sobre Claude Code.

---

## 3. Público-Alvo

**Perfil principal:** Desenvolvedores que já utilizam Claude Code e querem testar e validar seu conhecimento.

**Características:**
- Familiarizados com ferramentas de desenvolvimento modernas.
- Motivados por gamificação, pontuação e comparação entre pares.
- Preferem interfaces rápidas, sem fricção (sem necessidade de cadastro completo).

---

## 4. Funcionalidades (Features)

### 4.1 Tela Inicial (Landing)
- Apresentação do quiz: título, descrição e regras resumidas.
- Campo para o usuário inserir um **apelido (nickname)** antes de começar (sem autenticação formal).
- Prévia do leaderboard (top 5).
- Botão "Iniciar Quiz".

### 4.2 Quiz
- **20 perguntas** por sessão, ordenadas da mais fácil para a mais difícil:
  - 8 perguntas Iniciante (40%)
  - 7 perguntas Intermediário (35%)
  - 5 perguntas Avançado (25%)
- Perguntas selecionadas aleatoriamente dentro de cada nível a partir do banco local JSON.
- Cada pergunta exibe:
  - Indicador de nível (badge: Iniciante / Intermediário / Avançado).
  - Número da questão atual (ex: "Pergunta 7 de 20").
  - Barra de progresso.
  - Enunciado da afirmação.
  - Dois botões: **Verdadeiro** e **Falso**.
  - Countdown timer visual (barra + número de segundos).

#### Timers por nível
| Nível | Tempo |
|---|---|
| Iniciante | 30 segundos |
| Intermediário | 20 segundos |
| Avançado | 15 segundos |

- Se o timer expirar sem resposta, a questão é contada como **errada** (0 pontos).
- Após responder (ou o timer expirar), avança automaticamente para a próxima pergunta após 1 segundo de feedback visual (verde = acerto, vermelho = erro).

### 4.3 Sistema de Pontuação

**Pontos base por acerto:**
| Nível | Pontos base |
|---|---|
| Iniciante | 100 pts |
| Intermediário | 150 pts |
| Avançado | 200 pts |

**Bônus de velocidade:** `segundos_restantes × 5 pts`

**Exemplo:** Acertar uma questão Intermediária com 12 segundos restantes = `150 + (12 × 5) = 210 pts`

**Erro ou timeout:** 0 pts (sem penalidade negativa).

**Pontuação máxima teórica:**
- 8 × (100 + 30×5) = 8 × 250 = 2.000 pts
- 7 × (150 + 20×5) = 7 × 250 = 1.750 pts
- 5 × (200 + 15×5) = 5 × 275 = 1.375 pts
- **Total máximo: 5.125 pts**

### 4.4 Tela de Resultado Final

Exibida após a 20ª pergunta, contendo:
- Pontuação total obtida.
- Número de acertos por nível (ex: "6/8 Iniciante | 5/7 Intermediário | 3/5 Avançado").
- **Categoria final** baseada no percentual de acerto:

| Acertos (%) | Categoria |
|---|---|
| 0–39% | Curioso |
| 40–59% | Praticante |
| 60–79% | Proficiente |
| 80–94% | Expert |
| 95–100% | Claude Code Master |

- **Revisão completa:** todas as 20 perguntas com resposta do usuário, resposta correta e explicação detalhada.
- Botão "Ver Leaderboard".
- Botão "Jogar Novamente" (novo sorteio de perguntas).

### 4.5 Leaderboard Público

- Ranking global com os top 20 melhores scores.
- Colunas: Posição | Nickname | Pontuação | Categoria | Data.
- Score do usuário destacado na tabela (mesmo fora do top 20).
- Atualizado em tempo real via Supabase.
- Acessível também pela tela inicial.

---

## 5. Banco de Perguntas

### 5.1 Estrutura JSON

Arquivo: `/data/questions.json`

```json
[
  {
    "id": 1,
    "level": "iniciante",
    "statement": "O Claude Code é uma interface de linha de comando (CLI) oficial da Anthropic.",
    "answer": true,
    "explanation": "Correto. O Claude Code é a CLI oficial da Anthropic que permite interagir com o Claude diretamente no terminal, com acesso ao sistema de arquivos e ferramentas de desenvolvimento."
  }
]
```

**Campos obrigatórios:**
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number | Identificador único |
| `level` | `"iniciante"` \| `"intermediario"` \| `"avancado"` | Nível de dificuldade |
| `statement` | string | Afirmação a ser julgada (V/F) |
| `answer` | boolean | Resposta correta |
| `explanation` | string | Explicação exibida no resultado final |

### 5.2 Quantidade de Perguntas no Banco

- Mínimo: 30 perguntas
- Recomendado: 45–50 perguntas
- Distribuição sugerida: 18 iniciante, 16 intermediário, 11 avançado

### 5.3 Temas cobertos por nível

**Iniciante — conceitos de negócio e uso básico:**
- O que é o Claude Code e para que serve
- Como instalar e iniciar
- Comandos básicos (`/help`, `/clear`, `/exit`)
- Modelos disponíveis (Opus, Sonnet, Haiku)
- Permissões e modos de aprovação

**Intermediário — recursos e configuração:**
- Hooks e automações
- Arquivos CLAUDE.md e configuração de projeto
- MCP Servers (Model Context Protocol)
- Uso de ferramentas (Read, Edit, Bash, etc.)
- Slash commands e skills
- Modos de permissão (auto-approve, etc.)

**Avançado — arquitetura e casos avançados:**
- Claude Agent SDK
- Sub-agentes e paralelismo
- API da Anthropic (prompt caching, tool use, streaming)
- Configuração avançada de hooks
- Worktrees e isolamento de ambiente
- Limites de contexto e compactação

---

## 6. Arquitetura Técnica

### 6.1 Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Estilização | Tailwind CSS |
| Banco de dados | Supabase (PostgreSQL) |
| Deploy | Vercel |
| Perguntas | JSON local (`/data/questions.json`) |
| Linguagem | TypeScript |

### 6.2 Estrutura de Pastas

```
/
├── app/
│   ├── page.tsx              # Landing + leaderboard
│   ├── quiz/
│   │   └── page.tsx          # Tela do quiz
│   ├── result/
│   │   └── page.tsx          # Resultado final + revisão
│   └── api/
│       └── scores/
│           ├── route.ts      # GET top 20 scores
│           └── submit/
│               └── route.ts  # POST novo score
├── components/
│   ├── QuizCard.tsx          # Card da pergunta atual
│   ├── Timer.tsx             # Countdown visual
│   ├── ProgressBar.tsx       # Barra de progresso
│   ├── LevelBadge.tsx        # Badge de nível
│   ├── ResultSummary.tsx     # Resumo do resultado
│   ├── ReviewList.tsx        # Lista de revisão das perguntas
│   └── Leaderboard.tsx       # Tabela de ranking
├── data/
│   └── questions.json        # Banco de perguntas
├── lib/
│   ├── supabase.ts           # Cliente Supabase
│   ├── quiz.ts               # Lógica de seleção/embaralhamento
│   └── scoring.ts            # Cálculo de pontuação e categoria
└── types/
    └── index.ts              # Interfaces TypeScript
```

### 6.3 Modelo de Dados — Supabase

**Tabela: `scores`**

```sql
CREATE TABLE scores (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname    text NOT NULL,
  score       integer NOT NULL,
  total_questions integer NOT NULL DEFAULT 20,
  correct_answers integer NOT NULL,
  category    text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- Índice para ranking
CREATE INDEX idx_scores_score ON scores(score DESC);
```

**Row Level Security:** apenas INSERT e SELECT público (sem autenticação).

### 6.4 API Routes

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/scores` | Retorna top 20 scores ordenados por pontuação |
| POST | `/api/scores/submit` | Salva novo score no Supabase |

**Payload POST `/api/scores/submit`:**
```json
{
  "nickname": "dev_user",
  "score": 3250,
  "correct_answers": 15,
  "category": "Expert"
}
```

### 6.5 Gerenciamento de Estado do Quiz

Estado armazenado em `useState` / `useReducer` local (sem persistência entre sessões):

```typescript
interface QuizState {
  questions: Question[]       // 20 perguntas selecionadas
  currentIndex: number        // índice atual (0–19)
  answers: UserAnswer[]       // respostas do usuário
  totalScore: number          // pontuação acumulada
  status: 'idle' | 'running' | 'finished'
}

interface UserAnswer {
  questionId: number
  userAnswer: boolean | null  // null = timeout
  correct: boolean
  pointsEarned: number
  timeRemaining: number
}
```

---

## 7. Fluxo do Usuário

```
Landing Page
    ↓
Insere nickname → Clica "Iniciar Quiz"
    ↓
Questão 1 (Iniciante) — Timer 30s
    ↓ responde ou timeout
Questão 2 ... até Questão 20 (Avançado)
    ↓
Tela de Resultado
  - Score total + Categoria
  - Acertos por nível
  - Revisão completa com explicações
    ↓
Score salvo no Supabase
    ↓
Leaderboard (com posição do usuário destacada)
    ↓
Opção: Jogar Novamente | Ver Leaderboard completo
```

---

## 8. Design e UX

### 8.1 Princípios
- Interface limpa, foco total na pergunta durante o quiz.
- Feedback visual imediato após resposta (verde/vermelho).
- Timer deve ser urgente mas não ansioso — barra de progresso colorida (verde → amarelo → vermelho).
- Mobile-first: 100% responsivo.

### 8.2 Paleta de Cores sugerida
- Fundo: dark (`#0F0F0F` ou similar)
- Destaque principal: laranja Anthropic (`#D97706` ou `#F59E0B`)
- Acerto: verde (`#22C55E`)
- Erro: vermelho (`#EF4444`)
- Neutro: cinza (`#374151`)

### 8.3 Tipografia
- Fonte: Inter ou Geist (padrão Next.js)

---

## 9. Critérios de Aceite

| # | Critério |
|---|---|
| 1 | Usuário consegue iniciar o quiz inserindo apenas um nickname |
| 2 | 20 perguntas são exibidas em ordem crescente de dificuldade |
| 3 | Timer conta regressivamente e avança para próxima ao expirar |
| 4 | Pontuação é calculada corretamente com bônus de velocidade |
| 5 | Tela de resultado exibe score, categoria e revisão completa |
| 6 | Score é salvo no Supabase e aparece no leaderboard |
| 7 | Leaderboard exibe top 20 e destaca a posição do usuário |
| 8 | Interface é responsiva em mobile e desktop |
| 9 | Banco de perguntas tem no mínimo 30 questões em JSON |
| 10 | Perguntas são sorteadas aleatoriamente a cada nova partida |

---

## 10. Fora do Escopo (v1)

- Autenticação com OAuth ou email/senha.
- Sistema de medalhas ou conquistas.
- Modo multiplayer em tempo real.
- Trilhas de aprendizado ou cursos.
- Internacionalização (i18n) para outros idiomas.
- Painel administrativo para gestão de perguntas.

---

## 11. Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 12. Checklist de Entrega

- [ ] Banco de 30–50 perguntas em `/data/questions.json`
- [ ] Landing page com leaderboard preview
- [ ] Fluxo completo do quiz (20 perguntas + timer)
- [ ] Tela de resultado com revisão e explicações
- [ ] Leaderboard público com top 20
- [ ] Integração Supabase (tabela `scores` criada)
- [ ] Deploy na Vercel com variáveis de ambiente configuradas
- [ ] Testes manuais do fluxo completo em mobile e desktop
