# Calentamiento - Carga de Contexto

Este comando prepara el entorno cargando el contexto completo del proyecto y del workspace actual.

## 1. Identificar Workspace Actual

Verifique si está dentro de un workspace creado por `context-cli`:

```bash
# Verificar si está en un directorio de workspace
pwd
# El workspace generalmente está en ~/workspaces/<ISSUE-ID>/
```

Si no está en un workspace, pregunte al usuario qué workspace usar o si debe crear uno nuevo con `feature:start`.

## 2. Cargar Configuración del Proyecto

Ya está en el orchestrator del proyecto (raíz del repositorio actual).

1. **Verifique que está en la raíz del orchestrator**: `pwd` debe mostrar el directorio del orchestrator
2. **Lea el archivo `context-manifest.json`** en la raíz del orchestrator
3. **Lea el archivo `ai.properties.md`** para obtener configuraciones locales (base_path, etc.)

## 3. Cargar Manifiesto del Proyecto

Lea el `context-manifest.json` del orchestrator para entender:
- Lista completa de repositorios del ecosistema
- URL del repositorio de MetaSpecs
- Dependencias entre repositorios
- Roles de cada repositorio (application, library, service, specs-provider)

## 4. Cargar MetaSpecs

El repositorio de MetaSpecs es **separado** y está definido en `context-manifest.json` con `role: "metaspecs"`.

**Localice el repositorio de metaspecs:**

1. Lea `context-manifest.json` y encuentre el repositorio con `role: "metaspecs"`
2. Obtenga el `id` de ese repositorio (ej: "my-project-metaspecs")
3. Lea `ai.properties.md` para obtener el `base_path`
4. El repositorio de metaspecs está en: `{base_path}/{metaspecs-id}/`

**Lea siempre los archivos de índice primero:**

1. **`README.md`** - Visión general del proyecto y estructura de documentación
2. **`index.md`** (en la raíz o en subcarpetas) - Índice de especificaciones disponibles

**Use los índices como referencia** para navegar hasta las especificaciones específicas que necesita. No asuma que archivos específicos existen - siempre consulte los índices primero.

## 5. Cargar Sesión Actual (si existe)

Verifique si existe una sesión guardada para este workspace:

```bash
# Buscar sesión en orchestrator
ls -la .sessions/<ISSUE-ID>/ 2>/dev/null
```

Si existe, lea los archivos de sesión para recuperar el contexto de la última ejecución.

## 6. Contexto de los Repositorios

Para cada repositorio presente en el workspace, lea:
- `README.md` - Propósito y visión general del repositorio
- Archivo de configuración principal (`package.json`, `pom.xml`, `requirements.txt`, etc.)

## 7. Navegación Inteligente

- **Código**: Use herramientas de búsqueda (glob, grep) para localizar archivos relevantes
- **Documentación**: Use los índices de MetaSpecs como referencia
- **Espere Instrucciones**: NO lea otros archivos ahora. Espere el próximo comando.

## 8. Principio Jidoka (Parar al Detectar Problemas)

Si detecta desalineamiento, conflictos o problemas:
1. 🛑 **PARE** inmediatamente
2. 📝 **DOCUMENTE** el problema encontrado
3. 💬 **ALERTE** al usuario antes de proceder

---

**Argumentos proporcionados**: #$ARGUMENTS

**Estado**: Contexto cargado. Esperando próximo comando.
