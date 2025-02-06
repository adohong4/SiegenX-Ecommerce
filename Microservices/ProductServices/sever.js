const app = require("./src/app");

require('dotenv').config();

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
    console.log(`Server Start on http://localhost:${PORT}`)
})