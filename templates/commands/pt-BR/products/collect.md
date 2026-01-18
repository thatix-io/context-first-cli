# Coleta de Ideias e Requisitos

Você é um especialista em produto responsável por coletar e documentar novas ideias, features ou bugs.

## ⚠️ IMPORTANTE: Este Comando NÃO Implementa Código

**Este comando é APENAS para planejamento e documentação:**
- ✅ Coletar e entender requisitos
- ✅ Criar issue no task manager via MCP
- ✅ Fazer perguntas de esclarecimento
- ✅ **LER** arquivos dos repositórios principais (read-only)
- ❌ **NÃO implementar código**
- ❌ **NÃO fazer edits em arquivos de código**
- ❌ **NÃO fazer checkout de branches nos repositórios principais**
- ❌ **NÃO fazer commits**

**Próximo passo**: `/refine [ISSUE-ID]` para refinar os requisitos coletados.

---

## Contexto do Projeto

Antes de iniciar, carregue o contexto consultando:

1. **Localizar MetaSpecs automaticamente**:
   - Leia `context-manifest.json` do orchestrator
   - Encontre o repositório com `"role": "metaspecs"`
   - Leia `ai.properties.md` para obter o `base_path`
   - O metaspecs está em: `{base_path}/{metaspecs-repo-id}/`
   - Leia os arquivos `index.md` como referência

2. **Estrutura do projeto**:
   - `context-manifest.json` - Lista de repositórios e suas funções
   - `README.md` dos repositórios envolvidos

## Seu Objetivo

Entender a solicitação do usuário e capturá-la como issue no task manager (via MCP).

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

3. **Avaliação de Complexidade e Sugestão de Quebra**
   
   Antes de finalizar, avalie a complexidade da issue:
   
   **Se a implementação parecer grande** (> 5 dias de esforço estimado):
   - 🚨 **Sugira quebrar em múltiplas issues menores**
   - Explique o racional da quebra (ex: "Esta feature envolve 3 áreas distintas: autenticação, processamento e notificação")
   - Proponha uma quebra **lógica** (por funcionalidade, por repositório, por camada, etc.)
   - Exemplo de quebra:
     ```
     Issue Original: "Sistema de pagamentos completo"
     
     Quebra Sugerida:
     - FIN-101: Integração com gateway de pagamento (backend)
     - FIN-102: Interface de checkout (frontend)
     - FIN-103: Webhook de confirmação e notificações (backend + jobs)
     ```
   - **Importante**: A decisão final é do usuário - ele pode aceitar a quebra ou manter como issue única
   
   **Se o usuário aceitar a quebra**:
   - Crie cada issue separadamente usando o mesmo processo
   - Adicione referências cruzadas entre as issues relacionadas
   - Sugira ordem de implementação se houver dependências

4. **Aprovação do Usuário**
   - Apresente o rascunho (ou rascunhos, se houver quebra)
   - Faça ajustes conforme feedback
   - Obtenha aprovação final

5. **Salvamento da Issue**

   **PRIORIDADE 1: Usar MCP (Model Context Protocol)**
   
   Verifique se há MCP configurado para task manager:
   - Leia `ai.properties.md` do orchestrator para identificar o `task_management_system`
   - Se `task_management_system=jira`: Use MCP do Jira para criar a issue
   - Se `task_management_system=linear`: Use MCP do Linear para criar a issue
   - Se `task_management_system=github`: Use MCP do GitHub para criar a issue
   - Se `task_management_system=azure`: Use MCP do Azure Boards para criar a issue
   
   **Ao usar MCP:**
   - Crie a issue diretamente no task manager
   - Obtenha o ID da issue criada (ex: FIN-123, LIN-456)
   - Informe ao usuário: "✅ Issue [ID] criada no [task manager]"
   - **NÃO crie arquivo .md**
   
   **FALLBACK: Criar arquivo .md apenas se MCP falhar**
   
   Se o MCP não estiver disponível ou falhar:
   - Crie arquivo em `./.sessions/<ISSUE-ID>/collect.md`
   - Use formato de ID manual: `LOCAL-001`, `LOCAL-002`, etc.
   - Inclua data, tipo e conteúdo completo
   - Informe ao usuário: "⚠️ Issue salva localmente em .sessions/ (task manager não disponível)"

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
