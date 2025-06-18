import { ref, computed } from 'vue'
import type { UserEntry } from "@/types/User"

const userNamesList = ref<UserEntry[]>([])
const selectedUser = ref<UserEntry | null>(null)

export function useUsers() {
  const hasUserNames = computed(() => userNamesList.value.length > 0)

  const setUserNamesList = (users: UserEntry[]) => {
    userNamesList.value = users
  }

  const setSelectedUser = (user: UserEntry | null) => {
    selectedUser.value = user
  }

  return {
    // state
    userNamesList,
    selectedUser,

    // derived
    hasUserNames,

    // actions
    setUserNamesList,
    setSelectedUser,
  }
}
