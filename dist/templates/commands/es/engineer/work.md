# Ejecución del Trabajo

Este comando ejecuta una unidad de trabajo en el workspace actual, implementando parte del plan técnico.

## 📋 Prerrequisitos

Antes de ejecutar, asegúrate de que:
- Has ejecutado `/start` y `/plan` para tener el plan técnico
- Estás en el workspace correcto: `<orchestrator>/.sessions/<ISSUE-ID>/`
- Tienes disponibles los archivos `.sessions/<ISSUE-ID>/`:
  - `context.md` (inmutable)
  - `architecture.md` (inmutable)
  - `plan.md` (mutable)

## 📍 IMPORTANTE: Entiende la Estructura

**Workspace** (donde trabajas):
```
<orchestrator>/.sessions/<ISSUE-ID>/
├── repo-1/          # worktree con branch feature/<ISSUE-ID>
├── repo-2/          # worktree con branch feature/<ISSUE-ID>
├── context.md       # contexto (inmutable)
├── architecture.md  # arquitectura (inmutable)
└── plan.md          # plan (mutable)
```

**Repositorios principales** (NO tocar):
```
{base_path}/repo-1/  # repo principal (branch main/master)
{base_path}/repo-2/  # repo principal (branch main/master)
```

**REGLA DE ORO**:
- ✅ Trabaja SÓLO dentro de `<orchestrator>/.sessions/<ISSUE-ID>/`
- ✅ Haz commits en los worktrees dentro del workspace
- ❌ NUNCA hagas checkout en los repositorios principales
- ❌ NUNCA navegues a `{base_path}/{repo-id}/`

## 🛑 CRÍTICO: DÓNDE CREAR CÓDIGO

**⚠️ ATENCIÓN: TODO CÓDIGO DEBE SER CREADO DENTRO DEL WORKTREE DEL REPOSITORIO!**

**✅ CORRECTO** - Crear código dentro del worktree:
```
<orchestrator>/.sessions/<ISSUE-ID>/<repo-name>/src/file.ts  ✅
<orchestrator>/.sessions/<ISSUE-ID>/<repo-name>/tests/test.ts  ✅
<orchestrator>/.sessions/<ISSUE-ID>/<repo-name>/package.json  ✅
```

**❌ INCORRECTO** - NUNCA crear código directamente en .sessions:
```
<orchestrator>/.sessions/src/file.ts  ❌
<orchestrator>/.sessions/<ISSUE-ID>/src/file.ts  ❌
<orchestrator>/.sessions/<ISSUE-ID>/file.ts  ❌
```

**REGLA ABSOLUTA**:
- 🛑 **TODO archivo de código** (`.ts`, `.js`, `.py`, `.java`, etc.) **DEBE estar dentro de** `<orchestrator>/.sessions/<ISSUE-ID>/<repo-name>/`
- 🛑 **NUNCA crees código** directamente en `<orchestrator>/.sessions/` o `<orchestrator>/.sessions/<ISSUE-ID>/`
- ✅ **Único lugar válido**: Dentro del worktree del repositorio específico

## ⚠️ IMPORTANTE: Archivos Inmutables

**Este comando debe LEER pero NO MODIFICAR:**
- ✅ **LEER** `.sessions/<ISSUE-ID>/context.md` (inmutable)
- ✅ **LEER** `.sessions/<ISSUE-ID>/architecture.md` (inmutable)
- ✅ **ACTUALIZAR** `.sessions/<ISSUE-ID>/plan.md` (marcar progreso)
- ✅ **IMPLEMENTAR** código **DENTRO DEL WORKTREE**: `.sessions/<ISSUE-ID>/<repo-name>/`
- ✅ **HACER COMMITS** en los worktrees: `.sessions/<ISSUE-ID>/<repo-name>/`
- ❌ **NO modificar `context.md` o `architecture.md`**
- ❌ **NO hacer checkout de branches en los repositorios principales (fuera del workspace)**
- 🛑 **NUNCA crear código en `.sessions/` o `.sessions/<ISSUE-ID>/` directamente**

## 📚 Cargar MetaSpecs

**Localizar MetaSpecs automáticamente**:
1. Lee `context-manifest.json` del orchestrator
2. Encuentra el repositorio con `"role": "metaspecs"`
3. Lee `ai.properties.md` para obtener el `base_path`
4. El metaspecs está en: `{base_path}/{metaspecs-repo-id}/`
5. Lee los archivos `index.md` relevantes durante la implementación para:
   - Seguir patrones de código
   - Respetar arquitectura definida
   - Usar convenciones correctas

## 🎯 Objetivo

Implementar una unidad de trabajo específica del plan, que puede involucrar:
- Crear nuevos archivos/componentes
- Modificar archivos existentes
- Añadir pruebas
- Actualizar documentación

## 📝 Proceso de Trabajo

**⚠️ IMPORTANTE: CONTROL DE PROGRESO**

