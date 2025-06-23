import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../database/init.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', requireRole(['admin']), async (req, res) => {
  try {
    const { role, search } = req.query;
    
    let query = 'SELECT id, email, name, role, course, class_name, cnpj, address, phone, created_at FROM users WHERE 1=1';
    const params = [];
    
    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }
    
    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const users = await db.allAsync(query, params);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Create user (admin only)
router.post('/', requireRole(['admin']), async (req, res) => {
  try {
    const { email, password, name, role, course, className, cnpj, address, phone } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Email, senha, nome e perfil são obrigatórios' });
    }

    if (!['student', 'institution', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Perfil inválido' });
    }

    // Check if user already exists
    const existingUser = await db.getAsync('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.runAsync(`
      INSERT INTO users (email, password, name, role, course, class_name, cnpj, address, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [email, hashedPassword, name, role, course, className, cnpj, address, phone]);

    const newUser = await db.getAsync(`
      SELECT id, email, name, role, course, class_name, cnpj, address, phone, created_at 
      FROM users WHERE id = ?
    `, [result.lastID]);

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Update user
router.put('/:id', requireRole(['admin']), async (req, res) => {
  try {
    const userId = req.params.id;
    const { email, name, course, className, cnpj, address, phone } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email e nome são obrigatórios' });
    }

    // Check if user exists
    const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Check if email is already taken by another user
    const existingUser = await db.getAsync('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    await db.runAsync(`
      UPDATE users 
      SET email = ?, name = ?, course = ?, class_name = ?, cnpj = ?, address = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [email, name, course, className, cnpj, address, phone, userId]);

    const updatedUser = await db.getAsync(`
      SELECT id, email, name, role, course, class_name, cnpj, address, phone, created_at, updated_at 
      FROM users WHERE id = ?
    `, [userId]);

    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Reset user password
router.post('/:id/reset-password', requireRole(['admin']), async (req, res) => {
  try {
    const userId = req.params.id;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Nova senha deve ter pelo menos 6 caracteres' });
    }

    // Check if user exists
    const user = await db.getAsync('SELECT id FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.runAsync(`
      UPDATE users 
      SET password = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [hashedPassword, userId]);

    res.json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Delete user
router.delete('/:id', requireRole(['admin']), async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Don't allow deleting the current admin
    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'Não é possível excluir sua própria conta' });
    }

    // Check for dependencies
    if (user.role === 'institution') {
      const hasInternships = await db.getAsync('SELECT id FROM internships WHERE institution_id = ?', [userId]);
      if (hasInternships) {
        return res.status(400).json({ error: 'Não é possível excluir instituição com vagas cadastradas' });
      }
    }

    if (user.role === 'student') {
      const hasReservations = await db.getAsync('SELECT id FROM reservations WHERE student_id = ? AND status = "active"', [userId]);
      if (hasReservations) {
        return res.status(400).json({ error: 'Não é possível excluir estudante com reservas ativas' });
      }
    }

    await db.runAsync('DELETE FROM users WHERE id = ?', [userId]);

    res.json({ message: 'Usuário excluído com sucesso!' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;