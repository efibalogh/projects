USE web;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher') NOT NULL DEFAULT 'student',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  userId INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  courseId INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  deadline DATETIME NOT NULL,
  filePath VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS course_enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  courseId INT NOT NULL,
  userId INT NOT NULL,
  status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
  invitedBy INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_enrollment (courseId, userId),
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (invitedBy) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  enrollmentId INT NOT NULL,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (enrollmentId) REFERENCES course_enrollments(id) ON DELETE CASCADE
);

-- Test data (password is 'pass')
-- INSERT INTO users (name, email, password, role)
-- VALUES ('Teacher', 'teacher@school.edu', '$2a$10$CvdMHL.FTRJxnOnPN3ZKPuKzk6pGE8FmBLd2xiyD9xBo1EnALzDdG', 'teacher'),
--        ('Another Teacher', 'another.teacher@school.edu', '$2a$10$CvdMHL.FTRJxnOnPN3ZKPuKzk6pGE8FmBLd2xiyD9xBo1EnALzDdG', 'teacher'),
--        ('Student', 'student@school.edu', '$2a$10$CvdMHL.FTRJxnOnPN3ZKPuKzk6pGE8FmBLd2xiyD9xBo1EnALzDdG', 'student');

-- INSERT INTO courses (code, name, description, userId)
-- VALUES ('CSC101', 'Introduction to Computer Science', 'This is a course about the basics of computer science.', 1),
--        ('MAT101', 'Introduction to Mathematics', 'This is a course about the basics of mathematics.', 1),
--        ('PHY101', 'Introduction to Physics', 'This is a course about the basics of physics.', 2);
