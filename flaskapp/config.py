import os
import json

with open('/var/app/current/storage/secrets.json', 'r', encoding='utf-8') as j:
    content = (j.read())
    SECRETS = json.loads(content)

class Config(object):
    SECRET_KEY = SECRETS.get('FLASK_SECRET_KEY')