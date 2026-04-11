const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const buildPath = path.join(__dirname, 'build');

app.use(cors());
app.use(express.json());
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
}

// Sample meeting phases with durations in seconds
const meetingPhases = [
  { name: 'Introduction', duration: 300 }, // 5 minutes
  { name: 'Discussion', duration: 600 }, // 10 minutes
  { name: 'Conclusion', duration: 300 }, // 5 minutes
];

app.get('/api/phases', (req, res) => {
  res.json(meetingPhases);
});

app.use((req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Build not found. Please run npm run build first.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});