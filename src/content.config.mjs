// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// 2. Define your collection(s)
const projects = defineCollection({
  //   schema: z.object({
  //     title: z.string(),
  //     description: z.string(),
  //     image: z.object(), // Add other fields you need for your project content here
  //   }),
  // Specify the directory for the content
  //   directory: './src/content/projects',
});

const experiences = defineCollection({
  //   schema: z.object({
  //     title: z.string(),
  //     description: z.string(),
  //     image: z.object(), // Add other fields you need for your project content here
  //   }),
  // Specify the directory for the content
  //   directory: './src/content/experiences',
});

// 3. Export a single `collections` object to register your collection(s)
export const collections = { projects, experiences };
