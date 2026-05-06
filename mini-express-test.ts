/**
 * Mini Express test to verify route matching
 */
import express, { Router } from 'express'

const app = express()

// Create a simple middleware
const testMiddleware = (req: any, res: any, next: any) => {
	console.log('  -> Middleware called for', req.path)
	next()
}

// Create a router with middleware
const router = Router()
router.use(testMiddleware)
router.get('/test', (req, res) => {
	console.log('  -> Route handler called')
	res.json({ message: 'Success!' })
})

// Mount the router
app.use('/api', router)

// Test route
app.get('/', (req, res) => res.json({ message: 'Root' }))

// Start and test
app.listen(3003, async () => {
	console.log('\n✅ Mini test server started on 3003')

	// Wait a moment for server to fully start
	await new Promise(r => setTimeout(r, 100))

	console.log('\nTesting route /api/test...')
	try {
		const response = await fetch('http://localhost:3003/api/test')
		const data = await response.json()
		console.log('Status:', response.status)
		console.log('Response:', data)

		if (response.status === 200) {
			console.log('\n✅ Route matching works!')
		} else {
			console.log('\n❌ Unexpected status:', response.status)
		}
	} catch (e) {
		console.error('❌ Error:', (e as Error).message)
	}

	process.exit(0)
})
