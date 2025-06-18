import type { UserEntry } from '../types/User'
import type { HelloMessageEntry } from '../types/HelloMessage'

const API_BASE_URL = 'http://localhost:8000'

export function useApi() {
    const fetchUsers = async (): Promise<UserEntry[]> => {
        try {
            const response = await fetch("http://127.0.0.1:8000/chat/users");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data.users
        } catch (error) {
            console.error('Error fetching users:', error)
            return []
        }
    }

    const helloMessage = async (selectedUser: UserEntry): Promise<HelloMessageEntry> => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/chat/hello?user_id=${selectedUser.id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching hello message:', error)
            return {
                user: {
                    id: -1,
                    school_id: -1,
                    name: "Select a user",
                    email: "",
                },
                message: null,
            };

        }
    }

    return {
        fetchUsers, helloMessage
    }
} 