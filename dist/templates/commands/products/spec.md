# Criação de Especificação (PRD)

Este comando cria a especificação completa (Product Requirements Document) da feature.

## ⚠️ IMPORTANTE: Este Comando NÃO Implementa Código

Este comando é para documentação de requisitos, não implementação.

**Próximo passo**: `/start` para iniciar o desenvolvimento.

---

## 📋 Pré-requisitos

- Issue refinada via `/refine`
- Contexto do projeto carregado
- Aprovação para prosseguir com a feature

## 🎯 Objetivo

Criar um PRD completo que servirá como fonte única de verdade para a implementação.

## 📝 Estrutura do PRD

### 1. Visão Geral

```markdown
# [Título da Feature]

## Contexto
[Por que estamos construindo isso? Qual problema resolve?]

## Objetivo
[O que queremos alcançar com esta feature?]

## Métricas de Sucesso
- [Métrica 1]: [Como medir]
- [Métrica 2]: [Como medir]
```

### 2. Requisitos Funcionais

```markdown
## Requisitos Funcionais

### RF-01: [Nome do Requisito]
**Descrição**: [Descrição detalhada]
**Prioridade**: Must Have / Should Have / Could Have
**Repositórios**: [repos afetados]

### RF-02: [Nome do Requisito]
**Descrição**: [Descrição detalhada]
**Prioridade**: Must Have / Should Have / Could Have
**Repositórios**: [repos afetados]
```

### 3. Requisitos Não-Funcionais

```markdown
## Requisitos Não-Funcionais

### Performance
- [Requisito de performance]

### Segurança
- [Requisito de segurança]

### Acessibilidade
- [Requisito de acessibilidade]

### Escalabilidade
- [Requisito de escalabilidade]
```

### 4. Fluxos de Usuário

```markdown
## Fluxos de Usuário

### Fluxo Principal
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

### Fluxos Alternativos
**Cenário**: [Nome do cenário]
1. [Passo 1]
2. [Passo 2]

### Tratamento de Erros
**Erro**: [Tipo de erro]
**Comportamento**: [Como o sistema deve reagir]
```

### 5. Especificação Técnica

```markdown
## Especificação Técnica

### Arquitetura

#### <repo-1>
- **Componentes novos**: [lista]
- **Componentes modificados**: [lista]
- **APIs**: [endpoints novos/modificados]

#### <repo-2>
- **Componentes novos**: [lista]
- **Componentes modificados**: [lista]
- **APIs**: [endpoints novos/modificados]

### Integrações
- **Entre repos**: [como os repos se comunicam]
- **Externas**: [APIs externas, se houver]

### Modelo de Dados
[Descreva mudanças no modelo de dados, se houver]
```

### 6. Critérios de Aceitação

```markdown
## Critérios de Aceitação

### Funcional
- [ ] [Critério específico e testável]
- [ ] [Critério específico e testável]

### Técnico
- [ ] Testes unitários com cobertura >= X%
- [ ] Testes de integração implementados
- [ ] Performance dentro dos requisitos
- [ ] Documentação atualizada

### Qualidade
- [ ] Code review aprovado
- [ ] Sem regressões
- [ ] Acessibilidade validada
```

### 7. Fora do Escopo

```markdown
## Fora do Escopo

Funcionalidades que NÃO serão implementadas nesta versão:
- [Item 1]
- [Item 2]

Justificativa: [Por que ficam para depois]
```

### 8. Riscos e Mitigações

```markdown
## Riscos e Mitigações

### Risco 1: [Descrição]
- **Probabilidade**: Alta / Média / Baixa
- **Impacto**: Alto / Médio / Baixo
- **Mitigação**: [Como mitigar]

### Risco 2: [Descrição]
- **Probabilidade**: Alta / Média / Baixa
- **Impacto**: Alto / Médio / Baixo
- **Mitigação**: [Como mitigar]
```

### 9. Dependências

```markdown
## Dependências

### Técnicas
- [Dependência técnica 1]
- [Dependência técnica 2]

### De Negócio
- [Dependência de negócio 1]
- [Dependência de negócio 2]

### Bloqueadores
- [Bloqueador 1 e plano para resolver]
```

### 10. Plano de Testes

```markdown
## Plano de Testes

### Testes Unitários
- [Área 1 a ser testada]
- [Área 2 a ser testada]

### Testes de Integração
- [Cenário 1]
- [Cenário 2]

### Testes Manuais
- [Cenário 1]
- [Cenário 2]
```

## 📄 Salvamento do PRD

**Se task manager configurado**:
- Adicione o PRD como comentário na issue
- Ou anexe como arquivo

**Senão**:
- Salve em `./.context-sessions/<ISSUE-ID>/prd.md`

## 🔍 Revisão e Aprovação

Antes de finalizar:
1. Revise o PRD com stakeholders
2. Valide contra metaspecs (se disponíveis)
3. Obtenha aprovação para iniciar implementação
4. Atualize a issue no task manager com status "Pronto para Desenvolvimento"

---

**Argumentos fornecidos**:

```
#$ARGUMENTS
```

---

## 🎯 Próximo Passo

Após aprovação do PRD:

```bash
/start
```

Este comando iniciará o desenvolvimento da feature.
