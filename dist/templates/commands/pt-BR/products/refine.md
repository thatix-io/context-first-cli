# Refinamento de Requisitos

Este comando refina uma issue coletada, transformando-a em requisitos claros e validados.

## ⚠️ IMPORTANTE: Este Comando NÃO Implementa Código

**Este comando é APENAS para refinamento de requisitos:**
- ✅ Refinar e validar requisitos
- ✅ Atualizar issue no task manager via MCP
- ✅ **LER** arquivos dos repositórios principais (read-only)
- ❌ **NÃO implementar código**
- ❌ **NÃO fazer edits em arquivos de código**
- ❌ **NÃO fazer checkout de branches nos repositórios principais**
- ❌ **NÃO fazer commits**

**Próximo passo**: `/spec [ISSUE-ID]` para criar a especificação completa (PRD).

---

## 📋 Pré-requisitos

- Issue já coletada via `/collect`
- Contexto do projeto será carregado automaticamente (veja seção "Carregar MetaSpecs" abaixo)

## 🎯 Objetivo

Refinar a issue coletada, esclarecendo:
- Escopo exato (o que entra e o que não entra)
- Critérios de aceitação claros
- Impacto em cada repositório
- Dependências técnicas
- Riscos e restrições

## 📝 Processo de Refinamento

### 1. Carregar Issue

**PRIORIDADE 1: Usar MCP (Model Context Protocol)**

- Leia `ai.properties.md` do orchestrator para identificar o `task_management_system`
- Use o MCP apropriado para buscar a issue:
  - `task_management_system=jira`: Use MCP do Jira
  - `task_management_system=linear`: Use MCP do Linear
  - `task_management_system=github`: Use MCP do GitHub
- Carregue todos os dados da issue (título, descrição, labels, etc.)

**FALLBACK: Se MCP não estiver disponível ou falhar**

- Leia `./.sessions/<ISSUE-ID>/collect.md`
- Se o arquivo não existir, informe o erro ao usuário

### 2. Carregar MetaSpecs

**Localizar MetaSpecs automaticamente**:
1. Leia `context-manifest.json` do orchestrator
2. Encontre o repositório com `"role": "metaspecs"`
3. Leia `ai.properties.md` para obter o `base_path`
4. O metaspecs está em: `{base_path}/{metaspecs-repo-id}/`
5. Leia os arquivos `index.md` relevantes para entender:
   - Arquitetura do sistema
   - Padrões de design
   - Restrições técnicas
   - Convenções do projeto

### 3. Análise de Escopo

Defina claramente:

**O que ESTÁ no escopo**:
- Funcionalidades específicas a serem implementadas
- Repositórios que serão modificados
- Integrações necessárias

**O que NÃO ESTÁ no escopo**:
- Funcionalidades relacionadas mas que ficam para depois
- Otimizações futuras
- Features "nice to have"

### 4. Critérios de Aceitação

Defina critérios mensuráveis e testáveis:

```markdown
## Critérios de Aceitação

### Funcional
- [ ] [Critério 1 - específico e testável]
- [ ] [Critério 2 - específico e testável]

### Técnico
- [ ] [Critério técnico 1]
- [ ] [Critério técnico 2]

### Qualidade
- [ ] Testes unitários implementados
- [ ] Testes de integração implementados
- [ ] Documentação atualizada
```

### 5. Análise de Impacto

Para cada repositório afetado:

```markdown
## Impacto por Repositório

### <repo-1>
- **Componentes afetados**: [lista]
- **Tipo de mudança**: Nova feature / Modificação / Refatoração
- **Complexidade estimada**: Baixa / Média / Alta
- **Riscos**: [riscos específicos]

### <repo-2>
- **Componentes afetados**: [lista]
- **Tipo de mudança**: Nova feature / Modificação / Refatoração
- **Complexidade estimada**: Baixa / Média / Alta
- **Riscos**: [riscos específicos]
```

### 6. Dependências e Restrições

Identifique:
- Dependências entre repositórios
- Dependências de outras features/issues
- Restrições técnicas
- Restrições de negócio
- Bloqueadores conhecidos

### 7. Estimativa Inicial

Forneça estimativa de esforço:
- **Pequeno**: < 1 dia
- **Médio**: 1-3 dias
- **Grande**: 3-5 dias
- **Muito Grande**: > 5 dias (considere quebrar em issues menores)

### 8. Perguntas Pendentes

Liste perguntas que ainda precisam ser respondidas antes de iniciar a implementação.

## 📄 Salvamento do Refinamento

**PRIORIDADE 1: Atualizar via MCP**

- Use o MCP do task manager para atualizar a issue
- Adicione os critérios de aceitação como comentário ou campo customizado
- Atualize labels/tags se necessário (ex: "refined", "ready-for-spec")
- Adicione estimativa se o task manager suportar
- Informe ao usuário: "✅ Issue [ID] atualizada com refinamento"

**FALLBACK: Criar arquivo .md apenas se MCP falhar**

Se o MCP não estiver disponível ou falhar, crie/atualize `./.sessions/<ISSUE-ID>/refine.md`:

```markdown
# [Título da Issue] - Refinamento

## Escopo

### Incluído
- [Item 1]
- [Item 2]

### Excluído
- [Item 1]
- [Item 2]

## Critérios de Aceitação
[Conforme seção 3 acima]

## Impacto por Repositório
[Conforme seção 4 acima]

## Dependências
- [Dependência 1]
- [Dependência 2]

## Restrições
- [Restrição 1]
- [Restrição 2]

## Estimativa
[Pequeno/Médio/Grande/Muito Grande] - [Justificativa]

## Perguntas Pendentes
1. [Pergunta 1]
2. [Pergunta 2]

## Riscos Identificados
- [Risco 1 e mitigação]
- [Risco 2 e mitigação]
```

Informe ao usuário: "⚠️ Refinamento salvo localmente em .sessions/ (task manager não disponível)"

## 🔍 Validação

Valide o refinamento contra:
- Estratégia do produto (se documentada)
- Arquitetura técnica (se documentada)
- Capacidade do time
- Prioridades do roadmap

---

**Argumentos fornecidos**:

```
#$ARGUMENTS
```

---

## 🎯 Próximo Passo

Após refinamento aprovado:

```bash
/spec [ISSUE-ID]
```

Este comando criará a especificação completa (PRD) da feature.
