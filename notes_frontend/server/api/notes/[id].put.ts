import type { Note, UpdateNoteDto } from '~/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event) as UpdateNoteDto
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Mock updated note
  const updatedNote: Note = {
    id: id!,
    title: body.title || 'Updated Note',
    content: body.content || '',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Keep original creation date
    updatedAt: new Date().toISOString()
  }
  
  return {
    data: updatedNote,
    message: 'Note updated successfully'
  }
})
