'use server'

import { createClient } from '@/app/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { DifficultyEnum } from '../types/DifficultyEnum'
import { CategoryEnum } from '../types/CategoryEnum'

type RecipeUpdateData = {
  id: number
  title: string
  description: string
  difficulty: DifficultyEnum
  categories: CategoryEnum[]
  ingredients: string[]
  steps: string[]
  cookingTime: string
  servings: number
  imageFile?: File | null
  existingImageUrl?: string | null
}

export async function updateRecipeAction(formData: RecipeUpdateData) {
  const supabase = await createClient()

  // Get the session explicitly
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) {
    console.error('Session error:', sessionError)
    return { success: false, error: 'Session error' }
  }

  if (!session?.user) {
    console.error('No session user')
    return { success: false, error: 'User not authenticated' }
  }

  try {
    // Verify the recipe belongs to the user
    const { data: existingRecipe, error: fetchError } = await supabase
      .from('recipes')
      .select('author_id, image')
      .eq('id', formData.id)
      .single()

    if (fetchError || !existingRecipe) {
      return { success: false, error: 'Recipe not found' }
    }

    if (existingRecipe.author_id !== session.user.id) {
      return { success: false, error: 'Forbidden: You can only edit your own recipes' }
    }

    let imageUrl: string | null = formData.existingImageUrl || null

    // Handle new image upload
    if (formData.imageFile) {
      // Delete old image if it exists
      if (existingRecipe.image) {
        try {
          const urlParts = existingRecipe.image.split('/')
          const oldFileName = urlParts[urlParts.length - 1]
          await supabase.storage.from('recipes').remove([oldFileName])
        } catch (storageError) {
          console.error('Error deleting old image:', storageError)
        }
      }

      // Upload new image
      const fileName = `${Date.now()}-${formData.imageFile.name}`
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('recipes')
        .upload(fileName, formData.imageFile, {
          contentType: formData.imageFile.type,
        })

      if (uploadError) throw new Error(uploadError.message)

      const { data: publicUrlData } = supabase
        .storage
        .from('recipes')
        .getPublicUrl(uploadData.path)

      imageUrl = publicUrlData.publicUrl
    }

    // Update the recipe
    const { data, error } = await supabase
      .from('recipes')
      .update({
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        categories: formData.categories,
        ingredients: formData.ingredients,
        steps: formData.steps,
        cookingTime: formData.cookingTime,
        servings: formData.servings,
        image: imageUrl,
        slug: formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      })
      .eq('id', formData.id)
      .select()
      .single()

    if (error) {
      console.error('Database update error:', error)
      throw new Error(error.message)
    }

    revalidatePath('/recipes')
    revalidatePath('/my-recipes')
    revalidatePath(`/recipe/${data.slug}`)

    return { success: true, data }
  } catch (error) {
    console.error('Update Recipe Error:', error)
    return { success: false, error: error }
  }
}
