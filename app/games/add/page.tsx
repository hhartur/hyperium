"use client";

import { useAuthContext } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { imagekit } from "@/lib/imagekit";

const addGameSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().positive("Price must be a positive number"),
    discount_price: z.coerce.number().optional(),
    genre: z.string().min(1, "Genre is required"), // será convertido em array
    tags: z.string().optional(), // será convertido em array
    developer: z.string().min(1, "Developer is required"),
    publisher: z.string().min(1, "Publisher is required"),
    release_date: z.string().min(1, "Release date is required"),
    image_url: z.string().url("Invalid URL").optional(),
    screenshots: z.string().optional(), // será convertido em array
    video_url: z.string().url().optional(),
    file_url: z.string().url().optional(),
    image_file: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.image_url && !data.image_file[0]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either an image URL or an image file is required",
        path: ["image_url"],
      });
    }
  });

type AddGameForm = z.infer<typeof addGameSchema>;

export default function AddGamePage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(addGameSchema),
  });

  const imageUrl = watch("image_url");
  const imageFile = watch("image_file");

  useEffect(() => {
    if (imageUrl && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [imageUrl]);

  useEffect(() => {
    if (imageFile && imageFile[0]) {
      setValue("image_url", "");
    }
  }, [imageFile, setValue]);

  useEffect(() => {
    if (!loading && (!user || !user.email_verified)) {
      router.push("/");
    }
  }, [user, loading, router]);

  const onSubmit = async (data: AddGameForm) => {
    if (!user) return;

    try {
      let imageUrl = data.image_url;
      const imageFile = data.image_file?.[0];

      if (imageFile) {
        const authRes = await fetch("/api/imagekit/auth");
        const authData = await authRes.json();

        const uploadRes = await imagekit.upload({
          file: imageFile,
          fileName: imageFile.name,
          ...authData,
        });

        imageUrl = uploadRes.url;
      }

      const { image_file: _unusedImageFile, ...rest } = data;

      const response = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rest,
          seller_id: user.id,
          genre: data.genre.split(",").map((g) => g.trim()),
          tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
          screenshots: data.screenshots
            ? data.screenshots.split(",").map((s) => s.trim())
            : [],
          release_date: new Date(data.release_date),
          image_url: imageUrl,
        }),
      });

      if (response.ok) {
        toast.success("Game added successfully!");
        router.push("/");
      } else {
        const errorData = await response.json();
        toast.error(
          `Failed to add game: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
  };

  if (loading || !user || !user.email_verified) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Publish Your Game</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Game Information</CardTitle>
            <CardDescription>
              Provide the main details about your game.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                placeholder="Your game title"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                placeholder="Tell us about your game"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="developer">Developer</label>
                <Input
                  id="developer"
                  placeholder="Your studio name"
                  {...register("developer")}
                />
                {errors.developer && (
                  <p className="text-red-500 text-sm">
                    {errors.developer.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="publisher">Publisher</label>
                <Input
                  id="publisher"
                  placeholder="Publishing company"
                  {...register("publisher")}
                />
                {errors.publisher && (
                  <p className="text-red-500 text-sm">
                    {errors.publisher.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="genre">Genre</label>
                <Input
                  id="genre"
                  placeholder="Action, RPG, etc."
                  {...register("genre")}
                />
                {errors.genre && (
                  <p className="text-red-500 text-sm">{errors.genre.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="tags">Tags</label>
                <Input
                  id="tags"
                  placeholder="Indie, Multiplayer, etc."
                  {...register("tags")}
                />
                {errors.tags && (
                  <p className="text-red-500 text-sm">{errors.tags.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
            <CardDescription>
              Upload images and videos for your game.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="image_url">Cover Image URL</label>
              <Input
                id="image_url"
                placeholder="https://example.com/image.png"
                {...register("image_url")}
              />
              {errors.image_url && (
                <p className="text-red-500 text-sm">
                  {errors.image_url.message}
                </p>
              )}
            </div>
            <div className="text-center text-sm text-muted-foreground">OR</div>
            <div>
              <label htmlFor="image_file">Upload Cover Image</label>
              <Input
                id="image_file"
                type="file"
                {...register("image_file")}
                ref={fileInputRef}
              />
            </div>
            {(imageUrl || (imageFile && imageFile[0])) && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Image Preview:</p>
                <Image
                  src={
                    imageUrl || (imageFile && URL.createObjectURL(imageFile[0]))
                  }
                  alt="Image Preview"
                  width={200}
                  height={100}
                  className="rounded-md object-cover"
                />
              </div>
            )}
            <div>
              <label htmlFor="screenshots">Screenshots</label>
              <Input
                id="screenshots"
                placeholder="Comma-separated URLs"
                {...register("screenshots")}
              />
              {errors.screenshots && (
                <p className="text-red-500 text-sm">
                  {errors.screenshots.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="video_url">Video URL</label>
              <Input
                id="video_url"
                placeholder="https://youtube.com/watch?v=..."
                {...register("video_url")}
              />
              {errors.video_url && (
                <p className="text-red-500 text-sm">
                  {errors.video_url.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing and Release</CardTitle>
            <CardDescription>
              Set the price and release date for your game.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price">Price</label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="$19.99"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="discount_price">Discount Price</label>
              <Input
                id="discount_price"
                type="number"
                step="0.01"
                placeholder="$9.99"
                {...register("discount_price")}
              />
              {errors.discount_price && (
                <p className="text-red-500 text-sm">
                  {errors.discount_price.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="release_date">Release Date</label>
              <Input
                id="release_date"
                type="date"
                {...register("release_date")}
              />
              {errors.release_date && (
                <p className="text-red-500 text-sm">
                  {errors.release_date.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="file_url">Game File URL</label>
              <Input
                id="file_url"
                placeholder="https://example.com/game.zip"
                {...register("file_url")}
              />
              {errors.file_url && (
                <p className="text-red-500 text-sm">
                  {errors.file_url.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full">
          Publish Game
        </Button>
      </form>
    </div>
  );
}
