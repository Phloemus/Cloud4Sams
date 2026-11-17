
#!/usr/bin/env python3

import argparse
import csv
import json
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

import yaml


GITHUB_API = (
    "https://api.github.com/repos/"
    "research-software-ecosystem/content/contents/data"
)


def get_biotools_ids(json_file):
    """Recursively extract unique biotoolsID values from a JSON file."""

    with open(json_file, encoding="utf-8") as stream:
        data = json.load(stream)

    ids = set()

    def walk(obj):
        if isinstance(obj, dict):
            value = obj.get("biotoolsID")

            if isinstance(value, str) and value.strip():
                ids.add(value.strip())

            for child in obj.values():
                walk(child)

        elif isinstance(obj, list):
            for child in obj:
                walk(child)

    walk(data)

    return sorted(ids)


def github_request(url):
    """Retrieve JSON or text content from GitHub."""

    request = Request(
        url,
        headers={
            "Accept": "application/vnd.github+json",
            "User-Agent": "Bioconda-package-checker"
        }
    )

    with urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8")


def get_bioconda_files(biotools_id):
    """Find all bioconda*.yaml files for a bio.tools ID."""

    url = (
        f"{GITHUB_API}/{quote(biotools_id, safe='')}"
        "?ref=master&per_page=1000"
    )

    try:
        content = github_request(url)
        files = json.loads(content)

    except HTTPError as error:
        if error.code == 404:
            return []
        raise

    return [
        item
        for item in files
        if item.get("type") == "file"
        and item.get("name", "").startswith("bioconda")
        and item.get("name", "").endswith(".yaml")
        and item.get("download_url")
    ]


def get_package_name(yaml_url):
    """Extract package.name from a Bioconda YAML file."""

    content = github_request(yaml_url)
    metadata = yaml.safe_load(content)

    if not isinstance(metadata, dict):
        return None

    package = metadata.get("package")

    if not isinstance(package, dict):
        return None

    return package.get("name")


def check_biotools_id(biotools_id):
    """Check whether a Bioconda package matches the bio.tools ID."""

    result = {
        "biotoolsID": biotools_id,
        "package_name": "",
        "bioconda_file": "",
        "bioconda_match": "NO",
        "status": "NOT_FOUND"
    }

    try:
        files = get_bioconda_files(biotools_id)

        if not files:
            return result

        result["status"] = "PARSE_ERROR"

        for item in files:
            try:
                package_name = get_package_name(item["download_url"])

                if not package_name:
                    continue

                result["package_name"] = package_name
                result["bioconda_file"] = item["name"]

                if package_name == biotools_id:
                    result["bioconda_match"] = "YES"
                    result["status"] = "MATCH"
                    return result

                result["status"] = "DIFFERENT"

            except (HTTPError, URLError, ValueError, yaml.YAMLError):
                continue

        return result

    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as error:
        result["status"] = f"API_ERROR: {error}"
        return result


def main():

    parser = argparse.ArgumentParser(
        description=(
            "Check whether bio.tools IDs have matching "
            "Bioconda package names."
        )
    )

    parser.add_argument(
        "json_file",
        help="JSON file containing bio.tools entries"
    )

    parser.add_argument(
        "-o", "--output",
        default="bioconda_check.csv",
        help="Output CSV file (default: bioconda_check.csv)"
    )

    args = parser.parse_args()

    biotools_ids = get_biotools_ids(args.json_file)

    if not biotools_ids:
        sys.exit("Error: no biotoolsID found in JSON file.")

    print(f"Found {len(biotools_ids)} unique bio.tools IDs.")

    results = []

    for index, biotools_id in enumerate(biotools_ids, start=1):

        print(
            f"[{index}/{len(biotools_ids)}] Checking {biotools_id}...",
            file=sys.stderr
        )

        result = check_biotools_id(biotools_id)
        results.append(result)

    fieldnames = [
        "biotoolsID",
        "package_name",
        "bioconda_file",
        "bioconda_match",
        "status"
    ]

    with open(args.output, "w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)

    matches = sum(
        result["bioconda_match"] == "YES"
        for result in results
    )

    print("\nResults:")
    print(f"  Total bio.tools IDs: {len(results)}")
    print(f"  Matching Bioconda packages: {matches}")
    print(f"  No matching package: {len(results) - matches}")
    print(f"\nCSV report generated: {args.output}")


if __name__ == "__main__":
    main()
