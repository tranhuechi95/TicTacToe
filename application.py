import os

from flask import Flask, flash, jsonify, redirect, render_template, request, session
from tempfile import mkdtemp

# create and configure the app
application = Flask(__name__, instance_relative_config=True)
application.config.from_mapping(
    SECRET_KEY='dev',
    DATABASE=os.path.join(application.instance_path, 'flaskr.sqlite'),
)
application.config.from_pyfile('config.py', silent=True)

# ensure the instance folder exists
try:
    os.makedirs(application.instance_path)
except OSError:
    pass

# a simple page that says hello
@application.route('/', methods =["GET", "POST"])
def index():
    """User to select the size of the grid"""
    if request.method == "POST":
        sizes = int(request.form.get("size"))
        symbol = request.form.get("symbol")
        difficulty = request.form.get("difficulty")
        if difficulty == "Hard":
            if sizes == 3:
                return render_template("gridDifficult.html", sizes = sizes, symbol = symbol)
            else:
                return render_template("testDifficultOthers.html", sizes = sizes, symbol = symbol)
        else:
            return render_template("grid.html", sizes = sizes, symbol = symbol)

    else:
        sizes = [3,4,5,6,7,8,9,10]
        return render_template("selectgame.html", sizes = sizes)

@application.route('/selectgame', methods =["GET", "POST"])
def selectgame():
    """User to select the size of the grid"""
    if request.method == "POST":
        sizes = int(request.form.get("size"))
        symbol = request.form.get("symbol")
        difficulty = request.form.get("difficulty")
        if difficulty == "Hard":
            if sizes == 3:
                return render_template("gridDifficult.html", sizes = sizes, symbol = symbol)
            else:
                return render_template("gridDifficultOthers.html", sizes = sizes, symbol = symbol)
        else:
            return render_template("grid.html", sizes = sizes, symbol = symbol)

    else:
        sizes = [3,4,5,6]
        return render_template("selectgame.html", sizes = sizes)

if __name__ == "__main__":
    application.run()