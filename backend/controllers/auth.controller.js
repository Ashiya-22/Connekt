import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import Post from '../models/post.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });

    res.cookie('jwt-Connekt', token, {
      httpOnly: true, // prevent XSS attack
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: 'strict', // prevent CSRF attacks,
      secure: process.env.NODE_ENV === 'production', // prevents man-in-the-middle attacks
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log('Error in signup controller: ', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username !' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password !' });
    }

    // Create and send token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });
    await res.cookie('jwt-Connekt', token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    res.json({ message: 'Logged in successfully' });
  } catch (error) {
    console.error('Error in login controller:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie('jwt-Connekt');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log('Error in logout controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('Error in getCurrentUser controller:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // Remove the user from all other users' connection lists
    await User.updateMany(
      { connections: userId },
      { $pull: { connections: userId } }
    );

    //  Delete user, posts, and notifications concurrently
    await Promise.all([
      Post.deleteMany({ author: userId }),
      Notification.deleteMany({ recipient: userId }),
      User.findByIdAndDelete(userId),
    ]);

    res.clearCookie('jwt-Connekt');
    res
      .status(200)
      .json({ message: 'User and associated data deleted successfully!' });
  } catch (error) {
    console.error('Error deleteUser controller:', error);
    res.status(500).json({ message: 'Server error! Could not delete user.' });
  }
};
