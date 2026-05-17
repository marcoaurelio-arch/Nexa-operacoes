# Notion — Integrações Institucionais

## Visão Geral

O Notion é o **knowledge hub** da operação Nexa Malls — alinhado com o GitHub (`Nexa-Growth`) que é a versão "código-fonte" do mesmo conhecimento.

## Mapa GitHub ↔ Notion

| GitHub | Notion |
|--------|--------|
| `/Documentacao/` | Wiki institucional |
| `/Projetos/` | Database de projetos |
| `/CRM/Pipeline/` | Painéis operacionais |
| `/Estudos/` | Biblioteca de estudos |
| `/Automacoes/` | Catálogo de automações |

## Databases Principais

| Database | Função | Owner |
|----------|--------|-------|
| `Projetos` | Portfólio em desenvolvimento e operação | Diretor de Desenvolvimento |
| `Oportunidades` | Funil comercial unificado | Diretor Comercial |
| `Tasks` | Backlog operacional cross-team | Owner do repositório |
| `Atas` | Atas de reuniões com tags | Todos |
| `Estudos` | Estudos de mercado e viabilidade | Diretor de Estratégia |

## Sincronizações

| Origem | Destino | Workflow |
|--------|---------|----------|
| Notion `Tasks` | Slack `#tasks` | `ops-notifica-tasks` |
| Notion `Projetos` | Google Sheets `Inventario-Lojas` | `ops-sync-projetos` |
| GitHub PRs | Notion `Documentacao` | `dev-sync-pr` |
| Granola/Fireflies | Notion `Atas` | `comercial-arquiva-ata` |

## Padrão de Páginas Institucionais

```
# Título
> Pequeno resumo do propósito

## Contexto

## Conteúdo

## Próximos passos

## Pessoas
- Owner: @nome
- Stakeholders: @nome, @nome

## Vínculos
- GitHub: link
- Outras páginas Notion: link
```

## Boas Práticas

1. Toda database tem campos: `Status`, `Owner`, `Última atualização`, `Tags`.
2. Atas seguem template institucional.
3. Conhecimento estável vive no GitHub; conhecimento dinâmico vive no Notion.
4. Toda página crítica tem link de espelho no GitHub.

## Limitações

- Permissionamento granular complexo — auditar trimestralmente.
- Versionamento de páginas longas — ativar manualmente quando crítico.
