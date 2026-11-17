
import argparse
import csv
import json
import subprocess
from pathlib import Path

import yaml


REPO_URL = "https://github.com/research-software-ecosystem/content.git"
REPO_DIR = Path.home() / ".rsec-content"


def prepare_repository():
    """Clone le dépôt (ou le met à jour) une seule fois."""
    if not REPO_DIR.exists():
        subprocess.run(
            [
                "git", "clone",
                "--depth", "1",
                "--filter=blob:none",
                "--sparse",
                REPO_URL,
                str(REPO_DIR),
            ],
            check=True,
        )
        subprocess.run(
            ["git", "-C", str(REPO_DIR), "sparse-checkout", "set", "data"],
            check=True,
        )
    else:
        subprocess.run(
            ["git", "-C", str(REPO_DIR), "pull", "--ff-only"],
            check=True,
        )

    return REPO_DIR / "data"


def collect_biotools_ids(obj):
    """Récupère récursivement tous les biotoolsID du JSON."""
    ids = set()

    if isinstance(obj, dict):
        value = obj.get("biotoolsID")
        if isinstance(value, str) and value.strip():
            ids.add(value.strip())

        for child in obj.values():
            ids.update(collect_biotools_ids(child))

    elif isinstance(obj, list):
        for child in obj:
            ids.update(collect_biotools_ids(child))

    return ids


def check_id(biotools_id, data_dir):
    """Vérifie si package.name est exactement égal au biotoolsID."""
    yaml_file = (
        data_dir
        / biotools_id
        / f"bioconda_{biotools_id}.yaml"
    )

    if not yaml_file.is_file():
        return None, "FILE_NOT_FOUND"

    try:
        with yaml_file.open(encoding="utf-8") as f:
            metadata = yaml.safe_load(f) or {}

        package_name = (
            metadata.get("package", {}).get("name")
            if isinstance(metadata, dict)
            else None
        )

        if package_name is None:
            return None, "PACKAGE_NAME_MISSING"

        if package_name == biotools_id:
            return package_name, "MATCH"

        return package_name, "DIFFERENT"

    except (yaml.YAMLError, OSError) as e:
        return None, f"YAML_ERROR: {e}"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("input_json", help="Fichier JSON contenant les biotoolsID")
    parser.add_argument(
        "--output",
        default="bioconda_name_matches.csv",
        help="Fichier CSV de sortie",
    )
    args = parser.parse_args()

    with open(args.input_json, encoding="utf-8") as f:
        data = json.load(f)

    biotools_ids = sorted(collect_biotools_ids(data))
    print(f"Nombre de biotoolsID uniques : {len(biotools_ids)}")

    data_dir = prepare_repository()

    results = []
    matches = []

    for i, biotools_id in enumerate(biotools_ids, start=1):
        package_name, status = check_id(biotools_id, data_dir)

        results.append({
            "biotoolsID": biotools_id,
            "package.name": package_name or "",
            "status": status,
        })

        if status == "MATCH":
            matches.append(biotools_id)

        if i % 100 == 0:
            print(f"Vérifiés : {i}/{len(biotools_ids)}")

    # CSV contenant tous les résultats
    with open(args.output, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["biotoolsID", "package.name", "status"],
        )
        writer.writeheader()
        writer.writerows(results)

    print("\n========== RÉSULTATS ==========")
    print(f"Nombre total de biotoolsID : {len(biotools_ids)}")
    print(f"Correspondances exactes : {len(matches)}")
    print(f"Fichiers Bioconda absents : "
          f"{sum(r['status'] == 'FILE_NOT_FOUND' for r in results)}")
    print(f"Noms différents : "
          f"{sum(r['status'] == 'DIFFERENT' for r in results)}")

    print("\nbiotoolsID avec package.name identique :")
    for biotools_id in matches:
        print(f"  - {biotools_id}")

    print(f"\nRésultats détaillés enregistrés dans : {args.output}")


if __name__ == "__main__":
    main()
