#!/bin/bash

# Script de Publicação do context-first-cli no NPM
# Autor: Thatix
# Descrição: Automatiza o processo de publicação do pacote no NPM

set -e  # Exit on error

echo "🚀 Context-First CLI - Publicação no NPM"
echo "========================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se está na branch main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${RED}❌ Erro: Você deve estar na branch 'main' para publicar${NC}"
    echo -e "${YELLOW}   Branch atual: $CURRENT_BRANCH${NC}"
    exit 1
fi

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}❌ Erro: Há mudanças não commitadas${NC}"
    echo -e "${YELLOW}   Por favor, commit ou stash suas mudanças antes de publicar${NC}"
    git status --short
    exit 1
fi

# Verificar se está autenticado no NPM
echo -e "${BLUE}🔐 Verificando autenticação no NPM...${NC}"
if ! npm whoami &> /dev/null; then
    echo -e "${RED}❌ Erro: Você não está autenticado no NPM${NC}"
    echo -e "${YELLOW}   Execute: npm login${NC}"
    exit 1
fi

NPM_USER=$(npm whoami)
echo -e "${GREEN}✓ Autenticado como: $NPM_USER${NC}"
echo ""

# Obter versão atual
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}📦 Versão atual: $CURRENT_VERSION${NC}"
echo ""

# Perguntar qual tipo de versão incrementar
echo -e "${YELLOW}Qual tipo de versão você quer publicar?${NC}"
echo "  1) patch (bug fixes)        - $CURRENT_VERSION -> $(npm version patch --no-git-tag-version --dry-run | tail -n 1)"
echo "  2) minor (new features)     - $CURRENT_VERSION -> $(npm version minor --no-git-tag-version --dry-run | tail -n 1)"
echo "  3) major (breaking changes) - $CURRENT_VERSION -> $(npm version major --no-git-tag-version --dry-run | tail -n 1)"
echo "  4) Manter versão atual"
echo ""
read -p "Escolha uma opção (1-4): " VERSION_CHOICE

case $VERSION_CHOICE in
    1)
        VERSION_TYPE="patch"
        ;;
    2)
        VERSION_TYPE="minor"
        ;;
    3)
        VERSION_TYPE="major"
        ;;
    4)
        VERSION_TYPE=""
        ;;
    *)
        echo -e "${RED}❌ Opção inválida${NC}"
        exit 1
        ;;
esac

# Incrementar versão se necessário
if [ -n "$VERSION_TYPE" ]; then
    echo -e "${BLUE}📝 Incrementando versão ($VERSION_TYPE)...${NC}"
    NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version)
    echo -e "${GREEN}✓ Nova versão: $NEW_VERSION${NC}"
    echo ""
else
    NEW_VERSION="v$CURRENT_VERSION"
fi

# Executar testes (se houver)
echo -e "${BLUE}🧪 Executando testes...${NC}"
npm test || echo -e "${YELLOW}⚠️  Nenhum teste configurado${NC}"
echo ""

# Build do projeto
echo -e "${BLUE}🔨 Compilando TypeScript...${NC}"
npm run build
echo -e "${GREEN}✓ Build concluído${NC}"
echo ""

# Confirmação final
echo -e "${YELLOW}⚠️  Você está prestes a publicar:${NC}"
echo -e "   Pacote: ${GREEN}@thatix/context-first-cli${NC}"
echo -e "   Versão: ${GREEN}$NEW_VERSION${NC}"
echo -e "   Usuário NPM: ${GREEN}$NPM_USER${NC}"
echo ""
read -p "Confirma a publicação? (s/N): " CONFIRM

if [ "$CONFIRM" != "s" ] && [ "$CONFIRM" != "S" ]; then
    echo -e "${YELLOW}✋ Publicação cancelada${NC}"
    
    # Reverter mudança de versão se foi feita
    if [ -n "$VERSION_TYPE" ]; then
        git checkout package.json
        echo -e "${BLUE}ℹ️  Versão revertida para $CURRENT_VERSION${NC}"
    fi
    exit 0
fi

# Publicar no NPM
echo ""
echo -e "${BLUE}📤 Publicando no NPM...${NC}"
npm publish --access public

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Publicação concluída com sucesso!${NC}"
    echo ""
    
    # Commit e tag da nova versão
    if [ -n "$VERSION_TYPE" ]; then
        echo -e "${BLUE}📝 Criando commit e tag da versão...${NC}"
        git add package.json
        git commit -m "chore: bump version to $NEW_VERSION"
        git tag "$NEW_VERSION"
        
        echo -e "${BLUE}📤 Fazendo push das mudanças...${NC}"
        git push origin main
        git push origin "$NEW_VERSION"
        
        echo -e "${GREEN}✓ Commit e tag criados${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}🎉 Pacote publicado com sucesso!${NC}"
    echo -e "${BLUE}📦 Instalação:${NC}"
    echo -e "   ${GREEN}npm install -g @thatix/context-first-cli${NC}"
    echo ""
    echo -e "${BLUE}🔗 Links úteis:${NC}"
    echo -e "   NPM: ${GREEN}https://www.npmjs.com/package/@thatix/context-first-cli${NC}"
    echo -e "   GitHub: ${GREEN}https://github.com/thatix-io/context-first-cli${NC}"
else
    echo -e "${RED}❌ Erro na publicação${NC}"
    
    # Reverter mudança de versão se foi feita
    if [ -n "$VERSION_TYPE" ]; then
        git checkout package.json
        echo -e "${BLUE}ℹ️  Versão revertida para $CURRENT_VERSION${NC}"
    fi
    exit 1
fi
