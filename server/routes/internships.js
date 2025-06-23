import express from 'express';
import { db } from '../database/init.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all internships (for students)
router.get('/', async (req, res) => {
  try {
    const { city, area, monthYear, period } = req.query;
    
    let query = `
      SELECT i.*, u.name as institution_name, u.address as institution_address
      FROM internships i
      JOIN users u ON i.institution_id = u.id
      WHERE i.status = 'active' AND i.available_spots > 0
    `;
    
    const params = [];
    
    if (city) {
      query += ' AND i.city LIKE ?';
      params.push(`%${city}%`);
    }
    
    if (area) {
      query += ' AND i.area LIKE ?';
      params.push(`%${area}%`);
    }
    
    if (monthYear) {
      query += ' AND i.month_year = ?';
      params.push(monthYear);
    }
    
    if (period) {
      query += ' AND i.period = ?';
      params.push(period);
    }
    
    query += ' ORDER BY i.created_at DESC';
    
    const internships = await db.allAsync(query, params);
    res.json(internships);
  } catch (error) {
    console.error('Get internships error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Get internship by ID
router.get('/:id', async (req, res) => {
  try {
    const internship = await db.getAsync(`
      SELECT i.*, u.name as institution_name, u.address as institution_address, u.phone as institution_phone
      FROM internships i
      JOIN users u ON i.institution_id = u.id
      WHERE i.id = ?
    `, [req.params.id]);

    if (!internship) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    res.json(internship);
  } catch (error) {
    console.error('Get internship error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Reserve internship (students only)
router.post('/:id/reserve', requireRole(['student']), async (req, res) => {
  try {
    const internshipId = req.params.id;
    const studentId = req.user.id;

    // Check if internship exists and has available spots
    const internship = await db.getAsync(`
      SELECT * FROM internships 
      WHERE id = ? AND status = 'active' AND available_spots > 0
    `, [internshipId]);

    if (!internship) {
      return res.status(400).json({ error: 'Vaga não disponível' });
    }

    // Check if student already reserved this internship
    const existingReservation = await db.getAsync(`
      SELECT id FROM reservations 
      WHERE student_id = ? AND internship_id = ? AND status = 'active'
    `, [studentId, internshipId]);

    if (existingReservation) {
      return res.status(400).json({ error: 'Você já reservou esta vaga' });
    }

    // Start transaction
    await db.runAsync('BEGIN TRANSACTION');

    try {
      // Create reservation
      await db.runAsync(`
        INSERT INTO reservations (student_id, internship_id, status)
        VALUES (?, ?, 'active')
      `, [studentId, internshipId]);

      // Update available spots
      await db.runAsync(`
        UPDATE internships 
        SET available_spots = available_spots - 1, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [internshipId]);

      await db.runAsync('COMMIT');

      // Get updated internship data
      const updatedInternship = await db.getAsync(`
        SELECT i.*, u.name as institution_name
        FROM internships i
        JOIN users u ON i.institution_id = u.id
        WHERE i.id = ?
      `, [internshipId]);

      // Emit real-time update
      req.io.emit('internship_updated', updatedInternship);

      res.json({ message: 'Vaga reservada com sucesso!' });
    } catch (error) {
      await db.runAsync('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Reserve internship error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Get student reservations
router.get('/student/reservations', requireRole(['student']), async (req, res) => {
  try {
    const reservations = await db.allAsync(`
      SELECT r.*, i.title, i.period, i.shift, i.month_year, i.address, i.city, i.area,
             u.name as institution_name
      FROM reservations r
      JOIN internships i ON r.internship_id = i.id
      JOIN users u ON i.institution_id = u.id
      WHERE r.student_id = ?
      ORDER BY r.reserved_at DESC
    `, [req.user.id]);

    res.json(reservations);
  } catch (error) {
    console.error('Get student reservations error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Cancel reservation
router.delete('/reservations/:id', requireRole(['student']), async (req, res) => {
  try {
    const reservationId = req.params.id;
    const studentId = req.user.id;

    // Get reservation details
    const reservation = await db.getAsync(`
      SELECT * FROM reservations 
      WHERE id = ? AND student_id = ? AND status = 'active'
    `, [reservationId, studentId]);

    if (!reservation) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    // Start transaction
    await db.runAsync('BEGIN TRANSACTION');

    try {
      // Cancel reservation
      await db.runAsync(`
        UPDATE reservations 
        SET status = 'cancelled'
        WHERE id = ?
      `, [reservationId]);

      // Restore available spot
      await db.runAsync(`
        UPDATE internships 
        SET available_spots = available_spots + 1, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [reservation.internship_id]);

      await db.runAsync('COMMIT');

      // Get updated internship data
      const updatedInternship = await db.getAsync(`
        SELECT i.*, u.name as institution_name
        FROM internships i
        JOIN users u ON i.institution_id = u.id
        WHERE i.id = ?
      `, [reservation.internship_id]);

      // Emit real-time update
      req.io.emit('internship_updated', updatedInternship);

      res.json({ message: 'Reserva cancelada com sucesso!' });
    } catch (error) {
      await db.runAsync('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;