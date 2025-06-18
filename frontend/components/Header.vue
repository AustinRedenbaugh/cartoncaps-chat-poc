<script setup lang="ts">
    // Imports
    import { onMounted } from "vue";
    import { useHeaderDropdown } from "@/composables/useHeaderDropdown";
    import { useUsers } from "@/composables/useUsers";
    import { useApi } from "@/composables/useApi";
    import type { UserEntry } from "@/types/User";
    import { ScrollArea } from "@/components/ui/scroll-area";

    // Header dropdown state
    const { dropdownOpen, openDropdown, closeDropdown } = useHeaderDropdown();

    // Users composable
    const { userNamesList, selectedUser, setUserNamesList, setSelectedUser } =
        useUsers();

    // API composable
    const { fetchUsers } = useApi();

    // Avatar
    const avatarSrc = "/blank-profile-pic.png";

    // Handle avatar click (optional logic)
    function handleAvatarClick() {}

    // Fetch users on component mount
    onMounted(async () => {
        const users = await fetchUsers();
        console.log("Fetched users:", users);
        setUserNamesList(users);
    });
</script>

<template>
    <nav
        class="flex mx-auto items-center justify-between px-6 py-4 shadow-sm border-b bg-white dark:bg-gray-950 border-b border-b-black"
    >
        <!-- Left: Logo -->
        <div class="flex items-center gap-6 pl-60">
            <NuxtLink
                to="/"
                class="font-bold text-xl tracking-tight text-primary"
            >
                CartonCaps
            </NuxtLink>
        </div>

        <!-- Right: User + Avatar -->
        <div class="flex items-center gap-4 pr-60">
            <!-- Display Selected User -->
            <!-- <h1>User: {{ selectedUser?.name ?? "None Selected" }}</h1> -->

            <!-- Dropdown -->
            <DropdownMenu v-model:open="dropdownOpen">
                <DropdownMenuTrigger>
                    <Avatar
                        @click="handleAvatarClick"
                        class="cursor-pointer ring-1 ring-muted-foreground/20"
                    >
                        <AvatarImage
                            :src="avatarSrc"
                            alt="User avatar"
                            class="object-contain p-1"
                        />
                    </Avatar>
                </DropdownMenuTrigger>

                <div class="w-32 mt-2">
                    <DropdownMenuContent>
                        <ScrollArea class="h-72 w-48 rounded-md border">
                            <DropdownMenuItem
                                v-for="user in userNamesList"
                                :key="user.id"
                                class="text-black"
                                @click="setSelectedUser(user)"
                            >
                                {{ user.name ?? "Unnamed User" }}
                            </DropdownMenuItem>
                        </ScrollArea>
                    </DropdownMenuContent>
                </div>
            </DropdownMenu>
        </div>
    </nav>
</template>
