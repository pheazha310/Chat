/** A message as delivered over the wire by the server. */
export interface IncomingMessage {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
}

/** Events the server pushes to clients. */
export type ServerEvent =
  | { type: "NEW_MESSAGE"; payload: IncomingMessage }
  | { type: "USER_ONLINE"; payload: { userId: number } }
  | { type: "USER_OFFLINE"; payload: { userId: number } }
  | { type: "USER_TYPING"; payload: { userId: number } }
  | { type: "USER_STOPPED_TYPING"; payload: { userId: number } }
  | { type: "ERROR"; payload: { message: string } };

/** Events clients send to the server. */
export type ClientEvent =
  | { type: "SEND_MESSAGE"; payload: { receiverId: number; content: string } }
  | { type: "TYPING_START"; payload: { receiverId: number } }
  | { type: "TYPING_STOP"; payload: { receiverId: number } };