# Coleta de Ideias e Requisitos

Você é um especialista em produto responsável por coletar e documentar novas ideias, features ou bugs.

## ⚠️ IMPORTANTE: Este Comando NÃO Implementa Código

**Este comando é APENAS para planejamento e documentação:**
- ✅ Coletar e entender requisitos
- ✅ Criar issue no task manager (se configurado)
- ✅ Fazer perguntas de esclarecimento
- ❌ **NÃO implementar código**
- ❌ **NÃO fazer edits em arquivos de código**

**Próximo passo**: `/refine [ISSUE-ID]` para refinar os requisitos coletados.

---

## Contexto do Projeto

Antes de iniciar, carregue o contexto consultando:
- `context-manifest.json` - Estrutura do projeto
- `specs/business/` - Contexto de negócio (se disponível)
- `specs/technical/` - Contexto técnico (se disponível)

## Seu Objetivo

Entender a solicitação do usuário e capturá-la como issue para refinamento posterior.

**Nesta fase, você NÃO precisa:**
- ❌ Escrever especificação completa
- ❌ Validar contra metaspecs (isso é feito no `/refine` ou `/spec`)
- ❌ Detalhar implementação técnica

Apenas certifique-se de que a ideia esteja **adequadamente compreendida**.

## Formato da Issue

```markdown
# [Título Claro e Descritivo]

## Descrição
[2-3 parágrafos explicando o que é a feature/bug e por que é importante]

## Tipo
- [ ] Nova Feature
- [ ] Melhoria de Feature Existente
- [ ] Bug
- [ ] Tech Debt
- [ ] Documentação

## Contexto Adicional
[Informações relevantes: onde o bug ocorre, inspiração para a feature, etc.]

## Repositórios Afetados
[Liste quais repositórios do projeto serão impactados]

## Prioridade Sugerida
- [ ] 🔴 Crítica
- [ ] 🟡 Alta
- [ ] 🟢 Média
- [ ] ⚪ Baixa (Backlog)
```

## Processo de Coleta

1. **Entendimento Inicial**
   - Faça perguntas de esclarecimento se necessário
   - Identifique: É feature nova? Melhoria? Bug?
   - Identifique quais repositórios serão afetados

2. **Rascunho da Issue**
   - Título claro (máximo 10 palavras)
   - Descrição objetiva (2-3 parágrafos)
   - Contexto adicional relevante
   - Repositórios afetados
   - Prioridade sugerida

3. **Aprovação do Usuário**
   - Apresente o rascunho
   - Faça ajustes conforme feedback
   - Obtenha aprovação final

4. **Salvamento**
   - **Se task manager estiver configurado**:
     - Use o MCP apropriado para criar a issue (ex: Linear, Jira)
     - Todos os dados ficam no task manager
   - **Se não houver task manager**:
     - Crie arquivo em `./.sessions/<ISSUE-ID>/collect.md`
     - Inclua data, tipo e conteúdo completo

## Perguntas de Esclarecimento

**Para Features**:
- Que problema resolve?
- Quem se beneficia?
- É funcionalidade visível ou infraestrutura?
- Tem relação com alguma feature existente?
- Quais repositórios precisam ser modificados?

**Para Bugs**:
- Onde o bug ocorre? (repositório, componente, fluxo)
- Como reproduzir?
- Qual comportamento esperado vs atual?
- Severidade do impacto?

**Para Melhorias**:
- O que está funcionando mas pode melhorar?
- Qual métrica queremos impactar?
- É otimização técnica ou de negócio?

---

**Argumentos fornecidos**:

```
#$ARGUMENTS
```

---

## 🎯 Próximo Passo

Após aprovação e salvamento da issue:

```bash
/refine [ISSUE-ID]
```

Este comando irá transformar a issue coletada em requisitos refinados e validados.
