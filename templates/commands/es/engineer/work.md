# Ejecución del Trabajo

Este comando ejecuta una unidad de trabajo en el workspace actual, implementando parte del plan técnico.

## 📋 Requisitos Previos

Antes de ejecutar, asegúrese de que:
- Ha ejecutado `/start` y `/plan` para tener el plan técnico
- Está en el workspace correcto: `<orchestrator>/.sessions/<ISSUE-ID>/`
- Tiene los archivos `.sessions/<ISSUE-ID>/` disponibles:
  - `context.md` (inmutable)
  - `architecture.md` (inmutable)
  - `plan.md` (mutable)

## 📍 IMPORTANTE: Entienda la Estructura

**Workspace** (donde trabaja):
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
- ✅ Trabaje SÓLO dentro de `<orchestrator>/.sessions/<ISSUE-ID>/`
- ✅ Haga commits en los worktrees dentro del workspace
- ❌ NUNCA haga checkout en los repositorios principales
- ❌ NUNCA navegue a `{base_path}/{repo-id}/`

## ⚠️ IMPORTANTE: Archivos Inmutables

**Este comando debe LEER pero NO MODIFICAR:**
- ✅ **LEER** `.sessions/<ISSUE-ID>/context.md` (inmutable)
- ✅ **LEER** `.sessions/<ISSUE-ID>/architecture.md` (inmutable)
- ✅ **ACTUALIZAR** `.sessions/<ISSUE-ID>/plan.md` (marcar progreso)
- ✅ **IMPLEMENTAR** código en los repositorios del workspace
- ✅ **HACER COMMITS** en los repositorios del workspace
- ❌ **NO modificar `context.md` o `architecture.md`**
- ❌ **NO hacer checkout de branches en los repositorios principales (fuera del workspace)**

## 📚 Cargar MetaSpecs

**Localizar MetaSpecs automáticamente**:
1. Lea `context-manifest.json` del orchestrator
2. Encuentre el repositorio con `"role": "metaspecs"`
3. Lea `ai.properties.md` para obtener el `base_path`
4. El metaspecs está en: `{base_path}/{metaspecs-repo-id}/`
5. Lea los archivos `index.md` relevantes durante la implementación para:
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

Este comando ejecuta el trabajo en **fases incrementales**. Después de completar cada **FASE PRINCIPAL** (ej: Fase 1 → Fase 2):

1. 🛑 **PARE** la ejecución
2. 📊 **PRESENTE** un resumen de lo realizado
3. ❓ **PREGUNTE** al desarrollador si quiere:
   - Revisar el código implementado
   - Hacer ajustes antes de continuar
   - Continuar a la siguiente fase

**IMPORTANTE**:
- ✅ **PAUSE** entre fases principales (Fase 1 → Fase 2 → Fase 3)
- ❌ **NO pause** entre subfases (Fase 1.1 → Fase 1.2 → Fase 1.3)

**NO implemente todo de una vez**. Trabaje fase principal por fase principal, esperando confirmación del desarrollador.

---

### 1. Identificar Unidad de Trabajo

Basado en el plan técnico (`./.sessions/<ISSUE-ID>/plan.md`), identifique:
- Qué tarea específica será implementada ahora
- En cuál(es) repositorio(s) del workspace
- Qué archivos serán creados/modificados
- Dependencias con otras tareas

### 2. Implementación



**IMPORTANTE**: Trabaje SÓLO dentro del workspace en `.sessions/<ISSUE-ID>/`

Para cada repositorio en el workspace:

```bash
# Navegue al worktree dentro del workspace
cd <orchestrator>/.sessions/<ISSUE-ID>/<repo-name>/

# Verifique que está en la branch correcta
git branch  # debe mostrar * feature/<ISSUE-ID>

# Implemente el código aquí
```

Ejecute la implementación siguiendo:
- **Patrones del proyecto**: Consulte guías de estilo y arquitectura
- **Stack aprobada**: Use sólo tecnologías documentadas en las metaspecs
- **Pruebas**: Implemente pruebas conforme a los patrones del proyecto
- **Documentación**: Actualice comentarios y docs cuando sea necesario



### 3. Validación Local

Antes de commitear:
- Ejecute pruebas unitarias/integración
- Verifique linting y formato
- Confirme que no rompió funcionalidades existentes



### 4. Commit

Para cada repositorio modificado **dentro del workspace**:

```bash
# Navegue al worktree dentro del workspace
cd <orchestrator>/.sessions/<ISSUE-ID>/<repo-name>/

# Añada los cambios
git add .

# Commit
git commit -m "tipo: descripción concisa

- Detalle 1
- Detalle 2

Refs: <ISSUE-ID>"
```

**Tipos de commit**: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

**⚠️ PAUSA OBLIGATORIA**: Después de completar TODA la fase principal (identificación + implementación + validación + commit + actualización del plan.md), **PARE** y muestre al desarrollador:
- Resumen completo de la fase
- Archivos creados/modificados
- Commits realizados
- Pregunte si quiere revisar o continuar a la siguiente fase

### 5. Actualización del Plan.md

**POR CADA tarea completada**, actualice `./.sessions/<ISSUE-ID>/plan.md`:

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

**Marque estado de las tareas**:
- `[No Iniciada ⏳]` - Tarea aún no comenzó
- `[En Progreso ⏰]` - Tarea en curso ahora
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

Si encuentra problemas durante la implementación:
1. 🛑 **PARE** la implementación
2. 📝 **DOCUMENTE** el problema encontrado
3. 💬 **ALERTE** al usuario y discuta soluciones
4. 🔄 **AJUSTE** el plan si es necesario

---

**Argumentos proporcionados**:

```
#$ARGUMENTS
```

---

## 🎯 Próximos Pasos

- **Continuar implementación**: Ejecute `/work` nuevamente para la siguiente unidad
- **Finalizar feature**: Cuando todo esté implementado, ejecute `/pre-pr`

## 💡 Consejos

- Trabaje en unidades pequeñas e incrementales
- Commit frecuente (commits atómicos)
- Documente decisiones importantes en la sesión
- Mantenga los repositorios sincronizados entre sí