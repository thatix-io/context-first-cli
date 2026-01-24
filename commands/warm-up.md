# Aquecimento - Carregamento de Contexto

Prepara o ambiente carregando o contexto otimizado do projeto.

## 1. Carregar Configuração

Leia os arquivos do orchestrator:
- **`context-manifest.json`** - Repositórios e roles
- **`ai.properties.md`** - base_path, task_management_system

## 2. Carregar Contexto Compacto (OTIMIZADO)

**IMPORTANTE**: Use carregamento PROGRESSIVO para economizar janela de contexto.

### Obrigatório (warm-up)

Localize metaspecs via `context-manifest.json` (role: "specs-provider"):

```
{base_path}/{metaspecs-id}/specs/_meta/WARM_UP_CONTEXT.md  (~100 linhas)
```

Este arquivo contém TODOS os essenciais:
- Stack tecnológica
- Hierarquia de contexto
- 5 regras críticas
- Padrões de código mínimos
- Tabela de carregamento sob demanda

### Sob Demanda (NÃO carregar durante warm-up)

| Necessidade | Documento |
|-------------|-----------|
| Gerar código | `CLAUDE.meta.md` |
| Arquitetura | `ARCHITECTURE.md` |
| Feature específica | `features/{FEATURE}.md` |
| Anti-patterns completos | `ANTI_PATTERNS.md` |

## 3. Verificar Repositórios

Para cada repositório no `context-manifest.json`:
- Verificar existência em `{base_path}/{repo-id}/`
- **NÃO** ler README.md agora (sob demanda)

## 4. Verificar Sessão (se existir)

```bash
ls -la .sessions/<ISSUE-ID>/ 2>/dev/null
```

## 5. Princípio Jidoka

Se problemas detectados: **PARE**, documente, alerte o usuário.

---

**Argumentos**: #$ARGUMENTS

**Status**: Contexto carregado. Aguardando próximo comando.
