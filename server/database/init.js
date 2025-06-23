import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database(process.env.DATABASE_URL || './database.sqlite');

// Promisify database methods
db.runAsync = promisify(db.run.bind(db));
db.getAsync = promisify(db.get.bind(db));
db.allAsync = promisify(db.all.bind(db));

export const initDatabase = async () => {
  try {
    // Users table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('student', 'institution', 'admin')),
        course TEXT,
        class_name TEXT,
        cnpj TEXT,
        address TEXT,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Internships table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS internships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        institution_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        total_spots INTEGER NOT NULL,
        available_spots INTEGER NOT NULL,
        period TEXT NOT NULL,
        shift TEXT NOT NULL,
        month_year TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        area TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'cancelled')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (institution_id) REFERENCES users (id)
      )
    `);

    // Reservations table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        internship_id INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
        reserved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        FOREIGN KEY (student_id) REFERENCES users (id),
        FOREIGN KEY (internship_id) REFERENCES internships (id),
        UNIQUE(student_id, internship_id)
      )
    `);

    // Documents table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        institution_id INTEGER NOT NULL,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        mime_type TEXT NOT NULL,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (institution_id) REFERENCES users (id)
      )
    `);

    // Create default admin user
    const adminExists = await db.getAsync('SELECT id FROM users WHERE email = ?', ['admin@sistema.com']);
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.runAsync(`
        INSERT INTO users (email, password, name, role)
        VALUES (?, ?, ?, ?)
      `, ['admin@sistema.com', hashedPassword, 'Administrador', 'admin']);
      console.log('✅ Usuário admin criado: admin@sistema.com / admin123');
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

export { db };