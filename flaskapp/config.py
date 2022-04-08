from os import getenv
import json

with open(getenv('SECRETS_PATH'), 'r', encoding='utf-8') as j:
    content = (j.read())
    SECRETS = json.loads(content)

class Config(object):
    DEBUG = False
    TESTING = False
    LOG_LEVEL = 'INFO'
    SECRET_KEY = SECRETS.get('FLASK_SECRET_KEY')
    SONGKICK_API_KEY = SECRETS.get('SONGKICK_API_KEY')
    CLIENT_ID = SECRETS.get('SPOTIFY_CLIENT_ID')
    CLIENT_SECRET = SECRETS.get('SPOTIFY_CLIENT_SECRET')
    SCOPE = 'playlist-modify-public'
    REDIRECT_URI = "https://flaskapp-dev.us-east-1.elasticbeanstalk.com/callback"
    #REDIRECT_URI = "https://www.showquester.com/callback"
    AUTH_BASE = 'https://accounts.spotify.com'
    HOME = 'https://www.showquester.com'
    SHOW_DIALOG = True
    MAX_TRACKS = 10

class ProductionConfig(Config):
    MAX_TRACKS = 10

class DevelopmentConfig(Config):
    DEBUG = True
    LOG_LEVEL = 'DEBUG'
    REDIRECT_URI = "http://127.0.0.1:5000/callback"
    HOME = "http://localhost:3000"
    MAX_TRACKS = 5

class TestingConfig(Config):
    TESTING = True
    MAX_TRACKS = 5