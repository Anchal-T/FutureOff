const express = require('express');
require('./jobs/strategyOptimizerJob');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Yield Optimizer Backend is running!');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
