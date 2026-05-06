import { Request, Response } from 'express'
import pool from '../config/db'
import { CreatePrescriptionRequest } from '../types'

// Doctor rolini tez tekshiradi.
const isDoctor = (req: Request) => req.user?.role === 'doctor'

// Faqat o'z uchrashuvlarini ko'rsatadi.
export const viewMyAppointments = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		if (!isDoctor(req)) {
			res.status(403).json({ message: '❌ Ruxsat yoq' })
			return
		}

		const doctorId = Number(req.user?.id)
		const result = await pool.query(
			`SELECT
				a.id,
				a.patient_id,
				p.full_name AS patient_name,
				a.doctor_id,
				d.full_name AS doctor_name,
				a.appointment_date,
				a.reason,
				a.status
			 FROM appointments a
			 LEFT JOIN patients p ON p.id = a.patient_id
			 LEFT JOIN doctors d ON d.id = a.doctor_id
			 WHERE a.doctor_id = $1
			 ORDER BY a.id DESC`,
			[doctorId],
		)
		res.json({ appointments: result.rows })
	} catch (error) {
		res
			.status(500)
			.json({ message: '❌ Server xatosi', error: (error as Error).message })
	}
}

// Tashxis va tavsiyalarni saqlaydi.
export const createNewPrescription = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		if (!isDoctor(req)) {
			res.status(403).json({ message: '❌ Ruxsat yoq' })
			return
		}

		const body = req.body as CreatePrescriptionRequest

		if (
			body.appointment_id === undefined ||
			!body.recommendations?.trim() ||
			!body.duration?.trim()
		) {
			res.status(400).json({
				message: '❌ appointment_id, recommendations va duration kerak',
			})
			return
		}

		const appointmentResult = await pool.query(
			`SELECT * FROM appointments WHERE id = $1`,
			[Number(body.appointment_id)],
		)
		const appointment = appointmentResult.rows[0]

		if (!appointment) {
			res.status(404).json({ message: '❌ Uchrashuv topilmadi' })
			return
		}

		if (appointment.doctor_id !== req.user?.id) {
			res.status(403).json({ message: '❌ Bu uchrashuv sizga tegishli emas' })
			return
		}

		const result = await pool.query(
			`INSERT INTO prescriptions (appointment_id, recommendations, duration) VALUES ($1,$2,$3) RETURNING id, appointment_id, recommendations, duration, created_at`,
			[Number(body.appointment_id), body.recommendations, body.duration],
		)

		res
			.status(201)
			.json({ message: '✅ Tavsiyalar saqlandi', prescription: result.rows[0] })
	} catch (error) {
		res
			.status(500)
			.json({ message: '❌ Server xatosi', error: (error as Error).message })
	}
}
