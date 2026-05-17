# 📇 CRM — Customer Relationship Management

> Núcleo de relacionamento institucional com lojistas, investidores, proprietários de terrenos, parceiros e prospects da Nexa Malls.

---

## 1. Objetivo

Centralizar e padronizar a gestão de relacionamentos da Nexa Malls em todas as frentes — comercial, investidores, expansão imobiliária e parceiros estratégicos — assegurando visibilidade total do pipeline, histórico de interações e governança da base.

---

## 2. Estrutura

| Subpasta | Conteúdo |
|----------|----------|
| `Pipeline/` | Funis ativos por área (lojistas, investidores, proprietários) |
| `Contatos/` | Cadastro mestre, segmentação e enriquecimento de contatos |
| `Templates/` | Modelos de registro de oportunidade, ata de reunião, follow-up |
| `Integracoes/` | Conectores e mapeamento de dados com sistemas externos |
| `Relatorios/` | Snapshots semanais, mensais e trimestrais do CRM |

---

## 3. Responsáveis

| Função | Responsável |
|--------|-------------|
| Owner CRM | Diretor Comercial |
| Operação diária | SDRs e Closers |
| Higiene da base | Sales Ops |
| Integrações técnicas | Planejarcomm (TI) |

---

## 4. Ferramentas Utilizadas

- **CRM Operacional:** HubSpot / Pipedrive / RD Station CRM (a definir)
- **Enriquecimento:** Apollo, ZoomInfo, Common Room
- **Comunicação:** WhatsApp Business API, Gmail, LinkedIn
- **Automação:** n8n (sincronização e webhooks)
- **Inteligência:** OpenAI / Claude (qualificação e resumo)

---

## 5. Integrações

- **GitHub ↔ Notion** — versionamento de templates e playbooks
- **n8n ↔ WhatsApp API** — captura automática de leads inbound
- **n8n ↔ Google Sheets** — espelho operacional em tempo real
- **n8n ↔ OpenAI** — enriquecimento e qualificação automática
- **CRM ↔ Looker Studio** — dashboards executivos

---

## 6. Pipelines Gerenciados

1. **Pipeline Lojistas** — captação de redes para strip malls em desenvolvimento.
2. **Pipeline Investidores** — relacionamento com FIIs, family offices e investidores PF.
3. **Pipeline Proprietários** — captação de terrenos para novos projetos.
4. **Pipeline Parceiros** — corretores, projetistas, construtoras, consultores.
5. **Pipeline Renovações** — gestão de contratos vincendos em ativos operacionais.

---

## 7. Status Operacional

| Componente | Status |
|------------|--------|
| Estrutura base | ✅ Implantada |
| Templates oficiais | 🔄 Em construção |
| Integração CRM ↔ n8n | ⏳ Backlog |
| Dashboards executivos | ⏳ Backlog |
| Governança LGPD | ✅ Documentada |

---

## 8. Fluxos Relacionados

- `/SDR/Cadencias/` — cadências que alimentam o CRM.
- `/Comercial/Playbooks/` — guias operacionais para closers.
- `/Automacoes/n8n/workflows/` — workflows de sincronização.
- `/Dashboards/Comercial/` — visualização consolidada.

---

## 9. Convenções

- **ID de oportunidade:** `NEXA-YYYY-####` (ex.: `NEXA-2026-0042`)
- **Estágios padrão:** Prospecção → Qualificação → Proposta → Negociação → Fechamento → Pós-venda
- **Owner obrigatório** em todo registro
- **Próxima ação + data** obrigatórias em toda oportunidade aberta

---

## 10. Política de Higiene

- Toda oportunidade sem atividade há 30 dias é flagada.
- Toda oportunidade sem atividade há 60 dias entra em rito de revisão.
- Toda oportunidade sem atividade há 90 dias é arquivada ou recuperada com plano de ação documentado.
