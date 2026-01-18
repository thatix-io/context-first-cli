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

## 2. Carregar Configuração do Projeto

Identifique o orchestrator do projeto:

1. **Procure o arquivo `.contextrc.json`** em qualquer um dos repositórios do workspace
2. Este arquivo contém a URL do repositório orchestrator
3. Se o orchestrator ainda não estiver clonado localmente, clone-o

## 3. Carregar Manifesto do Projeto

Leia o `context-manifest.json` do orchestrator para entender:
- Lista completa de repositórios do ecossistema
- URL do repositório de MetaSpecs
- Dependências entre repositórios
- Roles de cada repositório (application, library, service, specs-provider)

## 4. Carregar MetaSpecs

O repositório de MetaSpecs está definido no `context-manifest.json` (geralmente com `role: "specs-provider"`).

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
