#!/usr/bin/env bash

set -e

# Répertoire courant absolu
CURRENT_DIR="$(pwd)"

echo
echo "Répertoire courant :"
echo "  $CURRENT_DIR"
echo

read -r -p "Les catalogues seront-ils installés dans ce répertoire ? [O/n] : " answer

if [[ "$answer" =~ ^[Nn]$ ]]; then
    read -r -p "Entrez le chemin du répertoire de destination : " DEST_DIR

    # Expansion de ~ et conversion en chemin absolu
    DEST_DIR="${DEST_DIR/#\~/$HOME}"

    if [[ ! -d "$DEST_DIR" ]]; then
        echo
        echo "Le répertoire n'existe pas : $DEST_DIR"
        exit 1
    fi

    DEST_DIR="$(cd "$DEST_DIR" && pwd)"
else
    DEST_DIR="$CURRENT_DIR"
fi

echo
echo "Les catalogues seront installés dans :"
echo "  $DEST_DIR"
echo

read -r -p "Confirmer le téléchargement ? [O/n] : " confirm

if [[ "$confirm" =~ ^[Nn]$ ]]; then
    echo "Téléchargement annulé."
    exit 0
fi

CATALOGUES=(
    "fc_1_3_gut"
    "gg_13_6_caecal"
    "clf_1_0_gut"
    "hs_10_4_gut"
    "hs_8_4_oral"
    "hs_2_9_skin"
    "mm_5_0_gut"
    "oc_5_7_gut"
    "rn_5_9_gut"
    "ssc_9_3_gut"
)

echo
echo "Début du téléchargement..."
echo

for catalogue in "${CATALOGUES[@]}"; do
    echo "========================================"
    echo "Catalogue : $catalogue"
    echo "Destination : $DEST_DIR"
    echo "========================================"

    meteor download \
        -i "$catalogue" \
        -o "$DEST_DIR" \
        -c

    echo
done

echo "========================================"
echo "Téléchargement terminé."
echo "Les catalogues sont disponibles dans :"
echo "  $DEST_DIR"
echo "========================================"
