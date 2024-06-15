const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

app.use(express.json());

// Servește fișierele statice din directorul public
app.use(express.static(path.join(__dirname, 'public')));

// Importarea și utilizarea fișierului de rute pentru utilizatori
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

console.log(`Server running on port ${PORT}`);
console.log(`Mongo URI: ${process.env.MONGO_URI}`);
console.log(`JWT Secret: ${process.env.JWT_SECRET}`);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
