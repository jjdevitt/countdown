const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Sample meeting phases with durations in seconds
const meetingPhases = [
  { name: 'Introduction', duration: 300 }, // 5 minutes
  { name: 'Discussion', duration: 600 }, // 10 minutes
  { name: 'Conclusion', duration: 300 }, // 5 minutes
];

app.get('/api/phases', (req, res) => {
  res.json(meetingPhases);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});