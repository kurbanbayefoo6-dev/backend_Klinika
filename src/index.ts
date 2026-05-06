const pool = require('./config/db')

async function connectDB() {
	try {
		console.log('🔄 Database ga ulanish jarayoni boshlanmoqda...')

		const result = await pool.query('SELECT NOW()')
		console.log('✅ Database ulandi! ')
		console.log('Vaqt:', result.rows[0].now)
		process.exit(0)
	} catch (error) {
		console.error('❌ Database ulana olmadi!')
		console.error('Xato:', error)
		process.exit(1)
	}
}

connectDB()
