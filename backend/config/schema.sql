-- =============================================================
--  MaritimeFlow — Database Initialisation Script
--  Database : maritimeflow
--  MySQL    : localhost:3306  |  User: root  |  Password: (none)
-- =============================================================

CREATE DATABASE IF NOT EXISTS maritimeflow
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE maritimeflow;

-- -----------------------------------------------------------
-- Users
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id          INT          NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  username    VARCHAR(100) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('admin','operator','viewer') NOT NULL DEFAULT 'viewer',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- Shipments
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS shipments (
  id                INT          NOT NULL AUTO_INCREMENT,
  tracking_number   VARCHAR(50)  NOT NULL UNIQUE,
  vessel_name       VARCHAR(150),
  origin            VARCHAR(150) NOT NULL,
  destination       VARCHAR(150) NOT NULL,
  status            ENUM('pending','in_transit','arrived','delivered','cancelled')
                                 NOT NULL DEFAULT 'pending',
  estimated_arrival DATE,
  actual_arrival    DATE,
  created_by        INT          NOT NULL,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- Containers
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS containers (
  id              INT          NOT NULL AUTO_INCREMENT,
  container_number VARCHAR(20) NOT NULL UNIQUE,
  shipment_id     INT,
  type            ENUM('20ft','40ft','40ft_hc','reefer','open_top','flat_rack')
                               NOT NULL DEFAULT '20ft',
  weight_kg       DECIMAL(10,2),
  status          ENUM('at_sea','at_port','under_inspection','cleared','released') NOT NULL DEFAULT 'at_port',
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- Documents
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS documents (
  id            INT           NOT NULL AUTO_INCREMENT,
  shipment_id   INT,
  uploaded_by   INT           NOT NULL,
  doc_type      VARCHAR(80)   NOT NULL COMMENT 'e.g. Bill of Lading, Manifest, Certificate',
  file_name     VARCHAR(255)  NOT NULL,
  file_path     VARCHAR(500)  NOT NULL,
  uploaded_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (shipment_id)  REFERENCES shipments(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by)  REFERENCES users(id)     ON DELETE RESTRICT
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- Contact Messages
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  message_id      INT           NOT NULL AUTO_INCREMENT,
  name            VARCHAR(150)  NOT NULL,
  email           VARCHAR(150)  NOT NULL,
  subject         VARCHAR(255)  NOT NULL,
  message         TEXT          NOT NULL,
  submitted_date  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (message_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- Reports
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
  id           INT           NOT NULL AUTO_INCREMENT,
  title        VARCHAR(200)  NOT NULL,
  report_type  VARCHAR(80)   NOT NULL COMMENT 'e.g. shipment_summary, container_status',
  generated_by INT           NOT NULL,
  file_path    VARCHAR(500),
  generated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =============================================================
-- Migration: run these on existing databases
-- =============================================================
-- ALTER TABLE shipments
--   ADD COLUMN vessel_name VARCHAR(150) AFTER tracking_number;
--
-- ALTER TABLE containers
--   MODIFY COLUMN status
--     ENUM('at_sea','at_port','under_inspection','cleared','released')
--     NOT NULL DEFAULT 'at_port';
-- UPDATE containers SET status = 'at_port' WHERE status NOT IN ('at_sea','at_port','under_inspection','cleared','released');
