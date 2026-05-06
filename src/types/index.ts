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
	birth_date?: string | null
	gender?: string | null
	address: string
}

export interface CreatePatientRequest {
	full_name: string
	birth_date?: string
	gender?: string
	address: string
}

export interface Appointment {
	id: number
	patient_id_fk: number
	doctor_id_fk: number
	cashier_id_fk?: number | null
	appointment_date: string
	status: string
}

export interface CreateAppointmentRequest {
	patient_id: number
	doctor_id: number
	appointment_date: string
	status?: string
}

export interface UpdateAppointmentRequest {
	patient_id?: number
	doctor_id?: number
	appointment_date?: string
	status?: string
}

export interface Payment {
	id: number
	appointment_id_fk: number
	amount: number
	payment_method: string
	payment_date?: string | null
}

export interface CreatePaymentRequest {
	appointment_id: number
	amount: number
	method?: string
	payment_method?: string
}

export interface Prescription {
	id: number
	appointment_id_fk: number
	diagnosis_description?: string | null
	recommendations: string
}

export interface CreatePrescriptionRequest {
	appointment_id: number
	diagnosis_description?: string
	recommendations: string
}
