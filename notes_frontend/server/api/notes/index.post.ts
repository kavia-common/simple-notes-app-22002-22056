import type { Note, CreateNoteDto } from '~/types'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as CreateNoteDto
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Create new note
  const newNote: Note = {
    id: Date.now().toString(),
    title: body.title || 'Untitled Note',
    content: body.content || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  return {
    data: newNote,
    message: 'Note created successfully'
  }
})
