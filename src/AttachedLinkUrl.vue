<template>
    <div id="linkinput" class="flex items-center gap-2">
        <div class="grid flex-1 gap-2">
            <Label for="link" class="sr-only">
                Link
            </Label>
            <Input placeholder="Enter a URL" id="link" v-model:model-value="url" />
        </div>
        <Button type="submit" size="sm" class="px-3" @click="emit('save', url)">
            <span class="sr-only">Apply</span>
            <Link class="w-2 h-2" />
        </Button>
    </div>
</template>


<script setup lang="ts">
import { Link } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ref } from 'vue'

const props = defineProps<{
    linkInputUrl: string,
}>()

const url = ref(props.linkInputUrl)

const emit = defineEmits<{
    (e: 'save', str: string): void
}>()
</script>
