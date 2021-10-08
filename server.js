const express = require('express')
const app = express()

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

const port = 1080

app.use(express.json());
app.use(express.urlencoded({ extended: true}))
require('./src/routes/index')(app);

app.listen(port, () => console.log(`Servidor Express na porta ${port}`));
