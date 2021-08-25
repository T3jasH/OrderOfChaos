const express = require("express")
const dotenv = require("dotenv")
const fs = require("fs")
const morgan = require("morgan")
const path = require("path")
const connectDB = require("./config/db")
const expressip = require("express-ip")
const app = express()

// Load Config
dotenv.config({ path: "./.env" })
// Connect Database
connectDB()

// Init middleware
app.use(express.json({ extended: false }))
app.use(expressip().getIpInfoMiddleware)

// app.use(
//     morgan("dev", {
//         skip: function (req, res) {
//             return res.statusCode < 400;
//         },
//     })
// );

// app.use(
//     morgan("common", {
//         stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
//             flags: "a",
//         }),
//     })
// );

// Routes
app.use("/api/users", require("./routes/users"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/admin", require("./routes/admin"))
app.use("/api/contest", require("./routes/contest"))
app.use("/api/leaderboard", require("./routes/leaderboard"))
app.use("/api/question", require("./routes/question"))
app.use("/api/attacklogs", require("./routes/timelog"))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}.`))
