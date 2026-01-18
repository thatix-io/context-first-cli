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

# Verificar linting (exemplos por stack):
# Node.js: npm run lint / yarn lint / pnpm lint
# Python: flake8 . / pylint src/ / black --check .
# Java: mvn checkstyle:check / gradle check
# Go: golangci-lint run / go vet ./...
# Ruby: rubocop
# Rust: cargo clippy
# PHP: ./vendor/bin/phpcs
# C#: dotnet format --verify-no-changes

# Verificar formatação (exemplos por stack):
# Node.js: npm run format:check / prettier --check .
# Python: black --check . / autopep8 --diff .
# Java: mvn formatter:validate
# Go: gofmt -l . / go fmt ./...
# Ruby: rubocop --format-only
# Rust: cargo fmt --check

# Verificar build (exemplos por stack):
# Node.js: npm run build / yarn build
# Python: python setup.py build
# Java: mvn compile / gradle build
# Go: go build ./...
# Ruby: rake build
# Rust: cargo build
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

# Executar testes unitários (exemplos por stack):
# Node.js: npm run test:unit / jest / vitest
# Python: pytest tests/unit / python -m unittest
# Java: mvn test / gradle test
# Go: go test ./... -short
# Ruby: rspec spec/unit / rake test:unit
# Rust: cargo test --lib
# PHP: ./vendor/bin/phpunit --testsuite=unit
# C#: dotnet test --filter Category=Unit

# Executar testes de integração (exemplos por stack):
# Node.js: npm run test:integration
# Python: pytest tests/integration
# Java: mvn verify / gradle integrationTest
# Go: go test ./... -run Integration
# Ruby: rspec spec/integration
# Rust: cargo test --test '*'
# PHP: ./vendor/bin/phpunit --testsuite=integration

# Verificar cobertura (exemplos por stack):
# Node.js: npm run test:coverage / jest --coverage
# Python: pytest --cov=src tests/
# Java: mvn jacoco:report / gradle jacocoTestReport
# Go: go test -cover ./...
# Ruby: rspec --coverage
# Rust: cargo tarpaulin
# PHP: ./vendor/bin/phpunit --coverage-html coverage/
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
