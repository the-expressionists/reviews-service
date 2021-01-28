#!/bin/bash

if [ "$(pgrep mongod | wc -l | tr -d ' ')" -lt 1 ]; then
    echo "MongoDB needs to be running!"
    echo "For Linux: sudo systemctl start mongodb"
    echo "For Mac: brew services start mongodb-community"
    exit 1
fi

npm run build
babel ./server/ -d ./dist/server --verbose --ignore __tests__/*,__mocks__/*
node dist/server/index.js
exit 0
