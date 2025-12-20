#!/usr/bin/env python3
import json
import os
import sys
from pathlib import Path

# Render a preview HTML using the library render function and write to build/index.html
try:
    from cloudflare_error_page import render
except Exception as e:
    print('Failed to import cloudflare_error_page:', e, file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
EXAMPLE = ROOT / 'examples' / 'working.json'
OUTDIR = ROOT / 'build'
OUTFILE = OUTDIR / 'index.html'

def load_params():
    if EXAMPLE.exists():
        try:
            return json.loads(EXAMPLE.read_text(encoding='utf-8'))
        except Exception as e:
            print('Failed to load example JSON:', e, file=sys.stderr)
    # fallback minimal params
    return {
        'title': 'Preview',
        'error_code': 503
    }


def main():
    OUTDIR.mkdir(parents=True, exist_ok=True)
    params = load_params()
    html = render(params)
    OUTFILE.write_text(html, encoding='utf-8')
    print(f'Preview written to: {OUTFILE}')

if __name__ == '__main__':
    main()
