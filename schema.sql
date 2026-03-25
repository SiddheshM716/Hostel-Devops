-- Student table
CREATE TABLE student (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    email VARCHAR(100) NOT NULL UNIQUE,
    street VARCHAR(100),
    city VARCHAR(50),
    flatno VARCHAR(20),
    contact_number VARCHAR(15) NOT NULL UNIQUE,
    pincode VARCHAR(10),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other'))
);

-- Warden table
CREATE TABLE warden (
    warden_id SERIAL PRIMARY KEY,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    warden_name VARCHAR(100) NOT NULL,
    warden_email VARCHAR(100) NOT NULL UNIQUE,
    warden_number VARCHAR(15) NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Hostel table
CREATE TABLE hostel (
    hostel_id SERIAL PRIMARY KEY,
    warden_id INTEGER,
    capacity INTEGER NOT NULL,
    hostel_name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    FOREIGN KEY (warden_id) REFERENCES warden(warden_id) ON DELETE SET NULL
);

-- Room table
CREATE TABLE room (
    room_id SERIAL PRIMARY KEY,
    room_capacity INTEGER NOT NULL,
    hostel_id INTEGER,
    yearly_fee NUMERIC(10,2) NOT NULL,
    has_attached_bathroom BOOLEAN DEFAULT false,
    has_ac BOOLEAN DEFAULT false,
    room_type VARCHAR(20) NOT NULL CHECK (room_type IN ('Single', 'Double', 'Triple', 'Dormitory')),
    room_no VARCHAR(20) NOT NULL,
    occupancy_status VARCHAR(20) NOT NULL CHECK (occupancy_status IN ('Available', 'Occupied')),
    FOREIGN KEY (hostel_id) REFERENCES hostel(hostel_id) ON DELETE CASCADE
);

-- Room Allocation table
CREATE TABLE room_allocation (
    allocation_id SERIAL PRIMARY KEY,
    student_id INTEGER,
    room_id INTEGER,
    allocation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    lease_end_date DATE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES room(room_id) ON DELETE SET NULL
);

-- Complaint table
CREATE TABLE complaint (
    complaint_id SERIAL PRIMARY KEY,
    student_id INTEGER,
    warden_id INTEGER,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    complaint_status VARCHAR(20) NOT NULL CHECK (complaint_status IN ('Pending', 'In Progress', 'Resolved')),
    description TEXT NOT NULL,
    complaint_type VARCHAR(20) NOT NULL CHECK (complaint_type IN ('plumbing', 'management', 'furniture', 'house_keeping')),
    assigned_to VARCHAR(100),
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (warden_id) REFERENCES warden(warden_id) ON DELETE SET NULL
);

CREATE TABLE visitor (
    visitor_id SERIAL PRIMARY KEY,
    student_id INTEGER,
    warden_id INTEGER,
    visitor_date DATE NOT NULL,
    visitor_name VARCHAR(100) NOT NULL,
    visitor_email VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Declined')),
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (warden_id) REFERENCES warden(warden_id) ON DELETE SET NULL
);

-- Mess Menu table (Replaces old student-specific Mess table)
CREATE TABLE mess_menu (
    menu_id SERIAL PRIMARY KEY,
    day_of_week VARCHAR(20) NOT NULL,
    meal_type VARCHAR(20) NOT NULL,
    veg_item TEXT NOT NULL,
    non_veg_item TEXT,
    timing VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Leave Application table
CREATE TABLE leave_application (
    leave_id SERIAL PRIMARY KEY,
    student_id INTEGER,
    warden_id INTEGER,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Declined')),
    applied_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (warden_id) REFERENCES warden(warden_id) ON DELETE SET NULL
);

-- Payment table
CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    student_id INTEGER,
    payment_date DATE NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_mode VARCHAR(20) NOT NULL CHECK (payment_mode IN ('UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash')),
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE
);

-- Maintenance table
CREATE TABLE maintenance (
    maintenance_id SERIAL PRIMARY KEY,
    student_id INTEGER,
    room_id INTEGER,
    warden_id INTEGER,
    issue TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES room(room_id) ON DELETE SET NULL,
    FOREIGN KEY (warden_id) REFERENCES warden(warden_id) ON DELETE SET NULL
);

-- Views
CREATE VIEW student_room_details AS
SELECT 
    s.student_id,
    s.name as student_name,
    s.email,
    r.room_no,
    r.room_type,
    h.hostel_name,
    ra.allocation_date,
    ra.lease_end_date
FROM student s
JOIN room_allocation ra ON s.student_id = ra.student_id
JOIN room r ON ra.room_id = r.room_id
JOIN hostel h ON r.hostel_id = h.hostel_id;

-- View for maintenance requests with details
CREATE VIEW maintenance_details AS
SELECT 
    m.maintenance_id,
    s.name as student_name,
    r.room_no,
    w.warden_name,
    m.issue,
    m.status
FROM maintenance m
JOIN student s ON m.student_id = s.student_id
JOIN room r ON m.room_id = r.room_id
LEFT JOIN warden w ON m.warden_id = w.warden_id;

-- View for payment history with student details
CREATE VIEW payment_history AS
SELECT 
    p.payment_id,
    s.name as student_name,
    s.email,
    p.amount,
    p.payment_date,
    p.payment_mode
FROM payment p
JOIN student s ON p.student_id = s.student_id;

-- Materialized view for hostel occupancy statistics
CREATE MATERIALIZED VIEW hostel_occupancy_stats AS
SELECT 
    h.hostel_id,
    h.hostel_name,
    h.capacity,
    COUNT(ra.allocation_id) as current_occupants,
    (h.capacity - COUNT(ra.allocation_id)) as available_spaces
FROM hostel h
LEFT JOIN room r ON h.hostel_id = r.hostel_id
LEFT JOIN room_allocation ra ON r.room_id = ra.room_id
GROUP BY h.hostel_id, h.hostel_name, h.capacity;

-- Triggers and Functions
CREATE OR REPLACE FUNCTION update_room_occupancy()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE room 
    SET occupancy_status = 'Occupied'
    WHERE room_id = NEW.room_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER room_allocation_trigger
AFTER INSERT ON room_allocation
FOR EACH ROW
EXECUTE FUNCTION update_room_occupancy();

CREATE OR REPLACE FUNCTION update_room_availability()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE room 
    SET occupancy_status = 'Available'
    WHERE room_id = OLD.room_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER room_deallocation_trigger
AFTER DELETE ON room_allocation
FOR EACH ROW
EXECUTE FUNCTION update_room_availability();

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_student_timestamp
BEFORE UPDATE ON student
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE OR REPLACE FUNCTION get_student_payment_summary(student_id_param INT)
RETURNS TABLE (
    payment_id INT,
    payment_date DATE,
    amount NUMERIC,
    payment_mode VARCHAR
) AS $$
DECLARE
    payment_cursor CURSOR FOR
        SELECT p.payment_id, p.payment_date, p.amount, p.payment_mode
        FROM payment p
        WHERE p.student_id = student_id_param
        ORDER BY p.payment_date DESC;
BEGIN
    OPEN payment_cursor;
    LOOP
        FETCH payment_cursor INTO payment_id, payment_date, amount, payment_mode;
        EXIT WHEN NOT FOUND;
        RETURN NEXT;
    END LOOP;
    CLOSE payment_cursor;
    RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_room_maintenance_history(room_id_param INT)
RETURNS TABLE (
    maintenance_id INT,
    issue_date TIMESTAMP,
    issue TEXT,
    status VARCHAR,
    student_name VARCHAR,
    warden_name VARCHAR
) AS $$
DECLARE
    maintenance_cursor CURSOR FOR
        SELECT 
            m.maintenance_id, 
            m.updated_at AS issue_date, 
            m.issue, 
            m.status,
            s.name AS student_name,
            w.warden_name
        FROM 
            maintenance m
        LEFT JOIN 
            student s ON m.student_id = s.student_id
        LEFT JOIN 
            warden w ON m.warden_id = w.warden_id
        WHERE 
            m.room_id = room_id_param
        ORDER BY 
            m.updated_at DESC;
BEGIN
    OPEN maintenance_cursor;
    LOOP
        FETCH maintenance_cursor INTO maintenance_id, issue_date, issue, status, student_name, warden_name;
        EXIT WHEN NOT FOUND;
        RETURN NEXT;
    END LOOP;
    CLOSE maintenance_cursor;
    RETURN;
END;
$$ LANGUAGE plpgsql;
