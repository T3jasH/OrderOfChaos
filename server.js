const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs')
const morgan = require('morgan')
const path = require('path')
const connectDB = require('./config/db');

// Load Config
dotenv.config({ path: './config.env' });

// Connect Database
connectDB();

const app = express();

app.use(morgan('dev', {
  skip: function (req,res) {return res.statusCode<400}
}));

app.use(morgan('common', {
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}));


// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/contest', require('./routes/contest'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/question/:id', require('./routes/question'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));
