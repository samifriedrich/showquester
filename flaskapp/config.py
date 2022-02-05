import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SECRET_KEY = os.environ.get('FLASK_SECRET_KEY') or 'you-will-never-guess'