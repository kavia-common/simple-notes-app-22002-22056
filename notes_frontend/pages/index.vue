<template>
  <div class="flex w-full">
    <!-- Notes List Panel -->
    <div class="w-1/3 border-r border-gray-200 bg-white">
      <div class="h-full flex flex-col">
        <!-- Search Bar -->
        <div class="p-4 border-b border-gray-100">
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search notes..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Notes List -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="loading && sortedNotes.length === 0" class="p-8 text-center text-gray-500">
            <div class="animate-pulse">Loading notes...</div>
          </div>
          
          <div v-else-if="filteredNotes.length === 0" class="p-8 text-center text-gray-500">
            <DocumentIcon class="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>{{ searchQuery ? 'No notes found' : 'No notes yet' }}</p>
            <p class="text-sm">{{ searchQuery ? 'Try a different search term' : 'Create your first note to get started' }}</p>
          </div>
          
          <div v-else class="divide-y divide-gray-100">
            <div
              v-for="note in filteredNotes"
              :key="note.id"
              @click="selectNote(note)"
              class="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
              :class="{
                'bg-blue-50 border-r-2 border-primary': selectedNote?.id === note.id
              }"
            >
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-medium text-gray-900 truncate flex-1" :title="note.title">
                  {{ note.title || 'Untitled' }}
                </h3>
                <button
                  @click.stop="deleteNoteHandler(note.id)"
                  class="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  title="Delete note"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
              <p class="text-sm text-gray-600 line-clamp-2 mb-2">
                {{ note.content || 'No content' }}
              </p>
              <p class="text-xs text-gray-400">
                {{ formatDate(note.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Note Editor Panel -->
    <div class="flex-1 flex flex-col bg-white">
      <div v-if="!selectedNote" class="flex-1 flex items-center justify-center text-gray-500">
        <div class="text-center">
          <DocumentTextIcon class="h-24 w-24 mx-auto mb-4 text-gray-300" />
          <h2 class="text-xl font-medium mb-2">Select a note to edit</h2>
          <p class="text-gray-400">Choose a note from the list or create a new one</p>
        </div>
      </div>
      
      <div v-else class="flex-1 flex flex-col">
        <!-- Editor Header -->
        <div class="p-4 border-b border-gray-100 flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">
              Last updated: {{ formatDate(selectedNote.updatedAt) }}
            </span>
            <span v-if="hasUnsavedChanges" class="text-xs text-amber-600 font-medium">
              Unsaved changes
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="saveNote"
              :disabled="!hasUnsavedChanges || saving"
              class="btn-primary text-sm"
              :class="{
                'opacity-50 cursor-not-allowed': !hasUnsavedChanges || saving
              }"
            >
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
            <button
              @click="deleteNoteHandler(selectedNote.id)"
              class="btn-danger text-sm"
            >
              <TrashIcon class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Editor Content -->
        <div class="flex-1 flex flex-col p-6">
          <!-- Title Input -->
          <input
            v-model="editingNote.title"
            type="text"
            placeholder="Note title..."
            class="text-2xl font-bold border-none outline-none mb-4 placeholder-gray-400 bg-transparent"
            @input="markAsChanged"
          />
          
          <!-- Content Textarea -->
          <textarea
            v-model="editingNote.content"
            placeholder="Start writing your note..."
            class="flex-1 resize-none border-none outline-none text-gray-700 placeholder-gray-400 bg-transparent leading-relaxed"
            @input="markAsChanged"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  MagnifyingGlassIcon, 
  DocumentIcon, 
  DocumentTextIcon, 
  TrashIcon 
} from '@heroicons/vue/24/outline'
import type { Note } from '~/types'

definePageMeta({
  layout: 'default'
})

const notesStore = useNotesStore()
const { sortedNotes, selectedNote, loading } = storeToRefs(notesStore)
const { fetchNotes, selectNote, updateNote, deleteNote } = notesStore

// Search functionality
const searchQuery = ref('')
const filteredNotes = computed(() => {
  if (!searchQuery.value) return sortedNotes.value
  
  const query = searchQuery.value.toLowerCase()
  return sortedNotes.value.filter(note => 
    note.title.toLowerCase().includes(query) || 
    note.content.toLowerCase().includes(query)
  )
})

// Editing state
const editingNote = ref({ title: '', content: '' })
const hasUnsavedChanges = ref(false)
const saving = ref(false)

// Watch for selected note changes
watch(selectedNote, (newNote) => {
  if (newNote) {
    editingNote.value = {
      title: newNote.title,
      content: newNote.content
    }
    hasUnsavedChanges.value = false
  }
}, { immediate: true })

// PUBLIC_INTERFACE
const markAsChanged = (): void => {
  /**
   * Marks the note as having unsaved changes
   */
  hasUnsavedChanges.value = true
}

// PUBLIC_INTERFACE
const saveNote = async (): Promise<void> => {
  /**
   * Saves the current note changes
   */
  if (!selectedNote.value || !hasUnsavedChanges.value) return
  
  saving.value = true
  try {
    await updateNote(selectedNote.value.id, {
      title: editingNote.value.title,
      content: editingNote.value.content
    })
    hasUnsavedChanges.value = false
  } catch (error) {
    console.error('Error saving note:', error)
  } finally {
    saving.value = false
  }
}

// PUBLIC_INTERFACE
const deleteNoteHandler = async (noteId: string): Promise<void> => {
  /**
   * Deletes a note with confirmation
   * @param noteId - The ID of the note to delete
   */
  const note = sortedNotes.value.find(n => n.id === noteId)
  if (!note) return
  
  const confirmed = confirm(`Are you sure you want to delete "${note.title || 'Untitled'}"?`)
  if (!confirmed) return
  
  await deleteNote(noteId)
}

// PUBLIC_INTERFACE
const formatDate = (dateString: string): string => {
  /**
   * Formats a date string for display
   * @param dateString - The date string to format
   * @returns Formatted date string
   */
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (days === 1) {
    return 'Yesterday'
  } else if (days < 7) {
    return `${days} days ago`
  } else {
    return date.toLocaleDateString()
  }
}

// Auto-save functionality
let saveTimeout: NodeJS.Timeout | null = null
watch([() => editingNote.value.title, () => editingNote.value.content], () => {
  if (!hasUnsavedChanges.value) return
  
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    saveNote()
  }, 2000) // Auto-save after 2 seconds of inactivity
})

// Initialize
onMounted(() => {
  fetchNotes()
})

// Cleanup
onUnmounted(() => {
  if (saveTimeout) clearTimeout(saveTimeout)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
