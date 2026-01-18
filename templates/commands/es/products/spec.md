# Creación de Especificación (PRD)

Este comando crea la especificación completa (Product Requirements Document) de la feature.

## ⚠️ IMPORTANTE: Este Comando NO Implementa Código

**Este comando es SÓLO para documentación de requisitos:**
- ✅ Crear PRD (Product Requirements Document)
- ✅ Actualizar issue en el task manager vía MCP
- ✅ **LEER** archivos de los repositorios principales (read-only)
- ❌ **NO implementar código**
- ❌ **NO hacer edits en archivos de código**
- ❌ **NO hacer checkout de branches en los repositorios principales**
- ❌ **NO hacer commits**

**Próximo paso**: `/start` para iniciar el desarrollo.

---

## 📋 Requisitos Previos

- Issue refinada vía `/refine`
- Aprobación para continuar con la feature

## 📚 Cargar MetaSpecs

**Localizar MetaSpecs automáticamente**:
1. Lea `context-manifest.json` del orchestrator
2. Encuentre el repositorio con `"role": "metaspecs"`
3. Lea `ai.properties.md` para obtener el `base_path`
4. El metaspecs está en: `{base_path}/{metaspecs-repo-id}/`
5. Lea los archivos `index.md` relevantes para garantizar conformidad con:
   - Arquitectura del sistema
   - Patrones de diseño
   - Restricciones técnicas
   - Convenciones del proyecto

## 🎯 Objetivo

Crear un PRD completo que servirá como fuente única de verdad para la implementación.

## 📝 Estructura del PRD

### 1. Visión General

```markdown
# [Título de la Feature]

## Contexto
[¿Por qué estamos construyendo esto? ¿Qué problema resuelve?]

## Objetivo
[¿Qué queremos lograr con esta feature?]

## Métricas de Éxito
- [Métrica 1]: [Cómo medir]
- [Métrica 2]: [Cómo medir]
```

### 2. Requisitos Funcionales

```markdown
## Requisitos Funcionales

### RF-01: [Nombre del Requisito]
**Descripción**: [Descripción detallada]
**Prioridad**: Must Have / Should Have / Could Have
**Repositorios**: [repos afectados]

### RF-02: [Nombre del Requisito]
**Descripción**: [Descripción detallada]
**Prioridad**: Must Have / Should Have / Could Have
**Repositorios**: [repos afectados]
```

### 3. Requisitos No Funcionales

```markdown
## Requisitos No Funcionales

### Performance
- [Requisito de performance]

### Seguridad
- [Requisito de seguridad]

### Accesibilidad
- [Requisito de accesibilidad]

### Escalabilidad
- [Requisito de escalabilidad]
```

### 4. Flujos de Usuario

```markdown
## Flujos de Usuario

### Flujo Principal
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

### Flujos Alternativos
**Escenario**: [Nombre del escenario]
1. [Paso 1]
2. [Paso 2]

### Manejo de Errores
**Error**: [Tipo de error]
**Comportamiento**: [Cómo debe reaccionar el sistema]
```

### 5. Especificación Técnica

```markdown
## Especificación Técnica

### Arquitectura

#### <repo-1>
- **Componentes nuevos**: [lista]
- **Componentes modificados**: [lista]
- **APIs**: [endpoints nuevos/modificados]

#### <repo-2>
- **Componentes nuevos**: [lista]
- **Componentes modificados**: [lista]
- **APIs**: [endpoints nuevos/modificados]

### Integraciones
- **Entre repos**: [cómo se comunican los repos]
- **Externas**: [APIs externas, si las hay]

### Modelo de Datos
[Describa cambios en el modelo de datos, si los hay]
```

### 6. Criterios de Aceptación

```markdown
## Criterios de Aceptación

### Funcional
- [ ] [Criterio específico y testable]
- [ ] [Criterio específico y testable]

### Técnico
- [ ] Tests unitarios con cobertura >= X%
- [ ] Tests de integración implementados
- [ ] Performance dentro de los requisitos
- [ ] Documentación actualizada

### Calidad
- [ ] Code review aprobado
- [ ] Sin regresiones
- [ ] Accesibilidad validada
```

### 7. Fuera del Alcance

```markdown
## Fuera del Alcance

Funcionalidades que NO serán implementadas en esta versión:
- [Ítem 1]
- [Ítem 2]

Justificación: [Por qué quedan para después]
```

### 8. Riesgos y Mitigaciones

```markdown
## Riesgos y Mitigaciones

### Riesgo 1: [Descripción]
- **Probabilidad**: Alta / Media / Baja
- **Impacto**: Alto / Medio / Bajo
- **Mitigación**: [Cómo mitigar]

### Riesgo 2: [Descripción]
- **Probabilidad**: Alta / Media / Baja
- **Impacto**: Alto / Medio / Bajo
- **Mitigación**: [Cómo mitigar]
```

### 9. Dependencias

```markdown
## Dependencias

### Técnicas
- [Dependencia técnica 1]
- [Dependencia técnica 2]

### De Negocio
- [Dependencia de negocio 1]
- [Dependencia de negocio 2]

### Bloqueadores
- [Bloqueador 1 y plan para resolver]
```

### 10. Plan de Pruebas

```markdown
## Plan de Pruebas

### Tests Unitarios
- [Área 1 a testear]
- [Área 2 a testear]

### Tests de Integración
- [Escenario 1]
- [Escenario 2]

### Tests Manuales
- [Escenario 1]
- [Escenario 2]
```

## 📄 Guardado del PRD

**PRIORIDAD 1: Usar MCP (Model Context Protocol)**

- Lea `ai.properties.md` del orchestrator para identificar el `task_management_system`
- Use el MCP apropiado para actualizar la issue con el PRD:
  - Añada el PRD completo como comentario en la issue
  - O adjunte como archivo (si el task manager lo soporta)
  - Actualice status/labels (ej: "spec-ready", "ready-for-dev")
- Informe al usuario: "✅ PRD añadido a la issue [ID]"

**FALLBACK: Crear archivo .md sólo si MCP falla**

Si MCP no está disponible o falla:
- Guarde en `./.sessions/<ISSUE-ID>/prd.md`
- Informe al usuario: "⚠️ PRD guardado localmente en .sessions/ (task manager no disponible)"

## 🔍 Revisión y Aprobación

Antes de finalizar:
1. Revise el PRD con stakeholders
2. Valide contra metaspecs (si están disponibles)
3. Obtenga aprobación para iniciar implementación
4. **Vía MCP**: Actualice la issue en el task manager con status "Listo para Desarrollo"
5. **Fallback**: Documente la aprobación en `./.sessions/<ISSUE-ID>/prd.md`

---

**Argumentos proporcionados**:

```
#$ARGUMENTS
```

---

## 🎯 Próximo Paso

Tras la aprobación del PRD:

```bash
/start
```

Este comando iniciará el desarrollo de la feature.