# Observabilidade de Decisões

Este comando registra decisões importantes tomadas durante o desenvolvimento, criando um log auditável para explicabilidade e rastreabilidade.

## 🎯 Objetivo

Criar registro estruturado de decisões técnicas e de produto, garantindo:
- **Explicabilidade**: Por que cada decisão foi tomada
- **Rastreabilidade**: Quais fontes (PRD, metaspecs, ADRs) embasaram a decisão
- **Auditoria**: Histórico completo de escolhas para revisão futura
- **Aprendizado**: Documentação de trade-offs e alternativas consideradas

**IMPORTANTE**: Este comando NÃO gera decisões novas. Ele apenas REGISTRA decisões que já foram tomadas no processo de desenvolvimento.

## 📋 Pré-requisitos

- Executou pelo menos um dos comandos que geram decisões:
  - `/spec` - gera PRD com decisões de produto
  - `/plan` - gera plan.md com decisões técnicas
  - `/work` - implementação gera decisões durante desenvolvimento

## 🔍 Processo de Observação

### 1. Identificar Decisões Relevantes

Analise os arquivos da sessão (`./.sessions/<ISSUE-ID>/`) para identificar decisões:

**Após `/spec`** - Decisões de Produto:
- Leia `./.sessions/<ISSUE-ID>/prd.md`
- Identifique decisões em:
  - Escopo (o que entra/não entra na feature)
  - Personas atendidas (quem é o público-alvo)
  - Métricas de sucesso (como medir resultados)
  - Requisitos não-funcionais (performance, acessibilidade)
  - Restrições e trade-offs

**Após `/plan`** - Decisões Técnicas:
- Leia `./.sessions/<ISSUE-ID>/plan.md`
- Identifique decisões em:
  - Arquitetura de componentes/módulos
  - Escolha de bibliotecas ou ferramentas
  - Padrões de implementação
  - Estrutura de dados
  - Estratégia de testes

**Durante `/work`** - Decisões de Implementação:
- Leia `./.sessions/<ISSUE-ID>/work.md`
- Identifique decisões em:
  - Refatorações realizadas
  - Mudanças de abordagem
  - Otimizações aplicadas
  - Tratamento de edge cases

### 2. Documentar Cada Decisão

Para cada decisão identificada, documente:

```markdown
## Decisão: [Título Claro]

**Contexto**: [Por que precisamos decidir isso? Qual o problema ou necessidade?]

**Opções Consideradas**:
1. **Opção A**: [Descrição]
   - Prós: [vantagens]
   - Contras: [desvantagens]
2. **Opção B**: [Descrição]
   - Prós: [vantagens]
   - Contras: [desvantagens]

**Decisão**: [Opção escolhida]

**Justificativa**: [Por que escolhemos esta opção? Quais critérios foram mais importantes?]

**Fontes**:
- [PRD seção X]
- [Metaspec Y]
- [ADR-00Z]

**Trade-offs Aceitos**: [Quais desvantagens aceitamos conscientemente?]

**Reversibilidade**: Fácil / Média / Difícil

**Data**: [data da decisão]
```

### 3. Criar Log de Decisões

Salve em `./.sessions/<ISSUE-ID>/decisions.md`:

```markdown
# Log de Decisões - [ISSUE-ID]

## Resumo
[Breve resumo das principais decisões tomadas nesta feature]

## Decisões de Produto

### [Decisão 1]
[Conforme template acima]

### [Decisão 2]
[Conforme template acima]

## Decisões Técnicas

### [Decisão 3]
[Conforme template acima]

### [Decisão 4]
[Conforme template acima]

## Decisões de Implementação

### [Decisão 5]
[Conforme template acima]

## Lições Aprendidas
- [Lição 1]
- [Lição 2]

## Decisões Pendentes
- [Decisão que ainda precisa ser tomada]
```

## 📊 Análise de Impacto

Para decisões críticas, documente o impacto:

```markdown
## Análise de Impacto

**Repositórios Afetados**: [lista]

**Componentes Impactados**: [lista]

**Dependências Criadas**: [lista]

**Riscos Introduzidos**: [lista]

**Mitigações Aplicadas**: [lista]
```

## 🔄 Revisão de Decisões

Periodicamente, revise as decisões tomadas:
- Ainda fazem sentido?
- Os trade-offs se provaram corretos?
- Há aprendizados para documentar?
- Alguma decisão precisa ser revertida?

---

**Argumentos fornecidos**:

```
#$ARGUMENTS
```

---

## 🎯 Resultado

Após executar este comando, você terá:
- Log completo de decisões em `./.sessions/<ISSUE-ID>/decisions.md`
- Rastreabilidade de cada escolha feita
- Documentação para futuras referências
- Base para ADRs (se decisões forem de arquitetura)
