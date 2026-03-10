import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';

// Register User
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        // Create JWT Token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login User
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check User
        const user = await User.findOne({
            where: { email },
            include: [
                { model: Student, as: 'studentProfile' },
                { model: Teacher, as: 'teacherProfile' }
            ]
        });

        if (!user) {
            console.log('Login failed: User not found for email:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate Role
        // Note: req.body.role comes from frontend selection
        if (req.body.role && req.body.role.toLowerCase() !== user.role.toLowerCase()) {
            console.log(`Login failed: Role mismatch. User is ${user.role} but requested ${req.body.role}`);
            return res.status(403).json({ message: `Access denied. You are registered as a ${user.role}, not a ${req.body.role}.` });
        }

        console.log(`User found: ${user.id} (${user.role}). Checking password...`);
        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Login failed: Password mismatch for user:', user.email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create Token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        // Prepare User Data (Flatten)
        const userJSON = user.toJSON();
        let profileData = {};
        if (user.role === 'student' || user.role === 'Student') {
            profileData = userJSON.studentProfile || {};
        } else if (user.role === 'teacher' || user.role === 'Teacher') {
            profileData = userJSON.teacherProfile || {};
        }

        const fullUserData = {
            ...userJSON,
            ...profileData,
            id: userJSON.id, // Ensure user ID is preserved, overriding the profileData ID if there is a conflict
            profileId: profileData.id,
            department: profileData.department || userJSON.department,
        };

        res.json({
            message: 'Login successful',
            token,
            user: fullUserData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
