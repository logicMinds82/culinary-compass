'use client';

import { useState, FormEvent, useEffect } from 'react';
import Image from "next/image";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function SubmitRecipeForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState(['']);
  const [difficulty, setDifficulty] = useState('Easy');
  const [cuisine, setCuisine] = useState('');
  const [duration, setDuration] = useState('');
  const [servings, setServings] = useState('');
  const [categories, setCategories] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(image);
    } else {
      setImagePreview(null);
    }
  }, [image]);

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => setIngredients([...ingredients, '']);
  const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      setStatus('reCAPTCHA is not yet available.');
      return;
    }

    const token = await executeRecaptcha('submit_recipe');

    const formData = new FormData();
    formData.append('title', title);
    if (image) formData.append('image', image);
    formData.append('ingredients', JSON.stringify(ingredients));
    formData.append('difficulty', difficulty);
    formData.append('cuisine', cuisine);
    formData.append('duration', duration);
    formData.append('servings', servings);
    formData.append('categories', categories);
    formData.append('message', message);
    formData.append('token', token);

    try {
      const res = await fetch('/api/recipes/submit', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Something went wrong');

      setTitle('');
      setImage(null);
      setIngredients(['']);
      setDifficulty('Easy');
      setCuisine('');
      setDuration('');
      setServings('');
      setCategories('');
      setMessage('');

      setStatus('Recipe submitted successfully!');
      setTimeout(() => setStatus(null), 5000);
    } catch {
      setStatus('Failed to submit recipe. Please try again later.');
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
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="file"
            className="w-full border border-gray-300 p-3 rounded"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />

          {imagePreview && (
            <Image src={imagePreview} alt="Thumbnail Preview" className="w-32 h-32 rounded object-cover" />
          )}

          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex space-x-2 items-center">
              <input
                type="text"
                placeholder={`Ingredient ${index + 1}`}
                className="flex-1 border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                required
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => removeIngredient(index)}
                >Remove</button>
              )}
            </div>
          ))}
          <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={addIngredient}>Add Ingredient</button>

          <select className="w-full border border-gray-300 p-3 rounded" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <input type="text" placeholder="Cuisine" className="w-full border border-gray-300 p-3 rounded" value={cuisine} onChange={(e) => setCuisine(e.target.value)} />
          <input type="text" placeholder="Duration (e.g., 30 minutes)" className="w-full border border-gray-300 p-3 rounded" value={duration} onChange={(e) => setDuration(e.target.value)} />
          <input type="number" placeholder="Servings" className="w-full border border-gray-300 p-3 rounded" value={servings} onChange={(e) => setServings(e.target.value)} />
          <input type="text" placeholder="Categories (comma separated)" className="w-full border border-gray-300 p-3 rounded" value={categories} onChange={(e) => setCategories(e.target.value)} />

          <textarea rows={4} placeholder="Additional Message" className="w-full border border-gray-300 p-3 rounded" value={message} onChange={(e) => setMessage(e.target.value)} />

          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold">Submit Recipe</button>
        </form>
      </div>
    </section>
  );
}