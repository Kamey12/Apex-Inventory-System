const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Product = require('./models/Product');
const authRoutes = require('./routes/authRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const productRoutes = require('./routes/productRoutes');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Apex Inventory API is running...');
    });
}

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        try {
            const User = require('./models/User'); 
            const adminExists = await User.findOne({ role: 'admin' });
            
            if (!adminExists) {
                const bcrypt = require('bcryptjs');
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('admin123', salt);
                
                await User.create({
                    username: 'admin',
                    password: hashedPassword,
                    role: 'admin'
                });
                console.log('🌱 Database Seeded: Master admin account created.');
            }
        } catch (seedError) {
            console.error('Failed to seed database:', seedError);
        }
    })
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send("Inventory System API is running...");
});
