import type { Note } from '~/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Mock note data
  const note: Note = {
    id: id!,
    title: `Note ${id}`,
    content: `This is the content for note ${id}`,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  return {
    data: note,
    message: 'Note retrieved successfully'
  }
})
