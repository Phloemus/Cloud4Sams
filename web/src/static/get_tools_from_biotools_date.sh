#!/bin/bash

set -e

echo "Récupération des outils bio.tools avec topic=metagenomics..."

curl --fail --silent --show-error \
  "https://bio.tools/api/tools?topic=metagenomics&format=json" \
  > ../static/biotools.json

DATE=$(date +"%Y-%m-%d %H:%M:%S")
echo "Dernière mise à jour: $DATE" > ../static/biotools_update.txt

echo "Mise à jour terminée"