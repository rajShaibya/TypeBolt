const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/typing'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TypeBolt backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 