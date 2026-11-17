
#!/usr/bin/env bash
set -euo pipefail

# Check argument
if [[ $# -ne 1 ]]; then
    echo "Usage: $0 <bioconda-package-id>"
    exit 1
fi

PACKAGE_ID="$1"

# Validate package ID
if [[ ! "$PACKAGE_ID" =~ ^[a-zA-Z0-9][a-zA-Z0-9._-]*$ ]]; then
    echo "Error: invalid package ID"
    exit 1
fi

OUTPUT_FILE="install.sh"

# Generate installation script
cat > "$OUTPUT_FILE" <<EOF
#!/usr/bin/env bash
set -euo pipefail

source /etc/os-release
LOCUSER=\$ID

if [[ -r /etc/profile.d/ifb.sh ]]; then
    source /etc/profile.d/ifb.sh
fi

# Add MOTD
MOTD_FNAME=/etc/update-motd.d/99-ifb
cat << 'MOTD' > "\$MOTD_FNAME"
#!/bin/bash
echo Welcome to Biosphere Meteor VM!
echo
MOTD

chmod +x "\$MOTD_FNAME"

CONDA_ROOT_PREFIX=\${CONDA_ROOT_PREFIX:-/var/lib/miniforge}

# Detect package manager
if command -v micromamba >/dev/null 2>&1; then
    MAMBA_BIN=\$(command -v micromamba)
    export MAMBA_ROOT_PREFIX="\$CONDA_ROOT_PREFIX"

elif command -v mamba >/dev/null 2>&1; then
    MAMBA_BIN=\$(command -v mamba)

elif command -v conda >/dev/null 2>&1; then
    MAMBA_BIN=\$(command -v conda)

else
    echo "Neither micromamba, mamba nor conda is available."
    exit 1
fi

# Install Bioconda package
PACKAGE_NAME="$PACKAGE_ID"

echo "Installing \$PACKAGE_NAME..."

"\$MAMBA_BIN" create -y \\
    -c conda-forge \\
    -c bioconda \\
    -n "\$PACKAGE_NAME" \\
    "\$PACKAGE_NAME"

# Check installation
"\$MAMBA_BIN" list -n "\$PACKAGE_NAME" "\$PACKAGE_NAME"

echo "Installation completed: \$PACKAGE_NAME"
EOF

chmod +x "$OUTPUT_FILE"

echo "Generated $OUTPUT_FILE for package: $PACKAGE_ID"
