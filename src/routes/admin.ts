import { Router } from 'express'
import {
	addDoctor,
	editDoctor,
	removeDoctor,
	viewAllDoctors,
	viewAppointments,
} from '../controllers/adminController'
import { authMiddleware } from '../middlewares/auth'

const router = Router()

// Admin endpointlari uchun avval avtorizatsiyani tekshiradi.
router.use(authMiddleware)

// Shifokorlarni boshqarish endpointlari.
router.post('/doctors', addDoctor)
router.get('/doctors', viewAllDoctors)
router.put('/doctors/:id', editDoctor)
router.delete('/doctors/:id', removeDoctor)

// Barcha uchrashuvlarni ko'rish endpointi.
router.get('/appointments', viewAppointments)

export default router
