#!/bin/bash

if [ "$(systemctl | grep -c mongodb)" -lt 1 ]; then
    sudo systemctl start mongodb
fi

npm run server

