require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const chatRoute = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/chat', chatRoute);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AIChatterbox backend is running.' });
});

// (Optional) serve the AngularJS frontend as static files from this same server.
// If you'd rather run the frontend separately (e.g. with Live Server / http-server),
// you can remove these two lines.
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.listen(PORT, () => {
  console.log(`AIChatterbox backend listening on http://localhost:${PORT}`);
});
