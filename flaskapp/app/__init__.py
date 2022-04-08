from flask import Flask
import config

application = Flask(__name__)

if application.config['ENV'] == "production":
    application.config.from_object(config.ProductionConfig)
elif application.config['ENV'] == "testing":
    application.config.from_object(config.TestingConfig)
else:
    application.config.from_object(config.DevelopmentConfig)

from app import routes
