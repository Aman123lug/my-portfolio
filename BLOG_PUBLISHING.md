# 📝 Blog Publishing Guide

Publish a post with **markdown + git push**. No Hashnode, no CMS.

```bash
mkdir -p content/blog/2026-08-01-my-new-post/images
# ... write content/blog/2026-08-01-my-new-post/index.md ...
git add content/blog
git commit -m "blog: my new post"
git push        # ← GitHub Action builds & deploys. You're live.
```

## Folder structure

One self-contained folder per post, images inside it:

```
content/blog/
└── 2026-08-01-my-new-post/     ← date prefix + slug (URL: /blog/my-new-post)
    ├── index.md                ← frontmatter + markdown
    └── images/
        └── cover.png
```

## index.md format

```markdown
---
title: My Post Title
date: 2026-08-01
tags: [rag, agents]
cover: ./images/cover.png
brief: One-line excerpt for the blog cards.
draft: false
---

Normal markdown. Reference images relatively:

![diagram](./images/diagram.png)
```

| Field   | Notes                                                              |
|---------|--------------------------------------------------------------------|
| `title` | Required                                                           |
| `date`  | Optional — falls back to the folder's date prefix                  |
| `tags`  | Powers blog search + latent-space clustering. First tag = category |
| `cover` | Optional, shown at the top of the post                             |
| `brief` | Optional — auto-generated from the content if omitted              |
| `draft` | `true` = hidden from the site until you flip it                    |

## Local preview

```bash
npm run dev                      # rebuilds blog data on start
node scripts/build-posts.mjs     # refresh if dev server is already running
```

## Good to know

- Local posts and Hashnode posts (via RSS, fetched at build time) appear in
  one list sorted by date. Don't publish the same post in both places.
- To edit or unpublish: change the file (or set `draft: true`) and push.
- `src/data/posts.ts` and `public/blog-images/` are **generated — never edit**.
