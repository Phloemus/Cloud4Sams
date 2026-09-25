#!/usr/bin/env bash

set -e

# ============================================================
# Configuration
# ============================================================

BRANCH="dev-vivek"
REPO_URL="git@github.com:Phloemus/Cloud4Sams.git"

# Nom de la clé SSH
SSH_KEY="$HOME/.ssh/id_ed25519"

# ============================================================
# Couleurs
# ============================================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "=========================================="
echo "        GitHub SSH + Repository Setup"
echo "=========================================="
echo ""

# ============================================================
# Vérification des commandes nécessaires
# ============================================================

if ! command -v ssh-keygen >/dev/null 2>&1; then
    echo -e "${RED}Erreur : ssh-keygen n'est pas installé.${NC}"
    exit 1
fi

if ! command -v git >/dev/null 2>&1; then
    echo -e "${RED}Erreur : git n'est pas installé.${NC}"
    exit 1
fi

# ============================================================
# Génération de la clé SSH
# ============================================================

echo "Génération de la clé SSH Ed25519..."

if [ -f "$SSH_KEY" ]; then
    echo -e "${YELLOW}Une clé existe déjà : $SSH_KEY${NC}"
    echo ""
    read -r -p "Veux-tu utiliser cette clé existante ? (oui/non) : " USE_EXISTING

    if [[ "$USE_EXISTING" != "oui" ]]; then
        echo "Arrêt du script."
        exit 0
    fi
else
    ssh-keygen -t ed25519 \
        -C "github-$(whoami)@$(hostname)" \
        -f "$SSH_KEY"

    echo ""
    echo -e "${GREEN}Clé SSH générée avec succès.${NC}"
fi

# ============================================================
# Affichage de la clé publique
# ============================================================

echo ""
echo "=========================================="
echo "           VOTRE CLÉ PUBLIQUE"
echo "=========================================="
echo ""

cat "${SSH_KEY}.pub"

echo ""
echo "=========================================="
echo ""

echo "Copie la clé ci-dessus et ajoute-la dans :"
echo ""
echo "GitHub → Settings → SSH and GPG keys → New SSH key"
echo ""
echo "Puis reviens ici."
echo ""

read -r -p "La clé publique est-elle bien collée dans GitHub ? (oui/non) : " KEY_ADDED

if [[ "$KEY_ADDED" != "oui" ]]; then
    echo ""
    echo "Le script est arrêté."
    echo "Tu peux relancer le script lorsque la clé sera ajoutée."
    exit 0
fi

# ============================================================
# Configuration de la clé pour SSH
# ============================================================

echo ""
echo "Configuration de la clé SSH..."

mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"

eval "$(ssh-agent -s)" >/dev/null

ssh-add "$SSH_KEY"

echo -e "${GREEN}Clé ajoutée à ssh-agent.${NC}"

# ============================================================
# Test de connexion GitHub
# ============================================================

echo ""
echo "Test de connexion à GitHub..."

if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo -e "${GREEN}Connexion GitHub réussie.${NC}"
else
    echo -e "${YELLOW}GitHub n'a pas retourné le message attendu.${NC}"
    echo "La connexion SSH peut néanmoins être correcte."
    echo ""

    read -r -p "Veux-tu continuer ? (oui/non) : " CONTINUE

    if [[ "$CONTINUE" != "oui" ]]; then
        exit 1
    fi
fi

# ============================================================
# Clone du repository
# ============================================================

echo ""
echo "=========================================="
echo "             CLONAGE DU REPO"
echo "=========================================="
echo ""

echo "Repository : $REPO_URL"
echo "Branche    : $BRANCH"
echo ""

git clone -b "$BRANCH" "$REPO_URL"

# Récupérer le nom du dossier créé par git clone
REPO_DIR=$(basename "$REPO_URL" .git)

echo ""
echo -e "${GREEN}Repository cloné avec succès.${NC}"
echo "Répertoire : $REPO_DIR"

# ============================================================
# Vérification du répertoire web
# ============================================================

WEB_DIR="$REPO_DIR/web"

if [ ! -d "$WEB_DIR" ]; then
    echo ""
    echo -e "${RED}Erreur : le répertoire $WEB_DIR n'existe pas.${NC}"
    exit 1
fi

cd "$WEB_DIR"

echo ""
echo "Répertoire courant : $(pwd)"

# ============================================================
# Installation de NVM
# ============================================================

echo ""
echo "=========================================="
echo "              INSTALLATION NVM"
echo "=========================================="
echo ""

if [ ! -d "$HOME/.nvm" ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
else
    echo "NVM est déjà installé."
fi

# Charger NVM dans le shell courant
export NVM_DIR="$HOME/.nvm"

if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
else
    echo -e "${RED}Erreur : impossible de charger NVM.${NC}"
    exit 1
fi

# ============================================================
# Installation de Node.js 22
# ============================================================

echo ""
echo "=========================================="
echo "          INSTALLATION NODE.JS 22"
echo "=========================================="
echo ""

nvm install 22
nvm use 22

# ============================================================
# Vérification Node / npm
# ============================================================

echo ""
echo "Version de Node.js :"
node -v

echo ""

echo "Version de npm :"
npm -v

# ============================================================
# Installation des dépendances
# ============================================================

echo ""
echo "=========================================="
echo "           NPM INSTALL"
echo "=========================================="
echo ""

npm install

echo ""
echo "=========================================="
echo -e "${GREEN}       INSTALLATION TERMINÉE${NC}"
echo "=========================================="
echo ""
echo "Repository : $REPO_DIR"
echo "Branche    : $BRANCH"
echo "Web        : $(pwd)"
echo ""