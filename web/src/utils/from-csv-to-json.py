
import pandas as pd
from sys import argv

# Default configuration
DEFAULT_CSV_FILE = "home/ubuntu/Cloud4Sams/web/src/utils/bioconda_repository_audit.csv"
DEFAULT_JSON_FILE = "home/ubuntu/Cloud4Sams/web/src/static/bioconda-packages.json"
DEFAULT_COLS = ["biotoolsID", "bioconda_package"]


def csv_to_json(csv_file, json_file, cols_to_keep=None):
    df = pd.read_csv(csv_file, usecols=cols_to_keep)

    df.to_json(
        json_file,
        orient="records",
        indent=4,
        force_ascii=False
    )

    print(f"\nConversion completed: {csv_file} -> {json_file}")


def main():
    # Arguments or defaults
    csv_file = argv[1] if len(argv) > 1 else DEFAULT_CSV_FILE
    json_file = argv[2] if len(argv) > 2 else DEFAULT_JSON_FILE
    cols = argv[3:] if len(argv) > 3 else DEFAULT_COLS

    # Display configuration
    print("\nConversion configuration:")
    print(f"CSV file  : {csv_file}")
    print(f"JSON file : {json_file}")
    print(f"Columns   : {', '.join(cols) if cols else 'All columns'}")

    answer = input("\nProceed? [y/n]: ").strip().lower()

    if answer == "n":
        csv_file = input("CSV file: ").strip() or DEFAULT_CSV_FILE
        json_file = input("JSON file: ").strip() or DEFAULT_JSON_FILE

        cols_input = input(
            "Columns (comma-separated, empty = all): "
        ).strip()

        cols = [c.strip() for c in cols_input.split(",")] if cols_input else None

    elif answer != "y":
        print("Aborted.")
        return

    csv_to_json(csv_file, json_file, cols)


if __name__ == "__main__":
    main()
