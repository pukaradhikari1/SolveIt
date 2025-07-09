from .reg import reg
def register_routes(app):
    app.register_blueprint(reg)