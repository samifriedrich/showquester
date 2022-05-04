# ShowQuester Flask App

## Development

The following files must be in the flaskapp/ directory on your local machine:
- `secrets.json`
- `.env`

The `secrets.json` file should define the following credentials:
```json
{
    "SEATGEEK_CLIENT_ID": "YOUR-KEY-HERE",
    "SEATGEEK_CLIENT_SECRET": "YOUR-KEY-HERE",
    "SPOTIFY_CLIENT_ID": "YOUR-KEY-HERE",
    "SPOTIFY_CLIENT_SECRET": "YOUR-KEY-HERE",
    "FLASK_SECRET_KEY": "YOUR-KEY-HERE"
}
```

The `.env` file should define the following environment variables:
```ini
SECRETS_PATH='secrets.json'
LOG_LEVEL='DEBUG'
FLASK_LOG_FILE_PATH='flask-app.log'
```

Next, `cd` into the `flask` directory and run the development server:

```bash
$ cd flaskapp
$ pipenv install # only run this once
$ pipenv shell
$ flask run
```

The `FLASK_ENV` is set to `development` in `.flaskenv`. You can change it there or set it prior to running `pipenv run flask app` as an environment variable with:
```bash
$ cd flaskapp
$ pipenv shell
$ export FLASK_ENV=production
$ flask run
```

The value of `FLASK_ENV` dictates the application configuration according to `config.py`.

Open [http://127.0.0.1:5000/](http://127.0.0.1:5000/) with your browser to see the result.

## Deployment to Elastic Beanstalk

Pushes to GitHub main are **not** automatically deployed. To deploy to Elastic Beanstalk, AWS and Elastic Beanstalk CLI tools must be installed locally. Then run:

```bash
$ cd flaskapp
$ eb init  # only run this once
$ eb deploy
```

Uncommited, staged changes can be deployed with:

```bash
$ eb deploy --staged
```
