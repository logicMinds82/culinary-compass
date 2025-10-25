'use server'

import { createClient } from '@/app/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteRecipeAction(recipeId: number) {
  const supabase = await createClient()

  // Get the authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, error: 'User not authenticated' }
  }

  try {
    // First, verify the recipe belongs to the user
    const { data: recipe, error: fetchError } = await supabase
      .from('recipes')
      .select('author_id, image')
      .eq('id', recipeId)
      .single()

    if (fetchError || !recipe) {
      return { success: false, error: 'Recipe not found' }
    }

    if (recipe.author_id !== user.id) {
      return { success: false, error: 'Forbidden: You can only delete your own recipes' }
    }

    // Delete the recipe image from storage if it exists
    if (recipe.image) {
      try {
        const urlParts = recipe.image.split('/')
        const fileName = urlParts[urlParts.length - 1]
        
        await supabase.storage
          .from('recipes')
          .remove([fileName])
      } catch (storageError) {
        console.error('Error deleting recipe image:', storageError)
        // Continue with recipe deletion even if image deletion fails
      }
    }

    // Delete the recipe
    const { error: deleteError } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipeId)

    if (deleteError) {
      console.error('Error deleting recipe:', deleteError)
      return { success: false, error: 'Error deleting recipe' }
    }

    // Revalidate relevant paths
    revalidatePath('/recipes')
    revalidatePath('/my-recipes')

    return { success: true }
  } catch (error) {
    console.error('Delete Recipe Error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
