import http from 'http'

function testEndpoint(path: string, method = 'GET'): Promise<any> {
	return new Promise(resolve => {
		const req = http.request(
			{
				hostname: 'localhost',
				port: 3000,
				path,
				method,
			},
			res => {
				let data = ''
				res.on('data', chunk => {
					data += chunk
				})
				res.on('end', () => {
					resolve({
						status: res.statusCode,
						body: data,
					})
				})
			},
		)

		req.on('error', error => {
			resolve({ error: error.message })
		})
		req.end()
	})
}

async function runDirectTests() {
	console.log('\n🔍 DIRECT HTTP TEST\n')

	const tests = [
		{ path: '/', name: 'Root' },
		{ path: '/health', name: 'Health' },
		{ path: '/api/auth/login', name: 'Auth Login' },
		{ path: '/api/admin/doctors', name: 'Admin - Doctors' },
		{ path: '/api/cashier/patients', name: 'Cashier - Patients' },
		{ path: '/api/doctor/appointments', name: 'Doctor - Appointments' },
	]

	for (const test of tests) {
		const result = await testEndpoint(test.path)
		console.log(`${test.name.padEnd(25)} ${test.path}`)
		console.log(`  Status: ${result.status}`)
		console.log(`  Body: ${result.body?.substring(0, 100)}`)
		console.log()
	}
}

setTimeout(runDirectTests, 1000)
