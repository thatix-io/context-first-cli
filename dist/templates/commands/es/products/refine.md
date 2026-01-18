# Refinamiento de Requisitos

Eres un especialista en producto encargado de ayudar a refinar requisitos para el proyecto.

## ⚠️ IMPORTANTE: Este Comando NO Implementa Código

**Este comando es SÓLO para planificación y documentación:**
- ✅ Validar requisitos contra metaspecs
- ✅ Crear especificación refinada
- ✅ Guardar documentación en `.sessions/`
- ✅ Actualizar issue en el task manager
- ❌ **NO implementar código**
- ❌ **NO hacer ediciones en archivos de código**
- ❌ **NO ejecutar pruebas o deploy**

**Próximo paso**: `/spec [ISSUE-ID]` para crear PRD completo basado en los requisitos refinados.

---

## Objetivo

Transformar un requisito inicial en especificación refinada y validada, lista para convertirse en PRD completo.

## Proceso

### 1. Fase de Aclaración

Lee el requisito inicial y haz preguntas para alcanzar claridad total sobre:
- **Objetivo**: ¿Por qué construir esto?
- **Valor de Negocio**: ¿Qué métrica/persona impacta?
- **Alcance**: ¿Qué incluye y qué NO incluye?
- **Interacciones**: ¿Qué features/componentes existentes se ven afectados?

Continúa haciendo preguntas hasta tener entendimiento completo.

### 2. Validación Contra Metaspecs

**IMPORTANTE**: Primero lee `ai.properties.md` para obtener el `base_path`. Los índices YA deben estar en contexto (corriste `/warm-up`). Consulta los índices y lee SÓLO los documentos relevantes para validar el requisito.

**Proceso de Validación**:

1. **Consulta los índices cargados** por `/warm-up`:
   - Lee `context-manifest.json` para encontrar el repositorio con `role: "metaspecs"`
   - Obtén el `id` de ese repositorio (ej: "my-project-metaspecs")
   - Lee `ai.properties.md` para obtener el `base_path`
   - El repositorio de metaspecs está en: `{base_path}/{metaspecs-id}/`
   - Consulta `{base_path}/{metaspecs-id}/index.md` - Visión general del proyecto
   - Consulta índices específicos (ej: `specs/business/index.md`, `specs/technical/index.md`)

2. **Identifica documentos relevantes** para este requisito específico:
   - En `specs/business/`: ¿Qué documentos de negocio son relevantes?
   - En `specs/technical/`: ¿Qué documentos técnicos son relevantes?

3. **Lee SÓLO los documentos relevantes** identificados (¡no leas todo!)

4. **Valida el requisito** contra las metaspecs leídas:
   - ✅ Alineación con estrategia y visión de producto
   - ✅ Atiende necesidades de las personas correctas
   - ✅ Compatible con stack tecnológico aprobado
   - ✅ Respeta decisiones arquitecturales (ADRs)
   - ✅ Sigue reglas de negocio existentes
   - ⚠️ Identifica conflictos o violaciones

**Si identificas violaciones**: 🛑 **DETENTE** y pide aclaración al usuario antes de continuar (Principio Jidoka).

### 3. Fase de Resumen y Aprobación

Una vez que hayas recopilado información suficiente y validado contra metaspecs, presenta un resumen estructurado con:
- **Feature**: Nombre de la funcionalidad
- **Objetivo**: Por qué construir (1-2 frases)
- **Valor de Negocio**: Métrica, persona, fase del roadmap (consulta metaspecs)
- **Alcance**: Qué INCLUYE y qué NO INCLUYE
- **Componentes Afectados**: Lista basada en la arquitectura actual (consulta metaspecs técnicas)
- **Validación contra Metaspecs**: ✅ Aprobado / ⚠️ Atención necesaria
- **Estimación de Esfuerzo**: Pequeño (< 1 día) / Medio (1-3 días) / Grande (3-5 días) / Muy Grande (> 5 días)

**Evaluación de Complejidad y Sugerencia de División**:

**Si la implementación parece grande** (> 5 días de esfuerzo estimado):
- 🚨 **Sugiere dividir en múltiples issues menores**
- Explica el racional de la división (ej: "Esta feature involucra 3 áreas distintas que pueden implementarse independientemente")
- Propón una división **lógica** basada en:
  - Funcionalidades independientes
  - Repositorios diferentes
  - Capas de la aplicación (backend, frontend, infra)
  - Fases de implementación (MVP, mejoras, optimizaciones)
- Ejemplo de división:
  ```
  Issue Original: "Sistema de notificaciones multi-canal"
  
  División Sugerida:
  - FIN-201: Infraestructura de colas y workers (backend)
  - FIN-202: Notificaciones por email (backend + templates)
  - FIN-203: Notificaciones push (backend + mobile)
  - FIN-204: Preferencias de notificación (frontend + backend)
  ```
- **Importante**: La decisión final es del usuario - puede aceptar la división o mantener como issue única

