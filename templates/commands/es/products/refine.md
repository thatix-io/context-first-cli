# Refinamiento de Requisitos

Este comando refina una issue recopilada, transformándola en requisitos claros y validados.

## ⚠️ IMPORTANTE: Este Comando NO Implementa Código

**Este comando es SOLO para refinamiento de requisitos:**
- ✅ Refinar y validar requisitos
- ✅ Actualizar issue en el task manager vía MCP
- ✅ **LEER** archivos de los repositorios principales (solo lectura)
- ❌ **NO implementar código**
- ❌ **NO hacer ediciones en archivos de código**
- ❌ **NO hacer checkout de branches en los repositorios principales**
- ❌ **NO hacer commits**

**Próximo paso**: `/spec [ISSUE-ID]` para crear la especificación completa (PRD).

---

## 📋 Prerrequisitos

- Issue ya recopilada vía `/collect`
- Contexto del proyecto se cargará automáticamente (ver sección "Cargar MetaSpecs" abajo)

## 🎯 Objetivo

Refinar la issue recopilada, aclarando:
- Alcance exacto (qué entra y qué no entra)
- Criterios de aceptación claros
- Impacto en cada repositorio
- Dependencias técnicas
- Riesgos y restricciones

## 📝 Proceso de Refinamiento

### 1. Cargar Issue

**PRIORIDAD 1: Usar MCP (Model Context Protocol)**

- Lea `ai.properties.md` del orchestrator para identificar el `task_management_system`
- Use el MCP apropiado para buscar la issue:
  - `task_management_system=jira`: Use MCP de Jira
  - `task_management_system=linear`: Use MCP de Linear
  - `task_management_system=github`: Use MCP de GitHub
- Cargue todos los datos de la issue (título, descripción, labels, etc.)

**FALLBACK: Si MCP no está disponible o falla**

- Lea `./.sessions/<ISSUE-ID>/collect.md`
- Si el archivo no existe, informe el error al usuario

### 2. Cargar MetaSpecs

**Localizar MetaSpecs automáticamente**:
1. Lea `context-manifest.json` del orchestrator
2. Encuentre el repositorio con `"role": "metaspecs"`
3. Lea `ai.properties.md` para obtener el `base_path`
4. El metaspecs está en: `{base_path}/{metaspecs-repo-id}/`
5. Lea los archivos `index.md` relevantes para entender:
   - Arquitectura del sistema
   - Patrones de diseño
   - Restricciones técnicas
   - Convenciones del proyecto

### 3. Análisis de Alcance

Defina claramente:

**Qué ESTÁ en el alcance**:
- Funcionalidades específicas a implementar
- Repositorios que serán modificados
- Integraciones necesarias

**Qué NO ESTÁ en el alcance**:
- Funcionalidades relacionadas pero que quedan para después
- Optimizaciones futuras
- Features "nice to have"

### 4. Criterios de Aceptación

Defina criterios medibles y comprobables:

```markdown
## Criterios de Aceptación

### Funcional
- [ ] [Criterio 1 - específico y comprobable]
- [ ] [Criterio 2 - específico y comprobable]

### Técnico
- [ ] [Criterio técnico 1]
- [ ] [Criterio técnico 2]

### Calidad
- [ ] Pruebas unitarias implementadas
- [ ] Pruebas de integración implementadas
- [ ] Documentación actualizada
```

### 5. Análisis de Impacto

Para cada repositorio afectado:

```markdown
## Impacto por Repositorio

### <repo-1>
- **Componentes afectados**: [lista]
- **Tipo de cambio**: Nueva feature / Modificación / Refactorización
- **Complejidad estimada**: Baja / Media / Alta
- **Riesgos**: [riesgos específicos]

### <repo-2>
- **Componentes afectados**: [lista]
- **Tipo de cambio**: Nueva feature / Modificación / Refactorización
- **Complejidad estimada**: Baja / Media / Alta
- **Riesgos**: [riesgos específicos]
```

### 6. Dependencias y Restricciones

Identifique:
- Dependencias entre repositorios
- Dependencias de otras features/issues
- Restricciones técnicas
- Restricciones de negocio
- Bloqueadores conocidos

### 7. Estimación Inicial

Proporcione estimación de esfuerzo:
- **Pequeño**: < 1 día
- **Medio**: 1-3 días
- **Grande**: 3-5 días
- **Muy Grande**: > 5 días (considere dividir en issues más pequeñas)

### 8. Preguntas Pendientes

Liste preguntas que aún necesitan respuesta antes de iniciar la implementación.

## 📄 Guardado del Refinamiento

**PRIORIDAD 1: Actualizar vía MCP**

- Use el MCP del task manager para actualizar la issue
- Añada los criterios de aceptación como comentario o campo personalizado
- Actualice labels/tags si es necesario (ej: "refined", "ready-for-spec")
- Añada estimación si el task manager lo soporta
- Informe al usuario: "✅ Issue [ID] actualizada con refinamiento"

**FALLBACK: Crear archivo .md solo si MCP falla**

Si el MCP no está disponible o falla, cree/actualice `./.sessions/<ISSUE-ID>/refine.md`:

```markdown
# [Título de la Issue] - Refinamiento

## Alcance

### Incluido
- [Ítem 1]
- [Ítem 2]

### Excluido
- [Ítem 1]
- [Ítem 2]

## Criterios de Aceptación
[Según sección 3 arriba]

## Impacto por Repositorio
[Según sección 4 arriba]

## Dependencias
- [Dependencia 1]
- [Dependencia 2]

## Restricciones
- [Restricción 1]
- [Restricción 2]

## Estimación
[Pequeño/Medio/Grande/Muy Grande] - [Justificación]

## Preguntas Pendientes
1. [Pregunta 1]
2. [Pregunta 2]

## Riesgos Identificados
- [Riesgo 1 y mitigación]
- [Riesgo 2 y mitigación]
```

Informe al usuario: "⚠️ Refinamiento guardado localmente en .sessions/ (task manager no disponible)"

## 🔍 Validación

Valide el refinamiento contra:
- Estrategia del producto (si está documentada)
- Arquitectura técnica (si está documentada)
- Capacidad del equipo
- Prioridades del roadmap

---

**Argumentos proporcionados**:

```
#$ARGUMENTS
```

---

## 🎯 Próximo Paso

Después de aprobar el refinamiento:

```bash
/spec [ISSUE-ID]
```

Este comando creará la especificación completa (PRD) de la feature.