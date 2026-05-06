/**
 * KLINIKA API TEST SUITE
 * Barcha API endpoint'larni tekshirish uchun
 */

import http from 'http'

interface TestCase {
	name: string
	method: string
	path: string
	body?: Record<string, any>
	expectedStatus: number
	headers?: Record<string, string>
}

const BASE_URL = 'http://localhost:3000'

// Testlar
const tests: TestCase[] = [
	// ========== HEALTH CHECKS ==========
	{
		name: 'GET / - Server status',
		method: 'GET',
		path: '/',
		expectedStatus: 200,
	},
	{
		name: 'GET /health - Health check',
		method: 'GET',
		path: '/health',
		expectedStatus: 200,
	},
	{
		name: 'GET /db - Database connection',
		method: 'GET',
		path: '/db',
		expectedStatus: 200,
	},

	// ========== AUTH ENDPOINTS ==========
	{
		name: 'POST /api/auth/login - Admin login',
		method: 'POST',
		path: '/api/auth/login',
		body: {
			username: 'admin1',
			password: 'admin123',
			role: 'admin',
		},
		expectedStatus: 200,
	},
	{
		name: 'POST /api/auth/login - Doctor login',
		method: 'POST',
		path: '/api/auth/login',
		body: {
			username: 'doctor1',
			password: 'password123',
			role: 'doctor',
		},
		expectedStatus: 200,
	},
	{
		name: 'POST /api/auth/login - Cashier login',
		method: 'POST',
		path: '/api/auth/login',
		body: {
			username: 'cashier1',
			password: 'cashier123',
			role: 'cashier',
		},
		expectedStatus: 200,
	},
	{
		name: 'POST /api/auth/login - Invalid credentials',
		method: 'POST',
		path: '/api/auth/login',
		body: {
			username: 'invalid',
			password: 'invalid',
			role: 'admin',
		},
		expectedStatus: 401,
	},
	{
		name: 'POST /api/auth/login - Missing fields',
		method: 'POST',
		path: '/api/auth/login',
		body: {
			username: 'admin1',
		},
		expectedStatus: 400,
	},

	// ========== ADMIN ENDPOINTS ==========
	{
		name: 'GET /api/admin/doctors - View all doctors (no auth)',
		method: 'GET',
		path: '/api/admin/doctors',
		expectedStatus: 401,
	},
	{
		name: 'GET /api/admin/appointments - View all appointments (no auth)',
		method: 'GET',
		path: '/api/admin/appointments',
		expectedStatus: 401,
	},
	{
		name: 'POST /api/admin/doctors - Add doctor (no auth)',
		method: 'POST',
		path: '/api/admin/doctors',
		body: {
			full_name: 'Test Doctor',
			username: 'testdoc',
			password: 'pass123',
			profile_img: 'http://example.com/img.jpg',
		},
		expectedStatus: 401,
	},

	// ========== CASHIER ENDPOINTS ==========
	{
		name: 'GET /api/cashier/appointments - View appointments (no auth)',
		method: 'GET',
		path: '/api/cashier/appointments',
		expectedStatus: 401,
	},
	{
		name: 'POST /api/cashier/patients - Add patient (no auth)',
		method: 'POST',
		path: '/api/cashier/patients',
		body: {
			full_name: 'John Doe',
			address: 'Tashkent',
		},
		expectedStatus: 401,
	},

	// ========== DOCTOR ENDPOINTS ==========
	{
		name: 'GET /api/doctor/appointments - View my appointments (no auth)',
		method: 'GET',
		path: '/api/doctor/appointments',
		expectedStatus: 401,
	},
	{
		name: 'POST /api/doctor/prescriptions - Create prescription (no auth)',
		method: 'POST',
		path: '/api/doctor/prescriptions',
		body: {
			appointment_id: 1,
			recommendations: 'Rest for 2 weeks',
			duration: '2 weeks',
		},
		expectedStatus: 401,
	},
]

async function makeRequest(
	method: string,
	path: string,
	body?: Record<string, any>,
	headers?: Record<string, string>,
): Promise<{ status: number; data: any }> {
	return new Promise((resolve, reject) => {
		const url = new URL(BASE_URL + path)
		const options = {
			hostname: url.hostname,
			port: url.port || 3000,
			path: url.pathname + url.search,
			method,
			headers: {
				'Content-Type': 'application/json',
				...headers,
			},
		}

		const req = http.request(options, res => {
			let data = ''
			res.on('data', chunk => {
				data += chunk
			})
			res.on('end', () => {
				try {
					resolve({
						status: res.statusCode || 500,
						data: data ? JSON.parse(data) : null,
					})
				} catch {
					resolve({
						status: res.statusCode || 500,
						data: data,
					})
				}
			})
		})

		req.on('error', reject)

		if (body) {
			req.write(JSON.stringify(body))
		}
		req.end()
	})
}

async function runTests() {
	console.log('\n🧪 KLINIKA API TEST SUITE\n')
	console.log('=' + '='.repeat(70))

	let passed = 0
	let failed = 0

	for (const test of tests) {
		try {
			const response = await makeRequest(
				test.method,
				test.path,
				test.body,
				test.headers,
			)

			const isPass =
				response.status === test.expectedStatus ||
				(test.expectedStatus === 200 &&
					response.status >= 200 &&
					response.status < 300)

			if (isPass) {
				console.log(`✅ ${test.name}`)
				console.log(
					`   Status: ${response.status} (expected: ${test.expectedStatus})`,
				)
				passed++
			} else {
				console.log(`❌ ${test.name}`)
				console.log(
					`   Status: ${response.status} (expected: ${test.expectedStatus})`,
				)
				if (response.data) {
					console.log(
						`   Response: ${JSON.stringify(response.data).substring(0, 100)}`,
					)
				}
				failed++
			}
		} catch (error) {
			console.log(`⚠️ ${test.name}`)
			console.log(`   Error: ${(error as Error).message}`)
			failed++
		}
		console.log()
	}

	console.log('=' + '='.repeat(70))
	console.log(`\n📊 TEST RESULTS: ${passed}/${passed + failed} passed\n`)
	process.exit(failed > 0 ? 1 : 0)
}

// Run after 2 seconds (let server start)
setTimeout(runTests, 2000)
