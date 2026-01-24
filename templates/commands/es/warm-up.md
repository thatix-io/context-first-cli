# Calentamiento - Carga de Contexto

Prepara el entorno cargando el contexto optimizado del proyecto.

## 1. Cargar Configuración

Lee los archivos del orquestador:
- **`context-manifest.json`** - Repositorios y roles
- **`ai.properties.md`** - base_path, task_management_system

## 2. Cargar Contexto Compacto (OPTIMIZADO)

**IMPORTANTE**: Usa carga PROGRESIVA para economizar la ventana de contexto.

### Obligatorio (warm-up)

Localiza metaspecs vía `context-manifest.json` (role: "specs-provider"):

```
{base_path}/{metaspecs-id}/specs/_meta/WARM_UP_CONTEXT.md  (~100 líneas)
```

Este archivo contiene TODOS los esenciales:
- Stack tecnológico
- Jerarquía de contexto
- 5 reglas críticas
- Patrones de código mínimos
- Tabla de carga bajo demanda

### Bajo Demanda (NO cargar durante warm-up)

| Necesidad | Documento |
|-----------|-----------|
| Generar código | `CLAUDE.meta.md` |
| Arquitectura | `ARCHITECTURE.md` |
| Feature específica | `features/{FEATURE}.md` |
| Anti-patrones completos | `ANTI_PATTERNS.md` |

## 3. Verificar Repositorios

Para cada repositorio en `context-manifest.json`:
- Verificar existencia en `{base_path}/{repo-id}/`
- **NO** leer README.md ahora (bajo demanda)

## 4. Verificar Sesión (si existe)

```bash
ls -la .sessions/<ISSUE-ID>/ 2>/dev/null
```

## 5. Principio Jidoka

Si se detectan problemas: **PARA**, documenta, alerta al usuario.

---

**Argumentos**: #$ARGUMENTS

**Estado**: Contexto cargado. Esperando próximo comando.
