import 'dotenv/config'
import express from 'express'

const app = express()

console.log('1. Creating app')

app.use(express.json())
console.log('2. Added JSON middleware')

try {
	console.log('3. About to import admin routes')
	const adminRoutes = require('./src/routes/admin').default
	console.log('4. Admin routes imported:', typeof adminRoutes)

	app.use('/api/admin', adminRoutes)
	console.log('5. Admin routes mounted')

	app.listen(3001, () => {
		console.log('6. Server listening on 3001')
	})
} catch (error) {
	console.error('ERROR:', (error as Error).message)
	console.error('Stack:', (error as Error).stack)
}
