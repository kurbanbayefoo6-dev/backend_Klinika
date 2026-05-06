import { Request, Response } from 'express'
import pool from '../config/db'
import {
	CreateAppointmentRequest,
	CreatePatientRequest,
	CreatePaymentRequest,
	UpdateAppointmentRequest,
} from '../types'

// Cashier rolini tez tekshiradi.
const isCashier = (req: Request) => req.user?.role === 'cashier'

// Yangi bemor qo'shadi.
export const createNewPatient = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		if (!isCashier(req)) {
			res.status(403).json({ message: '❌ Ruxsat yoq' })
			return
		}

		const body = req.body as CreatePatientRequest

		if (!body.full_name?.trim() || !body.address?.trim()) {
			res.status(400).json({ message: '❌ full_name va address kerak' })
			return
		}

		const result = await pool.query(
			`INSERT INTO patients (full_name, phone, address, date_of_birth)
			 VALUES ($1,$2,$3,$4) RETURNING id, full_name, phone, address, date_of_birth`,
			[
				body.full_name,
				body.phone ?? null,
				body.address,
				body.date_of_birth ?? null,
			],
		)

		res
			.status(201)
			.json({ message: "✅ Bemor qo'shildi", patient: result.rows[0] })
	} catch (error) {
		res
			.status(500)
			.json({ message: '❌ Server xatosi', error: (error as Error).message })
	}
}

// Yangi uchrashuv belgilaydi.
export const createNewAppointment = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		if (!isCashier(req)) {
			res.status(403).json({ message: '❌ Ruxsat yoq' })
			return
		}

		const body = req.body as CreateAppointmentRequest

		if (
			body.patient_id === undefined ||
			body.doctor_id === undefined ||
			!body.appointment_date?.trim()
		) {
			res.status(400).json({
				message: '❌ patient_id, doctor_id va appointment_date kerak',
			})
			return
		}

		const patient = await pool.query(`SELECT id FROM patients WHERE id = $1`, [
			Number(body.patient_id),
		])
		if (!patient.rows[0]) {
			res.status(404).json({ message: '❌ Bemor topilmadi' })
			return
		}

		const doctor = await pool.query(`SELECT id FROM doctors WHERE id = $1`, [
			Number(body.doctor_id),
		])
		if (!doctor.rows[0]) {
			res.status(404).json({ message: '❌ Shifokor topilmadi' })
			return
		}

		const result = await pool.query(
			`INSERT INTO appointments (patient_id, doctor_id, appointment_date, reason, status)
			 VALUES ($1,$2,$3,$4,$5) RETURNING id, patient_id, doctor_id, appointment_date, reason, status`,
			[
				Number(body.patient_id),
				Number(body.doctor_id),
				body.appointment_date,
				body.reason ?? null,
				body.status ?? 'scheduled',
			],
		)

		res
			.status(201)
			.json({ message: '✅ Uchrashuv belgilandi', appointment: result.rows[0] })
	} catch (error) {
		res
			.status(500)
			.json({ message: '❌ Server xatosi', error: (error as Error).message })
	}
}

