# 📚 Documentacao — Conhecimento Institucional

> Espaço institucional onde vivem arquitetura, processos, políticas, onboarding, glossário, manuais e diagramas da Nexa Malls.

---

## 1. Objetivo

Garantir que todo conhecimento operacional da Nexa Malls e da Planejarcomm esteja documentado, versionado e acessível — eliminando dependência de pessoas-chave e acelerando onboarding.

---

## 2. Estrutura

| Subpasta | Conteúdo |
|----------|----------|
| `Arquitetura/` | Diagramas técnicos, fluxos, decisões arquiteturais |
| `Processos/` | SOPs, fluxogramas, RACI |
| `Politicas/` | Políticas internas (LGPD, IA, segurança, etc.) |
| `Onboarding/` | Trilhas por função e área |
| `Glossario/` | Termos técnicos e institucionais |
| `Manuais/` | Manuais de uso de sistemas e ferramentas |
| `Diagramas/` | Diagramas em Mermaid, Excalidraw, draw.io |

---

## 3. Responsáveis

| Função | Responsável |
|--------|-------------|
| Owner Documentação | Owner do repositório |
| Curadoria | Sócios e diretores |
| Atualização | Cada área dona do processo |
| Revisão trimestral | Comitê de Gestão |

---

## 4. Padrão de Documento

Todo documento institucional contém:

```markdown
---
titulo: Título do documento
area: nome da área
versao: 1.0.0
data: YYYY-MM-DD
autor: nome
revisor: nome
proxima-revisao: YYYY-MM-DD
tipo: politica | processo | manual | onboarding | arquitetura
---

# Título

## Objetivo

## Escopo

## Definições

## Processo / Conteúdo

## Responsabilidades

## Referências

## Histórico de Versões
```

---

## 5. Políticas Críticas (a implantar)

- Política de Segurança da Informação
- Política de Uso de IA Institucional
- Política de Proteção de Dados (LGPD)
- Política de Comunicação Externa
- Política de Marca
- Política de Aprovação de Investimentos
- Código de Conduta

---

## 6. Trilhas de Onboarding

| Persona | Trilha |
|---------|--------|
| Novo SDR | `/Documentacao/Onboarding/sdr.md` |
| Novo Closer | `/Documentacao/Onboarding/closer.md` |
| Novo Analista de Viabilidade | `/Documentacao/Onboarding/viabilidade.md` |
| Novo Gestor de Ativos | `/Documentacao/Onboarding/gestao-ativos.md` |
| Novo Membro Comercial | `/Documentacao/Onboarding/comercial.md` |
| Novo Estagiário | `/Documentacao/Onboarding/estagio.md` |

---

## 7. Status Operacional

| Componente | Status |
|------------|--------|
| Estrutura base | ✅ Implantada |
| Glossário institucional | 🔄 Em construção |
| Onboarding por função | 🔄 Em construção |
| Políticas formais | 🔄 Em construção |
| Diagramas arquiteturais | 🔄 Em construção |

---

## 8. Fluxos Relacionados

- Todas as demais pastas — esta documentação as suporta.
- `/IA/Prompts/` — uso normatizado pela política de IA.
- `/APIs/Autenticacao/` — alinhada à política de segurança.

---

## 9. Convenções

- **Linguagem:** clara, objetiva, com exemplos.
- **Formato:** Markdown como padrão.
- **Diagramas:** Mermaid quando possível (versionável).
- **Revisão:** mínimo semestral, registrada em changelog.

---

## 10. Princípios Editoriais

1. Escrever para quem vai ler daqui a 6 meses (incluindo você mesmo).
2. Preferir listas curtas a parágrafos longos.
3. Sempre incluir um exemplo.
4. Datar e versionar tudo.
5. Documentar o porquê, não apenas o como.
