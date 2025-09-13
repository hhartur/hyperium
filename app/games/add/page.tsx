'use client'

import { useAuthContext } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const addGameSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().positive('Price must be a positive number'),
  genre: z.string().min(1, 'Genre is required'),
  developer: z.string().min(1, 'Developer is required'),
  publisher: z.string().min(1, 'Publisher is required'),
  image_url: z.string().url('Invalid URL'),
});

type AddGameForm = z.infer<typeof addGameSchema>;

export default function AddGamePage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(addGameSchema),
  });

  useEffect(() => {
    if (!loading && (!user || !user.email_verified)) {
      router.push('/');
    }
  }, [user, loading, router]);

  const onSubmit = async (data: AddGameForm) => {
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Game added successfully!');
        router.push('/');
      } else {
        toast.error('Failed to add game');
      }
    } catch {
      toast.error('An error occurred');
    }
  };

  if (loading || !user || !user.email_verified) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Add a New Game</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
            <Input id="title" placeholder="Title" {...register('title')} />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <Input id="description" placeholder="Description" {...register('description')} />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">Price</label>
            <Input id="price" placeholder="Price" type="number" step="0.01" {...register('price')} />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>
          <div>
            <label htmlFor="genre" className="block text-sm font-medium mb-1">Genre</label>
            <Input id="genre" placeholder="Genre" {...register('genre')} />
            {errors.genre && <p className="text-red-500 text-sm">{errors.genre.message}</p>}
          </div>
          <div>
            <label htmlFor="developer" className="block text-sm font-medium mb-1">Developer</label>
            <Input id="developer" placeholder="Developer" {...register('developer')} />
            {errors.developer && <p className="text-red-500 text-sm">{errors.developer.message}</p>}
          </div>
          <div>
            <label htmlFor="publisher" className="block text-sm font-medium mb-1">Publisher</label>
            <Input id="publisher" placeholder="Publisher" {...register('publisher')} />
            {errors.publisher && <p className="text-red-500 text-sm">{errors.publisher.message}</p>}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="image_url" className="block text-sm font-medium mb-1">Image URL</label>
            <Input id="image_url" placeholder="Image URL" {...register('image_url')} />
            {errors.image_url && <p className="text-red-500 text-sm">{errors.image_url.message}</p>}
          </div>
          <Button type="submit" className="w-full" variant='outline'>Add Game</Button>
        </div>
      </form>
    </div>
  );
}