// Barcha uchrashuvlarni ko'rsatadi.
export const viewAppointments = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		if (!isCashier(req)) {
			res.status(403).json({ message: '❌ Ruxsat yoq' })
			return
		}

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
			 ORDER BY a.id DESC`,
		)
		res.json({ appointments: result.rows })
	} catch (error) {
		res
			.status(500)
			.json({ message: '❌ Server xatosi', error: (error as Error).message })
	}
}

// Uchrashuvni tahrirlaydi.
export const editAppointment = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		if (!isCashier(req)) {
			res.status(403).json({ message: '❌ Ruxsat yoq' })
			return
		}

		const id = Number(req.params.id)
		const body = req.body as UpdateAppointmentRequest

		if (Number.isNaN(id)) {
			res.status(400).json({ message: "❌ Noto'g'ri id" })
			return
		}

		if (
			body.patient_id === undefined &&
			body.doctor_id === undefined &&
			body.appointment_date === undefined &&
			body.reason === undefined &&
			body.status === undefined
		) {
			res.status(400).json({ message: "❌ Yangilash uchun ma'lumot kerak" })
			return
		}

		const existingAppointment = await pool.query(
			`SELECT id FROM appointments WHERE id = $1`,
			[id],
		)
		if (!existingAppointment.rows[0]) {
			res.status(404).json({ message: '❌ Uchrashuv topilmadi' })
			return
		}

		if (body.patient_id !== undefined) {
			const patient = await pool.query(
				`SELECT id FROM patients WHERE id = $1`,
				[Number(body.patient_id)],
			)
			if (!patient.rows[0]) {
				res.status(404).json({ message: '❌ Bemor topilmadi' })
				return
			}
		}

		if (body.doctor_id !== undefined) {
			const doctor = await pool.query(`SELECT id FROM doctors WHERE id = $1`, [
				Number(body.doctor_id),
			])
			if (!doctor.rows[0]) {
				res.status(404).json({ message: '❌ Shifokor topilmadi' })
				return
			}
		}

		const fields: string[] = []
		const values: Array<string | number | null> = []
		if (body.patient_id !== undefined) {
			fields.push(`patient_id = $${fields.length + 1}`)
			values.push(body.patient_id)
		}
		if (body.doctor_id !== undefined) {
			fields.push(`doctor_id = $${fields.length + 1}`)
			values.push(body.doctor_id)
		}
		if (body.appointment_date !== undefined) {
			fields.push(`appointment_date = $${fields.length + 1}`)
			values.push(body.appointment_date)
		}
		if (body.reason !== undefined) {
			fields.push(`reason = $${fields.length + 1}`)
			values.push(body.reason)
		}
		if (body.status !== undefined) {
			fields.push(`status = $${fields.length + 1}`)
			values.push(body.status)
		}

		values.push(id)

		const result = await pool.query(
			`UPDATE appointments SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING id, patient_id, doctor_id, appointment_date, reason, status`,
			values,
		)
		res.json({
			message: '✅ Uchrashuv yangilandi',
			appointment: result.rows[0],
		})
	} catch (error) {
		res
			.status(500)
			.json({ message: '❌ Server xatosi', error: (error as Error).message })
	}
}

// Uchrashuvni bekor qiladi.
export const cancelExistingAppointment = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		if (!isCashier(req)) {
			res.status(403).json({ message: '❌ Ruxsat yoq' })
			return
		}

		const id = Number(req.params.id)
		if (Number.isNaN(id)) {
			res.status(400).json({ message: "❌ Noto'g'ri id" })
			return
		}
		const existingAppointment = await pool.query(
			`SELECT id FROM appointments WHERE id = $1`,
			[id],
		)
		if (!existingAppointment.rows[0]) {
			res.status(404).json({ message: '❌ Uchrashuv topilmadi' })
			return
		}

		const result = await pool.query(
			`UPDATE appointments SET status = 'cancelled' WHERE id = $1 RETURNING id, patient_id, doctor_id, appointment_date, reason, status`,
			[id],
		)
		res.json({
			message: '✅ Uchrashuv bekor qilindi',
			appointment: result.rows[0],
		})
	} catch (error) {
		res
			.status(500)
			.json({ message: '❌ Server xatosi', error: (error as Error).message })
	}
}

// To'lovni yozadi.
export const createNewPayment = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		if (!isCashier(req)) {
			res.status(403).json({ message: '❌ Ruxsat yoq' })
			return
		}

		const body = req.body as CreatePaymentRequest

		if (
			body.appointment_id === undefined ||
			body.amount === undefined ||
			!body.method?.trim()
		) {
			res.status(400).json({
				message: '❌ appointment_id, amount va method kerak',
			})
			return
		}
		const existingAppointment = await pool.query(
			`SELECT id FROM appointments WHERE id = $1`,
			[Number(body.appointment_id)],
		)
		if (!existingAppointment.rows[0]) {
			res.status(404).json({ message: '❌ Uchrashuv topilmadi' })
			return
		}

		const result = await pool.query(
			`INSERT INTO payments (appointment_id, amount, method, payment_date) VALUES ($1,$2,$3,$4) RETURNING id, appointment_id, amount, method, payment_date`,
			[
				Number(body.appointment_id),
				Number(body.amount),
				body.method,
				body.payment_date ?? new Date().toISOString(),
			],
		)

		res
			.status(201)
			.json({ message: "✅ To'lov qilindi", payment: result.rows[0] })
	} catch (error) {
		res
			.status(500)
			.json({ message: '❌ Server xatosi', error: (error as Error).message })
	}
}
