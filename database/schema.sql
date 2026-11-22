CREATE DATABASE IF NOT EXISTS eduresource_manager
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE eduresource_manager;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS resources (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    serial_number VARCHAR(100) NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    condition_status ENUM('working', 'damaged', 'untested') NOT NULL DEFAULT 'working',
    location VARCHAR(150) NOT NULL,
    status ENUM('available', 'loaned', 'repair', 'disposed') NOT NULL DEFAULT 'available',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_resources_category (category),
    INDEX idx_resources_location (location),
    INDEX idx_resources_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS loans (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    resource_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    issued_by INT UNSIGNED NOT NULL,
    checkout_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date DATE NOT NULL,
    return_date DATETIME NULL,
    INDEX idx_loans_user (user_id),
    INDEX idx_loans_due_date (due_date),
    CONSTRAINT fk_loans_resource FOREIGN KEY (resource_id) REFERENCES resources(id),
    CONSTRAINT fk_loans_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_loans_issuer FOREIGN KEY (issued_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
