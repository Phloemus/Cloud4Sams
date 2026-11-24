
import argparse
import json
import csv
import subprocess
from pathlib import Path
from collections import Counter

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_DIR = Path(__file__).resolve().parents[3].parent / "bioconda-recipes"
BiocondaREPO_URL = "https://github.com/bioconda/bioconda-recipes.git"
DEFAULT_OUTPUT = SCRIPT_DIR / "bioconda_repository_audit.csv"


def run_git(command_args):
    """Execute a git command and return its output."""
    result = subprocess.run(
        ["git", "-C", str(REPO_DIR)] + command_args,
        capture_output=True,
        text=True,
        check=True
    )
    return result.stdout


def get_tools(data):
    if isinstance(data, dict):
        tools = data.get("list") if isinstance(data.get("list"), list) else [data]
    elif isinstance(data, list):
        tools = data
    else:
        raise ValueError("Unexpected JSON structure: expected a dictionary or a list")

    normalized_tools = []
    for index, tool in enumerate(tools):
        if isinstance(tool, dict):
            normalized_tools.append(tool)
        elif isinstance(tool, list):
            normalized_tools.extend(get_tools(tool))
        else:
            raise ValueError(
                f"Unexpected JSON entry at index {index}: "
                f"expected a dictionary, got {type(tool).__name__}"
            )

    return normalized_tools


def main():
    parser = argparse.ArgumentParser(
        description="Compare bio.tools IDs with Bioconda recipe names."
    )
    parser.add_argument(
        "biotools_json",
        type=Path,
        help="Path to the bio.tools JSON file"
    )
    args = parser.parse_args()
    biotools_json = args.biotools_json.expanduser()

    if not biotools_json.is_file():
        parser.error(f"JSON file not found: {biotools_json}")

    output_value = input(
        f"Output CSV path [{DEFAULT_OUTPUT}]: "
    ).strip()
    output_path = Path(output_value).expanduser() if output_value else DEFAULT_OUTPUT

    # 1. Clone the repository if necessary
    if not REPO_DIR.exists():
        print(f"Cloning Bioconda repository to {REPO_DIR}...")

        subprocess.run(
            [
                "git", "clone",
                "--depth", "1",
                "--filter=blob:none",
                "--no-checkout",
                "--branch", "master",
                BiocondaREPO_URL,
                str(REPO_DIR)
            ],
            check=True
        )
    else:
        print("Updating Bioconda repository...")
        run_git(["fetch", "--depth", "1", "origin", "master"])

    # 2. Retrieve recipe directory names
    print("Retrieving Bioconda package names...")
    output = run_git([
        "ls-tree",
        "-d",
        "--name-only",
        "origin/master:recipes"
    ])
    bioconda_packages = {
        package.casefold(): package
        for package in output.splitlines()
    }
    print(f"Bioconda packages found: {len(bioconda_packages)}")

    # 3. Read bio.tools JSON
    data = json.loads(biotools_json.read_text(encoding="utf-8"))

    tools = get_tools(data)

    # 4. Compare bio.tools IDs with Bioconda package names
    results = []
    seen_ids = set()

    for tool in tools:
        biotools_id = tool.get("biotoolsID", "")

        if not isinstance(biotools_id, str):
            continue

        biotools_id = biotools_id.strip()
        if not biotools_id:
            continue

        normalized_id = biotools_id.casefold()
        if normalized_id in seen_ids:
            continue

        seen_ids.add(normalized_id)
        matched_package = bioconda_packages.get(normalized_id)
        status = "FOUND" if matched_package else "NOT_FOUND"
        results.append({
            "biotoolsID": biotools_id,
            "bioconda_package": matched_package or "",
            "status": status
        })

    # 5. Generate CSV report
    fieldnames = ["biotoolsID", "bioconda_package", "status"]
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)

    # 6. Summary
    summary = Counter(r["status"] for r in results)
    print("\n========== BIOCONDA AUDIT ==========")
    print(f"bio.tools IDs analysed: {len(results)}")
    print(f"Bioconda packages: {len(bioconda_packages)}")
    print(f"FOUND: {summary['FOUND']}")
    print(f"NOT_FOUND: {summary['NOT_FOUND']}")
    print(f"\nReport generated: {output_path}")


if __name__ == "__main__":
    main()
