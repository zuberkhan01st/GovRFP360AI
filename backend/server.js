require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const rfpRoutes = require('./routes/rfpRoutes');
const complianceRoutes = require('./routes/complianceRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

app.use('/api/rfp', rfpRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/search', searchRoutes);

app.get('/', (req, res) => {
  res.send('GovRFP360AI Backend is running.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
