-- Comprehensive Seed Data for Hostel Management System
-- Passwords for both roles are 'pass123'

-- 1. Clear All Tables and Reset Sequences
TRUNCATE student, warden, hostel, room, room_allocation, complaint, visitor, mess, payment, maintenance RESTART IDENTITY CASCADE;

-- 2. Wardens
-- password: pass123 hashed with bcrypt
-- $2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36GxMDgJLRjfE4J9qBxvUuS
INSERT INTO warden (warden_name, warden_email, warden_number, password) VALUES
('Amit Shah', 'amit@warden.com', '9876543210', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36GxMDgJLRjfE4J9qBxvUuS'),
('Priya Verma', 'priya@warden.com', '9876543211', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36GxMDgJLRjfE4J9qBxvUuS'),
('Suresh Raina', 'suresh@warden.com', '9876543212', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36GxMDgJLRjfE4J9qBxvUuS');

-- 3. Hostels
INSERT INTO hostel (warden_id, capacity, hostel_name, location) VALUES
((SELECT warden_id FROM warden WHERE warden_email = 'amit@warden.com'), 100, 'Green Valley Hostel', 'North Wing'),
((SELECT warden_id FROM warden WHERE warden_email = 'priya@warden.com'), 120, 'Blue Ocean Hostel', 'South Wing'),
((SELECT warden_id FROM warden WHERE warden_email = 'suresh@warden.com'), 80, 'Sky High Hostel', 'East Wing');

-- 4. Rooms
INSERT INTO room (room_capacity, hostel_id, rent, room_type, room_no, occupancy_status) VALUES
(1, (SELECT hostel_id FROM hostel WHERE hostel_name = 'Green Valley Hostel'), 5000, 'Single', 'A101', 'Available'),
(2, (SELECT hostel_id FROM hostel WHERE hostel_name = 'Green Valley Hostel'), 3500, 'Double', 'A102', 'Available'),
(3, (SELECT hostel_id FROM hostel WHERE hostel_name = 'Green Valley Hostel'), 2500, 'Triple', 'A103', 'Available'),
(4, (SELECT hostel_id FROM hostel WHERE hostel_name = 'Green Valley Hostel'), 2000, 'Dormitory', 'A104', 'Available'),
(1, (SELECT hostel_id FROM hostel WHERE hostel_name = 'Blue Ocean Hostel'), 5500, 'Single', 'B101', 'Available'),
(2, (SELECT hostel_id FROM hostel WHERE hostel_name = 'Blue Ocean Hostel'), 4000, 'Double', 'B102', 'Available'),
(3, (SELECT hostel_id FROM hostel WHERE hostel_name = 'Blue Ocean Hostel'), 3000, 'Triple', 'B103', 'Available'),
(4, (SELECT hostel_id FROM hostel WHERE hostel_name = 'Blue Ocean Hostel'), 2200, 'Dormitory', 'B104', 'Available'),
(1, (SELECT hostel_id FROM hostel WHERE hostel_name = 'Sky High Hostel'), 4500, 'Single', 'C101', 'Available'),
(2, (SELECT hostel_id FROM hostel WHERE hostel_name = 'Sky High Hostel'), 3200, 'Double', 'C102', 'Available');

-- 5. Students
INSERT INTO student (name, email, contact_number, gender, date_of_birth, password) VALUES
('Rahul Kumar', 'rahul@student.com', '8888888888', 'Male', '2002-05-15', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36GxMDgJLRjfE4J9qBxvUuS'),
('Anjali Singh', 'anjali@student.com', '8888888889', 'Female', '2003-08-20', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36GxMDgJLRjfE4J9qBxvUuS'),
('Vikram Rathore', 'vikram@student.com', '8888888890', 'Male', '2001-12-10', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36GxMDgJLRjfE4J9qBxvUuS'),
('Sneha Reddy', 'sneha@student.com', '8888888891', 'Female', '2002-02-28', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36GxMDgJLRjfE4J9qBxvUuS'),
('Deepak Verma', 'deepak@student.com', '8888888892', 'Male', '2003-10-05', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36GxMDgJLRjfE4J9qBxvUuS');

-- 6. Room Allocations
INSERT INTO room_allocation (student_id, room_id, allocation_date, lease_end_date) VALUES
((SELECT student_id FROM student WHERE email = 'rahul@student.com'), (SELECT room_id FROM room WHERE room_no = 'A101'), '2025-01-01', '2026-01-01'),
((SELECT student_id FROM student WHERE email = 'anjali@student.com'), (SELECT room_id FROM room WHERE room_no = 'B101'), '2025-01-01', '2026-01-01'),
((SELECT student_id FROM student WHERE email = 'vikram@student.com'), (SELECT room_id FROM room WHERE room_no = 'A102'), '2025-01-15', '2026-01-15'),
((SELECT student_id FROM student WHERE email = 'sneha@student.com'), (SELECT room_id FROM room WHERE room_no = 'B102'), '2025-01-15', '2026-01-15');

-- 7. Complaints
INSERT INTO complaint (student_id, complaint_status, description, complaint_type, assigned_to) VALUES
((SELECT student_id FROM student WHERE email = 'rahul@student.com'), 'Pending', 'Fan not working in A101', 'management', NULL),
((SELECT student_id FROM student WHERE email = 'anjali@student.com'), 'In Progress', 'Water leakage in B101', 'plumbing', 'Electrician Bob'),
((SELECT student_id FROM student WHERE email = 'vikram@student.com'), 'Resolved', 'Broken chair in A102', 'furniture', 'Carpenter Sam'),
((SELECT student_id FROM student WHERE email = 'sneha@student.com'), 'Pending', 'Light bulb fused in B102', 'management', NULL);

-- 8. Payments
INSERT INTO payment (student_id, payment_date, amount, payment_mode) VALUES
((SELECT student_id FROM student WHERE email = 'rahul@student.com'), '2025-01-05', 5000, 'UPI'),
((SELECT student_id FROM student WHERE email = 'anjali@student.com'), '2025-01-05', 5500, 'Credit Card'),
((SELECT student_id FROM student WHERE email = 'vikram@student.com'), '2025-01-20', 3500, 'Debit Card'),
((SELECT student_id FROM student WHERE email = 'sneha@student.com'), '2025-01-20', 4000, 'Net Banking');

-- 9. Maintenance
INSERT INTO maintenance (student_id, room_id, warden_id, issue, status) VALUES
((SELECT student_id FROM student WHERE email = 'rahul@student.com'), (SELECT room_id FROM room WHERE room_no = 'A101'), (SELECT warden_id FROM warden WHERE warden_email = 'amit@warden.com'), 'Fan repair', 'Pending'),
((SELECT student_id FROM student WHERE email = 'anjali@student.com'), (SELECT room_id FROM room WHERE room_no = 'B101'), (SELECT warden_id FROM warden WHERE warden_email = 'priya@warden.com'), 'Plumbing check', 'In Progress');

-- Refresh occupancy stats
REFRESH MATERIALIZED VIEW hostel_occupancy_stats;
