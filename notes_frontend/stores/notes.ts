import { defineStore } from 'pinia'
import { notesService } from '~/services/notesService'
import type { Note, CreateNoteDto, UpdateNoteDto } from '~/types'

export const useNotesStore = defineStore('notes', () => {
  // State
  const notes = ref<Note[]>([])
  const selectedNote = ref<Note | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const sortedNotes = computed(() => {
    return [...notes.value].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  })

  const notesCount = computed(() => notes.value.length)

  // Actions
  // PUBLIC_INTERFACE
  const fetchNotes = async (): Promise<void> => {
    /**
     * Fetches all notes from the backend and updates the store
     */
    loading.value = true
    error.value = null
    try {
      notes.value = await notesService.getAllNotes()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch notes'
      console.error('Store: Error fetching notes:', err)
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  const createNote = async (noteData: CreateNoteDto): Promise<Note | null> => {
    /**
     * Creates a new note and adds it to the store
     * @param noteData - The note data to create
     * @returns The created note or null if failed
     */
    loading.value = true
    error.value = null
    try {
      const newNote = await notesService.createNote(noteData)
      notes.value.unshift(newNote)
      selectedNote.value = newNote
      return newNote
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create note'
      console.error('Store: Error creating note:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  const updateNote = async (id: string, noteData: UpdateNoteDto): Promise<Note | null> => {
    /**
     * Updates an existing note in the store
     * @param id - The note ID
     * @param noteData - The updated note data
     * @returns The updated note or null if failed
     */
    loading.value = true
    error.value = null
    try {
      const updatedNote = await notesService.updateNote(id, noteData)
      const index = notes.value.findIndex(note => note.id === id)
      if (index !== -1) {
        notes.value[index] = updatedNote
      }
      if (selectedNote.value?.id === id) {
        selectedNote.value = updatedNote
      }
      return updatedNote
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update note'
      console.error('Store: Error updating note:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  const deleteNote = async (id: string): Promise<boolean> => {
    /**
     * Deletes a note from the store
     * @param id - The note ID to delete
     * @returns True if successful, false otherwise
     */
    loading.value = true
    error.value = null
    try {
      await notesService.deleteNote(id)
      notes.value = notes.value.filter(note => note.id !== id)
      if (selectedNote.value?.id === id) {
        selectedNote.value = notes.value.length > 0 ? notes.value[0] : null
      }
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete note'
      console.error('Store: Error deleting note:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  const selectNote = (note: Note | null): void => {
    /**
     * Selects a note for editing/viewing
     * @param note - The note to select
     */
    selectedNote.value = note
  }

  // PUBLIC_INTERFACE
  const clearError = (): void => {
    /**
     * Clears any error state
     */
    error.value = null
  }

  return {
    // State
    notes,
    selectedNote,
    loading,
    error,
    // Getters
    sortedNotes,
    notesCount,
    // Actions
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    selectNote,
    clearError
  }
})
