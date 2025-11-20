# SPDX-License-Identifier: MIT

import os
import secrets
import string
import sys

from flask import Flask, request
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
from sqlalchemy.orm import DeclarativeBase

root_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../')
sys.path.append(root_dir)
from cloudflare_error_page import render as render_cf_error_page

class Base(DeclarativeBase):
    pass

db: SQLAlchemy = SQLAlchemy(model_class=Base, session_options={
    # 'autobegin': False,
    # 'expire_on_commit': False,
})

limiter: Limiter = Limiter(
    key_func=get_remote_address,  # Uses client's IP address by default
    default_limits=["200 per day", "50 per hour"] # Global default limits
)

def generate_secret(length=32) -> str:
    characters = string.ascii_letters + string.digits  # A-Z, a-z, 0-9
    return ''.join(secrets.choice(characters) for _ in range(length))


def create_app(test_config=None) -> Flask:
    instance_path = os.getenv('INSTANCE_PATH', None)
    if instance_path is not None:
        os.makedirs(instance_path, exist_ok=True)
    app = Flask(__name__,
        instance_path=instance_path,
        instance_relative_config=True
    )
    app.json.ensure_ascii = False
    app.json.mimetype = "application/json; charset=utf-8"
    secret_key = os.getenv('SECRET_KEY', '')
    if secret_key:
        app.secret_key = secret_key
    else:
        print('Using generated secret')
        app.secret_key = generate_secret()
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv('DATABASE_URI', 'sqlite:///example.db')
    url_prefix = os.getenv('URL_PREFIX', '')


    from . import models
    from . import examples
    from . import editor
    from . import share

    if app.config["SQLALCHEMY_DATABASE_URI"].startswith('sqlite'):
        app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
            'isolation_level': 'SERIALIZABLE',
            # "execution_options": {"autobegin": False}
        }
    db.init_app(app)
    limiter.init_app(app)
    
    
    with app.app_context():
        db.create_all()
        # if db.engine.dialect.name == 'sqlite':
        #     @event.listens_for(db.engine, "connect")
        #     def enable_foreign_keys(dbapi_connection, connection_record):
        #         cursor = dbapi_connection.cursor()
        #         cursor.execute("PRAGMA foreign_keys=ON;")
        #         cursor.close()

    @app.route('/health')
    def health():
        return '', 204

    app.register_blueprint(editor.bp, url_prefix=f'{url_prefix}/editor')
    app.register_blueprint(examples.bp, url_prefix=f'{url_prefix}/examples')
    app.register_blueprint(share.bp, url_prefix=f'{url_prefix}/s')

    return app


def get_common_cf_template_params():
    # Get real Ray ID from Cloudflare header
    ray_id = request.headers.get('Cf-Ray')
    if ray_id:
        ray_id = ray_id[:16]
    # Get real client ip from Cloudflare header or request.remote_addr
    client_ip = request.headers.get('X-Forwarded-For')
    if not client_ip:
        client_ip = request.remote_addr
    return {
        'ray_id': ray_id,
        'client_ip': client_ip,
    }


__all__ = ['create_app', 'db', 'get_common_cf_template_params', 'render_cf_error_page']
