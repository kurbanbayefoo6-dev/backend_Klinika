/**
 * Debug import test
 */

console.log('Starting import test...')

try {
	console.log('Importing adminController...')
	const adminCtrl = require('./src/controllers/adminController')
	console.log('adminController exports:', Object.keys(adminCtrl))
} catch (e) {
	console.error('Error importing adminController:', (e as Error).message)
}

try {
	console.log('Importing cashierController...')
	const cashierCtrl = require('./src/controllers/cashierController')
	console.log('cashierController exports:', Object.keys(cashierCtrl))
} catch (e) {
	console.error('Error importing cashierController:', (e as Error).message)
}

try {
	console.log('Importing doctorController...')
	const doctorCtrl = require('./src/controllers/doctorController')
	console.log('doctorController exports:', Object.keys(doctorCtrl))
} catch (e) {
	console.error('Error importing doctorController:', (e as Error).message)
}

try {
	console.log('Importing admin routes...')
	const adminRoutes = require('./src/routes/admin')
	console.log('Admin routes imported, default:', typeof adminRoutes.default)
} catch (e) {
	console.error('Error importing admin routes:', (e as Error).message)
}

console.log('Import test complete')
