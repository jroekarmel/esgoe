import json
import csv
from pathlib import Path

INPUT_FILE = Path("veranstaltungen_2021-2026_extern.json")
OUTPUT_FILE = Path("veranstaltungen_2021-2026_extern_table.csv")

PREFERRED_COLUMNS = [
    "id", "datum", "startdatum", "enddatum", "zeit", "titel", "prenom", "referent",
    "postnom", "institutionort", "art", "ort", "youtube", "zoomlink", "podcast",
    "meetingid", "homepagelink", "Zusammenfassung", "kursnummer", "parentid",
    "parenttitel", "issubevent", "zkommentare"
]


def ensure_list(data):
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        if all(isinstance(v, dict) for v in data.values()):
            return list(data.values())
        for key in ("data", "items", "events", "veranstaltungen", "records"):
            value = data.get(key)
            if isinstance(value, list):
                return value
    raise ValueError("Unsupported JSON structure. Expected a list of objects or a dict containing one.")


def flatten(obj, parent_key="", sep="_"):
    items = {}
    for k, v in obj.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else str(k)
        if isinstance(v, dict):
            items.update(flatten(v, new_key, sep=sep))
        elif isinstance(v, list):
            items[new_key] = json.dumps(v, ensure_ascii=False)
        else:
            items[new_key] = v
    return items


def main():
    with INPUT_FILE.open("r", encoding="utf-8") as f:
        data = json.load(f)

    records = ensure_list(data)
    flat_records = [flatten(r) for r in records]

    all_columns = []
    seen = set()
    for col in PREFERRED_COLUMNS:
        if any(col in r for r in flat_records):
            all_columns.append(col)
            seen.add(col)

    for record in flat_records:
        for key in record.keys():
            if key not in seen:
                all_columns.append(key)
                seen.add(key)

    with OUTPUT_FILE.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=all_columns, extrasaction="ignore")
        writer.writeheader()
        for record in flat_records:
            writer.writerow({k: "" if record.get(k) is None else record.get(k) for k in all_columns})

    print(f"Wrote {len(flat_records)} rows to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()