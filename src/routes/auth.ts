import { Router } from 'express'
import { getProfile, login } from '../controllers/authController'
import { authMiddleware } from '../middlewares/auth'

const router = Router()

// Public routes (Login only)
router.post('/login', login)

// Protected routes
router.get('/profile', authMiddleware, getProfile)

export default router
