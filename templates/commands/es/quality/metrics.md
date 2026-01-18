# Métricas de Calidad

Este comando recopila y analiza métricas de calidad del código y del proceso de desarrollo.

## 🎯 Objetivo

Medir y documentar la calidad de la implementación mediante métricas objetivas:
- Cobertura de pruebas
- Complejidad del código
- Deuda técnica
- Rendimiento
- Cumplimiento con estándares

## 📋 Requisitos previos

- Implementación finalizada (después de `/work`)
- Pruebas implementadas
- Build funcionando

## 📊 Métricas a Recopilar

### 1. Cobertura de Pruebas

Para cada repositorio modificado:

```bash
cd <repositório>

# Ejecutar pruebas con cobertura
npm run test:coverage  # ou comando equivalente

# Capturar resultados
```

Documente:
```markdown
## Cobertura de Pruebas

### <repo-1>
- **Cobertura Total**: X%
- **Statements**: X%
- **Branches**: X%
- **Functions**: X%
- **Lines**: X%
- **Archivos no cubiertos**: [lista]

### <repo-2>
[Mismo formato]
```

### 2. Complejidad del Código

Analice la complejidad ciclomática de los archivos modificados:

```markdown
## Complejidad del Código

### Archivos con Alta Complejidad
- **archivo1.ts**: Complejidad 15 (recomendado: < 10)
- **archivo2.ts**: Complejidad 12

### Recomendaciones
- [Sugerencia de refactorización 1]
- [Sugerencia de refactorización 2]
```

### 3. Calidad del Código

```bash
# Ejecutar linting
npm run lint

# Verificar formato
npm run format:check

# Análisis estático (si está disponible)
npm run analyze
```

Documente:
```markdown
## Calidad del Código

### Linting
- **Errores**: 0
- **Warnings**: X
- **Warnings Justificados**: [lista con justificaciones]

### Formato
- **Estado**: ✅ Conforme / ⚠️ Ajustes necesarios

### Análisis Estático
- **Problemas Críticos**: 0
- **Problemas Medios**: X
- **Problemas Bajos**: Y
```

### 4. Rendimiento

Si aplica, mida rendimiento:

```markdown
## Rendimiento

### Benchmarks
- **Operación X**: Yms (baseline: Zms)
- **Operación Y**: Yms (baseline: Zms)

### Optimizaciones Aplicadas
- [Optimización 1 e impacto]
- [Optimización 2 e impacto]

### Cuellos de Botella Identificados
- [Cuello de botella 1 y plan de mitigación]
```

### 5. Tamaño e Impacto

```markdown
## Tamaño e Impacto

### Líneas de Código
- **Añadidas**: +X líneas
- **Eliminadas**: -Y líneas
- **Modificadas**: Z líneas

### Archivos
- **Nuevos**: X archivos
- **Modificados**: Y archivos
- **Eliminados**: Z archivos

### Dependencias
- **Nuevas dependencias**: [lista]
- **Tamaño del bundle**: +X KB
```

### 6. Deuda Técnica

Identifique deuda técnica introducida o resuelta:

```markdown
## Deuda Técnica

### Deuda Introducida
- **Ítem 1**: [Descripción y justificación]
  - Severidad: Alta / Media / Baja
  - Plan de resolución: [cuándo y cómo resolver]

### Deuda Resuelta
- **Ítem 1**: [Qué fue resuelto]
  - Impacto: [mejora obtenida]
```

## 📄 Informe de Métricas

Cree `./.sessions/<ISSUE-ID>/metrics.md`:

```markdown
# Informe de Métricas - [ISSUE-ID]

**Fecha**: [fecha/hora]
**Repositorios**: [lista]

## Resumen Ejecutivo

- **Cobertura de Pruebas**: X% (meta: Y%)
- **Calidad del Código**: ✅ / ⚠️ / ❌
- **Rendimiento**: ✅ / ⚠️ / ❌
- **Deuda Técnica**: Baja / Media / Alta

## Métricas Detalladas

[Incluir todas las secciones anteriores]

## Comparación con Baseline

| Métrica | Antes | Después | Variación |
|---------|-------|---------|-----------|
| Cobertura | X% | Y% | +Z% |
| Complejidad Media | X | Y | +Z |
| Tamaño del Bundle | X KB | Y KB | +Z KB |

## Acciones Recomendadas

1. [Acción 1 - prioridad alta]
2. [Acción 2 - prioridad media]
3. [Acción 3 - prioridad baja]

## Aprobación para Merge

- [ ] Cobertura de pruebas >= meta
- [ ] Sin problemas críticos de calidad
- [ ] Rendimiento dentro de los requisitos
- [ ] Deuda técnica documentada y aprobada
```

## 🎯 Metas de Calidad

Si el proyecto tiene metas definidas en las metaspecs, valide:

```markdown
## Validación contra Metas

### Metas del Proyecto
- **Cobertura mínima**: 80%
- **Complejidad máxima**: 10
- **Rendimiento**: < 100ms

### Estado
- Cobertura: ✅ 85% (meta: 80%)
- Complejidad: ⚠️ 12 (meta: 10) - Justificado
- Rendimiento: ✅ 85ms (meta: 100ms)
```

## 🚨 Alertas

Si alguna métrica está fuera de lo aceptable:
1. 🛑 **DOCUMENTE** el problema
2. 💬 **ALERTE** al usuario
3. 🔧 **PROPONGA** acciones correctivas
4. ⏸️ **CONSIDERE** bloquear el merge hasta resolución

---

**Argumentos proporcionados**:

```
#$ARGUMENTS
```

---

## 🎯 Resultado

Tras ejecutar este comando, tendrá:
- Informe completo de métricas
- Comparación con baseline y metas
- Identificación de problemas de calidad
- Recomendaciones de acciones
- Base objetiva para aprobación de merge