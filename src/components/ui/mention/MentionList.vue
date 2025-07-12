<template>
    <div class="flex flex-col rounded gap-1 bg-gray-100">
        <template v-if="items.length">
            <button class="hover:bg-amber-100 hover:cursor-pointer px-2"
                :class="{ 'bg-amber-100': index === selectedIndex }" v-for="(item, index) in items" :key="index"
                @click="selectItem(index)">
                {{ item }}
            </button>
        </template>
        <div class="item" v-else>Not Found</div>
    </div>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            required: true,
        },

        command: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {
            selectedIndex: 0,
        }
    },
    watch: {
        items() {
            this.selectedIndex = 0
        },
    },
    methods: {
        onKeyDown({ event }) {
            if (event.key === 'ArrowUp') {
                this.upHandler()
                return true
            }
            if (event.key === 'ArrowDown') {
                this.downHandler()
                return true
            }
            if (event.key === 'Enter') {
                this.enterHandler()
                return true
            }
            return false
        },
        upHandler() {
            this.selectedIndex = (this.selectedIndex + this.items.length - 1) % this.items.length
        },
        downHandler() {
            this.selectedIndex = (this.selectedIndex + 1) % this.items.length
        },
        enterHandler() {
            this.selectItem(this.selectedIndex)
        },
        selectItem(index) {
            const item = this.items[index]
            if (item) {
                this.command({ id: item })
            }
        },
    },
}
</script>
