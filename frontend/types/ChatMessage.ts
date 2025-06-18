export type ChatRole = "User" | "Assistant";

export interface ChatMessageEntry {
    role: ChatRole;
    message: string | null;
}