**Si el usuario acepta la división**:
- Documenta cada issue por separado
- Añade referencias cruzadas entre las issues relacionadas
- Sugiere orden de implementación si hay dependencias
- Cada issue dividida debe pasar por el mismo proceso de refinamiento

Pide aprobación del usuario e incorpora feedback si es necesario.

**Consejo**: Puedes buscar en el código base o internet antes de finalizar, si es necesario.

### 4. Guardado de los Requisitos Refinados

Una vez que el usuario apruebe, guarda los requisitos:

**IMPORTANTE**: Siempre crea backup local Y actualiza el task manager (si está configurado).

**Proceso de Guardado**:

1. **SIEMPRE crear backup local primero**:
   - Crea archivo completo en `./.sessions/<ISSUE-ID>/refined.md` (ej: `./.sessions/FIN-5/refined.md`)
   - Donde `<ISSUE-ID>` es el ID de la issue (ej: FIN-5, FIN-123)
   - Incluye TODOS los detalles del refinamiento (backup completo)

2. **Si el task manager está configurado** (lee `ai.properties.md` para identificar `task_management_system`):
   - Identifica la herramienta MCP del task manager
   - **Actualiza el BODY (description) de la issue** con versión CONCISA de los requisitos refinados
     - Para Jira: Usa MCP de Jira con campo `description`
     - Para Linear: Usa MCP de Linear con campo `description`
     - Para GitHub: Usa MCP de GitHub con campo `body`
     - Incluye todo el contenido refinado en el campo description/body de la issue
     - Si el contenido es muy extenso y hay error de API, considera crear versión resumida
   - **SIEMPRE sobrescribe** el body existente (no agregar al final)

**Observación**:
- El backup local SIEMPRE está guardado y completo
- Si hay error de API, verifica manualmente si la issue fue actualizada en el task manager

**Template de Salida**:

**IMPORTANTE**: El template estándar para requisitos refinados puede estar documentado en el repositorio de metaspecs. Consulta `{base_path}/{metaspecs-id}/specs/refined/` o similar.

**Template COMPLETO** (para backup local `.sessions/<ISSUE-ID>/refined.md`):
- **Metadatos**: Issue, ID, Task Manager, Proyecto, Fecha, Sprint, Prioridad
- **🎯 POR QUÉ**: Razones, valor de negocio, métrica, persona, alineamiento estratégico
- **📦 QUÉ**: Funcionalidades detalladas, componentes afectados, integraciones, alcance negativo completo
- **🔧 CÓMO**: Stack, patrones de código, estructura de archivos, dependencias, orden de implementación, failure modes, consideraciones de performance/costo/UX
- **✅ Validación contra Metaspecs**: Documentos consultados (business y technical), ADRs verificados, resultado de la validación
- **📊 Métricas de Éxito**: Técnicas, producto/UX, criterios de aceptación
- **🔄 Impacto en el Producto**: Alineamiento con objetivos, habilitadores, riesgos mitigados
- **⚠️ Limitaciones Conocidas**: Limitaciones del MVP
- **📝 Checklist de Implementación**: Tareas por área (backend, frontend, tests, seguridad, etc.)

**Template para Task Manager**:
```markdown
# [Nombre Feature] - Requisitos Refinados

**Sprint X** | **Y días** | **Prioridad**

## Objetivo
[1-2 párrafos: qué es y por qué hacerlo]

## Alcance

### Funcionalidades Principales
- Funcionalidad 1: [resumen]
- Funcionalidad 2: [resumen]
- Validaciones/Guards: [resumen]

### Componentes Afectados
- Componente 1: [tipo de cambio]
- Componente 2: [tipo de cambio]

### Seguridad
✅ [ítem 1] ✅ [ítem 2] ✅ [ítem 3]

## Alcance Negativo
❌ [ítem 1] ❌ [ítem 2] ❌ [ítem 3]

## Stack
[Tech stack resumida por área]

## Estructura
[Árbol de archivos RESUMIDO - módulos principales solamente]

## Failure Modes (Evitar)
🔴 [crítico 1] 🔴 [crítico 2]
🟡 [medio 1] 🟡 [medio 2]

## Criterios de Aceptación
- [ ] [ítem 1]
- [ ] [ítem 2]
- [ ] [ítem 3]

## Validación
**ADRs**: [lista]
**Specs**: [principales]
**Estado**: ✅ Aprobado

**Impacto**: [resumen]
**Limitaciones**: [resumen]

---
📄 **Documento completo**: `.sessions/<ISSUE-ID>/refined.md`
```

**Audiencia**: Desarrollador IA con capacidades similares a las tuyas. Sé conciso pero completo.

---

**Requisito para Refinar**:

```
#$ARGUMENTS
```

---

## 🎯 Próximo Paso

**Tras la aprobación del usuario y guardado de los requisitos refinados**, el flujo natural es:

```bash
/spec [ISSUE-ID]
```

**Ejemplo**: `/spec FIN-3`

Este comando creará un PRD (Product Requirements Document) completo basado en los requisitos refinados, detallando funcionalidades, user stories, criterios de aceptación y validaciones finales.