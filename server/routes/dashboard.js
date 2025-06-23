import express from 'express';
import { db } from '../database/init.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Admin dashboard statistics
router.get('/admin/stats', requireRole(['admin']), async (req, res) => {
  try {
    const stats = await Promise.all([
      db.getAsync('SELECT COUNT(*) as count FROM users WHERE role = "student"'),
      db.getAsync('SELECT COUNT(*) as count FROM users WHERE role = "institution"'),
      db.getAsync('SELECT COUNT(*) as count FROM internships WHERE status = "active"'),
      db.getAsync('SELECT COUNT(*) as count FROM reservations WHERE status = "active"'),
      db.getAsync('SELECT SUM(total_spots) as total, SUM(available_spots) as available FROM internships WHERE status = "active"')
    ]);

    const [students, institutions, activeInternships, activeReservations, spotsData] = stats;

    res.json({
      totalStudents: students.count,
      totalInstitutions: institutions.count,
      activeInternships: activeInternships.count,
      activeReservations: activeReservations.count,
      totalSpots: spotsData.total || 0,
      availableSpots: spotsData.available || 0,
      occupiedSpots: (spotsData.total || 0) - (spotsData.available || 0)
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Admin dashboard charts data
router.get('/admin/charts', requireRole(['admin']), async (req, res) => {
  try {
    // Reservations by month
    const reservationsByMonth = await db.allAsync(`
      SELECT 
        strftime('%Y-%m', reserved_at) as month,
        COUNT(*) as count
      FROM reservations 
      WHERE reserved_at >= date('now', '-12 months')
      GROUP BY strftime('%Y-%m', reserved_at)
      ORDER BY month
    `);

    // Internships by area
    const internshipsByArea = await db.allAsync(`
      SELECT area, COUNT(*) as count
      FROM internships
      WHERE status = 'active'
      GROUP BY area
      ORDER BY count DESC
      LIMIT 10
    `);

    // Most active institutions
    const activeInstitutions = await db.allAsync(`
      SELECT 
        u.name,
        COUNT(i.id) as internships_count,
        SUM(i.total_spots - i.available_spots) as reserved_spots
      FROM users u
      LEFT JOIN internships i ON u.id = i.institution_id AND i.status = 'active'
      WHERE u.role = 'institution'
      GROUP BY u.id, u.name
      ORDER BY internships_count DESC
      LIMIT 10
    `);

    res.json({
      reservationsByMonth,
      internshipsByArea,
      activeInstitutions
    });
  } catch (error) {
    console.error('Get admin charts error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Institution dashboard statistics
router.get('/institution/stats', requireRole(['institution']), async (req, res) => {
  try {
    const stats = await Promise.all([
      db.getAsync('SELECT COUNT(*) as count FROM internships WHERE institution_id = ?', [req.user.id]),
      db.getAsync('SELECT COUNT(*) as count FROM internships WHERE institution_id = ? AND status = "active"', [req.user.id]),
      db.getAsync(`
        SELECT COUNT(*) as count FROM reservations r
        JOIN internships i ON r.internship_id = i.id
        WHERE i.institution_id = ? AND r.status = 'active'
      `, [req.user.id]),
      db.getAsync(`
        SELECT SUM(total_spots) as total, SUM(available_spots) as available 
        FROM internships 
        WHERE institution_id = ? AND status = 'active'
      `, [req.user.id])
    ]);

    const [totalInternships, activeInternships, totalReservations, spotsData] = stats;

    res.json({
      totalInternships: totalInternships.count,
      activeInternships: activeInternships.count,
      totalReservations: totalReservations.count,
      totalSpots: spotsData.total || 0,
      availableSpots: spotsData.available || 0,
      occupiedSpots: (spotsData.total || 0) - (spotsData.available || 0)
    });
  } catch (error) {
    console.error('Get institution stats error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Student dashboard statistics
router.get('/student/stats', requireRole(['student']), async (req, res) => {
  try {
    const stats = await Promise.all([
      db.getAsync('SELECT COUNT(*) as count FROM reservations WHERE student_id = ? AND status = "active"', [req.user.id]),
      db.getAsync('SELECT COUNT(*) as count FROM reservations WHERE student_id = ? AND status = "completed"', [req.user.id]),
      db.getAsync('SELECT COUNT(*) as count FROM reservations WHERE student_id = ? AND status = "cancelled"', [req.user.id])
    ]);

    const [activeReservations, completedReservations, cancelledReservations] = stats;

    res.json({
      activeReservations: activeReservations.count,
      completedReservations: completedReservations.count,
      cancelledReservations: cancelledReservations.count,
      totalReservations: activeReservations.count + completedReservations.count + cancelledReservations.count
    });
  } catch (error) {
    console.error('Get student stats error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;