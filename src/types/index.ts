// Type definitions
export interface User {
	id: number
	full_name: string
	username: string
	password: string
	role: 'doctor' | 'admin' | 'cashier' | 'patient'
}

export interface JWTPayload {
	id: number
	role: 'doctor' | 'admin' | 'cashier'
}

export interface LoginRequest {
	username: string
	password: string
	role: 'doctor' | 'admin' | 'cashier'
}

export interface AuthResponse {
	token?: string
	message: string
	user?: Partial<User>
}

export interface Doctor {
	id: number
	full_name: string
	specialty?: string | null
	username: string
	password?: string
	phone?: string | null
	status?: string | null
	profile_img_url?: string | null
	role: 'doctor'
}

export interface CreateDoctorRequest {
	full_name: string
	specialty?: string
	username: string
	password: string
	phone?: string
	status?: string
	profile_img_url?: string
	profile_img?: string
}

export interface UpdateDoctorRequest {
	full_name?: string
	specialty?: string
	username?: string
	password?: string
	phone?: string
	status?: string
	profile_img_url?: string
	profile_img?: string
}

export interface Patient {
	id: number
	full_name: string
	phone?: string | null
	address: string
	date_of_birth?: string | null
}

export interface CreatePatientRequest {
	full_name: string
	phone?: string
	address: string
	date_of_birth?: string
}

export interface Appointment {
	id: number
	patient_id: number
	doctor_id: number
	appointment_date: string
	reason?: string | null
	status: string
}

export interface CreateAppointmentRequest {
	patient_id: number
	doctor_id: number
	appointment_date: string
	reason?: string
	status?: string
}

export interface UpdateAppointmentRequest {
	patient_id?: number
	doctor_id?: number
	appointment_date?: string
	reason?: string
	status?: string
}

export interface Payment {
	id: number
	appointment_id: number
	amount: number
	method: string
	payment_date?: string | null
}

export interface CreatePaymentRequest {
	appointment_id: number
	amount: number
	method: string
	payment_date?: string
}

export interface Prescription {
	id: number
	appointment_id: number
	recommendations: string
	duration: string
	created_at?: string | null
}

export interface CreatePrescriptionRequest {
	appointment_id: number
	recommendations: string
	duration: string
}
