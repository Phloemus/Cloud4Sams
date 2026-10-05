#!/bin/bash
# C:\Users\vashokan\taxprofilingcatalogue_2\web\src\static\get_tools_from_biotools.sh

echo "Récupération des outils bio.tools avec topic=metagenomics..."
curl -s "https://bio.tools/api/tools?topic=metagenomics&format=json" > ../static/biotools.json

# Ajout de la date de mise à jour
DATE=$(date +"%Y-%m-%d %H:%M:%S")
echo "Dernière mise à jour: $DATE" >> ../static/biotools_update.txt

echo "Mise à jour terminée"