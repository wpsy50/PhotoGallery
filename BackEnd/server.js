import express from 'express';
const app = express();
const PORT = 3000

app.use(express.static('public'));

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
