import sys
import yaml

with open(sys.argv[1], encoding="utf-8") as stream:
    content = yaml.safe_load(stream)

try:
    name = content["package"]["name"]
except (TypeError, KeyError):
    sys.exit("Error: package.name was not found in the YAML file.")

print(name)