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
  discount_price: z.coerce.number().optional(),
  genre: z.string().min(1, 'Genre is required'), // será convertido em array
  tags: z.string().optional(), // será convertido em array
  developer: z.string().min(1, 'Developer is required'),
  publisher: z.string().min(1, 'Publisher is required'),
  release_date: z.string().min(1, 'Release date is required'),
  image_url: z.string().url('Invalid URL'),
  screenshots: z.string().optional(), // será convertido em array
  video_url: z.string().url().optional(),
  file_url: z.string().url().optional(),
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
    if (!user) return;

    try {
      const payload = {
        ...data,
        seller_id: user.id,
        genre: data.genre.split(',').map(g => g.trim()), // converte para array
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
        screenshots: data.screenshots ? data.screenshots.split(',').map(s => s.trim()) : [],
        release_date: new Date(data.release_date),
      };

      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Game added successfully!');
        router.push('/');
      } else {
        const errorData = await response.json();
        toast.error(`Failed to add game: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
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
            <Input id="price" type="number" step="0.01" {...register('price')} />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>

          <div>
            <label htmlFor="discount_price" className="block text-sm font-medium mb-1">Discount Price</label>
            <Input id="discount_price" type="number" step="0.01" {...register('discount_price')} />
            {errors.discount_price && <p className="text-red-500 text-sm">{errors.discount_price.message}</p>}
          </div>

          <div>
            <label htmlFor="genre" className="block text-sm font-medium mb-1">Genre</label>
            <Input id="genre" placeholder="Genre (comma separated)" {...register('genre')} />
            {errors.genre && <p className="text-red-500 text-sm">{errors.genre.message}</p>}
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-1">Tags</label>
            <Input id="tags" placeholder="Tags (comma separated)" {...register('tags')} />
            {errors.tags && <p className="text-red-500 text-sm">{errors.tags.message}</p>}
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

          <div>
            <label htmlFor="release_date" className="block text-sm font-medium mb-1">Release Date</label>
            <Input id="release_date" type="date" {...register('release_date')} />
            {errors.release_date && <p className="text-red-500 text-sm">{errors.release_date.message}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="image_url" className="block text-sm font-medium mb-1">Image URL</label>
            <Input id="image_url" placeholder="Image URL" {...register('image_url')} />
            {errors.image_url && <p className="text-red-500 text-sm">{errors.image_url.message}</p>}
          </div>

          <div>
            <label htmlFor="screenshots" className="block text-sm font-medium mb-1">Screenshots</label>
            <Input id="screenshots" placeholder="Screenshots URLs (comma separated)" {...register('screenshots')} />
            {errors.screenshots && <p className="text-red-500 text-sm">{errors.screenshots.message}</p>}
          </div>

          <div>
            <label htmlFor="video_url" className="block text-sm font-medium mb-1">Video URL</label>
            <Input id="video_url" placeholder="Video URL" {...register('video_url')} />
            {errors.video_url && <p className="text-red-500 text-sm">{errors.video_url.message}</p>}
          </div>

          <div>
            <label htmlFor="file_url" className="block text-sm font-medium mb-1">File URL</label>
            <Input id="file_url" placeholder="File URL" {...register('file_url')} />
            {errors.file_url && <p className="text-red-500 text-sm">{errors.file_url.message}</p>}
          </div>

          <Button type="submit" className="w-full" variant='outline'>Add Game</Button>
        </div>
      </form>
    </div>
  );
}
