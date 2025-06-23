import express from 'express';
import { db } from '../database/init.js';
import { requireRole } from '../middleware/auth.js';
import { Parser } from 'json2csv';

const router = express.Router();

// Get institution's internships
router.get('/internships', requireRole(['institution']), async (req, res) => {
  try {
    const internships = await db.allAsync(`
      SELECT * FROM internships 
      WHERE institution_id = ?
      ORDER BY created_at DESC
    `, [req.user.id]);

    res.json(internships);
  } catch (error) {
    console.error('Get institution internships error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Create internship
router.post('/internships', requireRole(['institution']), async (req, res) => {
  try {
    const {
      title,
      description,
      totalSpots,
      period,
      shift,
      monthYear,
      address,
      city,
      area
    } = req.body;

    if (!title || !totalSpots || !period || !shift || !monthYear || !address || !city || !area) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    const result = await db.runAsync(`
      INSERT INTO internships (
        institution_id, title, description, total_spots, available_spots,
        period, shift, month_year, address, city, area
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.user.id, title, description, totalSpots, totalSpots,
      period, shift, monthYear, address, city, area
    ]);

    const newInternship = await db.getAsync(`
      SELECT i.*, u.name as institution_name
      FROM internships i
      JOIN users u ON i.institution_id = u.id
      WHERE i.id = ?
    `, [result.lastID]);

    // Emit real-time update
    req.io.emit('new_internship', newInternship);

    res.status(201).json(newInternship);
  } catch (error) {
    console.error('Create internship error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Update internship
router.put('/internships/:id', requireRole(['institution']), async (req, res) => {
  try {
    const internshipId = req.params.id;
    const {
      title,
      description,
      totalSpots,
      period,
      shift,
      monthYear,
      address,
      city,
      area,
      status
    } = req.body;

    // Check if internship belongs to this institution
    const internship = await db.getAsync(`
      SELECT * FROM internships 
      WHERE id = ? AND institution_id = ?
    `, [internshipId, req.user.id]);

    if (!internship) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    // Calculate new available spots if total spots changed
    let availableSpots = internship.available_spots;
    if (totalSpots !== internship.total_spots) {
      const reservedSpots = internship.total_spots - internship.available_spots;
      availableSpots = Math.max(0, totalSpots - reservedSpots);
    }

    await db.runAsync(`
      UPDATE internships 
      SET title = ?, description = ?, total_spots = ?, available_spots = ?,
          period = ?, shift = ?, month_year = ?, address = ?, city = ?, area = ?,
          status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      title, description, totalSpots, availableSpots,
      period, shift, monthYear, address, city, area,
      status || internship.status, internshipId
    ]);

    const updatedInternship = await db.getAsync(`
      SELECT i.*, u.name as institution_name
      FROM internships i
      JOIN users u ON i.institution_id = u.id
      WHERE i.id = ?
    `, [internshipId]);

    // Emit real-time update
    req.io.emit('internship_updated', updatedInternship);

    res.json(updatedInternship);
  } catch (error) {
    console.error('Update internship error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Delete internship
router.delete('/internships/:id', requireRole(['institution']), async (req, res) => {
  try {
    const internshipId = req.params.id;

    // Check if internship belongs to this institution
    const internship = await db.getAsync(`
      SELECT * FROM internships 
      WHERE id = ? AND institution_id = ?
    `, [internshipId, req.user.id]);

    if (!internship) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    // Check if there are active reservations
    const activeReservations = await db.getAsync(`
      SELECT COUNT(*) as count FROM reservations 
      WHERE internship_id = ? AND status = 'active'
    `, [internshipId]);

    if (activeReservations.count > 0) {
      return res.status(400).json({ error: 'Não é possível excluir vaga com reservas ativas' });
    }

    await db.runAsync('DELETE FROM internships WHERE id = ?', [internshipId]);

    // Emit real-time update
    req.io.emit('internship_deleted', { id: internshipId });

    res.json({ message: 'Vaga excluída com sucesso!' });
  } catch (error) {
    console.error('Delete internship error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Get students enrolled in internship
router.get('/internships/:id/students', requireRole(['institution']), async (req, res) => {
  try {
    const internshipId = req.params.id;

    // Check if internship belongs to this institution
    const internship = await db.getAsync(`
      SELECT * FROM internships 
      WHERE id = ? AND institution_id = ?
    `, [internshipId, req.user.id]);

    if (!internship) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    const students = await db.allAsync(`
      SELECT u.name, u.email, u.course, u.class_name, r.reserved_at, r.status
      FROM reservations r
      JOIN users u ON r.student_id = u.id
      WHERE r.internship_id = ?
      ORDER BY r.reserved_at DESC
    `, [internshipId]);

    res.json(students);
  } catch (error) {
    console.error('Get internship students error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Export students list as CSV
router.get('/internships/:id/students/export', requireRole(['institution']), async (req, res) => {
  try {
    const internshipId = req.params.id;

    // Check if internship belongs to this institution
    const internship = await db.getAsync(`
      SELECT * FROM internships 
      WHERE id = ? AND institution_id = ?
    `, [internshipId, req.user.id]);

    if (!internship) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    const students = await db.allAsync(`
      SELECT u.name as "Nome", u.email as "Email", u.course as "Curso", 
             u.class_name as "Turma", r.reserved_at as "Data da Reserva", 
             r.status as "Status"
      FROM reservations r
      JOIN users u ON r.student_id = u.id
      WHERE r.internship_id = ?
      ORDER BY r.reserved_at DESC
    `, [internshipId]);

    if (students.length === 0) {
      return res.status(404).json({ error: 'Nenhum estudante encontrado' });
    }

    const parser = new Parser();
    const csv = parser.parse(students);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="estudantes_${internship.title}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Export students error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;