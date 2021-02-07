#!/bin/bash

npm run resetschema

npm run gen

/usr/bin/time -v cqlsh -e "USE reviews_service; COPY reviews (productid, title, user, date, likes, body, thumbnail, stars, recommend, difficulty, value, quality, appearance, works) FROM '/home/ed/hackreactor/SDC/reviews-service/server/db/data/reviews.csv' WITH header=true AND delimiter=',';"