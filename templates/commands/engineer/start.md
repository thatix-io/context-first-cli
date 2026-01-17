# Início do Desenvolvimento

Este comando inicia o desenvolvimento de uma funcionalidade no workspace atual.

## 🎯 Contexto do Projeto

Antes de iniciar, carregue o contexto consultando:
- `context-manifest.json` - Estrutura de repositórios
- `specs/business/index.md` - Contexto de negócio
- `specs/technical/index.md` - Stack, arquitetura e padrões técnicos
- `.workspace.json` - Informações do workspace atual

## ⚙️ Configuração Inicial

1. **Verificar Workspace**:
   - Confirme que está no workspace correto (verifique `.workspace.json`)
   - Liste os repositórios disponíveis no workspace

2. **Verificar Branches**:
   - Para cada repositório no workspace, verifique a branch atual
   - Confirme que todas as branches estão sincronizadas

3. **Carregar Especificação**:
   - **Se task manager configurado**: Leia a issue usando o MCP apropriado
   - **Senão**: Peça ao usuário o arquivo de especificação ou descrição da feature

4. **Atualizar Status** (se task manager configurado):
   - Mova a issue para "Em Progresso"

## 📋 Análise e Entendimento

Analise a especificação e construa entendimento completo respondendo:

### Negócio
- **Por que** isso está sendo construído?
- **Quem** se beneficia?
- **Qual** métrica queremos impactar?

### Funcional
- **Qual resultado esperado**? (comportamento do usuário, output do sistema)
- **Quais componentes** serão criados/modificados em cada repositório?
- **Quais integrações** entre repositórios são necessárias?

### Técnico
- **Stack aprovada**? Verificar contra especificações técnicas
- **Padrões arquiteturais**? Verificar ADRs (se disponíveis)
- **Dependências novas**? Justificar e documentar
- **Como testar**? (conforme padrões do projeto)

### Validação contra Metaspecs

Se metaspecs estiverem disponíveis, validar:
- Alinhado com estratégia e roadmap?
- Usa stack tecnológica aprovada?
- Respeita Architecture Decision Records?
- Segue regras de negócio documentadas?

## 🤔 Perguntas de Esclarecimento

Após análise inicial, formule **3-5 clarificações mais importantes**:

**Exemplos de perguntas relevantes**:
- Qual repositório deve conter a lógica principal?
- Como os repositórios devem se comunicar?
- Há dependências entre as mudanças nos diferentes repos?
- Qual a ordem de implementação recomendada?
- Há impacto em APIs ou contratos entre serviços?

## 📝 Documentação da Sessão

Crie arquivo `./.context-sessions/<ISSUE-ID>/start.md` com:

```markdown
# [Título da Feature] - Início

## Entendimento
[Resumo do que será construído e por quê]

## Repositórios Afetados
- **repo-1**: [O que será feito]
- **repo-2**: [O que será feito]

## Perguntas Pendentes
1. [Pergunta 1]
2. [Pergunta 2]

## Validações Realizadas
- [x] Alinhado com estratégia
- [x] Stack aprovada
- [ ] Pendente: [algo a validar]

## Próximos Passos
1. Aguardar respostas das perguntas
2. Executar `/plan` para planejamento técnico detalhado
```

---

**Argumentos fornecidos**:

```
#$ARGUMENTS
```

---

## 🎯 Próximo Passo

Após esclarecimentos e aprovação:

```bash
/plan
```

Este comando criará o planejamento técnico detalhado da implementação.
