'use client';

import { useState, FormEvent, useEffect } from 'react';
import Image from "next/image";
import { postRecipeAction } from '../actions/postRecipeAction';
import { useAuth } from './AuthProvider';
import { DifficultyEnum } from '../types/DifficultyEnum';
import { CategoryEnum } from '../types/CategoryEnum';

export default function SubmitRecipeForm() {
  const { user } = useAuth();

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryEnum[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [currentStep, setCurrentStep] = useState('');

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(image);
    } else {
      setImagePreview(null);
    }
  }, [image]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setStatus('Please sign in first.');
      return;
    }

    if (categories.length === 0) {
      setStatus('Please select at least one category.');
      return;
    }

    if (ingredients.length === 0) {
      setStatus('Please add at least one ingredient.');
      return;
    }

    if (steps.length === 0) {
      setStatus('Please add at least one instruction step.');
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const file = formData.get('image') as File;

    setLoading(true);
    const result = await postRecipeAction({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      difficulty: formData.get('difficulty') as DifficultyEnum,
      categories: categories,
      ingredients: ingredients,
      steps: steps,
      cookingTime: formData.get('cookingTime') as string,
      servings: Number(formData.get('servings')),
      authorId: user.id,
      authorName: user.user_metadata?.full_name || user.email || 'Anonymous',
      imageFile: file.size > 0 ? file : null,
    });
    setLoading(false);

    if (result.success) {
      setStatus('Recipe posted successfully!');
      setImage(null);
      setImagePreview(null);
      setCategories([]);
      setIngredients([]);
      setSteps([]);
      setCurrentIngredient('');
      setCurrentStep('');
      form.reset();
      setTimeout(() => setStatus(null), 5000);
      // router.push(`/recipes/${result.data.id}`); // Uncomment if you have recipe detail page
    } else {
      setStatus(String(result.error) || 'Failed to submit recipe. Please try again later.');
    }
  };

  return (
    <section className="w-full min-h-screen bg-stone-100 py-16">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-black mb-6">Submit <span className="text-red-600">Your Recipe</span></h2>

        {status && <div className="mb-4 text-green-600 font-semibold">{status}</div>}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 space-y-6">
          <input
            type="text"
            placeholder="Recipe Title"
            name="title"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />

          <input
            type="file"
            name="image"
            className="w-full border border-gray-300 p-3 rounded"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.size > 8 * 1024 * 1024) {
                setStatus('Image size must be less than 8MB.');
                setImage(null);
                setImagePreview(null);
                e.target.value = '';
                return;
              }
              setImage(file || null);
              setStatus(null);
            }}
          />

          {imagePreview && (
            <Image width={128} height={128} src={imagePreview} alt="Thumbnail Preview" className="w-32 h-32 rounded object-cover" />
          )}

          <textarea rows={3} placeholder="Recipe Description" name="description" className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-600" required />

          <select name="difficulty" className="w-full border border-gray-300 p-3 rounded" defaultValue={DifficultyEnum.Easy}>
            <option value={DifficultyEnum.Easy}>Easy</option>
            <option value={DifficultyEnum.Medium}>Medium</option>
            <option value={DifficultyEnum.Hard}>Hard</option>
          </select>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {Object.values(CategoryEnum).map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={categories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCategories([...categories, category]);
                      } else {
                        setCategories(categories.filter(c => c !== category));
                      }
                    }}
                    className="mr-2"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                placeholder="Add an ingredient"
                className="flex-1 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    if (currentIngredient.trim()) {
                      setIngredients([...ingredients, currentIngredient.trim()]);
                      setCurrentIngredient('');
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (currentIngredient.trim()) {
                    setIngredients([...ingredients, currentIngredient.trim()]);
                    setCurrentIngredient('');
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
            <ul className="list-disc list-inside space-y-1">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{ingredient}</span>
                  <button
                    type="button"
                    onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentStep}
                onChange={(e) => setCurrentStep(e.target.value)}
                placeholder="Add a step"
                className="flex-1 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    if (currentStep.trim()) {
                      setSteps([...steps, currentStep.trim()]);
                      setCurrentStep('');
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (currentStep.trim()) {
                    setSteps([...steps, currentStep.trim()]);
                    setCurrentStep('');
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
            <ol className="list-decimal list-inside space-y-1">
              {steps.map((step, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{step}</span>
                  <button
                    type="button"
                    onClick={() => setSteps(steps.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <input type="number" placeholder="Servings" name="servings" className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-600" required />

          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Recipe'}
          </button>
        </form>
      </div>
    </section>
  );
}