import { Router } from 'express'
import {
	createNewPrescription,
	viewMyAppointments,
} from '../controllers/doctorController'
import { authMiddleware } from '../middlewares/auth'

const router = Router()

// Doctor endpointlari uchun avval avtorizatsiyani tekshiradi.
router.use(authMiddleware)

// O'z uchrashuvlarini ko'rish endpointi.
router.get('/appointments', viewMyAppointments)

// Tashxis va tavsiyalar yozish endpointi.
router.post('/prescriptions', createNewPrescription)

export default router
