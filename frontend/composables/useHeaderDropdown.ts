import { ref } from "vue";

const dropdownOpen = ref(false);

export function useHeaderDropdown() {
    return {
        dropdownOpen,
        closeDropdown: () => (dropdownOpen.value = false),
        openDropdown: () => (dropdownOpen.value = true),
    }
}