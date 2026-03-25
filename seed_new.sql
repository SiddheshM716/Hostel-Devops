-- Comprehensive Seed Data for Hostel Management System
-- Passwords for both roles are 'pass123'

-- 1. Clear All Tables and Reset Sequences
TRUNCATE student, warden, hostel, room, room_allocation, complaint, visitor, mess_menu, leave_application, payment, maintenance RESTART IDENTITY CASCADE;

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
INSERT INTO room (room_capacity, hostel_id, yearly_fee, has_attached_bathroom, has_ac, room_type, room_no, occupancy_status) VALUES
(1, (SELECT hostel_id FROM hostel WHERE hostel_name = 'Green Valley Hostel'), 60000, true, true, 'Single', 'A101', 'Available'),
(2, (SELECT hostel_id FROM hostel WHERE hostel_name = 'Green Valley Hostel'), 42000, true, false, 'Double', 'A102', 'Available'),
(3, (SELECT hostel_id FROM hostel WHERE hostel_name = 'Green Valley Hostel'), 30000, false, false, 'Triple', 'A103', 'Available'),
(4, (SELECT hostel_id FROM hostel WHERE hostel_name = 'Green Valley Hostel'), 24000, false, false, 'Dormitory', 'A104', 'Available'),
(1, (SELECT hostel_id FROM hostel WHERE hostel_name = 'Blue Ocean Hostel'), 66000, true, true, 'Single', 'B101', 'Available'),
(2, (SELECT hostel_id FROM hostel WHERE hostel_name = 'Blue Ocean Hostel'), 48000, true, false, 'Double', 'B102', 'Available'),
(3, (SELECT hostel_id FROM hostel WHERE hostel_name = 'Blue Ocean Hostel'), 36000, false, false, 'Triple', 'B103', 'Available'),
(4, (SELECT hostel_id FROM hostel WHERE hostel_name = 'Blue Ocean Hostel'), 26400, false, false, 'Dormitory', 'B104', 'Available'),
(1, (SELECT hostel_id FROM hostel WHERE hostel_name = 'Sky High Hostel'), 54000, true, true, 'Single', 'C101', 'Available'),
(2, (SELECT hostel_id FROM hostel WHERE hostel_name = 'Sky High Hostel'), 38400, false, false, 'Double', 'C102', 'Available');

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

-- 10. Mess Menu
INSERT INTO mess_menu (day_of_week, meal_type, veg_item, non_veg_item, timing) VALUES
('Monday', 'Breakfast', 'Poha, Tea', NULL, '07:30 AM - 09:30 AM'),
('Monday', 'Lunch', 'Dal, Rice, Roti, Paneer', 'Chicken Curry', '12:30 PM - 02:30 PM'),
('Monday', 'Dinner', 'Mixed Veg, Roti, Rice', 'Egg Curry', '07:30 PM - 09:30 PM');

-- 11. Visitors
INSERT INTO visitor (student_id, warden_id, visitor_date, visitor_name, visitor_email, status) VALUES
((SELECT student_id FROM student WHERE email = 'rahul@student.com'), (SELECT warden_id FROM warden WHERE warden_email = 'amit@warden.com'), CURRENT_DATE + INTERVAL '2 days', 'Ramesh Kumar', 'ramesh@example.com', 'Approved'),
((SELECT student_id FROM student WHERE email = 'anjali@student.com'), NULL, CURRENT_DATE + INTERVAL '5 days', 'Sunita Singh', 'sunita@example.com', 'Pending');

-- 12. Leaves
INSERT INTO leave_application (student_id, warden_id, start_date, end_date, reason, status) VALUES
((SELECT student_id FROM student WHERE email = 'vikram@student.com'), (SELECT warden_id FROM warden WHERE warden_email = 'amit@warden.com'), CURRENT_DATE + INTERVAL '10 days', CURRENT_DATE + INTERVAL '12 days', 'Family function', 'Approved'),
((SELECT student_id FROM student WHERE email = 'sneha@student.com'), NULL, CURRENT_DATE + INTERVAL '15 days', CURRENT_DATE + INTERVAL '18 days', 'Medical reason', 'Pending');

-- Refresh occupancy stats
REFRESH MATERIALIZED VIEW hostel_occupancy_stats;
