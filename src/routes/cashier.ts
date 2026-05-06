import { Router } from 'express'
import {
	cancelExistingAppointment,
	createNewAppointment,
	createNewPatient,
	createNewPayment,
	editAppointment,
	viewAppointments,
} from '../controllers/cashierController'
import { authMiddleware } from '../middlewares/auth'

const router = Router()

// Cashier endpointlari uchun avval avtorizatsiyani tekshiradi.
router.use(authMiddleware)

// Bemorlarni yaratish endpointi.
router.post('/patients', createNewPatient)

// Uchrashuvlarni boshqarish endpointlari.
router.post('/appointments', createNewAppointment)
router.get('/appointments', viewAppointments)
router.put('/appointments/:id', editAppointment)
router.patch('/appointments/:id/cancel', cancelExistingAppointment)

// To'lov endpointi.
router.post('/payments', createNewPayment)

export default router
