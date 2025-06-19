export type ChatRole = "User" | "Assistant";

export interface ChatMessageEntry {
    role: ChatRole;
    message: string | null;
    is_thinking: boolean;
}

export interface MessageRequest {
    user_id: number;
    message: string;
}