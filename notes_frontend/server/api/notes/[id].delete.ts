export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return {
    data: { id },
    message: 'Note deleted successfully'
  }
})
