# Preparación para Pull Request

Este comando valida que todo está listo para crear Pull Requests.

## 📋 Requisitos previos

- Implementación completa (todas las tareas del `/plan` ejecutadas)
- Todos los commits realizados
- Workspace limpio y organizado

## 🎯 Objetivo

Garantizar que la implementación está completa, probada y lista para revisión antes de crear los PRs.

## ✅ Checklist de Validación

### 1. Completitud de la Implementación

```markdown
## Verificación de Completitud

- [ ] Todas las tareas del plan fueron ejecutadas
- [ ] Todos los requisitos funcionales del PRD fueron implementados
- [ ] Todos los criterios de aceptación fueron cumplidos
- [ ] Ninguna funcionalidad quedó a medias
```

### 2. Calidad del Código

Para cada repositorio modificado:

```bash
cd <repositório>

# Verificar estado
git status

# Verificar linting
npm run lint  # o comando equivalente

# Verificar formateo
npm run format:check  # o comando equivalente

# Verificar build
npm run build  # o comando equivalente
```

Checklist:
```markdown
## Calidad del Código

### <repo-1>
- [ ] Linting sin errores
- [ ] Formateo correcto
- [ ] Build sin errores
- [ ] Sin warnings críticos

### <repo-2>
- [ ] Linting sin errores
- [ ] Formateo correcto
- [ ] Build sin errores
- [ ] Sin warnings críticos
```

### 3. Pruebas

Para cada repositorio:

```bash
cd <repositório>

# Ejecutar pruebas unitarias
npm run test:unit  # o comando equivalente

# Ejecutar pruebas de integración
npm run test:integration  # o comando equivalente

# Verificar cobertura
npm run test:coverage  # o comando equivalente
```

Checklist:
```markdown
## Pruebas

### <repo-1>
- [ ] Todas las pruebas unitarias pasando
- [ ] Todas las pruebas de integración pasando
- [ ] Cobertura de pruebas adecuada (>= X%)
- [ ] Nuevas pruebas añadidas para nuevas funcionalidades

### <repo-2>
- [ ] Todas las pruebas unitarias pasando
- [ ] Todas las pruebas de integración pasando
- [ ] Cobertura de pruebas adecuada (>= X%)
- [ ] Nuevas pruebas añadidas para nuevas funcionalidades
```

### 4. Documentación

```markdown
## Documentación

- [ ] README actualizado (si es necesario)
- [ ] Comentarios de código adecuados
- [ ] Documentación de APIs actualizada (si hay cambios)
- [ ] Changelog actualizado
- [ ] Documentación técnica actualizada en las metaspecs (si aplica)
```

### 5. Commits

```markdown
## Commits

- [ ] Todos los commits tienen mensajes claros y descriptivos
- [ ] Los commits siguen el estándar del proyecto (conventional commits, etc.)
- [ ] No hay commits con mensajes genéricos ("fix", "update", etc.)
- [ ] Los commits están organizados lógicamente
- [ ] No hay commits de debug o temporales
```

### 6. Sincronización

```markdown
## Sincronización

- [ ] Las branches están actualizadas con la branch base (main/develop)
- [ ] No hay conflictos de merge
- [ ] Cambios entre repositorios están sincronizados
- [ ] Dependencias entre repos fueron probadas
```

### 7. Seguridad

```markdown
## Seguridad

- [ ] No hay credenciales ni secrets en el código
- [ ] No hay datos sensibles en logs
- [ ] Dependencias de seguridad fueron verificadas
- [ ] No hay vulnerabilidades conocidas introducidas
```

### 8. Performance

```markdown
## Performance

- [ ] No hay regresiones de performance evidentes
- [ ] Queries/operaciones costosas fueron optimizadas
- [ ] No hay memory leaks introducidos
- [ ] Requisitos de performance del PRD fueron cumplidos
```

## 🔍 Validación Cruzada

Si se modificaron múltiples repositorios:

```markdown
## Validación Cruzada

- [ ] Probé la integración entre los repositorios localmente
- [ ] APIs/contratos entre repos están consistentes
- [ ] No hay breaking changes no documentados
- [ ] El orden de deploy/merge está claro
```

## 📄 Preparación de la Descripción del PR

Cree `./.sessions/<ISSUE-ID>/pr-description.md`:

```markdown
## 🎯 Objetivo
[Breve descripción de lo que hace esta feature]

## 📝 Cambios Principales
- [Cambio 1]
- [Cambio 2]
- [Cambio 3]

## 🔗 Enlaces
- **Issue**: [ISSUE-ID]
- **PRD**: [link o ruta]
- **Plan Técnico**: [link o ruta]

## ✅ Checklist
- [x] Código implementado y probado
- [x] Pruebas unitarias añadidas/actualizadas
- [x] Pruebas de integración pasando
- [x] Documentación actualizada
- [x] Linting y formateo OK
- [x] Build sin errores

## 🧪 Cómo Testear
1. [Paso 1]
2. [Paso 2]
3. [Resultado esperado]

## 🔍 Notas para Revisores
- [Punto de atención 1]
- [Punto de atención 2]
```

## 🚨 Problemas Encontrados

Si alguna validación falla:
1. 🛑 **PARE** el proceso de creación de PR
2. 📝 **DOCUMENTE** el problema
3. 🔧 **CORRIJA** el problema
4. 🔄 **EJECUTE** `/pre-pr` nuevamente

## 📊 Informe de Validación

Cree `./.sessions/<ISSUE-ID>/pre-pr-report.md`:

```markdown
# Informe de Validación Pre-PR

**Fecha**: [fecha/hora]
**Issue**: [ISSUE-ID]

## Estado General
✅ Listo para PR / ⚠️ Pendientes / ❌ Bloqueado

## Repositorios Validados
- **<repo-1>**: ✅ OK
- **<repo-2>**: ✅ OK

## Resumen de Pruebas
- **Pruebas Unitarias**: X/X pasando
- **Pruebas de Integración**: Y/Y pasando
- **Cobertura**: Z%

## Pendientes (si las hay)
- [Pendiente 1]
- [Pendiente 2]

## Próximos Pasos
- [x] Todas las validaciones pasaron
- [ ] Ejecutar `/pr` para crear Pull Requests
```

---

**Argumentos proporcionados**:

```
#$ARGUMENTS
```

---

## 🎯 Próximo Paso

Si todas las validaciones pasaron:

```bash
/pr
```

Este comando creará los Pull Requests para todos los repositorios modificados.