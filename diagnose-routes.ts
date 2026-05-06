/**
 * Diagnostic: Check if routes can be imported and what they export
 */

async function diagnoseRoutes() {
	console.log('\n🔍 ROUTE IMPORT DIAGNOSTIC\n')

	try {
		console.log('1. Importing admin routes...')
		const adminRoutes = await import('./src/routes/admin')
		console.log('   ✅ Admin routes imported')
		console.log('   Type of default export:', typeof adminRoutes.default)
		console.log(
			'   Is it a function?',
			typeof adminRoutes.default === 'function',
		)

		const testRouter = adminRoutes.default
		console.log('   Router.stack exists?', !!(testRouter as any).stack)
		console.log('   Router.stack length:', (testRouter as any).stack?.length)

		// Check what's in the stack
		if ((testRouter as any).stack) {
			;(testRouter as any).stack.forEach((layer: any, idx: number) => {
				console.log(
					`   Layer ${idx}: name="${layer.name}", regexp="${layer.regexp}"`,
				)
			})
		}
	} catch (e) {
		console.error('   ❌ Error importing admin routes:', (e as Error).message)
		console.error('   Stack:', (e as Error).stack)
	}

	try {
		console.log('\n2. Importing auth routes...')
		const authRoutes = await import('./src/routes/auth')
		console.log('   ✅ Auth routes imported')
		console.log('   Type of default export:', typeof authRoutes.default)

		if ((authRoutes.default as any)?.stack) {
			console.log('   Routes in auth router:')
			;(authRoutes.default as any).stack.forEach((layer: any) => {
				console.log(`     - ${layer.route?.path || layer.regexp}`)
			})
		}
	} catch (e) {
		console.error('   ❌ Error:', (e as Error).message)
	}

	try {
		console.log('\n3. Importing cashier routes...')
		const cashierRoutes = await import('./src/routes/cashier')
		console.log('   ✅ Cashier routes imported')
		console.log('   Type:', typeof cashierRoutes.default)
	} catch (e) {
		console.error('   ❌ Error:', (e as Error).message)
	}

	try {
		console.log('\n4. Importing doctor routes...')
		const doctorRoutes = await import('./src/routes/doctor')
		console.log('   ✅ Doctor routes imported')
		console.log('   Type:', typeof doctorRoutes.default)
	} catch (e) {
		console.error('   ❌ Error:', (e as Error).message)
	}
}

diagnoseRoutes()
