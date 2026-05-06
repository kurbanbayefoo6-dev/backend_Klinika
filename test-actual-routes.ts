/**
 * Test with actual route files
 */
import express from 'express'
import adminRoutes from './src/routes/admin'
import authRoutes from './src/routes/auth'

const app = express()
app.use(express.json())

console.log('\n✅ Mounting routes...')
console.log('  Admin routes type:', typeof adminRoutes)
console.log('  Auth routes type:', typeof authRoutes)

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

app.get('/', (req, res) => res.json({ message: 'Root' }))

app.listen(3004, async () => {
	console.log('\n✅ Server started on 3004 with ACTUAL route files')

	// Wait for server to start
	await new Promise(r => setTimeout(r, 200))

	console.log('\nTesting actual routes...')

	try {
		console.log('\n1. Testing GET /api/auth/login')
		const res1 = await fetch('http://localhost:3004/api/auth/login')
		console.log('   Status:', res1.status)

		console.log('\n2. Testing POST /api/auth/login')
		const res2 = await fetch('http://localhost:3004/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				username: 'admin1',
				password: 'admin123',
				role: 'admin',
			}),
		})
		console.log('   Status:', res2.status)
		const data2 = await res2.json()
		console.log('   Response:', data2)

		console.log('\n3. Testing GET /api/admin/doctors (no auth - should be 401)')
		const res3 = await fetch('http://localhost:3004/api/admin/doctors')
		console.log('   Status:', res3.status)
		const data3 = await res3.json()
		console.log('   Response:', data3)
	} catch (e) {
		console.error('❌ Error:', (e as Error).message)
	}

	process.exit(0)
})
