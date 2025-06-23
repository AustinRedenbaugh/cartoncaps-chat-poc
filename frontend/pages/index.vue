<script setup lang="ts">
    import { ref, watch } from "vue";
    import { ScrollArea } from "@/components/ui/scroll-area";
    import { Textarea } from "@/components/ui/textarea";
    import { Button } from "@/components/ui/button";
    import { marked } from "marked";

    import type { ChatMessageEntry } from "@/types/ChatMessage";

    // Users composable
    const { userNamesList, selectedUser, setUserNamesList, setSelectedUser } =
        useUsers();

    // API composable
    const { helloMessage, respondMessageSSE } = useApi();

    // Chat messages list
    const chatMessages = ref<ChatMessageEntry[]>([]);

    // Message input
    const messageInput = ref("");

    // Conversation ID tracking
    const conversationId = ref(-1);

    // Loading state for streaming
    const isStreaming = ref(false);

    // Register a custom renderer for links to open in new tab
    marked.use({
        renderer: {
            link(token: any) {
                const href = token.href;
                const title = token.title ? ` title="${token.title}"` : "";
                const text = this.parser.parseInline(token.tokens);
                return `<a href="${href}"${title} target="_blank" rel="noopener noreferrer">${text}</a>`;
            }
        }
    });

    // Send message function
    const sendMessage = async () => {
        if (
            messageInput.value.trim() &&
            selectedUser.value &&
            !isStreaming.value
        ) {
            const userMessage = messageInput.value.trim();

            // Add user message to chat
            chatMessages.value.push({
                role: "User",
                message: userMessage,
                is_thinking: false,
            });

            // Clear input
            messageInput.value = "";

            // Set streaming state
            isStreaming.value = true;

            // Add placeholder for assistant response
            const assistantMessageIndex = chatMessages.value.length;
            chatMessages.value.push({
                role: "Assistant",
                message: "Thinking...",
                is_thinking: true,
            });

            try {
                // Use SSE streaming
                await respondMessageSSE(
                    {
                        user_id: selectedUser.value.id,
                        message: userMessage,
                        conversation_id: conversationId.value,
                    },
                    // onStep callback
                    (data) => {
                        console.log("BIGdata", data);
                        if (data.type === "step") {
                            console.log("data: ", data);
                            const stepData = data.content;
                            console.log("stepData: ", stepData);
                            if (stepData.step_type === "final_response") {
                                // Update the assistant message with final response
                                chatMessages.value[assistantMessageIndex] = {
                                    role: "Assistant",
                                    message: stepData.message,
                                    is_thinking: stepData.is_thinking,
                                };
                            } else if (stepData.step_type === "step") {
                                // Update with processing status
                                chatMessages.value[assistantMessageIndex] = {
                                    role: "Assistant",
                                    message: stepData.message,
                                    is_thinking: stepData.is_thinking,
                                };
                            }
                        }
                    },
                    // onComplete callback
                    () => {
                        isStreaming.value = false;
                    },
                    // onError callback
                    (error) => {
                        isStreaming.value = false;
                        console.error("Error sending message:", error);
                        chatMessages.value[assistantMessageIndex] = {
                            role: "Assistant",
                            message: "Sorry, there was an error processing your message.",
                            is_thinking: false,
                        };
                    }
                );
            } catch (error) {
                isStreaming.value = false;
                console.error("Error sending message:", error);
                chatMessages.value[assistantMessageIndex] = {
                    role: "Assistant",
                    message:
                        "Sorry, there was an error processing your message.",
                    is_thinking: false,
                };
            }
        }
    };

    // Watch for user change → reset chatMessages
    watch(selectedUser, async () => {
        chatMessages.value = [];

        if (selectedUser.value) {
            try {
                const helloResponse = await helloMessage(selectedUser.value);
                // Convert HelloMessageEntry to ChatMessageEntry and append to chatMessages
                chatMessages.value.push({
                    role: "Assistant",
                    message: helloResponse.message,
                    is_thinking: false,
                });
                // Update conversation ID
                conversationId.value = helloResponse.conversation_id;
            } catch (error) {
                console.error("Error fetching hello message:", error);
            }
        }
    });

    function renderMessage(msg: string) {
        return marked.parse(msg);
    }
</script>

<template>
    <div
        class="min-h-screen flex flex-col items-center justify-center text-black text-3xl font-bold"
    >
        <h1 class="text-white text-sm">
            User: {{ selectedUser?.name ?? "Select a user" }}
        </h1>
        <h1 class="text-white text-sm">
            Conversation_ID: {{ conversationId ?? -10 }}
        </h1>
        <div class="h-[576px] w-96 rounded-md border bg-gray-200 flex flex-col">
            <!-- Scrollable chat area -->
            <div class="flex-1 overflow-auto">
                <ScrollArea class="h-full p-4 space-y-20">
                    <div
                        v-for="(msg, index) in chatMessages"
                        :key="index"
                        :class="[
                            'flex',
                            msg.role === 'Assistant'
                                ? 'justify-start'
                                : 'justify-end',
                        ]"
                    >
                        <div class="flex flex-col">
                            <div
                                :class="[
                                    'max-w-80 rounded-lg px-3 py-2 text-sm flex flex-col',
                                    msg.role === 'Assistant' && msg.is_thinking
                                        ? 'bg-gray-300 text-black pr-2'
                                        : msg.role === 'Assistant'
                                            ? 'bg-green-300 text-black pr-2'
                                            : 'bg-blue-300 text-black pr-2',
                                ]"
                            >
                                <span v-html="renderMessage(msg.message ?? '(no message)')"></span>
                            </div>
                            <div
                                :class="[
                                    'text-xs text-gray-400 mt-1 mb-[5px]',
                                    msg.role === 'Assistant'
                                        ? 'text-left'
                                        : 'text-right',
                                ]"
                            >
                                {{ msg.role }}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>

            <!-- Message input -->
            <Textarea
                v-model="messageInput"
                class="bg-white w-full"
                placeholder="Type your message here."
                @keydown.enter.prevent="sendMessage"
                :disabled="isStreaming"
            />
        </div>

        <Button
            @click="sendMessage"
            class="h-[36px] w-96 rounded-md border bg-green-500 hover:bg-green-600 text-white"
            :disabled="!messageInput.trim() || !selectedUser || isStreaming"
        >
            {{ isStreaming ? "Streaming..." : "Send Message" }}
        </Button>
    </div>
</template>

<style scoped>
a {
  color: #2563eb; /* Tailwind blue-600 */
  text-decoration: underline;
  font-weight: 500;
  transition: color 0.2s;
}
a:hover {
  color: #1d4ed8; /* Tailwind blue-700 */
}
</style>
