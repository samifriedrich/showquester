#!/bin/bash
TASKS_DIR=/opt/elasticbeanstalk/tasks
# include all app log files in bundle logs (replaces ".log" by "*")
echo "${FLASK_LOG_FILE_PATH//.log/*}" > "$TASKS_DIR/bundlelogs.d/01-app-log.conf"
# include current app log file in tail logs
echo $FLASK_LOG_FILE_PATH > "$TASKS_DIR/taillogs.d/01-app-log.conf"