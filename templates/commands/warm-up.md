# Aquecimento - Carregamento de Contexto

Este comando prepara o ambiente carregando o contexto completo do projeto e do workspace atual.

## 1. Identificar Workspace Atual

Verifique se você está dentro de um workspace criado pelo `context-cli`:

```bash
# Procurar pelo arquivo .workspace.json no diretório atual ou pais
pwd
ls -la .workspace.json 2>/dev/null || echo "Não está em um workspace"
```

Se não estiver em um workspace, pergunte ao usuário qual workspace usar ou se deve criar um novo.

## 2. Carregar Configuração do Orchestrator

Leia o arquivo `.workspace.json` para identificar:
- Issue ID do workspace
- Repositórios incluídos neste workspace
- Data de criação e última atualização

## 3. Carregar Metaspecs (se disponíveis)

Navegue até o diretório do orchestrator (geralmente `../.context-orchestrator/`) e leia:

1. **Manifesto do Projeto**: `context-manifest.json`
   - Entenda a estrutura de repositórios
   - Identifique dependências entre repos

2. **Índices de Documentação** (se existirem):
   - `specs/business/index.md` - Contexto de negócio
   - `specs/technical/index.md` - Contexto técnico
   - `README.md` - Visão geral do projeto

3. **Especificações Core** (se existirem):
   - `specs/business/PRODUCT_STRATEGY.md` - Estratégia do produto
   - `specs/technical/meta/intent.md` - Objetivos e constraints
   - `specs/technical/meta/stack.md` - Stack tecnológica e ADRs

## 4. Contexto dos Repositórios

Para cada repositório no workspace, leia:
- `README.md` - Entenda o propósito do repositório
- `package.json` ou arquivo equivalente - Identifique dependências e scripts

## 5. Navegação Inteligente

- **Código**: Use ferramentas de busca (glob, grep) para localizar arquivos relevantes
- **Documentação**: Use os índices carregados para encontrar especificações
- **Aguarde Instruções**: NÃO leia outros arquivos agora. Aguarde o próximo comando.

## 6. Princípio Jidoka (Parar ao Detectar Problemas)

Se detectar desalinhamento, conflitos ou problemas:
1. 🛑 **PARE** imediatamente
2. 📝 **DOCUMENTE** o problema encontrado
3. 💬 **ALERTE** o usuário antes de prosseguir

---

**Argumentos fornecidos**: #$ARGUMENTS

**Status**: Contexto carregado. Aguardando próximo comando.
