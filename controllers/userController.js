const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    console.log('Request to /api/users/register');
    console.log(`Received data: name=${name}, email=${email}, password=${password}`);

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log('Creating salt for password hashing');
        const salt = await bcrypt.genSalt(10);
        console.log('Salt created:', salt);

        console.log('Hashing password');
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Password hashed');

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        console.log('Saving user to database');
        await user.save();

        console.log('User registered successfully');
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log('Request to /api/users/login');
    console.log(`Received data: email=${email}, password=${password}`);

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });
            console.log('User authenticated successfully');
            res.json({ token });
        } else {
            console.log('Invalid email or password');
            res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
