from email.mime import application
from flask import Flask
from config import Config

application = Flask(__name__)
application.config.from_object(Config)

from app import routes
