const express = require('express');
const cors = require('cors');
const app = express();

// This allows your frontend at 3005 to talk to this backend
app.use(cors({
  origin: 'http://localhost:3005'
}));

app.get('/api/data', (req, res) => {
  res.json({ message: "Connected!" });
});

app.listen(3000);