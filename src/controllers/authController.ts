import { Request, Response } from 'express'
import { LoginRequest } from '../types'
import { generateToken } from '../utils/auth'

// Pre-populated users (database'dan olish kerak)
const users = [
	{
		id: 1,
		full_name: 'Admin Foydalanuvchi',
		username: 'admin1',
		password: 'admin123', // Real production'da hash bo'lishi kerak
		role: 'admin',
	},
	{
		id: 2,
		full_name: 'Dr. Ahsan Ali',
		username: 'doctor1',
		password: 'password123',
		role: 'doctor',
	},
	{
		id: 3,
		full_name: 'Cashier Foydalanuvchi',
		username: 'cashier1',
		password: 'cashier123',
		role: 'cashier',
	},
]

export const login = async (req: Request, res: Response): Promise<void> => {
	try {
		const { username, password, role } = req.body as LoginRequest

		if (!username || !password || !role) {
			res.status(400).json({ message: '❌ Username, password va role kerak' })
			return
		}

		// Database dan foydalanuvchini qidirish
		let user = users.find(u => u.username === username && u.role === role)

		// Production'da database'dan olish:
		// const result = await pool.query(
		// 	`SELECT * FROM admin WHERE username = $1
		//   UNION ALL SELECT * FROM doctor WHERE username = $1
		//   UNION ALL SELECT * FROM cashier WHERE username = $1`,
		// 	[username]
		// )
		// user = result.rows[0]

		if (!user) {
			res
				.status(401)
				.json({ message: "❌ Username, password yoki role noto'g'ri" })
			return
		}

		// Password tekshirish (hozir oddiy, database'da hash bo'ladi)
		const isValidPassword = user.password === password
		if (!isValidPassword) {
			res
				.status(401)
				.json({ message: "❌ Username, password yoki role noto'g'ri" })
			return
		}

		const token = generateToken(user.id, user.role)
		const panelMessage =
			user.role === 'admin'
				? '✅ Siz admin paneliga kirdingiz'
				: user.role === 'doctor'
					? '✅ Siz doctor paneliga kirdingiz'
					: '✅ Siz cashier paneliga kirdingiz'

		res.json({
			message: panelMessage,
			token,
			user: {
				id: user.id,
				full_name: user.full_name,
				username: user.username,
				role: user.role,
			},
		})
	} catch (error) {
		res
			.status(500)
			.json({ message: '❌ Server xatosi', error: (error as Error).message })
	}
}

export const getProfile = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		if (!req.user) {
			res.status(401).json({ message: '❌ Avtorizatsiya kerak' })
			return
		}

		// Database'dan foydalanuvchi ma'lumotlarini olish
		const user = users.find(u => u.id === req.user.id)

		if (!user) {
			res.status(404).json({ message: '❌ Foydalanuvchi topilmadi' })
			return
		}

		res.json({
			message: "✅ Profil ma'lumotlari",
			user: {
				id: user.id,
				full_name: user.full_name,
				username: user.username,
				role: user.role,
			},
		})
	} catch (error) {
		res
			.status(500)
			.json({ message: '❌ Server xatosi', error: (error as Error).message })
	}
}
