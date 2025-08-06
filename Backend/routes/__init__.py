from .reg import reg
from .home import home


def register_routes(app):
    app.register_blueprint(reg)
    app.register_blueprint(home)
    