import os

from flask import Flask, flash, jsonify, redirect, render_template, request, session
from tempfile import mkdtemp


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    @app.route('/')
    def index():
        "TODO"
        return render_template("index.html")

    @app.route('/startgame', methods =["GET", "POST"])
    def startgame():
        """User to select the size of the grid"""
        if request.method == "POST":
            "TODO"
            sizes = int(request.form.get("size"))
            symbol = request.form.get("symbol")
            return render_template("grid.html", sizes = sizes, symbol = symbol)

        else:
            sizes = [3,4,5,6,7,8,9,10] 
            return render_template("startgame.html", sizes = sizes)




    return app