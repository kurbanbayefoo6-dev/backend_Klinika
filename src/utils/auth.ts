import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'
const JWT_EXPIRY = '10h'

export const generateToken = (id: number, role: string): string => {
	return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

export const verifyToken = (token: string): any => {
	try {
		return jwt.verify(token, JWT_SECRET)
	} catch (error) {
		return null
	}
}

export const hashPassword = async (password: string): Promise<string> => {
	return await bcrypt.hash(password, 10)
}

export const comparePassword = async (
	password: string,
	hash: string,
): Promise<boolean> => {
	return await bcrypt.compare(password, hash)
}
