# Execução do Trabalho

Este comando executa uma unidade de trabalho no workspace atual, implementando parte do plano técnico.

## 📋 Pré-requisitos

Antes de executar, certifique-se de que:
- Executou `/start` e `/plan` para ter o planejamento técnico
- Está no workspace correto (verifique `diretório do workspace`)
- Tem o arquivo `./.sessions/<ISSUE-ID>/plan.md` disponível

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

Para cada repositório modificado:

```bash
cd <repositório>
git add .
git commit -m "tipo: descrição concisa

- Detalhe 1
- Detalhe 2

Refs: <ISSUE-ID>"
```

**Tipos de commit**: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

### 5. Documentação da Sessão

Atualize `./.sessions/<ISSUE-ID>/work.md`:

```markdown
# [Título da Feature] - Trabalho Executado

## [Data/Hora] - [Descrição da Unidade]

### Repositórios Modificados
- **repo-1**: [Arquivos modificados e o que foi feito]
- **repo-2**: [Arquivos modificados e o que foi feito]

### Decisões Tomadas
- [Decisão 1 e justificativa]
- [Decisão 2 e justificativa]

### Testes Adicionados
- [Descrição dos testes]

### Próxima Unidade
- [O que será feito a seguir]
```

## 🔍 Checklist de Qualidade

Antes de considerar a unidade completa:
- [ ] Código implementado e testado
- [ ] Testes passando
- [ ] Linting/formatação OK
- [ ] Documentação atualizada (se necessário)
- [ ] Commit realizado em todos os repos afetados
- [ ] Sessão documentada

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
