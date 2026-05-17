# Guia de Contribuição — Nexa-Growth

Este documento define as regras institucionais para contribuir com o repositório **Nexa-Growth**.

---

## 1. Princípios

- Toda contribuição deve agregar valor mensurável à operação.
- Documentação acompanha código e workflow — sem exceção.
- Padrões existem para escalar. Siga-os.
- Em caso de dúvida, abra uma _issue_ antes de uma _pull request_.

---

## 2. Fluxo de Trabalho

### 2.1 Branches

| Prefixo | Uso |
|---------|-----|
| `feature/` | Nova funcionalidade, template, automação ou prompt |
| `fix/` | Correção de erro em conteúdo, workflow ou documentação |
| `docs/` | Apenas documentação |
| `chore/` | Manutenção, organização, renomeação |
| `refactor/` | Reestruturação sem alteração de funcionalidade |

**Exemplo:** `feature/crm-template-lojista-anchor`

### 2.2 Commits

Adotamos **Conventional Commits**:

```
feat: adiciona template de proposta para investidor institucional
fix: corrige fórmula de cap rate em modelo de viabilidade
docs: atualiza README da pasta IA com nova biblioteca de prompts
chore: padroniza nomenclatura de arquivos da pasta SDR
```

### 2.3 Pull Requests

Toda PR deve conter:
1. Título descritivo (verbo no imperativo)
2. Resumo do que foi alterado
3. Justificativa de negócio
4. Checklist de testes/validações realizadas
5. Referência à issue relacionada (se houver)

---

## 3. Nomenclatura

### 3.1 Arquivos
- `kebab-case-minusculo.md`
- Sem acentos, sem espaços, sem caracteres especiais
- Datas: `YYYY-MM-DD-nome-do-arquivo.md`

### 3.2 Pastas
- `PascalCase-Capitalizado/`
- Sem acentos quando possível
- Plurais para coleções (`Prompts/`, `Templates/`)

### 3.3 Variáveis e chaves
- `snake_case` em JSON/YAML
- `UPPER_SNAKE_CASE` em variáveis de ambiente

---

## 4. Templates Obrigatórios

Toda nova adição em uma das áreas abaixo deve usar o template padrão da pasta:

- `/CRM/Templates/` — modelos de registro de contato e oportunidade
- `/Comercial/Playbooks/` — estrutura padronizada de playbook
- `/Automacoes/n8n/workflows/` — metadado JSON + README
- `/IA/Prompts/` — header padronizado de prompt
- `/Viabilidade/Templates/` — modelo financeiro Excel

---

## 5. Revisão e Aprovação

| Tipo | Aprovador |
|------|-----------|
| Documentação | Owner ou Lead Técnico |
| Templates comerciais | Diretor Comercial |
| Workflows críticos | Lead Técnico + Owner |
| Modelos financeiros | Diretor Financeiro |
| Prompts de IA institucional | Owner |

---

## 6. Confidencialidade

- **Nunca** suba dados reais de prospects, clientes, lojistas ou investidores.
- Use dados sintéticos em todos os exemplos.
- Credenciais ficam em `.env` (ignorado pelo Git).
- Em caso de exposição acidental de segredo, rotacione imediatamente.

---

## 7. Suporte

Dúvidas: abra uma _issue_ com label `question`.
Bugs: abra uma _issue_ com label `bug`.
Propostas: abra uma _issue_ com label `enhancement`.
