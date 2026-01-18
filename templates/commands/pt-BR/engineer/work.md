# Execução do Trabalho

Este comando executa uma unidade de trabalho no workspace atual, implementando parte do plano técnico.

## 📋 Pré-requisitos

Antes de executar, certifique-se de que:
- Executou `/start` e `/plan` para ter o planejamento técnico
- Está no workspace correto: `<orchestrator>/.sessions/<ISSUE-ID>/`
- Tem os arquivos `.sessions/<ISSUE-ID>/` disponíveis:
  - `context.md` (imutável)
  - `architecture.md` (imutável)
  - `plan.md` (mutável)

## 📍 IMPORTANTE: Entenda a Estrutura

**Workspace** (onde você trabalha):
```
<orchestrator>/.sessions/<ISSUE-ID>/
├── repo-1/          # worktree com branch feature/<ISSUE-ID>
├── repo-2/          # worktree com branch feature/<ISSUE-ID>
├── context.md       # contexto (imutável)
├── architecture.md  # arquitetura (imutável)
└── plan.md          # plano (mutável)
```

**Repositórios principais** (NÃO tocar):
```
{base_path}/repo-1/  # repo principal (branch main/master)
{base_path}/repo-2/  # repo principal (branch main/master)
```

**REGRA DE OURO**:
- ✅ Trabalhe APENAS dentro de `<orchestrator>/.sessions/<ISSUE-ID>/`
- ✅ Faça commits nos worktrees dentro do workspace
- ❌ NUNCA faça checkout nos repositórios principais
- ❌ NUNCA navegue para `{base_path}/{repo-id}/`

## ⚠️ IMPORTANTE: Arquivos Imutáveis

**Este comando deve LER mas NÃO MODIFICAR:**
- ✅ **LER** `.sessions/<ISSUE-ID>/context.md` (imutável)
- ✅ **LER** `.sessions/<ISSUE-ID>/architecture.md` (imutável)
- ✅ **ATUALIZAR** `.sessions/<ISSUE-ID>/plan.md` (marcar progresso)
- ✅ **IMPLEMENTAR** código nos repositórios do workspace
- ✅ **FAZER COMMITS** nos repositórios do workspace
- ❌ **NÃO modificar `context.md` ou `architecture.md`**
- ❌ **NÃO fazer checkout de branches nos repositórios principais (fora do workspace)**

## 📚 Carregar MetaSpecs

**Localizar MetaSpecs automaticamente**:
1. Leia `context-manifest.json` do orchestrator
2. Encontre o repositório com `"role": "metaspecs"`
3. Leia `ai.properties.md` para obter o `base_path`
4. O metaspecs está em: `{base_path}/{metaspecs-repo-id}/`
5. Leia os arquivos `index.md` relevantes durante a implementação para:
   - Seguir padrões de código
   - Respeitar arquitetura definida
   - Usar convenções corretas

## 🎯 Objetivo

Implementar uma unidade de trabalho específica do plano, que pode envolver:
- Criar novos arquivos/componentes
- Modificar arquivos existentes
- Adicionar testes
- Atualizar documentação

## 📝 Processo de Trabalho

### 1. Identificar Unidade de Trabalho

Com base no plano técnico (`./.sessions/<ISSUE-ID>/plan.md`), identifique:
- Qual tarefa específica será implementada agora
- Em qual(is) repositório(s) do workspace
- Quais arquivos serão criados/modificados
- Dependências com outras tarefas

### 2. Implementação

**IMPORTANTE**: Trabalhe APENAS dentro do workspace em `.sessions/<ISSUE-ID>/`

Para cada repositório no workspace:

```bash
# Navegue para o worktree dentro do workspace
cd <orchestrator>/.sessions/<ISSUE-ID>/<repo-name>/

# Verifique que está na branch correta
git branch  # deve mostrar * feature/<ISSUE-ID>

# Implemente o código aqui
```

Execute a implementação seguindo:
- **Padrões do projeto**: Consulte guias de estilo e arquitetura
- **Stack aprovada**: Use apenas tecnologias documentadas nas metaspecs
- **Testes**: Implemente testes conforme padrões do projeto
- **Documentação**: Atualize comentários e docs quando necessário

### 3. Validação Local

Antes de commitar:
- Execute testes unitários/integração
- Verifique linting e formatação
- Confirme que não quebrou funcionalidades existentes

### 4. Commit

Para cada repositório modificado **dentro do workspace**:

```bash
# Navegue para o worktree dentro do workspace
cd <orchestrator>/.sessions/<ISSUE-ID>/<repo-name>/

# Adicione as mudanças
git add .

# Commit
git commit -m "tipo: descrição concisa

- Detalhe 1
- Detalhe 2

Refs: <ISSUE-ID>"
```

**Tipos de commit**: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

### 5. Atualização do Plan.md

**A CADA tarefa completada**, atualize `./.sessions/<ISSUE-ID>/plan.md`:

```markdown
#### 1.1 - [Nome da Tarefa] [Completada ✅]
- [Detalhe 1]
- [Detalhe 2]
- [Detalhe 3]

**Arquivos**:
- `path/to/file1.ts` ✅
- `path/to/file2.vue` ✅

**Testes**:
- Unit test: [Descrição] ✅
- Integration test: [Descrição] ✅

**Comentários**:
- Decisão: [Explicação de decisão técnica importante]
- Aprendizado: [Algo aprendido durante implementação]
```

**Marque status das tarefas**:
- `[Não Iniciada ⏳]` - Tarefa ainda não começou
- `[Em Progresso ⏰]` - Tarefa sendo trabalhada agora
- `[Completada ✅]` - Tarefa finalizada e validada

## 🔍 Checklist de Qualidade

Antes de considerar a unidade completa:
- [ ] Código implementado e testado
- [ ] Testes passando
- [ ] Linting/formatação OK
- [ ] Documentação atualizada (se necessário)
- [ ] Commit realizado em todos os repos afetados
- [ ] `plan.md` atualizado com progresso e comentários

## ⚠️ Princípio Jidoka

Se encontrar problemas durante a implementação:
1. 🛑 **PARE** a implementação
2. 📝 **DOCUMENTE** o problema encontrado
3. 💬 **ALERTE** o usuário e discuta soluções
4. 🔄 **AJUSTE** o plano se necessário

---

**Argumentos fornecidos**:

```
#$ARGUMENTS
```

---

## 🎯 Próximos Passos

- **Continuar implementação**: Execute `/work` novamente para próxima unidade
- **Finalizar feature**: Quando tudo estiver implementado, execute `/pre-pr`

## 💡 Dicas

- Trabalhe em unidades pequenas e incrementais
- Commit frequentemente (atomic commits)
- Documente decisões importantes na sessão
- Mantenha os repositórios sincronizados entre si
