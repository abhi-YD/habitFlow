// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');

// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// //routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/habits', require('./routes/habits'));
// app.use('/api/tasks', require('./routes/tasks'));

// app.use('/api/goals', require('./routes/goals'));

// app.get('/', (req, res) => res.send('HabitFlow API Running'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express  = require('express');
const cors     = require('cors');
const dotenv   = require('dotenv');
const connectDB = require('./config/db');
const { startCronJobs } = require('./services/cronService');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/habits',        require('./routes/habits'));
app.use('/api/tasks',         require('./routes/tasks'));
app.use('/api/goals',         require('./routes/goals'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/ai',            require('./routes/ai'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin',    require('./routes/admin'));

app.get('/', (req, res) => res.send('HabitFlow API Running'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startCronJobs(); // ← start all cron jobs
});