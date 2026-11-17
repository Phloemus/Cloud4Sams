
import json
import csv
from pathlib import Path

DATA_DIR = Path("content/data")
OUTPUT = "bioconda_naming_audit.csv"

results = []

for folder in sorted(DATA_DIR.iterdir()):
    if not folder.is_dir():
        continue

    # Retrieve bio.tools ID
    biotools_id = ""

    for json_file in folder.glob("*.biotools.json"):
        try:
            data = json.loads(json_file.read_text(encoding="utf-8"))
            biotools_id = data.get("biotoolsID", "")
            if biotools_id:
                break
        except (json.JSONDecodeError, OSError):
            pass

    # Find all YAML files mentioning Bioconda in their name
    candidates = sorted(
        p.name for p in folder.iterdir()
        if p.is_file()
        and "bioconda" in p.name.lower()
        and p.suffix.lower() in (".yaml", ".yml")
    )

    expected = f"bioconda_{folder.name}.yaml"

    if expected in candidates:
        status = "STANDARD"
    elif len(candidates) == 0:
        status = "MISSING"
    elif len(candidates) > 1:
        status = "MULTIPLE"
    else:
        status = "NON_STANDARD"

    results.append({
        "folder": folder.name,
        "biotoolsID": biotools_id,
        "expected_filename": expected,
        "actual_filenames": ";".join(candidates),
        "status": status
    })

with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=results[0].keys())
    writer.writeheader()
    writer.writerows(results)

# Summary
from collections import Counter

summary = Counter(r["status"] for r in results)

print(f"Folders analysed: {len(results)}")
for status, count in summary.items():
    print(f"{status}: {count}")

print(f"\nReport generated: {OUTPUT}")
