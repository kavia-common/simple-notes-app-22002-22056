<template>
  <div class="min-h-screen bg-ocean-background">
    <!-- Navigation Header -->
    <nav class="bg-white border-b border-gray-200 shadow-sm">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Title -->
          <div class="flex items-center">
            <PencilSquareIcon class="h-8 w-8 text-primary mr-3" />
            <h1 class="text-xl font-bold text-ocean-text">Notes App</h1>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">
              {{ notesCount }} {{ notesCount === 1 ? 'note' : 'notes' }}
            </span>
            <button
              @click="createNewNote"
              class="btn-primary flex items-center space-x-2"
              :disabled="loading"
            >
              <PlusIcon class="h-4 w-4" />
              <span>New Note</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="flex h-[calc(100vh-4rem)]">
      <slot />
    </div>

    <!-- Error Toast -->
    <Transition name="fade">
      <div
        v-if="error"
        class="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg max-w-md"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <ExclamationTriangleIcon class="h-5 w-5 mr-2" />
            <span>{{ error }}</span>
          </div>
          <button
            @click="clearError"
            class="ml-2 text-red-600 hover:text-red-800"
          >
            <XMarkIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { PencilSquareIcon, PlusIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const notesStore = useNotesStore()
const { notesCount, loading, error } = storeToRefs(notesStore)
const { clearError, createNote } = notesStore

// PUBLIC_INTERFACE
const createNewNote = async (): Promise<void> => {
  /**
   * Creates a new empty note and selects it
   */
  const newNote = await createNote({
    title: 'Untitled Note',
    content: ''
  })
  
  if (newNote) {
    await navigateTo('/')
  }
}
</script>
