import express, { Router } from 'express'

const app = express()
const router = Router()

router.get('/test', (req, res) => {
	res.json({ message: 'Test route works!' })
})

app.use('/api', router)

app.get('/', (req, res) => {
	res.json({ message: 'Root works' })
})

app.listen(3002, () => {
	console.log('Minimal test server on 3002')
})
