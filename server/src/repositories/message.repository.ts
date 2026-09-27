import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { database } from "../config/database";
import type { Message } from "../models/message.model";

interface MessageRow extends RowDataPacket, Message {}

export class MessageRepository {
  async create(
    senderId: number,
    receiverId: number,
    content: string,
  ): Promise<Message> {
    const [result] = await database.execute<ResultSetHeader>(
      "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)",
      [senderId, receiverId, content],
    );
    const [rows] = await database.execute<MessageRow[]>(
      `SELECT id, sender_id AS senderId, receiver_id AS receiverId,
              content, created_at AS createdAt
       FROM messages WHERE id = ?`,
      [result.insertId],
    );
    if (!rows[0]) {
      throw new Error("Created message could not be loaded");
    }
    return rows[0];
  }

  async findConversation(
    firstUserId: number,
    secondUserId: number,
  ): Promise<Message[]> {
    const [rows] = await database.execute<MessageRow[]>(
      `SELECT id, sender_id AS senderId, receiver_id AS receiverId,
              content, created_at AS createdAt
       FROM messages
       WHERE (sender_id = ? AND receiver_id = ?)
          OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC, id ASC`,
      [firstUserId, secondUserId, secondUserId, firstUserId],
    );
    return rows;
  }
}
