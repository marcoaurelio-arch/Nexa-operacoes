---
titulo: Integração Google Workspace
versao: 1.0.0
data: 2026-05-16
tipo: arquitetura
---

# Integração Google Workspace

## 1. Objetivo
Operacionalizar Google Sheets, Gmail e Google Calendar como sistemas operacionais centrais da Nexa Malls — orquestrados via n8n.

## 2. Serviços Utilizados
- **Google Sheets** — espelho operacional, logs, dashboards leves
- **Gmail** — comunicação externa, automações de e-mail
- **Google Calendar** — agendamentos, briefings automatizados
- **Google Drive** — armazenamento de documentos
- **Google Docs** — colaboração textual
- **Apps Script** — automações nativas

## 3. Autenticação
- **OAuth2** para acessos do n8n.
- **Service Account** para automações server-to-server.
- **Domain-wide delegation** para acessar caixas de email institucionais.

## 4. Fluxos Principais

### 4.1 Espelho CRM → Sheets
```
CRM (HubSpot/Pipedrive) → 
  webhook em alteração de oportunidade → 
  n8n → 
  atualiza linha em CRM-Mirror
```

### 4.2 Briefing Pré-Reunião
```
Google Calendar (evento começando em 1h) → 
  trigger n8n → 
  busca contexto (CRM + Notion + Gmail) → 
  LLM consolida briefing → 
  envia para email do organizador
```

### 4.3 Arquivamento de Propostas
```
Gmail filtro "proposta enviada" → 
  trigger n8n → 
  salva PDF no Drive → 
  registra link no CRM → 
  notifica owner da oportunidade
```

## 5. Permissionamento
- **Estrutura de pastas** padronizada (`/Nexa/[area]/[ano]/`).
- **Compartilhamento** via grupos do Workspace.
- **Auditoria semestral** de permissões.

## 6. Apps Script Catalogados
Ver `/Automacoes/Google-Sheets/README.md`.

## 7. Monitoramento
- Quotas da API Google monitoradas via console.
- Alertas em caso de 80% de uso de quota.
