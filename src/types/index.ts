export interface Student {
  student_id: number;
  name: string;
  email: string;
  date_of_birth: string;
  contact_number: string;
  gender: 'Male' | 'Female' | 'Other';
  street?: string;
  city?: string;
  flatno?: string;
  pincode?: string;
  auth_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Warden {
  warden_id: number;
  warden_name: string;
  warden_email: string;
  warden_number: string;
  updated_at?: string;
}

export interface Room {
  room_id: number;
  room_no: string;
  room_type: 'Single' | 'Double' | 'Triple' | 'Dormitory';
  room_capacity: number;
  yearly_fee: number;
  has_attached_bathroom: boolean;
  has_ac: boolean;
  occupancy_status: 'Available' | 'Occupied';
  hostel_id?: number;
  vacancies?: number;
  hostel?: {
    hostel_id: number;
    hostel_name: string;
  };
}

export interface RoomAllocation {
  allocation_id: number;
  student_id?: number;
  room_id?: number;
  allocation_date: string;
  lease_end_date: string;
  updated_at?: string;
}

export interface Complaint {
  complaint_id: number;
  student_id?: number;
  warden_id?: number;
  complaint_type: string;
  description: string;
  complaint_status: string;
  assigned_to?: string;
  updated_at?: string;
}

export interface Visitor {
  visitor_id: number;
  student_id?: number;
  warden_id?: number;
  visitor_name: string;
  visitor_email: string;
  visitor_date: string;
  status: 'Pending' | 'Approved' | 'Declined';
  warden_name?: string;
  student_name?: string;
}

export interface MessMenu {
  menu_id: number;
  day_of_week: string;
  meal_type: string;
  veg_item: string;
  non_veg_item?: string;
  timing: string;
  updated_at?: string;
}

export interface LeaveApplication {
  leave_id: number;
  student_id?: number;
  warden_id?: number;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Declined';
  applied_at: string;
  warden_name?: string;
  student_name?: string;
}

export interface Payment {
  payment_id: number;
  student_id?: number;
  payment_date: string;
  amount: number;
  payment_mode: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Cash';
  room_id : number;
}

export interface Hostel {
  hostel_id: number;
  warden_id?: number;
  hostel_name: string;
  location: string;
  capacity: number;
}

export interface Maintenance {
  maintenance_id: number;
  student_id?: number;
  room_id?: number;
  warden_id?: number;
  issue: string;
  status: string;
}

export interface User {
  id: string;
  email: string;
  role: 'student' | 'warden';
  name: string;
} 