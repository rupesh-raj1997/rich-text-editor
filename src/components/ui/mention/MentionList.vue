<template>
    <div class="dropdown-menu">
        <template v-if="items.length">
            <button :class="{ 'is-selected': index === selectedIndex }" v-for="(item, index) in items" :key="index"
                @click="selectItem(index)">
                {{ item }}
            </button>
        </template>
        <div class="item" v-else>
            No result
        </div>
    </div>
</template>

<script>
export default {
    name: 'MentionList',
}
</script>

<script setup lang="ts">
import { ref } from 'vue';


const props = defineProps({
    items: { type: Array, required: true },
    command: { type: Function, required: true },
})

const selectedIndex = ref(0);

const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
        upHandler()
        return true
    }

    if (event.key === 'ArrowDown') {
        downHandler()
        return true
    }

    if (event.key === 'Enter') {
        enterHandler()
        return true
    }
}


const selectItem = (index: number) => {
    const item = props.items[index]
    if (item) props.command({ id: item })
};

const upHandler = () => {
    selectedIndex.value = ((selectedIndex.value + props.items.length) - 1) % props.items.length
};

const downHandler = () => {
    selectedIndex.value = (selectedIndex.value + 1) % props.items.length
};

const enterHandler = () => {
    selectItem(selectedIndex.value)
};


</script>



<style lang="scss">
/* Dropdown menu */
.mention .dropdown-menu {
    background: var(--white);
    border: 1px solid var(--gray-1);
    border-radius: 0.7rem;
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    overflow: auto;
    padding: 0.4rem;
    position: relative;

    button {
        align-items: center;
        background-color: transparent;
        display: flex;
        gap: 0.25rem;
        text-align: left;
        width: 100%;

        &:hover,
        &:hover.is-selected {
            background-color: var(--gray-3);
        }

        &.is-selected {
            background-color: var(--gray-2);
        }
    }
}
</style>