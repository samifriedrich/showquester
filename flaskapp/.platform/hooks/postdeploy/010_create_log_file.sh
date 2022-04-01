#!/bin/bash

if test -f "$FLASK_LOG_FILE_PATH";
then
  echo "$FLASK_LOG_FILE_PATH exists"
else
  # create log file
  touch $FLASK_LOG_FILE_PATH
fi

# set log file owner (we are currently "root", but the app runs as "webapp")
chown webapp:webapp $FLASK_LOG_FILE_PATH