import os
import re
from urllib.parse import quote


root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
resources_folder = os.path.join(root,'resources')


def read_file(path: str) -> str:
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()


def write_file(path: str, data: str):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(data)


def convert_svg_to_data_uri(data: str) -> str:
    data = data.replace('<?xml version="1.0" encoding="UTF-8"?>', '')
    data = re.sub(r'\n\s*', '', data, flags=re.DOTALL)
    uri = 'data:image/svg+xml;utf8,'
    uri += quote(data)
    return uri


def inline_svg_resources(css_file: str, svg_files: list[str], output_file: str):
    css_data = read_file(css_file)
    for svg_file in svg_files:
        svg_data = read_file(os.path.join(os.path.dirname(css_file), svg_file))
        svg_uri = convert_svg_to_data_uri(svg_data)
        css_data = css_data.replace(svg_file, svg_uri)
    print(f'inline_svg_resources writing to {output_file}')
    write_file(output_file, css_data)


def inline_assets(original_file: str, css_file: str, js_replacements: dict[str, str], output_file: str):
    css_data = read_file(css_file)
    original_data = read_file(original_file)
    original_data = original_data.replace('<!-- @INLINE_CSS_HERE@ -->', f'<style>{css_data}</style>')
    for placeholder, js_file in js_replacements.items():
        js_data = read_file(js_file)
        original_data = original_data.replace(placeholder, f'<script>{js_data}</script>')
    note = 'Note: This file is generated with scripts/inline_resources.py. Please do not edit manually.'
    if original_file.endswith('.ejs'):
        original_data = f'<%# {note} %>\n' + original_data
    else:
        original_data = f'{{# {note} #}}\n' + original_data
    print(f'inline_assets writing to  {output_file}')
    write_file(output_file, original_data)


if __name__ == '__main__':
    inline_svg_resources(
        os.path.join(resources_folder, 'styles/main-original.css'),
        [
            '../images/cf-icon-browser.svg',
            '../images/cf-icon-cloud.svg',
            '../images/cf-icon-server.svg',
            '../images/cf-icon-ok.svg',
            '../images/cf-icon-error.svg',
        ],
        os.path.join(resources_folder, 'styles/main.css'),
        )
    js_map = {'<!-- @INLINE_CLOCK_JS@ -->': os.path.join(resources_folder, 'scripts/clock.js')}
    inline_assets(
        os.path.join(resources_folder, 'templates/error.html'),
        os.path.join(resources_folder, 'styles/main.css'),
        js_map,
        os.path.join(root, 'cloudflare_error_page/templates/error.html'),
    )
    inline_assets(
        os.path.join(resources_folder, 'templates/error.ejs'),
        os.path.join(resources_folder, 'styles/main.css'),
        js_map,
        os.path.join(root, 'editor/web/src/template.ejs'),
    )
    inline_assets(
        os.path.join(resources_folder, 'templates/error.ejs'),
        os.path.join(resources_folder, 'styles/main.css'),
        js_map,
        os.path.join(root, 'nodejs/templates/error.ejs'),
    )
