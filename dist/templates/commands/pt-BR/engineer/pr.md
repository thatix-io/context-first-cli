# Criação de Pull Request

Este comando cria Pull Requests para todos os repositórios modificados no workspace.

## 📋 Pré-requisitos

Antes de criar PRs, certifique-se de que:
- Executou `/pre-pr` e todas as validações passaram
- Todos os commits foram feitos
- Todos os testes estão passando
- A documentação está atualizada

## 🎯 Processo de Criação de PRs

### 1. Identificar Repositórios Modificados

Para cada repositório no workspace, verifique:
```bash
cd <repositório>
git status
git log origin/main..HEAD  # Ver commits não pushados
```

### 2. Push das Branches

Para cada repositório modificado:
```bash
cd <repositório>
git push origin <branch-name>
```

### 3. Criar Pull Requests

Para cada repositório, crie um PR usando o GitHub CLI ou interface web:

**Usando GitHub CLI**:
```bash
cd <repositório>
gh pr create --title "[ISSUE-ID] Título da Feature" \
  --body "$(cat ../.sessions/<ISSUE-ID>/pr-description.md)" \
  --base main
```

**Template de Descrição do PR**:

```markdown
## 🎯 Objetivo

[Breve descrição do que esta PR faz]

## 📝 Mudanças

### Repositório: <nome-do-repo>

- [Mudança 1]
- [Mudança 2]
- [Mudança 3]

## 🔗 Relacionamentos

- **Issue**: <ISSUE-ID>
- **PRs Relacionados**: 
  - <repo-1>#<PR-number>
  - <repo-2>#<PR-number>

## ✅ Checklist

- [ ] Código implementado e testado
- [ ] Testes unitários adicionados/atualizados
- [ ] Testes de integração passando
- [ ] Documentação atualizada
- [ ] Sem breaking changes (ou documentados)
- [ ] Revisado por pares (após criação do PR)

## 🧪 Como Testar

1. [Passo 1]
2. [Passo 2]
3. [Resultado esperado]

## 📸 Screenshots/Demos

[Se aplicável, adicione screenshots ou links para demos]

## 🔍 Notas para Revisores

- [Ponto de atenção 1]
- [Ponto de atenção 2]
```

### 4. Vincular PRs

Se houver múltiplos PRs (um por repositório):
- Adicione links cruzados entre os PRs
- Documente a ordem de merge recomendada
- Indique dependências entre PRs

### 5. Atualizar Issue no Task Manager

Se task manager estiver configurado:
- Mova a issue para "Em Revisão" ou "PR Aberto"
- Adicione links dos PRs na issue
- Adicione comentário com resumo das mudanças

### 6. Documentação da Sessão

Atualize `./.sessions/<ISSUE-ID>/pr.md`:

```markdown
# [Título da Feature] - Pull Requests

## PRs Criados

### <repo-1>
- **Link**: <URL do PR>
- **Status**: Aberto
- **Commits**: X commits

### <repo-2>
- **Link**: <URL do PR>
- **Status**: Aberto
- **Commits**: Y commits

## Ordem de Merge Recomendada

1. <repo-1> - [Justificativa]
2. <repo-2> - [Justificativa]

## Notas para Merge

- [Nota importante 1]
- [Nota importante 2]
```

## 🔍 Checklist Final

Antes de solicitar revisão:
- [ ] Todos os PRs criados
- [ ] Descrições completas e claras
- [ ] PRs vinculados entre si
- [ ] Issue atualizada no task manager
- [ ] Testes passando em CI/CD
- [ ] Documentação da sessão completa

## 📢 Comunicação

Notifique o time sobre os PRs:
- Mencione revisores relevantes
- Destaque mudanças críticas ou breaking changes
- Indique urgência se aplicável

---

**Argumentos fornecidos**:

```
#$ARGUMENTS
```

---

## 🎯 Próximos Passos

1. Aguardar revisão dos PRs
2. Responder comentários e fazer ajustes
3. Após aprovação, fazer merge na ordem recomendada
4. Executar `context-cli feature:end <ISSUE-ID>` para limpar o workspace
