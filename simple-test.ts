/**
 * SIMPLE TEST - Check actual server responses
 */

import http from 'http'

async function testEndpoint(path: string, method = 'GET') {
	return new Promise(resolve => {
		const req = http.request(
			{
				hostname: 'localhost',
				port: 3000,
				path,
				method,
				headers: {
					'Content-Type': 'application/json',
				},
			},
			res => {
				let data = ''
				res.on('data', chunk => (data += chunk))
				res.on('end', () => {
					resolve({
						status: res.statusCode,
						headers: res.headers,
						body: data.substring(0, 200),
					})
				})
			},
		)
		req.on('error', e => resolve({ error: e.message }))
		req.end()
	})
}

async function run() {
	console.log('Testing endpoints...\n')

	const tests = [
		'/',
		'/api/admin/doctors',
		'/api/cashier/patients',
		'/api/doctor/appointments',
	]

	for (const path of tests) {
		const result = await testEndpoint(path)
		console.log(`\n${path}:`)
		console.log(JSON.stringify(result, null, 2))
	}
}

setTimeout(run, 1000)