Este comando ejecuta el trabajo en **fases incrementales**. Tras completar cada **FASE PRINCIPAL** (ej: Fase 1 → Fase 2):

1. 🛑 **DETÉN** la ejecución
2. 📊 **PRESENTA** un resumen de lo realizado
3. ❓ **PREGUNTA** al desarrollador si quiere:
   - Revisar el código implementado
   - Hacer ajustes antes de continuar
   - Continuar a la siguiente fase

**IMPORTANTE**:
- ✅ **PAUSA** entre fases principales (Fase 1 → Fase 2 → Fase 3)
- ❌ **NO pauses** entre subfases (Fase 1.1 → Fase 1.2 → Fase 1.3)

**NO implementes todo de una vez**. Trabaja fase principal por fase principal, esperando confirmación del desarrollador.

---

### 1. Identificar Unidad de Trabajo

Basado en el plan técnico (`./.sessions/<ISSUE-ID>/plan.md`), identifica:
- Qué tarea específica se implementará ahora
- En cuál(es) repositorio(s) del workspace
- Qué archivos serán creados/modificados
- Dependencias con otras tareas

### 2. Implementación



**IMPORTANTE**: Trabaja SÓLO dentro del workspace en `.sessions/<ISSUE-ID>/`

Para cada repositorio en el workspace:

```bash
# Navega al worktree dentro del workspace
cd <orchestrator>/.sessions/<ISSUE-ID>/<repo-name>/

# Verifica que estás en la branch correcta
git branch  # debe mostrar * feature/<ISSUE-ID>

# Implementa el código aquí
```

Ejecuta la implementación siguiendo:
- **Patrones del proyecto**: Consulta guías de estilo y arquitectura
- **Stack aprobada**: Usa sólo tecnologías documentadas en las metaspecs
- **Pruebas**: Implementa pruebas conforme a los estándares del proyecto
- **Documentación**: Actualiza comentarios y docs cuando sea necesario



### 3. Validación Local

Antes de commitear:
- Ejecuta pruebas unitarias/integración
- Verifica linting y formato
- Confirma que no rompiste funcionalidades existentes



### 4. Commit

Para cada repositorio modificado **dentro del workspace**:

```bash
# Navega al worktree dentro del workspace
cd <orchestrator>/.sessions/<ISSUE-ID>/<repo-name>/

# Añade los cambios
git add .

# Commit
git commit -m "tipo: descripción concisa

- Detalle 1
- Detalle 2

Refs: <ISSUE-ID>"
```

**Tipos de commit**: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

**⚠️ PAUSA OBLIGATORIA**: Tras completar TODA la fase principal (identificación + implementación + validación + commit + actualización del plan.md), **DETÉN** y muestra al desarrollador:
- Resumen completo de la fase
- Archivos creados/modificados
- Commits realizados
- Pregunta si quiere revisar o continuar a la siguiente fase

### 5. Actualización del Plan.md

**POR CADA tarea completada**, actualiza `./.sessions/<ISSUE-ID>/plan.md`:

```markdown
#### 1.1 - [Nombre de la Tarea] [Completada ✅]
- [Detalle 1]
- [Detalle 2]
- [Detalle 3]

**Archivos**:
- `path/to/file1.ts` ✅
- `path/to/file2.vue` ✅

**Pruebas**:
- Unit test: [Descripción] ✅
- Integration test: [Descripción] ✅

**Comentarios**:
- Decisión: [Explicación de decisión técnica importante]
- Aprendizaje: [Algo aprendido durante implementación]
```

**Marca el estado de las tareas**:
- `[No Iniciada ⏳]` - Tarea aún no comenzó
- `[En Progreso ⏰]` - Tarea en curso
- `[Completada ✅]` - Tarea finalizada y validada

## 🔍 Checklist de Calidad

Antes de considerar la unidad completa:
- [ ] Código implementado y probado
- [ ] Pruebas pasando
- [ ] Linting/formato OK
- [ ] Documentación actualizada (si es necesario)
- [ ] Commit realizado en todos los repositorios afectados
- [ ] `plan.md` actualizado con progreso y comentarios

## ⚠️ Principio Jidoka

Si encuentras problemas durante la implementación:
1. 🛑 **DETÉN** la implementación
2. 📝 **DOCUMENTA** el problema encontrado
3. 💬 **ALERTA** al usuario y discute soluciones
4. 🔄 **AJUSTA** el plan si es necesario

---

**Argumentos proporcionados**:

```
#$ARGUMENTS
```

---

## 🎯 Próximos Pasos

- **Continuar implementación**: Ejecuta `/work` nuevamente para la siguiente unidad
- **Finalizar feature**: Cuando todo esté implementado, ejecuta `/pre-pr`

## 💡 Consejos

- Trabaja en unidades pequeñas e incrementales
- Commit frecuente (commits atómicos)
- Documenta decisiones importantes en la sesión
- Mantén los repositorios sincronizados entre sí