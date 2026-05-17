# 📞 SDR — Sales Development & Prospecção

> Operação de geração e qualificação de oportunidades para as três frentes comerciais da Nexa Malls.

---

## 1. Objetivo

Construir e operar uma máquina de prospecção previsível, mensurável e escalável, alimentando o CRM com oportunidades qualificadas para closers e diretoria.

---

## 2. Estrutura

| Subpasta | Conteúdo |
|----------|----------|
| `Scripts/` | Scripts de cold call, voicemail, demo, follow-up |
| `Cadencias/` | Sequências multi-canal por persona |
| `Listas-Prospects/` | Bases segmentadas (sem dados reais no Git) |
| `Templates-Mensagens/` | Mensagens WhatsApp, LinkedIn, email |
| `Objecoes/` | Catálogo de objeções e respostas |
| `Qualificacao-BANT/` | Frameworks e scorecards de qualificação |

---

## 3. Responsáveis

| Função | Responsável |
|--------|-------------|
| Owner SDR | Coordenador SDR |
| Operação diária | SDRs |
| Qualidade de cadências | Sales Ops |
| Métricas e relatórios | RevOps |

---

## 4. Ferramentas Utilizadas

- **Discagem:** softphone integrado ao CRM
- **Email:** Apollo / Outreach / Reply
- **WhatsApp:** API oficial + n8n
- **LinkedIn:** Sales Navigator, Apollo
- **Enriquecimento:** Apollo, Common Room, ZoomInfo
- **IA:** `/IA/Prompts/SDR/` para personalização e objeções

---

## 5. Integrações

- **SDR ↔ CRM** — toda atividade registrada.
- **SDR ↔ IA** — personalização e qualificação assistida.
- **SDR ↔ Marketing** — leads inbound roteados.
- **SDR ↔ Comercial** — handoff documentado.

---

## 6. Personas Prioritárias

### 6.1 Lojistas
- Gerente de Expansão de redes varejistas
- Diretor de Operações de franquias
- Sócio de operação multi-unidade

### 6.2 Investidores
- Family offices
- Gestores de FII
- Investidor PF qualificado

### 6.3 Proprietários de Terrenos
- Proprietário direto (PF/PJ)
- Imobiliárias com mandato
- Espólios e inventariantes

---

## 7. Estrutura Padrão de Cadência

| Dia | Canal | Ação |
|-----|-------|------|
| 1 | Email | Apresentação institucional |
| 1 | LinkedIn | Connection request personalizado |
| 3 | Telefone | Cold call |
| 5 | Email | Follow-up com valor (estudo, case) |
| 7 | WhatsApp | Mensagem curta e objetiva |
| 10 | LinkedIn | Mensagem direta |
| 14 | Telefone | Última tentativa |
| 21 | Email | Break-up email |

---

## 8. Status Operacional

| Componente | Status |
|------------|--------|
| Scripts por persona | 🔄 Em construção |
| Cadências padrão | 🔄 Em construção |
| Catálogo de objeções | 🔄 Em construção |
| Métricas SDR (atividade, conversão) | ⏳ Backlog |
| Onboarding novo SDR | 🔄 Em construção |

---

## 9. Fluxos Relacionados

- `/CRM/Pipeline/` — destino das oportunidades qualificadas.
- `/Comercial/Playbooks/` — continuação do funil.
- `/IA/Prompts/SDR/` — assistência por IA.
- `/Dashboards/Comercial/` — performance SDR.

---

## 10. Métricas-Chave

| Métrica | Meta de Referência |
|---------|--------------------|
| Atividades/SDR/dia | ≥ 60 |
| Connect rate | ≥ 15% |
| Meeting booked rate | ≥ 8% |
| Show rate | ≥ 70% |
| MQL → SQL | ≥ 30% |
