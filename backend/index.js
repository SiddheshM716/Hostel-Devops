const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/wardens', require('./routes/wardens'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/allocations', require('./routes/allocations'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/hostels', require('./routes/hostels'));
app.use('/api/mess', require('./routes/mess'));
app.use('/api/visitors', require('./routes/visitors'));
app.use('/api/leaves', require('./routes/leaves'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5001;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
