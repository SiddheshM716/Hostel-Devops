-- Seed data for hostel_dbms

-- Warden (password: warden123)
INSERT INTO warden (warden_name, warden_email, warden_number, password)
VALUES 
  ('Mr. Ramesh Kumar', 'ramesh@hostel.com', '9111111111', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36GxMDgJLRjfE4J9qBxvUuS'),
  ('Ms. Priya Nair', 'priya@hostel.com', '9222222222', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36GxMDgJLRjfE4J9qBxvUuS')
ON CONFLICT DO NOTHING;

-- Hostels
INSERT INTO hostel (warden_id, capacity, hostel_name, location)
VALUES
  (1, 100, 'Block A - Men''s Hostel', 'North Campus'),
  (2, 80, 'Block B - Women''s Hostel', 'South Campus')
ON CONFLICT DO NOTHING;

-- Rooms
INSERT INTO room (room_capacity, hostel_id, yearly_fee, has_attached_bathroom, has_ac, room_type, room_no, occupancy_status)
VALUES
  (1, 1, 96000.00, true, true, 'Single', 'A101', 'Available'),
  (2, 1, 66000.00, true, false, 'Double', 'A102', 'Available'),
  (2, 1, 66000.00, false, false, 'Double', 'A103', 'Occupied'),
  (3, 1, 48000.00, false, false, 'Triple', 'A201', 'Available'),
  (4, 1, 36000.00, false, false, 'Dormitory', 'A202', 'Available'),
  (1, 2, 102000.00, true, true, 'Single', 'B101', 'Available'),
  (2, 2, 72000.00, true, false, 'Double', 'B102', 'Occupied'),
  (2, 2, 72000.00, false, false, 'Double', 'B103', 'Available'),
  (3, 2, 54000.00, false, false, 'Triple', 'B201', 'Available'),
  (4, 2, 42000.00, false, false, 'Dormitory', 'B202', 'Available')
ON CONFLICT DO NOTHING;

-- Students (password: student123)
-- Note: These are example students. The ones created via signup already exist.
INSERT INTO student (name, email, contact_number, gender, date_of_birth, password)
VALUES
  ('Arjun Sharma', 'arjun@student.com', '9333333333', 'Male', '2001-03-15', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36GxMDgJLRjfE4J9qBxvUuS'),
  ('Neha Patel', 'neha@student.com', '9444444444', 'Female', '2002-07-22', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36GxMDgJLRjfE4J9qBxvUuS'),
  ('Rohit Verma', 'rohit@student.com', '9555555555', 'Male', '2000-11-05', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36GxMDgJLRjfE4J9qBxvUuS')
ON CONFLICT DO NOTHING;

-- Room Allocations (allocate students to occupied rooms)
INSERT INTO room_allocation (student_id, room_id, allocation_date, lease_end_date)
SELECT s.student_id, r.room_id, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year'
FROM student s, room r
WHERE s.email = 'arjun@student.com' AND r.room_no = 'A103'
ON CONFLICT DO NOTHING;

INSERT INTO room_allocation (student_id, room_id, allocation_date, lease_end_date)
SELECT s.student_id, r.room_id, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year'
FROM student s, room r
WHERE s.email = 'neha@student.com' AND r.room_no = 'B102'
ON CONFLICT DO NOTHING;

-- Complaints
INSERT INTO complaint (student_id, complaint_status, description, complaint_type)
SELECT s.student_id, 'Pending', 'The tap in my room is leaking and causing water wastage.', 'plumbing'
FROM student s WHERE s.email = 'arjun@student.com'
ON CONFLICT DO NOTHING;

INSERT INTO complaint (student_id, complaint_status, description, complaint_type)
SELECT s.student_id, 'In Progress', 'The chair in the room is broken and needs replacement.', 'furniture'
FROM student s WHERE s.email = 'neha@student.com'
ON CONFLICT DO NOTHING;

INSERT INTO complaint (student_id, complaint_status, description, complaint_type)
SELECT s.student_id, 'Resolved', 'The common area was unhygienic and needed cleaning.', 'house_keeping'
FROM student s WHERE s.email = 'arjun@student.com'
ON CONFLICT DO NOTHING;

-- Payments
INSERT INTO payment (student_id, payment_date, amount, payment_mode)
SELECT s.student_id, CURRENT_DATE - INTERVAL '30 days', 5500.00, 'UPI'
FROM student s WHERE s.email = 'arjun@student.com'
ON CONFLICT DO NOTHING;

INSERT INTO payment (student_id, payment_date, amount, payment_mode)
SELECT s.student_id, CURRENT_DATE - INTERVAL '30 days', 6000.00, 'Net Banking'
FROM student s WHERE s.email = 'neha@student.com'
ON CONFLICT DO NOTHING;

INSERT INTO payment (student_id, payment_date, amount, payment_mode)
SELECT s.student_id, CURRENT_DATE, 5500.00, 'Credit Card'
FROM student s WHERE s.email = 'arjun@student.com'
ON CONFLICT DO NOTHING;

-- Maintenance Requests
INSERT INTO maintenance (student_id, room_id, warden_id, issue, status)
SELECT s.student_id, r.room_id, 1, 'Ceiling fan is making a loud rattling noise', 'Pending'
FROM student s, room r
WHERE s.email = 'arjun@student.com' AND r.room_no = 'A103'
ON CONFLICT DO NOTHING;

INSERT INTO maintenance (student_id, room_id, warden_id, issue, status)
SELECT s.student_id, r.room_id, 2, 'Room window latch is broken and does not close properly', 'In Progress'
FROM student s, room r
WHERE s.email = 'neha@student.com' AND r.room_no = 'B102'
ON CONFLICT DO NOTHING;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW hostel_occupancy_stats;
