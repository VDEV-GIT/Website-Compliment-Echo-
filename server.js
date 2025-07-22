
const express = require('express');

const app = express();

const cors = require('cors');

const db = require('./database/db');

const apiRoutes = require('./routes/api');

const adminRoutes = require('./routes/admin'); // adjust path if needed





app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);



const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));