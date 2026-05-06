import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import os from 'os'
import pool from './src/config/db'
import adminRoutes from './src/routes/admin'
import authRoutes from './src/routes/auth'
import cashierRoutes from './src/routes/cashier'
import doctorRoutes from './src/routes/doctor'

const app = express()
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'

console.log('DEBUG: Initializing middleware and routes...')
app.use(cors())
app.use(express.json())

// Auth routes
console.log('DEBUG: Mounting auth routes at /api/auth')
app.use('/api/auth', authRoutes)

// Role-based klinika routes
console.log('DEBUG: Mounting admin routes at /api/admin')
console.log('DEBUG: adminRoutes type:', typeof adminRoutes)
app.use('/api/admin', adminRoutes)

console.log('DEBUG: Mounting cashier routes at /api/cashier')
app.use('/api/cashier', cashierRoutes)

console.log('DEBUG: Mounting doctor routes at /api/doctor')
app.use('/api/doctor', doctorRoutes)

console.log('DEBUG: Routes mounted successfully')

app.get('/', (req, res) => {
	res.json({
		message: ' Server ishga tushdi',
		port: PORT,
	})
})

app.get('/db', async (req, res) => {
	try {
		await pool.query('SELECT NOW()')
		res.json({ database: '✅ connected' })
	} catch (error) {
		res.status(500).json({ database: '❌ disconnected' })
	}
})

app.get('/health', (req, res) => {
	res.json({
		status: 'OK',
		time: new Date().toISOString(),
	})
})
const networkIp =
	Object.values(os.networkInterfaces())
		.flat()
		.find(iface => iface?.family === 'IPv4' && !iface.internal)?.address ??
	'unknown'

app.listen(Number(PORT), HOST, () => {
	console.log(`\n Server ${PORT} portda ishlayapti`)
	pool
		.query('SELECT NOW()')
		.then(() => console.log('✅ Database ulandi!'))
		.catch(error => console.error('❌ Database ulana olmadi!', error.message))
})
