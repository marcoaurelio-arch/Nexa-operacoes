# 📈 Dashboards — Visibilidade Executiva e Operacional

> Painéis institucionais que consolidam dados de todas as áreas em tempo real para decisão executiva e operacional.

---

## 1. Objetivo

Dar visibilidade unificada e em tempo real da performance da Nexa Malls — em frentes executiva, comercial, financeira, operacional e de marketing — sustentando reuniões de gestão por dados (data-driven).

---

## 2. Estrutura

| Subpasta | Conteúdo |
|----------|----------|
| `Executivo/` | Visão consolidada para sócios e diretoria |
| `Operacional/` | Indicadores de operação de ativos |
| `Comercial/` | Pipeline, conversão, atividade |
| `Financeiro/` | Receita, NOI, inadimplência, fluxo |
| `Marketing/` | Performance, leads, custo por canal |
| `Looker-Studio/` | Definições e fontes Looker |
| `Power-BI/` | Arquivos `.pbix` e documentação |
| `Google-Sheets/` | Dashboards Sheets nativos |

---

## 3. Responsáveis

| Função | Responsável |
|--------|-------------|
| Owner Dashboards | Diretor de Operações |
| Modelagem de dados | Planejarcomm |
| Validação numérica | Cada área dona da métrica |
| Atualização automática | n8n + Apps Script |

---

## 4. Ferramentas Utilizadas

- **BI:** Looker Studio (principal), Power BI, Metabase
- **Data:** Google Sheets, BigQuery, Supabase
- **ETL:** n8n, Supermetrics, Apps Script
- **Storytelling:** Notion (interpretação executiva)

---

## 5. Integrações

- **CRM ↔ Dashboards Comercial** — pipeline em tempo real.
- **Financeiro (ERP) ↔ Dashboards Financeiro** — DRE consolidado.
- **GA4 + Ads ↔ Dashboards Marketing** — funil end-to-end.
- **Operação de ativos ↔ Dashboards Operacional** — vacância, NOI, inadimplência.

---

## 6. Painéis-Chave

### 6.1 Executivo (semanal)
- Pipeline ponderado por estágio
- Receita projetada vs. realizada
- NOI consolidado dos ativos
- Marcos de projeto
- Riscos críticos

### 6.2 Comercial (diário)
- Atividades SDR
- Oportunidades por estágio
- Forecast do trimestre
- Taxas de conversão
- Tempo médio por estágio

### 6.3 Financeiro (mensal)
- Receita por ativo
- NOI por ativo
- Inadimplência
- Cap rate implícito
- Cobertura de serviço da dívida

### 6.4 Operacional (semanal)
- Vacância por ativo
- Tickets de manutenção
- Comunicação com lojistas
- Indicadores ESG

### 6.5 Marketing (semanal)
- Tráfego e origem
- Leads por canal
- CPLq por canal
- Engajamento orgânico
- Performance de campanhas

---

## 7. Status Operacional

| Componente | Status |
|------------|--------|
| Modelo de dados unificado | 🔄 Em construção |
| Dashboard executivo | ⏳ Backlog |
| Dashboard comercial | ⏳ Backlog |
| Dashboard financeiro | ⏳ Backlog |
| Cadência de revisão | ⏳ Backlog |

---

## 8. Fluxos Relacionados

- `/CRM/` — origem do comercial.
- `/Automacoes/n8n/workflows/` — ETLs.
- `/Viabilidade/` — projeções financeiras.
- `/Marketing/Performance/` — origem do marketing.

---

## 9. Convenções

- **Toda métrica** tem dono, fórmula e fonte documentada.
- **Toda atualização** é versionada.
- **Toda revisão** semanal/mensal/trimestral é registrada em ata.
- **Toda exceção numérica** é justificada no painel.

---

## 10. Cadência de Revisão

- **Diário:** Comercial (huddle SDR/closers)
- **Semanal:** Executivo, Operacional, Marketing
- **Mensal:** Financeiro, Comitê de Gestão
- **Trimestral:** Comitê Executivo, OKRs
