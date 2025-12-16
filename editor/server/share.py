# SPDX-License-Identifier: MIT

import html
import random
import string

from flask import (
    Blueprint,
    current_app,
    request,
    abort,
    jsonify,
    redirect,
    url_for,
)
from jinja2 import Environment, select_autoescape

from cloudflare_error_page import (
    default_template as cf_template,
    render as render_cf_error_page,
)

from . import (
    db,
    limiter,
    models
)

from .utils import fill_cf_template_params, sanitize_page_param_links

# root_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../')
# examples_dir = os.path.join(root_dir, 'examples')
env = Environment(
    autoescape=select_autoescape(),
    trim_blocks=True,
    lstrip_blocks=True,
)
template = env.from_string('''
{% extends base %}

{% block header %}
<meta property="og:type" content="website" />
<meta property="og:site_name" content="moe::virt" />
<meta property="og:title" content="{{ html_title }}" />
<meta property="og:url" content="{{ url }}" />
<meta property="og:description" content="{{ description }}" />

<meta property="twitter:card" content="summary" />
<meta property="twitter:site" content="moe::virt" />
<meta property="twitter:title" content="{{ html_title }}" />
<meta property="twitter:description" content="{{ description }}" />
{% endblock %}
''')

bp = Blueprint('share', __name__, url_prefix='/')
bp_short = Blueprint('share_short', __name__, url_prefix='/')


rand_charset = string.ascii_lowercase + string.digits 

def get_rand_name(digits=8):
    return ''.join(random.choice(rand_charset) for _ in range(digits))


@bp.post('/create')
@limiter.limit("20 per minute")
@limiter.limit("500 per hour")
def create():
    if len(request.data) > 4096:
        abort(413)

    # Simple CSRF check
    sec_fetch_site = request.headers.get('Sec-Fetch-Site')
    if sec_fetch_site is not None and sec_fetch_site != 'same-origin':
        return jsonify({
            'status': 'failed',
            'message': 'CSRF check failed (Sec-Fetch-Site)',
        }), 403

    # Accessing request.json raises 415 error if Content-Type is not application/json. This also prevents CSRF requests.
    # See https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/CSRF#avoiding_simple_requests
    params = request.json['parameters']  # throws KeyError

    # TODO: strip unused params
    try:
        item = models.Item()
        digits = current_app.config.get('SHARE_LINK_DIGITS', 7)
        item.name = get_rand_name(digits)
        item.params = params
        db.session.add(item)
        db.session.commit()
    except:
        db.session.rollback()
        return jsonify({
            'status': 'failed',
        })
    return jsonify({
        'status': 'ok',
        'name': item.name,
        'url': request.host_url[:-1] + url_for('share_short.get', name=item.name),
        # TODO: better way to handle this
    })


@bp_short.get('/<name>')
def get(name: str):
    accept = request.headers.get('Accept', '')
    is_json = 'application/json' in accept

    item = db.session.query(models.Item).filter_by(name=name).first()
    if not item:
        if is_json:
            return jsonify({
                'status': 'notfound'
            })
        else:
            return abort(404)
    params: dict = item.params
    params.pop('time', None)
    params.pop('ray_id', None)
    params.pop('client_ip', None)
    
    if is_json:
        return jsonify({
            'status': 'ok',
            'parameters': params,
        })
    else:
        params['creator_info'] = {
            'hidden': False,
            'text': 'CF Error Page Editor',
            'link': request.host_url[:-1] + url_for('editor.index') + f'#from={name}',
        }
        fill_cf_template_params(params)
        sanitize_page_param_links(params)

        return render_cf_error_page(params=params,
                                    allow_html=False,
                                    template=template,
                                    base=cf_template,
                                    url=request.url,
                                    description='Cloudflare error page')


@bp.get('/<name>')
def get_redir(name: str):
    short_share_url = current_app.config.get('SHORT_SHARE_URL', False)
    if short_share_url:
        return redirect(f'../{name}', code=308)
    else:
        return get(name=name)
