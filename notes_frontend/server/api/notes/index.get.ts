import type { Note } from '~/types'

// Mock data for development
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Welcome to Notes App',
    content: 'This is your first note! You can edit this text and create new notes using the "New Note" button.',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '2',
    title: 'Meeting Notes',
    content: 'Project discussion:\n- Review requirements\n- Assign tasks\n- Set deadlines\n\nNext meeting: Friday 2PM',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    title: 'Shopping List',
    content: '- Milk\n- Bread\n- Eggs\n- Apples\n- Coffee\n- Yogurt',
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 172800000).toISOString()
  }
]

export default defineEventHandler(async (event) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return {
    data: mockNotes,
    message: 'Notes retrieved successfully'
  }
})
