-- GYM PLUS Database Schema
CREATE DATABASE IF NOT EXISTS gym_plus;
USE gym_plus;

-- ADMIN_USER table
CREATE TABLE IF NOT EXISTS ADMIN_USER (
  admin_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('Admin','Trainer') DEFAULT 'Admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MEMBER table
CREATE TABLE IF NOT EXISTS MEMBER (
  member_id VARCHAR(20) PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(150),
  gender ENUM('Male','Female','Other'),
  address TEXT,
  photo VARCHAR(255),
  join_date DATE DEFAULT (CURDATE()),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TRAINER table
CREATE TABLE IF NOT EXISTS TRAINER (
  trainer_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  specialization VARCHAR(200),
  phone VARCHAR(20),
  email VARCHAR(150),
  experience INT DEFAULT 0,
  status ENUM('Active','Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MEMBERSHIP table
CREATE TABLE IF NOT EXISTS MEMBERSHIP (
  membership_id INT AUTO_INCREMENT PRIMARY KEY,
  member_id VARCHAR(20),
  membership_type ENUM('Basic Plan','Standard Plan','Premium Plan','Elite Plan') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  validity VARCHAR(50),
  amount DECIMAL(10,2) DEFAULT 0,
  status ENUM('Active','Expired','Pending') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES MEMBER(member_id) ON DELETE CASCADE
);

-- ATTENDANCE table
CREATE TABLE IF NOT EXISTS ATTENDANCE (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id VARCHAR(20),
  entry_time DATETIME,
  exit_time DATETIME,
  date DATE DEFAULT (CURDATE()),
  FOREIGN KEY (member_id) REFERENCES MEMBER(member_id) ON DELETE CASCADE
);

-- PAYMENT table
CREATE TABLE IF NOT EXISTS PAYMENT (
  payment_id VARCHAR(20) PRIMARY KEY,
  member_id VARCHAR(20),
  member_name VARCHAR(200),
  plan VARCHAR(100),
  amount DECIMAL(10,2),
  payment_date DATE DEFAULT (CURDATE()),
  status ENUM('Paid','Pending') DEFAULT 'Paid',
  method ENUM('UPI','Card','Cash','Net Banking') DEFAULT 'Cash',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES MEMBER(member_id) ON DELETE CASCADE
);

-- Seed admin user (password: admin123)
INSERT IGNORE INTO ADMIN_USER (username, password, role) VALUES
('admin', 'admin123', 'Admin'),
('trainer1', 'trainer123', 'Trainer');

-- Seed members
INSERT IGNORE INTO MEMBER (member_id, first_name, last_name, phone, email, gender, address, join_date) VALUES
('MBR1001', 'Amit', 'Sharma', '9876543210', 'amit.sharma@email.com', 'Male', 'Mumbai, Maharashtra', '2025-01-10'),
('MBR1002', 'Neha', 'Kapoor', '9123456780', 'neha.kapoor@email.com', 'Female', '45, Park Street, Bangalore', '2025-05-25'),
('MBR1003', 'Rohan', 'Mehta', '9876543211', 'rohan.mehta@email.com', 'Male', 'Delhi, India', '2025-05-24'),
('MBR1004', 'Priya', 'Patel', '9988776655', 'priya.patel@email.com', 'Female', 'Ahmedabad, Gujarat', '2025-05-24'),
('MBR1005', 'Rahul', 'Verma', '8899776655', 'rahul.verma@email.com', 'Male', 'Pune, Maharashtra', '2025-05-23');

-- Seed trainers
INSERT IGNORE INTO TRAINER (name, specialization, phone, email, experience, status) VALUES
('Vikram Singh', 'Strength & Conditioning', '9911223344', 'vikram@gymplus.com', 8, 'Active'),
('Anita Rao', 'Yoga & Flexibility', '9922334455', 'anita@gymplus.com', 5, 'Active'),
('Deepak Malhotra', 'Cardio & HIIT', '9933445566', 'deepak@gymplus.com', 6, 'Active');

-- Seed memberships
INSERT IGNORE INTO MEMBERSHIP (member_id, membership_type, start_date, end_date, validity, amount, status) VALUES
('MBR1001', 'Premium Plan', '2025-01-10', '2025-07-10', '6 Months', 6999, 'Active'),
('MBR1002', 'Standard Plan', '2025-05-25', '2025-08-25', '3 Months', 3999, 'Active'),
('MBR1003', 'Basic Plan', '2025-05-24', '2025-06-24', '1 Month', 1499, 'Active'),
('MBR1004', 'Premium Plan', '2025-05-24', '2025-11-24', '6 Months', 6999, 'Active'),
('MBR1005', 'Elite Plan', '2025-05-23', '2026-05-23', '12 Months', 11999, 'Active');

-- Seed payments
INSERT IGNORE INTO PAYMENT (payment_id, member_id, member_name, plan, amount, payment_date, status, method) VALUES
('PAY1001', 'MBR1001', 'Amit Sharma', 'Premium Plan', 6999, '2025-05-25', 'Paid', 'UPI'),
('PAY1002', 'MBR1002', 'Neha Kapoor', 'Standard Plan', 3999, '2025-05-25', 'Paid', 'Card'),
('PAY1003', 'MBR1003', 'Rohan Mehta', 'Basic Plan', 1499, '2025-05-24', 'Paid', 'Cash'),
('PAY1004', 'MBR1004', 'Priya Patel', 'Premium Plan', 6999, '2025-05-24', 'Pending', 'UPI'),
('PAY1005', 'MBR1005', 'Rahul Verma', 'Elite Plan', 11999, '2025-05-23', 'Paid', 'Card');

-- Seed attendance
INSERT IGNORE INTO ATTENDANCE (member_id, entry_time, exit_time, date) VALUES
('MBR1001', NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 1 HOUR, CURDATE()),
('MBR1002', NOW() - INTERVAL 3 HOUR, NOW() - INTERVAL 1 HOUR, CURDATE()),
('MBR1003', NOW() - INTERVAL 1 HOUR, NULL, CURDATE());
