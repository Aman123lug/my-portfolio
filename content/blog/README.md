# Writing a blog post

Publishing = write markdown → `git push`. The GitHub Action rebuilds and deploys automatically. These posts live only on your website (no Hashnode needed) and appear alongside the Hashnode ones, sorted by date.

## Structure

One folder per post (MLflow-website style). Images live inside the post folder:

```
content/blog/
  2026-07-19-my-post-title/
    index.md
    images/
      cover.png
      diagram.png
```

The folder name becomes the URL slug (a leading `YYYY-MM-DD-` prefix is stripped and used as the date fallback): `/blog/my-post-title`.

## index.md format

```markdown
---
title: My Post Title
date: 2026-07-19
tags: [rag, agents]
cover: ./images/cover.png
brief: Optional custom excerpt for the blog cards. Auto-generated if omitted.
draft: false
---

Your markdown here. Reference images relatively:

![architecture diagram](./images/diagram.png)
```

- `title` — required (well, strongly recommended)
- `date` — optional if the folder name has a date prefix
- `tags` — used by search and the latent-space clustering on the blog page
- `cover` — optional, shown at the top of the post
- `draft: true` — post is skipped entirely (commit safely, publish later)

## Local preview

`npm run dev` rebuilds post data on start. If you edit a post while the dev
server is already running, run `node scripts/build-posts.mjs` to refresh.
