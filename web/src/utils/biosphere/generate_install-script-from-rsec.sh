#!/usr/bin/env bash
set -euo pipefail

# Usage:



if [[ $# -ne 1 ]]; then
    echo "Usage: $0 <biotoolsID>" >&2
    exit 1
fi

BIOTOOLS_ID="${1#bio.tools:}"

if [[ ! "$BIOTOOLS_ID" =~ ^[A-Za-z0-9][A-Za-z0-9._-]*$ ]]; then
    echo "Error: invalid bio.tools ID: $BIOTOOLS_ID" >&2
    exit 1
fi

YAML_URL="https://raw.githubusercontent.com/research-software-ecosystem/content/master/data/${BIOTOOLS_ID}/bioconda_*.yaml"
TMP_YAML="$(mktemp)"
trap 'rm -f "$TMP_YAML"' EXIT

echo "Retrieving Bioconda recipe for bio.tools:${BIOTOOLS_ID}..."

if command -v curl >/dev/null 2>&1; then
    curl --fail --silent --show-error --location "$YAML_URL" --output "$TMP_YAML" || {
        echo "Error: no Bioconda YAML found at:" >&2
        echo "  $YAML_URL" >&2
        exit 1
    }
elif command -v wget >/dev/null 2>&1; then
    wget --quiet --output-document="$TMP_YAML" "$YAML_URL" || {
        echo "Error: no Bioconda YAML found at:" >&2
        echo "  $YAML_URL" >&2
        exit 1
    }
else
    echo "Error: curl or wget is required." >&2
    exit 1
fi

# Extract package.name (the key directly below the top-level "package:").
PACKAGE_NAME="$(
    python3 - "$TMP_YAML" <<'PY'|| {
    echo "Error: could not extract package.name from the YAML." >&2
    exit 1
}

echo "Bioconda package found: ${PACKAGE_NAME}"

OUTPUT_FILE="install.sh"

cat > "$OUTPUT_FILE" <<EOF
#!/usr/bin/env bash
set -euo pipefail

CONDA_ROOT_PREFIX=\${CONDA_ROOT_PREFIX:-/var/lib/miniforge}

# Detect Conda-compatible package manager
if command -v micromamba >/dev/null 2>&1; then
    MAMBA_BIN=\$(command -v micromamba)
    export MAMBA_ROOT_PREFIX="\$CONDA_ROOT_PREFIX"
elif command -v mamba >/dev/null 2>&1; then
    MAMBA_BIN=\$(command -v mamba)
elif command -v conda >/dev/null 2>&1; then
    MAMBA_BIN=\$(command -v conda)
else
    echo "Neither micromamba, mamba nor conda is available." >&2
    exit 1
fi

PACKAGE_NAME="${PACKAGE_NAME}"
ENV_NAME="${PACKAGE_NAME}"

echo "Creating Conda environment '\$ENV_NAME' and installing '\$PACKAGE_NAME'..."

"\$MAMBA_BIN" create -y \\
    -c conda-forge \\
    -c bioconda \\
    -n "\$ENV_NAME" \\
    "\$PACKAGE_NAME"

echo "Checking installation..."
"\$MAMBA_BIN" list -n "\$ENV_NAME" "\$PACKAGE_NAME"

echo "Installation completed."
echo "Activate the environment with:"
echo "  conda activate \$ENV_NAME"
EOF

chmod +x "$OUTPUT_FILE"

echo "Generated $OUTPUT_FILE"
echo "  bio.tools ID: bio.tools:${BIOTOOLS_ID}"
echo "  Conda package: ${PACKAGE_NAME}"
