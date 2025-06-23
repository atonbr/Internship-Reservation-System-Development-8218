import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/init.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await db.getAsync('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Register student
router.post('/register/student', async (req, res) => {
  try {
    const { email, password, name, course, className } = req.body;

    if (!email || !password || !name || !course || !className) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Check if user already exists
    const existingUser = await db.getAsync('SELECT id FROM users WHERE email = ?', [email]);

    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.runAsync(`
      INSERT INTO users (email, password, name, role, course, class_name)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [email, hashedPassword, name, 'student', course, className]);

    const token = jwt.sign(
      { userId: result.lastID, email, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      user: {
        id: result.lastID,
        email,
        name,
        role: 'student',
        course,
        class_name: className
      },
      token
    });
  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Register institution
router.post('/register/institution', async (req, res) => {
  try {
    const { email, password, name, cnpj, address, phone } = req.body;

    if (!email || !password || !name || !cnpj) {
      return res.status(400).json({ error: 'Email, senha, nome e CNPJ são obrigatórios' });
    }

    // Check if user already exists
    const existingUser = await db.getAsync('SELECT id FROM users WHERE email = ? OR cnpj = ?', [email, cnpj]);

    if (existingUser) {
      return res.status(400).json({ error: 'Email ou CNPJ já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.runAsync(`
      INSERT INTO users (email, password, name, role, cnpj, address, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [email, hashedPassword, name, 'institution', cnpj, address, phone]);

    const token = jwt.sign(
      { userId: result.lastID, email, role: 'institution' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      user: {
        id: result.lastID,
        email,
        name,
        role: 'institution',
        cnpj,
        address,
        phone
      },
      token
    });
  } catch (error) {
    console.error('Institution registration error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;