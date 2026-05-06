/**
 * Comprehensive test to verify all routes and endpoints
 */

interface TestEndpoint {
	name: string
	method: string
	path: string
	headers?: Record<string, string>
	body?: any
	expectStatus?: number
}

const ENDPOINTS: TestEndpoint[] = [
	// Health checks
	{ name: 'Server Status', method: 'GET', path: '/', expectStatus: 200 },
	{ name: 'Health Check', method: 'GET', path: '/health', expectStatus: 200 },
	{ name: 'Database Status', method: 'GET', path: '/db', expectStatus: 200 },

	// Auth endpoints
	{
		name: 'Admin Login',
		method: 'POST',
		path: '/api/auth/login',
		body: { username: 'admin1', password: 'admin123', role: 'admin' },
		expectStatus: 200,
	},
	{
		name: 'Doctor Login',
		method: 'POST',
		path: '/api/auth/login',
		body: { username: 'doctor1', password: 'password123', role: 'doctor' },
		expectStatus: 200,
	},
	{
		name: 'Cashier Login',
		method: 'POST',
		path: '/api/auth/login',
		body: { username: 'cashier1', password: 'cashier123', role: 'cashier' },
		expectStatus: 200,
	},

	// Protected endpoints (no auth - expect 401)
	{
		name: 'Admin - Get Doctors',
		method: 'GET',
		path: '/api/admin/doctors',
		expectStatus: 401,
	},
	{
		name: 'Admin - Get Appointments',
		method: 'GET',
		path: '/api/admin/appointments',
		expectStatus: 401,
	},
	{
		name: 'Cashier - Get Appointments',
		method: 'GET',
		path: '/api/cashier/appointments',
		expectStatus: 401,
	},
	{
		name: 'Doctor - Get My Appointments',
		method: 'GET',
		path: '/api/doctor/appointments',
		expectStatus: 401,
	},
]

async function runTests() {
	console.log('\n📋 COMPREHENSIVE API TEST SUITE\n')
	let passed = 0
	let failed = 0

	for (const endpoint of ENDPOINTS) {
		try {
			const fetchOptions: any = {
				method: endpoint.method,
				headers: {
					'Content-Type': 'application/json',
					...endpoint.headers,
				},
			}

			if (endpoint.body) {
				fetchOptions.body = JSON.stringify(endpoint.body)
			}

			const response = await fetch(
				`http://localhost:3000${endpoint.path}`,
				fetchOptions,
			)

			const isPass = endpoint.expectStatus
				? response.status === endpoint.expectStatus
				: response.ok

			if (isPass) {
				console.log(
					`✅ ${endpoint.name.padEnd(30)} ${endpoint.method} ${endpoint.path}`,
				)
				console.log(`   Status: ${response.status}`)
				passed++
			} else {
				console.log(
					`❌ ${endpoint.name.padEnd(30)} ${endpoint.method} ${endpoint.path}`,
				)
				console.log(
					`   Expected: ${endpoint.expectStatus}, Got: ${response.status}`,
				)
				failed++
			}
		} catch (error) {
			console.log(
				`⚠️ ${endpoint.name.padEnd(30)} ${endpoint.method} ${endpoint.path}`,
			)
			console.log(`   Error: ${(error as Error).message}`)
			failed++
		}
	}

	console.log(`\n${'═'.repeat(70)}`)
	console.log(`RESULTS: ${passed}/${passed + failed} tests passed\n`)
	process.exit(failed > 0 ? 1 : 0)
}

// Wait for server to be ready
setTimeout(runTests, 2000)
