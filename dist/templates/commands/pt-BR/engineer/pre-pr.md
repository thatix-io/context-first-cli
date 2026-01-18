# Preparação para Pull Request

Este comando valida que tudo está pronto para criar Pull Requests.

## 📋 Pré-requisitos

- Implementação completa (todas as tarefas do `/plan` executadas)
- Todos os commits realizados
- Workspace limpo e organizado

## 🎯 Objetivo

Garantir que a implementação está completa, testada e pronta para revisão antes de criar os PRs.

## ✅ Checklist de Validação

### 1. Completude da Implementação

```markdown
## Verificação de Completude

- [ ] Todas as tarefas do plano foram executadas
- [ ] Todos os requisitos funcionais do PRD foram implementados
- [ ] Todos os critérios de aceitação foram atendidos
- [ ] Nenhuma funcionalidade ficou pela metade
```

### 2. Qualidade do Código

Para cada repositório modificado:

```bash
cd <repositório>

# Verificar status
git status

# Verificar linting
npm run lint  # ou comando equivalente

# Verificar formatação
npm run format:check  # ou comando equivalente

# Verificar build
npm run build  # ou comando equivalente
```

Checklist:
```markdown
## Qualidade do Código

### <repo-1>
- [ ] Linting sem erros
- [ ] Formatação correta
- [ ] Build sem erros
- [ ] Sem warnings críticos

### <repo-2>
- [ ] Linting sem erros
- [ ] Formatação correta
- [ ] Build sem erros
- [ ] Sem warnings críticos
```

### 3. Testes

Para cada repositório:

```bash
cd <repositório>

# Executar testes unitários
npm run test:unit  # ou comando equivalente

# Executar testes de integração
npm run test:integration  # ou comando equivalente

# Verificar cobertura
npm run test:coverage  # ou comando equivalente
```

Checklist:
```markdown
## Testes

### <repo-1>
- [ ] Todos os testes unitários passando
- [ ] Todos os testes de integração passando
- [ ] Cobertura de testes adequada (>= X%)
- [ ] Novos testes adicionados para novas funcionalidades

### <repo-2>
- [ ] Todos os testes unitários passando
- [ ] Todos os testes de integração passando
- [ ] Cobertura de testes adequada (>= X%)
- [ ] Novos testes adicionados para novas funcionalidades
```

### 4. Documentação

```markdown
## Documentação

- [ ] README atualizado (se necessário)
- [ ] Comentários de código adequados
- [ ] Documentação de APIs atualizada (se houver mudanças)
- [ ] Changelog atualizado
- [ ] Documentação técnica atualizada nas metaspecs (se aplicável)
```

### 5. Commits

```markdown
## Commits

- [ ] Todos os commits têm mensagens claras e descritivas
- [ ] Commits seguem o padrão do projeto (conventional commits, etc.)
- [ ] Não há commits com mensagens genéricas ("fix", "update", etc.)
- [ ] Commits estão organizados logicamente
- [ ] Não há commits de debug ou temporários
```

### 6. Sincronização

```markdown
## Sincronização

- [ ] Branches estão atualizadas com a branch base (main/develop)
- [ ] Não há conflitos de merge
- [ ] Mudanças entre repositórios estão sincronizadas
- [ ] Dependências entre repos foram testadas
```

### 7. Segurança

```markdown
## Segurança

- [ ] Não há credenciais ou secrets no código
- [ ] Não há dados sensíveis em logs
- [ ] Dependências de segurança foram verificadas
- [ ] Não há vulnerabilidades conhecidas introduzidas
```

### 8. Performance

```markdown
## Performance

- [ ] Não há regressões de performance óbvias
- [ ] Queries/operações custosas foram otimizadas
- [ ] Não há memory leaks introduzidos
- [ ] Requisitos de performance do PRD foram atendidos
```

## 🔍 Validação Cruzada

Se múltiplos repositórios foram modificados:

```markdown
## Validação Cruzada

- [ ] Testei a integração entre os repositórios localmente
- [ ] APIs/contratos entre repos estão consistentes
- [ ] Não há breaking changes não documentados
- [ ] Ordem de deploy/merge está clara
```

## 📄 Preparação da Descrição do PR

Crie `./.sessions/<ISSUE-ID>/pr-description.md`:

```markdown
## 🎯 Objetivo
[Breve descrição do que esta feature faz]

## 📝 Mudanças Principais
- [Mudança 1]
- [Mudança 2]
- [Mudança 3]

## 🔗 Links
- **Issue**: [ISSUE-ID]
- **PRD**: [link ou caminho]
- **Plano Técnico**: [link ou caminho]

## ✅ Checklist
- [x] Código implementado e testado
- [x] Testes unitários adicionados/atualizados
- [x] Testes de integração passando
- [x] Documentação atualizada
- [x] Linting e formatação OK
- [x] Build sem erros

## 🧪 Como Testar
1. [Passo 1]
2. [Passo 2]
3. [Resultado esperado]

## 🔍 Notas para Revisores
- [Ponto de atenção 1]
- [Ponto de atenção 2]
```

## 🚨 Problemas Encontrados

Se alguma validação falhar:
1. 🛑 **PARE** o processo de criação de PR
2. 📝 **DOCUMENTE** o problema
3. 🔧 **CORRIJA** o problema
4. 🔄 **EXECUTE** `/pre-pr` novamente

## 📊 Relatório de Validação

Crie `./.sessions/<ISSUE-ID>/pre-pr-report.md`:

```markdown
# Relatório de Validação Pre-PR

**Data**: [data/hora]
**Issue**: [ISSUE-ID]

## Status Geral
✅ Pronto para PR / ⚠️ Pendências / ❌ Bloqueado

## Repositórios Validados
- **<repo-1>**: ✅ OK
- **<repo-2>**: ✅ OK

## Resumo de Testes
- **Testes Unitários**: X/X passando
- **Testes de Integração**: Y/Y passando
- **Cobertura**: Z%

## Pendências (se houver)
- [Pendência 1]
- [Pendência 2]

## Próximos Passos
- [x] Todas as validações passaram
- [ ] Executar `/pr` para criar Pull Requests
```

---

**Argumentos fornecidos**:

```
#$ARGUMENTS
```

---

## 🎯 Próximo Passo

Se todas as validações passaram:

```bash
/pr
```

Este comando criará os Pull Requests para todos os repositórios modificados.
