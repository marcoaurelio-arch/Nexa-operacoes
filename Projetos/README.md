# 🏗️ Projetos — Portfólio Nexa Malls

> Repositório de todos os projetos imobiliários da Nexa Malls — em desenvolvimento, em prospecção, concluídos e templates de projeto.

---

## 1. Objetivo

Centralizar a documentação operacional, técnica, comercial e financeira de cada projeto da Nexa Malls em um único local versionado e auditável.

---

## 2. Estrutura

| Subpasta | Conteúdo |
|----------|----------|
| `Em-Desenvolvimento/` | Projetos em obra ou comercialização |
| `Concluidos/` | Projetos entregues e estabilizados |
| `Prospects/` | Oportunidades em análise/originação |
| `Arquivo/` | Projetos descontinuados (com motivo) |
| `Templates-Projeto/` | Estrutura padrão de pasta de projeto |

---

## 3. Estrutura Padrão de um Projeto

```
[Nome-do-Projeto]/
├── 00-Resumo/                  # Sumário executivo
├── 01-Terreno/                 # Documentação fundiária
├── 02-Aprovacoes/              # Alvarás, zoneamento
├── 03-Arquitetura/             # Projetos e plantas
├── 04-Viabilidade/             # Modelo financeiro
├── 05-Comercial/               # Mix, propostas, contratos
├── 06-Marketing/               # Materiais do projeto
├── 07-Investidores/            # Memorando, due diligence
├── 08-Obra/                    # Cronograma, medições
├── 09-Operacao/                # Pós-entrega
└── README.md                   # Visão geral do projeto
```

---

## 4. Responsáveis

| Função | Responsável |
|--------|-------------|
| Owner Portfólio | Diretor de Desenvolvimento |
| Project Manager | Designado por projeto |
| Comercial | Time Comercial |
| Viabilidade | Diretor Financeiro |
| Gestão pós-entrega | Time de Gestão de Ativos |

---

## 5. Ferramentas Utilizadas

- **Documentação:** GitHub + Notion
- **Arquitetura:** AutoCAD, Revit, SketchUp
- **Gestão de obra:** MS Project / Sienge
- **Financeiro:** Excel + Sienge
- **Comercial:** CRM + propostas

---

## 6. Status do Portfólio

| Status | Projetos |
|--------|----------|
| Em prospecção | (a popular) |
| Em desenvolvimento | (a popular) |
| Em comercialização | (a popular) |
| Em operação | (a popular) |
| Arquivados | (a popular) |

---

## 7. Convenções de Nomenclatura

- **Nome do projeto:** `Nexa-[Cidade]-[Bairro/Ref]` → ex.: `Nexa-Curitiba-Boqueirao`
- **Fase no nome:** sufixo opcional `-D1`, `-D2`, `-Operacao`
- **ID interno:** `NX-YYYY-####`

---

## 8. Cadência

- **Semanal:** status report por projeto em desenvolvimento.
- **Mensal:** comitê de portfólio.
- **Trimestral:** revisão de viabilidade dos projetos ativos.
- **Anual:** análise de performance vs. modelado.

---

## 9. Fluxos Relacionados

- `/Viabilidade/Estudos-Concluidos/` — vinculados a cada projeto.
- `/Comercial/Propostas/` — propostas por projeto.
- `/Marketing/Campanhas/` — campanhas específicas.
- `/Estudos/Mercado/` — base para vocação.

---

## 10. Governança

- Cada projeto tem **PM designado** desde a originação.
- **Toda decisão crítica** registrada em ata na pasta `00-Resumo/decisoes/`.
- **Auditoria trimestral** de aderência ao modelado.
- **Lições aprendidas** documentadas ao fim de cada fase.
