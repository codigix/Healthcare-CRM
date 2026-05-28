import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import pool from '../db';

const router = Router();

// GET all notifications for the current user/department
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const userId = req.user?.id || '';
    const userDept = req.user?.department || '';

    connection = await pool.getConnection();

    // 1. Fetch all matching notifications
    const [notifications]: any = await connection.query(
      `SELECT * FROM notifications 
       WHERE receiverId = ? 
          OR (department IS NOT NULL AND LOWER(department) = LOWER(?)) 
          OR (receiverId IS NULL AND department IS NULL)
       ORDER BY createdAt DESC`,
      [userId, userDept]
    );

    // 2. Fetch unread count
    const [unreadResult]: any = await connection.query(
      `SELECT COUNT(*) as unreadCount FROM notifications 
       WHERE (receiverId = ? 
          OR (department IS NOT NULL AND LOWER(department) = LOWER(?)) 
          OR (receiverId IS NULL AND department IS NULL))
         AND isRead = 0`,
      [userId, userDept]
    );
    
    const unreadCount = unreadResult[0]?.unreadCount || 0;

    connection.release();

    res.json({ notifications, unreadCount });
  } catch (error: any) {
    if (connection) connection.release();
    console.error('[NOTIFICATIONS GET] Error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications', details: error.message });
  }
});

// POST a new notification
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { title, message, type = 'info', receiverId, department, senderName } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Missing title or message' });
    }

    const resolvedSenderName = senderName || 'System';
    const senderId = req.user?.id || null;

    connection = await pool.getConnection();

    // Insert notification with UUID
    const query = `
      INSERT INTO notifications (id, title, message, type, senderId, senderName, receiverId, department, isRead, createdAt, updatedAt)
      VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, 0, NOW(3), NOW(3))
    `;

    await connection.query(query, [
      title,
      message,
      type,
      senderId,
      resolvedSenderName,
      receiverId || null,
      department || null
    ]);

    // Fetch the newly created notification
    const [newNotification]: any = await connection.query(
      'SELECT * FROM notifications WHERE title = ? AND message = ? ORDER BY createdAt DESC LIMIT 1',
      [title, message]
    );

    connection.release();

    res.status(201).json(newNotification[0]);
  } catch (error: any) {
    if (connection) connection.release();
    console.error('[NOTIFICATIONS POST] Error:', error);
    res.status(500).json({ error: 'Failed to create notification', details: error.message });
  }
});

// PATCH mark a specific notification as read
router.patch('/:id/read', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;

    connection = await pool.getConnection();
    const result = await connection.query(
      'UPDATE notifications SET isRead = 1, updatedAt = NOW(3) WHERE id = ?',
      [id]
    );

    if ((result[0] as any).affectedRows === 0) {
      connection.release();
      return res.status(404).json({ error: 'Notification not found' });
    }

    const [notification]: any = await connection.query(
      'SELECT * FROM notifications WHERE id = ?',
      [id]
    );

    connection.release();
    res.json(notification[0]);
  } catch (error: any) {
    if (connection) connection.release();
    console.error('[NOTIFICATIONS PATCH READ] Error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read', details: error.message });
  }
});

// POST mark all matching notifications as read
router.post('/mark-all-read', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const userId = req.user?.id || '';
    const userDept = req.user?.department || '';

    connection = await pool.getConnection();
    await connection.query(
      `UPDATE notifications 
       SET isRead = 1, updatedAt = NOW(3)
       WHERE (receiverId = ? 
          OR (department IS NOT NULL AND LOWER(department) = LOWER(?)) 
          OR (receiverId IS NULL AND department IS NULL))
         AND isRead = 0`,
      [userId, userDept]
    );

    connection.release();
    res.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    if (connection) connection.release();
    console.error('[NOTIFICATIONS MARK ALL READ] Error:', error);
    res.status(500).json({ error: 'Failed to mark all as read', details: error.message });
  }
});

// DELETE a notification
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  let connection;
  try {
    const { id } = req.params;

    connection = await pool.getConnection();
    const result = await connection.query(
      'DELETE FROM notifications WHERE id = ?',
      [id]
    );

    connection.release();

    if ((result[0] as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error: any) {
    if (connection) connection.release();
    console.error('[NOTIFICATIONS DELETE] Error:', error);
    res.status(500).json({ error: 'Failed to delete notification', details: error.message });
  }
});

export default router;
