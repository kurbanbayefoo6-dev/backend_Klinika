import { Request, Response } from 'express'
import pool from '../database/db'
import { CreateDoctorRequest, UpdateDoctorRequest } from '../types'
import { hashPassword } from '../utils/auth'

// Admin rolini tez tekshiradi.
const isAdmin = (req: Request) => req.user?.role === 'admin'

// Yangi shifokor qo'shadi.
export const addDoctor = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!isAdmin(req)) {
			res.status(403).json({ message: '❌ Ruxsat yoq' })
			return
		}

		const body = req.body as CreateDoctorRequest
		const profileImgUrl = body.profile_img_url ?? body.profile_img

		if (
			!body.full_name?.trim() ||
			!body.username?.trim() ||
			!body.password?.trim() ||
			!profileImgUrl?.trim()
		) {
			res.status(400).json({
				message: '❌ full_name, username, password va profile_img kerak',
			})
			return
		}

		const hashedPassword = await hashPassword(body.password)
		const result = await pool.query(
			`INSERT INTO doctors (
				full_name, specialty, username, password, phone, status, profile_img_url, role
			) VALUES ($1,$2,$3,$4,$5,$6,$7,'doctor') RETURNING id, full_name, specialty, username, phone, status, profile_img_url, role`,
			[
				body.full_name,
				body.specialty ?? null,
				body.username,
				hashedPassword,
				body.phone ?? null,
				body.status ?? 'active',
				profileImgUrl ?? null,
			],
		)

		res
			.status(201)
			.json({ message: "✅ Shifokor qo'shildi", doctor: result.rows[0] })
	} catch (error) {
		res
			.status(500)
			.json({ message: '❌ Server xatosi', error: (error as Error).message })
	}
}

// Barcha shifokorlarni ko'rsatadi.
export const viewAllDoctors = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		if (!isAdmin(req)) {
			res.status(403).json({ message: '❌ Ruxsat yoq' })
			return
		}

		const result = await pool.query(
			`SELECT id, full_name, specialty, username, phone, status, profile_img_url, role
			 FROM doctors ORDER BY id DESC`,
		)
		res.json({ doctors: result.rows })
	} catch (error) {
		res
			.status(500)
			.json({ message: '❌ Server xatosi', error: (error as Error).message })
	}
}

// Bitta shifokorni tahrirlaydi.
export const editDoctor = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		if (!isAdmin(req)) {
			res.status(403).json({ message: '❌ Ruxsat yoq' })
			return
		}

		const id = Number(req.params.id)
		const body = req.body as UpdateDoctorRequest
		const profileImgUrl = body.profile_img_url ?? body.profile_img

		if (Number.isNaN(id)) {
			res.status(400).json({ message: "❌ Noto'g'ri id" })
			return
		}

		if (
			body.full_name === undefined &&
			body.specialty === undefined &&
			body.username === undefined &&
			body.password === undefined &&
			body.phone === undefined &&
			body.status === undefined &&
			profileImgUrl === undefined
		) {
			res.status(400).json({ message: "❌ Yangilash uchun ma'lumot kerak" })
			return
		}

		const existing = await pool.query(`SELECT id FROM doctors WHERE id = $1`, [
			id,
		])
		if (!existing.rows[0]) {
			res.status(404).json({ message: '❌ Shifokor topilmadi' })
			return
		}

		const fields: string[] = []
		const values: Array<string | number | null> = []

		if (body.full_name !== undefined) {
			fields.push(`full_name = $${fields.length + 1}`)
			values.push(body.full_name)
		}
		if (body.specialty !== undefined) {
			fields.push(`specialty = $${fields.length + 1}`)
			values.push(body.specialty)
		}
		if (body.username !== undefined) {
			fields.push(`username = $${fields.length + 1}`)
			values.push(body.username)
		}
		if (body.password !== undefined) {
			const hashed = await hashPassword(body.password)
			fields.push(`password = $${fields.length + 1}`)
			values.push(hashed)
		}
		if (body.phone !== undefined) {
			fields.push(`phone = $${fields.length + 1}`)
			values.push(body.phone)
		}
		if (body.status !== undefined) {
			fields.push(`status = $${fields.length + 1}`)
			values.push(body.status)
		}
		if (profileImgUrl !== undefined) {
			fields.push(`profile_img_url = $${fields.length + 1}`)
			values.push(profileImgUrl)
		}

		values.push(id)

		const result = await pool.query(
			`UPDATE doctors SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING id, full_name, specialty, username, phone, status, profile_img_url, role`,
			values,
		)
		res.json({ message: '✅ Shifokor yangilandi', doctor: result.rows[0] })
	} catch (error) {
		res
			.status(500)
			.json({ message: '❌ Server xatosi', error: (error as Error).message })
	}
}

// Bitta shifokorni o'chiradi.
export const removeDoctor = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		if (!isAdmin(req)) {
			res.status(403).json({ message: '❌ Ruxsat yoq' })
			return
		}

		const id = Number(req.params.id)
		if (Number.isNaN(id)) {
			res.status(400).json({ message: "❌ Noto'g'ri id" })
			return
		}

		const existing = await pool.query(`SELECT id FROM doctors WHERE id = $1`, [
			id,
		])
		if (!existing.rows[0]) {
			res.status(404).json({ message: '❌ Shifokor topilmadi' })
			return
		}

		await pool.query(`DELETE FROM doctors WHERE id = $1`, [id])
		res.json({ message: "✅ Shifokor o'chirildi" })
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
		if (!isAdmin(req)) {
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
