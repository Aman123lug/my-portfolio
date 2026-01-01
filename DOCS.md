# Portfolio Documentation

## Project Structure

Your portfolio now uses **React Router** for separate pages:

| Route | Page | File |
|-------|------|------|
| `/` | Home | `src/pages/HomePage.tsx` |
| `/about` | About | `src/pages/AboutPage.tsx` |
| `/projects` | Projects | `src/pages/ProjectsPage.tsx` |
| `/blog` | Blog | `src/pages/BlogPage.tsx` |
| `/contact` | Contact | `src/pages/ContactPage.tsx` |

---

## Adding New Blog Posts

### Step 1: Add Your Blog Post

Open `src/components/Blog.tsx` and find the `blogPosts` array:

```tsx
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Your Blog Title',
    excerpt: 'A brief summary of your blog post...',
    date: 'Jan 1, 2026',
    readTime: '5 min read',
    category: 'Technology',
    url: '/blog/your-post-slug',        // or external URL
    image: '/images/blog/your-image.jpg' // optional
  },
  // Add more posts here...
];
```

### Step 2: Add Blog Images

1. Create an images folder:
   ```
   public/
   └── images/
       └── blog/
           ├── post1.jpg
           ├── post2.jpg
           └── ...
   ```

2. Add your images to `public/images/blog/`

3. Reference them in your blog post:
   ```tsx
   image: '/images/blog/post1.jpg'
   ```

### Step 3: Update the BlogPost Interface

The `image` field needs to be added to the interface. Update in `Blog.tsx`:

```tsx
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  url: string;
  image?: string;  // Add this line
}
```

---

## Quick Reference

| Field | Description | Example |
|-------|-------------|---------|
| `id` | Unique number | `1`, `2`, `3` |
| `title` | Blog post title | `"My First Post"` |
| `excerpt` | Short summary (2-3 lines) | `"Learn how to..."` |
| `date` | Publication date | `"Jan 1, 2026"` |
| `readTime` | Estimated read time | `"5 min read"` |
| `category` | Post category | `"Tech"`, `"Life"` |
| `url` | Link to full post | `"#"` or external URL |
| `image` | Image path (optional) | `"/images/blog/pic.jpg"` |

---

## Example: Adding a New Post

```tsx
{
  id: 4,
  title: 'How I Built My Portfolio',
  excerpt: 'A step-by-step guide on creating a modern portfolio website using React and TypeScript.',
  date: 'Jan 1, 2026',
  readTime: '8 min read',
  category: 'Tutorial',
  url: 'https://medium.com/@yourname/my-post',
  image: '/images/blog/portfolio-guide.jpg'
}
```

---

## Image Guidelines

- **Recommended size**: 800x500px (16:10 ratio)
- **Format**: JPG or PNG
- **Location**: `public/images/blog/`
- **Naming**: Use lowercase, no spaces (e.g., `my-post-image.jpg`)
