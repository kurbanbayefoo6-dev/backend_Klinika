import 'dotenv/config'
import { Pool } from 'pg'

// Database configuration (simple and readable for junior devs)
const pool = new Pool({
	host:
		process.env.DB_HOST ||
		'dpg-d7rimtosfn5c73bpan8g-a.ohio-postgres.render.com',
	port: Number(process.env.DB_PORT || 5432),
	database: process.env.DB_NAME || 'db_klinik',
	user: process.env.DB_USER || 'clinic',
	password: process.env.DB_PASSWORD || 'Wy7Q7XzqdvDxvvQxpAGLdGvkvo9SNW2O',
	ssl: { rejectUnauthorized: false },
})

export default pool
