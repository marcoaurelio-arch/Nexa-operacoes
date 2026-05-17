# Google Sheets — Integrações Institucionais

## Visão Geral

Google Sheets atua como **camada operacional** entre sistemas — espelho do CRM, log de automações, dashboards leves e cockpit comercial.

## Planilhas-Mestre

| Planilha | Função | Owner | Sincronização |
|----------|--------|-------|---------------|
| `CRM-Mirror` | Espelho do funil comercial | RevOps | n8n a cada 1h |
| `Logs-Automacoes` | Registro de execuções críticas | Planejarcomm | n8n em tempo real |
| `Pipeline-Forecast` | Forecast trimestral | Diretor Comercial | manual + automações |
| `Inventario-Lojas` | Vacância e status por ativo | Gestão de Ativos | n8n a cada 6h |
| `Custos-Operacionais` | Acompanhamento de OPEX | Diretor Financeiro | manual |

## Padrão de Nomenclatura

- **Planilha:** `[Area]-[Funcao]` → ex.: `CRM-Mirror`
- **Aba:** `kebab-case` → ex.: `pipeline-lojistas`
- **Coluna:** `snake_case` → ex.: `data_criacao`

## Integrações com n8n

| Workflow | Direção | Planilha |
|----------|---------|----------|
| `dados-sincroniza-crm-sheets` | CRM → Sheets | CRM-Mirror |
| `dados-loga-automacao` | n8n → Sheets | Logs-Automacoes |
| `ops-atualiza-vacancia` | Sistema → Sheets | Inventario-Lojas |

## Apps Script (catálogo)

| Script | Função | Planilha |
|--------|--------|----------|
| `notifica-vencimento.gs` | Alerta de contratos vincendos | Inventario-Lojas |
| `gera-resumo-semanal.gs` | Resumo do funil para diretoria | Pipeline-Forecast |

## Boas Práticas

1. Toda planilha-mestre tem README na primeira aba.
2. Toda coluna tem cabeçalho descritivo.
3. Toda automação que escreve em Sheets registra timestamp.
4. Permissões revisadas semestralmente.
5. Histórico de versão sempre ativo.

## Limitações

- Sheets não substitui banco de dados — máximo 10 mil linhas por aba.
- Acima de 50 mil registros, migrar para BigQuery/Supabase.
