# 📊 Viabilidade — Modelagem Econômico-Financeira

> Modelos, premissas, sensibilidades e estudos completos de viabilidade para projetos de strip malls e ativos comerciais.

---

## 1. Objetivo

Sustentar tecnicamente toda decisão de investimento da Nexa Malls com modelos financeiros institucionais, padronizados, auditáveis e versionados.

---

## 2. Estrutura

| Subpasta | Conteúdo |
|----------|----------|
| `Modelos-Excel/` | Modelos financeiros em Excel (master e por projeto) |
| `Estudos-Concluidos/` | Estudos finalizados, organizados por projeto |
| `Templates/` | Templates reutilizáveis (DRE, fluxo de caixa, sensibilidade) |
| `Cap-Rate/` | Análises de cap rate por região e tipologia |
| `NOI/` | Memórias de cálculo de Net Operating Income |
| `DRE/` | Demonstrativos projetados |
| `Sensibilidade/` | Tabelas de sensibilidade multi-variável |
| `Premissas/` | Premissas institucionais e específicas |

---

## 3. Responsáveis

| Função | Responsável |
|--------|-------------|
| Owner Viabilidade | Diretor Financeiro |
| Modelagem | Analistas Financeiros |
| Validação | Diretor Financeiro + Sócios |
| Atualização de premissas | Time de Inteligência |

---

## 4. Ferramentas Utilizadas

- **Excel / Google Sheets** — modelos
- **Python** — análises complementares
- **Power BI / Looker** — visualização
- **S&P Capital IQ, Daloopa, LSEG** — dados de mercado (quando aplicável)
- **IA** — crítica de premissas via `/IA/Prompts/Viabilidade/`

---

## 5. Integrações

- **Viabilidade ↔ Estudos** — premissas de demanda e renda.
- **Viabilidade ↔ Comercial** — propostas para investidores.
- **Viabilidade ↔ Dashboards** — KPIs consolidados.
- **Viabilidade ↔ Projetos** — cada projeto tem seu estudo vinculado.

---

## 6. Estrutura Padrão de Estudo de Viabilidade

1. **Resumo Executivo** (1 página)
2. **Descrição do Ativo** — terreno, projeto arquitetônico, ABL
3. **Premissas Operacionais** — vacância, inadimplência, IPTU, condomínio
4. **Premissas de Mercado** — aluguel/m², mix, cap rate
5. **Investimento** — terreno, obra, aprovação, mobiliário
6. **Cronograma** — desenvolvimento, comercialização, estabilização
7. **DRE Projetado** — 10 anos
8. **Fluxo de Caixa** — VPL, TIR, payback
9. **Sensibilidade** — variáveis críticas
10. **Cenários** — base, otimista, pessimista
11. **Risco e Mitigantes**
12. **Conclusão e Recomendação**

---

## 7. Indicadores Padrão

| Indicador | Fórmula | Faixa Alvo |
|-----------|---------|------------|
| Cap Rate | NOI / Valor do Ativo | 9% – 11% |
| Yield on Cost | NOI Estabilizado / Custo Total | > 11% |
| TIR Alavancada | — | > 18% |
| TIR Desalavancada | — | > 13% |
| Payback | — | < 8 anos |
| LTV | Dívida / Valor do Ativo | < 60% |
| DSCR | NOI / Serviço da Dívida | > 1,3 |

---

## 8. Status Operacional

| Componente | Status |
|------------|--------|
| Template master Excel | 🔄 Em construção |
| Premissas institucionais | 🔄 Em construção |
| Biblioteca de cap rates | ⏳ Backlog |
| Modelo de sensibilidade | 🔄 Em construção |
| Auditoria interna | ⏳ Backlog |

---

## 9. Fluxos Relacionados

- `/Estudos/Macroeconomia/` — curva de juros, inflação.
- `/Estudos/Setor-Varejo/` — aluguel/m² de referência.
- `/Comercial/Propostas/` — anexo financeiro.
- `/Projetos/Em-Desenvolvimento/` — estudo vinculado a cada projeto.

---

## 10. Governança

- **Toda alteração** em modelo master gera versão (`vX.Y.Z`).
- **Toda premissa** tem fonte documentada.
- **Todo estudo** passa por revisão dual antes de circular.
- **Toda decisão** baseada em estudo é registrada com data e responsável.
