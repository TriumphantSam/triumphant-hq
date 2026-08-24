"""Build every Vendor Survival artifact."""

from __future__ import annotations

from build_main import build as build_main
from build_phone import build as build_phone
from build_workbook import build as build_workbook


def main() -> None:
    build_phone()
    build_main()
    build_workbook()
    print("All Vendor Survival PDFs built.")


if __name__ == "__main__":
    main()
