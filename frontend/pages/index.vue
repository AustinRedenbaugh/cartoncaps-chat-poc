<script setup lang="ts">
    import { ref, watch } from "vue";
    import { ScrollArea } from "@/components/ui/scroll-area";
    import { Textarea } from "@/components/ui/textarea";
    import { Button } from "@/components/ui/button";

    import type { ChatMessageEntry } from "@/types/ChatMessage";

    // Users composable
    const { userNamesList, selectedUser, setUserNamesList, setSelectedUser } =
        useUsers();

    // API composable
    const { helloMessage } = useApi();

    // Chat messages list
    const chatMessages = ref<ChatMessageEntry[]>([]);
    
    // Message input
    const messageInput = ref("");

    // Send message function
    const sendMessage = () => {
        if (messageInput.value.trim() && selectedUser.value) {
            // Add user message to chat
            chatMessages.value.push({
                role: "User",
                message: messageInput.value.trim()
            });
            
            // Clear input
            messageInput.value = "";
            
            // TODO: Here you would typically call an API to get assistant response
            // For now, we'll add a mock response
            setTimeout(() => {
                chatMessages.value.push({
                    role: "Assistant",
                    message: "Thanks for your message! This is a mock response."
                });
            }, 1000);
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
                    message: helloResponse.message
                });
            } catch (error) {
                console.error('Error fetching hello message:', error);
            }
        }
    });
</script>

<template>
    <div
        class="min-h-screen flex flex-col items-center justify-center text-black text-3xl font-bold"
    >
        <h1 class="text-white text-sm">
            User: {{ selectedUser?.name ?? "Select a user" }}
        </h1>

        <div class="h-[576px] w-96 rounded-md border bg-gray-500 flex flex-col">
            <!-- Scrollable chat area -->
            <div class="flex-1 overflow-auto">
                <ScrollArea class="h-full p-4 space-y-20">
                    <div 
                        v-for="(msg, index) in chatMessages" 
                        :key="index"
                        :class="[
                            'flex',
                            msg.role === 'Assistant' ? 'justify-start' : 'justify-end'
                        ]"
                    >
                        <div class="flex flex-col">
                            <div 
                                :class="[
                                    'max-w-64 rounded-lg px-3 py-2 text-sm flex flex-col',
                                    msg.role === 'Assistant' 
                                        ? 'bg-blue-500 text-white pr-2' 
                                        : 'bg-green-500 text-white pr-3'
                                ]"
                            >
                                {{ msg.message ?? "(no message)" }}
                            </div>
                            <div 
                                :class="[
                                    'text-xs text-gray-300 mt-1 mb-[5px]',
                                    msg.role === 'Assistant' ? 'text-left' : 'text-right'
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
            />
        </div>

        <Button 
            @click="sendMessage"
            class="h-[36px] w-96 rounded-md border bg-green-500 hover:bg-green-600 text-white"
            :disabled="!messageInput.trim() || !selectedUser"
        >
            Send Message
        </Button>
    </div>
</template>
