# Aquecimento - Carregamento de Contexto

Este comando prepara o ambiente carregando o contexto completo do projeto e do workspace atual.

## 1. Identificar Workspace Atual

Verifique se você está dentro de um workspace criado pelo `context-cli`:

```bash
# Verificar se está em um diretório de workspace
pwd
# O workspace geralmente está em ~/workspaces/<ISSUE-ID>/
```

Se não estiver em um workspace, pergunte ao usuário qual workspace usar ou se deve criar um novo com `feature:start`.

## 📋 Configuração do Projeto

**⚠️ IMPORTANTE: Sempre leia os arquivos de configuração do projeto ANTES de executar este comando!**

### Arquivos Obrigatórios

1. **`context-manifest.json`** (raiz do orchestrator)
   - Lista de repositórios do projeto
   - Roles de cada repositório (metaspecs, application, etc.)
   - URLs e dependências entre repositórios

2. **`ai.properties.md`** (raiz do orchestrator)
   - Configurações do projeto (`project_name`, `base_path`)
   - Sistema de gerenciamento de tarefas (`task_management_system`)
   - Credenciais e configurações específicas

### Como Ler

```bash
# 1. Ler context-manifest.json
cat context-manifest.json

# 2. Ler ai.properties.md
cat ai.properties.md
```

### Informações Essenciais

Após ler os arquivos, você terá:
- ✅ Lista completa de repositórios do projeto
- ✅ Localização do repositório de metaspecs
- ✅ Base path para localizar repositórios
- ✅ Sistema de task management configurado
- ✅ Configurações específicas do projeto

**🛑 NÃO prossiga sem ler estes arquivos!** Eles contêm informações críticas para a execução correta do comando.


## 2. Carregar Configuração do Projeto

Você já está no orchestrator do projeto (raiz do repositório atual).

1. **Verifique se está na raiz do orchestrator**: `pwd` deve mostrar o diretório do orchestrator
2. **Leia o arquivo `context-manifest.json`** na raiz do orchestrator
3. **Leia o arquivo `ai.properties.md`** para obter configurações locais (base_path, etc.)

## 3. Carregar Manifesto do Projeto

Leia o `context-manifest.json` do orchestrator para entender:
- Lista completa de repositórios do ecossistema
- URL do repositório de MetaSpecs
- Dependências entre repositórios
- Roles de cada repositório (application, library, service, specs-provider)

## 4. Carregar MetaSpecs

O repositório de MetaSpecs é **separado** e está definido no `context-manifest.json` com `role: "metaspecs"`.

**Localize o repositório de metaspecs:**

1. Leia `context-manifest.json` e encontre o repositório com `role: "metaspecs"`
2. Obtenha o `id` desse repositório (ex: "my-project-metaspecs")
3. Leia `ai.properties.md` para obter o `base_path`
4. O repositório de metaspecs está em: `{base_path}/{metaspecs-id}/`

**Leia sempre os arquivos de índice primeiro:**

1. **`README.md`** - Visão geral do projeto e estrutura de documentação
2. **`index.md`** (na raiz ou em subpastas) - Índice de especificações disponíveis

**Use os índices como referência** para navegar até as especificações específicas que você precisa. Não assuma que arquivos específicos existem - sempre consulte os índices primeiro.

## 5. Carregar Sessão Atual (se existir)

Verifique se existe uma sessão salva para este workspace:

```bash
# Procurar por sessão no orchestrator
ls -la .sessions/<ISSUE-ID>/ 2>/dev/null
```

Se existir, leia os arquivos de sessão para recuperar o contexto da última execução.

## 6. Contexto dos Repositórios

Para cada repositório presente no workspace, leia:
- `README.md` - Propósito e visão geral do repositório
- Arquivo de configuração principal (`package.json`, `pom.xml`, `requirements.txt`, etc.)

## 7. Navegação Inteligente

- **Código**: Use ferramentas de busca (glob, grep) para localizar arquivos relevantes
- **Documentação**: Use os índices dos MetaSpecs como referência
- **Aguarde Instruções**: NÃO leia outros arquivos agora. Aguarde o próximo comando.

## 8. Princípio Jidoka (Parar ao Detectar Problemas)

Se detectar desalinhamento, conflitos ou problemas:
1. 🛑 **PARE** imediatamente
2. 📝 **DOCUMENTE** o problema encontrado
3. 💬 **ALERTE** o usuário antes de prosseguir

---

**Argumentos fornecidos**: #$ARGUMENTS

**Status**: Contexto carregado. Aguardando próximo comando.
