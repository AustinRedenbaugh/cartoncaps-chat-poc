export type ChatRole = "User" | "Assistant";

export interface ChatMessageEntry {
    role: ChatRole;
    message: string | null;
}

export interface MessageRequest {
    user_id: number;
    message: string;
}