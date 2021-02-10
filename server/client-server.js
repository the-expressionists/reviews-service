const express = require('express');
const path = require('path')
const app = express();

app.use(express.static(path.resolve(__dirname, '../dist/client')));

const PORT = process.env.PORT || 9001;
app.listen(PORT, () => console.log(`client-server is listening on port ${PORT}`));