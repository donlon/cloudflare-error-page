#!/usr/bin/env python3

import os
import re
import sys

from flask import (
    Flask,
    json,
    request,
    abort,
    send_from_directory
)

examples_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(examples_dir))
from cloudflare_error_page import get_resources_folder, render as render_cf_error_page

# TODO: use blueprint
app = Flask(__name__)

# You can use resources from Cloudflare CDN. But in case of changing, you can set use_cdn = False to use bundled resources.
use_cdn = True

if use_cdn:
    res_folder = get_resources_folder()

    # This handler is used to provide stylesheet and icon resources for the error page. If you pass use_cdn=True to render_cf_error_page
    # or if your site is under proxy of Cloudflare (the cdn-cgi folder is already provided by Cloudflare), this handler can be removed.
    @app.route('/cdn-cgi/<path:path>')
    def cdn_cgi(path):
        return send_from_directory(res_folder, path)


param_cache: dict[str, dict] = {}

def get_page_params(name: str) -> dict:
    name = re.sub(r'[^\w]', '', name)
    params = param_cache.get(name)
    if params is not None:
        return params
    try:
        with open(os.path.join(examples_dir, f'{name}.json')) as f:
            params = json.load(f)
        param_cache[name] = params
        return params
    except Exception as _:
        return None


@app.route('/', defaults={'name': 'default'})
@app.route('/<path:name>')
def index(name: str):
    name = os.path.basename(name)  # keep only the base name

    params = get_page_params(name)
    if params is None:
        abort(404)

    # Get real Ray ID from Cloudflare header
    ray_id = request.headers.get('Cf-Ray')
    if ray_id:
        ray_id = ray_id[:16]

    # Get real client ip from Cloudflare header or request.remote_addr
    client_ip = request.headers.get('X-Forwarded-For')
    if not client_ip:
        client_ip = request.remote_addr

    params = {
        **params,
        'ray_id': ray_id,
        'client_ip': client_ip,
    }

    # Render the error page
    return render_cf_error_page(params, use_cdn=use_cdn), 500


if __name__ == '__main__':
    if len(sys.argv) > 1:
        host = sys.argv[1]
    else:
        host = None
    if len(sys.argv) > 2:
        port = int(sys.argv[2])
    else:
        port = None
    
    app.run(debug=True, host=host, port=port)
