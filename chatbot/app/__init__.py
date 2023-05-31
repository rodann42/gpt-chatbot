from flask import Flask

app = Flask(__name__)
app.config['TESTING'] = True

from app import routes
