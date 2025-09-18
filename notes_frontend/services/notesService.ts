import type { Note, CreateNoteDto, UpdateNoteDto, ApiResponse } from '~/types'

// PUBLIC_INTERFACE
export class NotesService {
  private baseUrl = '/api/notes'

  /**
   * Fetches all notes from the backend
   * @returns Promise<Note[]> Array of all notes
   */
  async getAllNotes(): Promise<Note[]> {
    try {
      const response = await $fetch<ApiResponse<Note[]>>(this.baseUrl)
      return response.data || []
    } catch (error) {
      console.error('Error fetching notes:', error)
      throw new Error('Failed to fetch notes')
    }
  }

  /**
   * Fetches a single note by ID
   * @param id - The note ID
   * @returns Promise<Note> The requested note
   */
  async getNoteById(id: string): Promise<Note> {
    try {
      const response = await $fetch<ApiResponse<Note>>(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching note ${id}:`, error)
      throw new Error('Failed to fetch note')
    }
  }

  /**
   * Creates a new note
   * @param noteData - The note data to create
   * @returns Promise<Note> The created note
   */
  async createNote(noteData: CreateNoteDto): Promise<Note> {
    try {
      const response = await $fetch<ApiResponse<Note>>(this.baseUrl, {
        method: 'POST',
        body: noteData
      })
      return response.data
    } catch (error) {
      console.error('Error creating note:', error)
      throw new Error('Failed to create note')
    }
  }

  /**
   * Updates an existing note
   * @param id - The note ID
   * @param noteData - The updated note data
   * @returns Promise<Note> The updated note
   */
  async updateNote(id: string, noteData: UpdateNoteDto): Promise<Note> {
    try {
      const response = await $fetch<ApiResponse<Note>>(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        body: noteData
      })
      return response.data
    } catch (error) {
      console.error(`Error updating note ${id}:`, error)
      throw new Error('Failed to update note')
    }
  }

  /**
   * Deletes a note
   * @param id - The note ID to delete
   * @returns Promise<void>
   */
  async deleteNote(id: string): Promise<void> {
    try {
      await $fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error(`Error deleting note ${id}:`, error)
      throw new Error('Failed to delete note')
    }
  }
}

// PUBLIC_INTERFACE
export const notesService = new NotesService()
