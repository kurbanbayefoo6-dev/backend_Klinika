import { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../utils/auth'

declare global {
	namespace Express {
		interface Request {
			user?: any
		}
	}
}

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const token = req.headers.authorization?.split(' ')[1]

		if (!token) {
			return res.status(401).json({ message: 'Token topilmadi' })
		}

		const decoded = verifyToken(token)

		if (!decoded) {
			return res
				.status(401)
				.json({ message: "Token noto'g'ri yoki eskirgan" })
		}

		req.user = decoded
		next()
	} catch (error) {
		res.status(401).json({ message: 'Authorization xatosi' })
	}
}
