// src/routes/adminRoutes.ts
import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { 
  getAllUsers, 
  createUser, 
  getAttendanceReports,
  getAllLeaveRequests,  
  updateLeaveRequestStatus 
} from '../controllers/adminController';

const router = express.Router();


router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.post('/users', authMiddleware, adminMiddleware, createUser);


router.get('/reports/all', authMiddleware, adminMiddleware, getAttendanceReports);


router.get('/requests', authMiddleware, adminMiddleware, getAllLeaveRequests);


router.put('/requests/:id', authMiddleware, adminMiddleware, updateLeaveRequestStatus);

export default router;