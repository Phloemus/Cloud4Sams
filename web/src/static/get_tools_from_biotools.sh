#!/bin/bash

API_URL="https://bio.tools/api/t/?topic=Metagenomics&per_page=1000" 
NEXT_URL="https://bio.tools/api/t/?topic=Metagenomics&per_page=1000" ## Per page limit is 100 with biotools ..

echo "[" > biotools.json

while [ -n "$NEXT_URL" ] && [ "$NEXT_PAGE" != "null" ]; do
    echo "Fetching: $NEXT_URL"

    RESPONSE=$(curl -H "Accept: application/json" -s "$NEXT_URL")
    NEXT_PAGE=$(echo "$RESPONSE" | jq '.next')

    echo "$RESPONSE" | jq '.list' >> biotools.json

    if [ "$NEXT_PAGE" != "null" ]; then
        NEXT_PAGE="${NEXT_PAGE#*?page=}"; NEXT_PAGE="${NEXT_PAGE%%[^0-9]*}"
        echo "$NEXT_PAGE"
        echo "," >> biotools.json
    fi

    NEXT_URL="${API_URL}&page=${NEXT_PAGE}"

done

echo "]" >> biotools.json
