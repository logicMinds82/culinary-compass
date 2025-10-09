'use server'

import { createClient } from '@/app/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { DifficultyEnum } from '../types/DifficultyEnum'
import { CategoryEnum } from '../types/CategoryEnum'

type RecipeFormData = {
  title: string
  description: string
  difficulty: DifficultyEnum
  categories: CategoryEnum[]
  ingredients: string[]
  steps: string[]
  cookingTime: string
  servings: number
  authorId: string
  authorName: string
  imageFile?: File | null
}

export async function postRecipeAction(formData: RecipeFormData) {
  // Create client without relying on automatic cookie handling
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
    let imageUrl: string | null = null
    if (formData.imageFile) {
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

    const { data, error } = await supabase
      .from('recipes')
      .insert({
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        categories: formData.categories,
        ingredients: formData.ingredients,
        steps: formData.steps,
        cookingTime: formData.cookingTime,
        servings: formData.servings,
        author_id: formData.authorId,
        author_name: formData.authorName,
        image: imageUrl,
        date_added: new Date().toISOString().split('T')[0],
        slug: formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      })
      .select()
      .single()

    if (error) {
      console.error('Database insert error:', error)
      throw new Error(error.message)
    }

    revalidatePath('/recipes')

    return { success: true, data }
  } catch (error) {
    console.error('Post Recipe Error:', "error occured", error)
    return { success: false, error: error }
  }
}
