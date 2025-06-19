import type { UserEntry } from '../types/User'
import type { HelloMessageEntry } from '../types/HelloMessage'
import type { MessageRequest } from '../types/ChatMessage'

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
            const response = await fetch("http://127.0.0.1:8000/chat/hello", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: selectedUser.id }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching hello message:", error);
            return {
                user: {
                    id: -1,
                    school_id: -1,
                    name: "Select a user",
                    email: "",
                },
                message: null,
                conversation_id: -1,
            };
        }
    };


    const respondMessageSSE = async (
        messageRequest: MessageRequest,
        onStep: (data: any) => void,
        onComplete: () => void,
        onError: (error: string) => void
    ): Promise<void> => {
        try {
            const response = await fetch("http://127.0.0.1:8000/chat/respond", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageRequest),
            });

            if (!response.ok || !response.body) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let currentEvent = '';
            let currentData = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });

                // Split on newlines to process SSE format
                let lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) {
                        // Empty line indicates end of event, process it
                        if (currentEvent && currentData) {
                            try {
                                console.log("currentData: ", currentData)
                                const parsedData = JSON.parse(currentData);

                                if (currentEvent === 'step') {
                                    onStep(parsedData);
                                }
                                else if (currentEvent === 'complete') {
                                    onComplete();
                                } else if (currentEvent === 'error') {
                                    onError(parsedData.message || 'An error occurred');
                                }
                            } catch (err) {
                                console.error('Error parsing SSE data:', err, currentData);
                            }
                        }
                        // Reset for next event
                        currentEvent = '';
                        currentData = '';
                        continue;
                    }

                    // Parse SSE field: "field: value"
                    const colonIndex = trimmedLine.indexOf(':');
                    if (colonIndex !== -1) {
                        const field = trimmedLine.substring(0, colonIndex).trim();
                        const value = trimmedLine.substring(colonIndex + 1).trim();
                        console.log("field: ", field)
                        console.log("value: ", value)
                        if (field === 'event') {
                            currentEvent = value;
                        } else if (field === 'data') {
                            currentData = value;
                        }
                    }
                }
            }

            // Process any remaining event in buffer
            if (currentEvent && currentData) {
                try {
                    const parsedData = JSON.parse(currentData);

                    if (currentEvent === 'step') {
                        onStep(parsedData);
                    } else if (currentEvent === 'complete') {
                        onComplete();
                    } else if (currentEvent === 'error') {
                        onError(parsedData.message || 'An error occurred');
                    }
                } catch (err) {
                    console.error('Error parsing final SSE data:', err, currentData);
                }
            }

            // After stream ends, call onComplete if not already called
            onComplete();
        } catch (error: any) {
            console.error('Error streaming message:', error);
            onError(error?.message || 'Failed to stream response');
        }
    }

    // Keep the old respondMessage for backward compatibility if needed
    const respondMessage = async (messageRequest: MessageRequest): Promise<any> => {
        try {
            const response = await fetch("http://127.0.0.1:8000/chat/respond", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageRequest)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error sending message:', error)
            throw error
        }
    }

    return {
        fetchUsers,
        helloMessage,
        respondMessage,
        respondMessageSSE
    }
} 