#!/bin/bash

if [ "$(systemctl | grep -c mongodb)" -lt 1 ]; then
    sudo systemctl start mongodb
fi

npm run build
babel ./server/ -d ./dist/server --verbose --ignore __tests__/*,__mocks__/*
node dist/server/index.js
