import type { UserEntry } from "@/types/User"

export interface HelloMessageEntry {
    user: UserEntry;
    message: string | null;
  }