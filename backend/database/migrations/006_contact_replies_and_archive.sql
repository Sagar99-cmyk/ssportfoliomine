-- Migration 006: Add archive flag and dedicated contact_replies tracking table

-- 1. Safely add is_archived column if it does not already exist
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'contact_messages'
  AND COLUMN_NAME = 'is_archived';

SET @sql = IF(@col_exists = 0, 'ALTER TABLE contact_messages ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT FALSE AFTER replied_at;', 'SELECT "is_archived already exists";');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. Create contact_replies table for persistent email reply tracking and delivery status
CREATE TABLE IF NOT EXISTS contact_replies (
  id VARCHAR(64) PRIMARY KEY,
  message_id VARCHAR(64) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  sender_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  reply_content TEXT NOT NULL,
  provider_message_id VARCHAR(255) NULL,
  status ENUM('sent', 'failed', 'queued') NOT NULL DEFAULT 'sent',
  error_details TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_replies_message_id (message_id),
  INDEX idx_replies_created_at (created_at),
  CONSTRAINT fk_replies_message_id
    FOREIGN KEY (message_id) REFERENCES contact_messages(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

