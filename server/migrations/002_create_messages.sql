CREATE TABLE messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  sender_id INT UNSIGNED NOT NULL,
  receiver_id INT UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT messages_sender_user_fk FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT messages_receiver_user_fk FOREIGN KEY (receiver_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT messages_content_not_empty CHECK (CHAR_LENGTH(TRIM(content)) > 0),
  INDEX messages_sender_receiver_created_idx (sender_id, receiver_id, created_at),
  INDEX messages_receiver_sender_created_idx (receiver_id, sender_id, created_at)
);