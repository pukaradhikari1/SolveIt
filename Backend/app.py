from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)

@app.route('/')
def home(name = "your name"):
    return render_template("index.html",content = name, thislist = ["a", "b", "c", "d"])


if __name__ == "__main__":
    app.run(debug=True)