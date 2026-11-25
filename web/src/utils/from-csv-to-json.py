
import csv
import json
from sys import argv


# ==============================
# DEFAULT CONFIGURATION
# ==============================

DEFAULT_CSV_FILE = "~/Cloud4Sams/web/src/utils/bioconda_repository_audit.csv"
DEFAULT_JSON_FILE = "~/Cloud4Sams/web/src/static/bioconda_packages.json"

DEFAULT_COLS_TO_KEEP = [
    "biotoolsID",
    "bioconda_package"
]


# ==============================
# CONVERSION FUNCTION
# ==============================

def csv_to_json(csv_file, json_file, cols_to_keep=None):

    data = []

    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            if cols_to_keep:
                row = {
                    key: row[key]
                    for key in cols_to_keep
                    if key in row
                }

            data.append(row)

    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    print(f"\nConversion completed: {csv_file} -> {json_file}")


# ==============================
# INTERACTIVE CONFIGURATION
# ==============================

def ask_custom_configuration():

    print("\n--- Custom configuration ---")

    csv_file = input(
        f"CSV file [{DEFAULT_CSV_FILE}]: "
    ).strip() or DEFAULT_CSV_FILE

    json_file = input(
        f"JSON file [{DEFAULT_JSON_FILE}]: "
    ).strip() or DEFAULT_JSON_FILE

    cols_input = input(
        "Columns to keep (comma-separated, leave empty for all columns): "
    ).strip()

    cols_to_keep = (
        [col.strip() for col in cols_input.split(",")]
        if cols_input
        else None
    )

    return csv_file, json_file, cols_to_keep


# ==============================
# MAIN
# ==============================

def main():

    # Arguments provided through terminal
    if len(argv) > 1:

        csv_file = argv[1]
        json_file = argv[2] if len(argv) > 2 else DEFAULT_JSON_FILE

        cols_to_keep = argv[3:] if len(argv) > 3 else DEFAULT_COLS_TO_KEEP

    else:

        # Default configuration
        csv_file = DEFAULT_CSV_FILE
        json_file = DEFAULT_JSON_FILE
        cols_to_keep = DEFAULT_COLS_TO_KEEP

    # Display configuration
    print("\n===================================")
    print("         CSV TO JSON")
    print("===================================\n")

    print(f"CSV file       : {csv_file}")
    print(f"JSON file      : {json_file}")
    print(
        f"Columns        : {', '.join(cols_to_keep) if cols_to_keep else 'ALL'}"
    )

    # Confirmation
    confirmation = input("\nProceed with this configuration? [y/n]: ").strip().lower()

    if confirmation == "y":
        pass

    elif confirmation == "n":
        csv_file, json_file, cols_to_keep = ask_custom_configuration()

    else:
        print("Invalid response. Aborting.")
        return

    # Execute conversion
    csv_to_json(csv_file, json_file, cols_to_keep)


if __name__ == "__main__":
    main()
