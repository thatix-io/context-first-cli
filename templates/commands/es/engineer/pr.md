# Creación de Pull Request

Este comando crea Pull Requests para todos los repositorios modificados en el workspace.

## 📋 Requisitos previos

Antes de crear PRs, asegúrate de que:
- Has ejecutado `/pre-pr` y todas las validaciones pasaron
- Todos los commits fueron realizados
- Todas las pruebas están pasando
- La documentación está actualizada

## 🎯 Proceso de Creación de PRs

### 1. Identificar Repositorios Modificados

Para cada repositorio en el workspace, verifica:
```bash
cd <repositório>
git status
git log origin/main..HEAD  # Ver commits no pushados
```

### 2. Push de las Branches

Para cada repositorio modificado:
```bash
cd <repositório>
git push origin <branch-name>
```

### 3. Crear Pull Requests

Para cada repositorio, crea un PR usando el GitHub CLI o la interfaz web:

**Usando GitHub CLI**:
```bash
cd <repositório>
gh pr create --title "[ISSUE-ID] Título de la Feature" \
  --body "$(cat ../.sessions/<ISSUE-ID>/pr-description.md)" \
  --base main
```

**Plantilla de Descripción del PR**:

```markdown
## 🎯 Objetivo

[Breve descripción de lo que hace este PR]

## 📝 Cambios

### Repositorio: <nome-do-repo>

- [Cambio 1]
- [Cambio 2]
- [Cambio 3]

## 🔗 Relaciones

- **Issue**: <ISSUE-ID>
- **PRs Relacionados**: 
  - <repo-1>#<PR-number>
  - <repo-2>#<PR-number>

## ✅ Checklist

- [ ] Código implementado y probado
- [ ] Pruebas unitarias añadidas/actualizadas
- [ ] Pruebas de integración pasando
- [ ] Documentación actualizada
- [ ] Sin breaking changes (o documentados)
- [ ] Revisado por pares (después de crear el PR)

## 🧪 Cómo Testear

1. [Paso 1]
2. [Paso 2]
3. [Resultado esperado]

## 📸 Screenshots/Demos

[Si aplica, añade capturas de pantalla o enlaces a demos]

## 🔍 Notas para Revisores

- [Punto de atención 1]
- [Punto de atención 2]
```

### 4. Vincular PRs

Si hay múltiples PRs (uno por repositorio):
- Añade enlaces cruzados entre los PRs
- Documenta el orden de merge recomendado
- Indica dependencias entre PRs

### 5. Actualizar Issue en el Task Manager

Si el task manager está configurado:
- Mueve la issue a "En Revisión" o "PR Abierto"
- Añade enlaces de los PRs en la issue
- Añade comentario con resumen de los cambios

### 6. Documentación de la Sesión

Actualiza `./.sessions/<ISSUE-ID>/pr.md`:

```markdown
# [Título de la Feature] - Pull Requests

## PRs Creados

### <repo-1>
- **Link**: <URL del PR>
- **Estado**: Abierto
- **Commits**: X commits

### <repo-2>
- **Link**: <URL del PR>
- **Estado**: Abierto
- **Commits**: Y commits

## Orden de Merge Recomendado

1. <repo-1> - [Justificación]
2. <repo-2> - [Justificación]

## Notas para Merge

- [Nota importante 1]
- [Nota importante 2]
```

## 🔍 Checklist Final

Antes de solicitar revisión:
- [ ] Todos los PRs creados
- [ ] Descripciones completas y claras
- [ ] PRs vinculados entre sí
- [ ] Issue actualizada en el task manager
- [ ] Pruebas pasando en CI/CD
- [ ] Documentación de la sesión completa

## 📢 Comunicación

Notifica al equipo sobre los PRs:
- Menciona revisores relevantes
- Destaca cambios críticos o breaking changes
- Indica urgencia si aplica

---

**Argumentos proporcionados**:

```
#$ARGUMENTS
```

---

## 🎯 Próximos Pasos

1. Esperar revisión de los PRs
2. Responder comentarios y hacer ajustes
3. Tras la aprobación, hacer merge en el orden recomendado
4. Ejecutar `context-cli feature:end <ISSUE-ID>` para limpiar el workspace