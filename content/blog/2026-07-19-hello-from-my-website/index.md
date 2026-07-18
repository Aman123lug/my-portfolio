---
title: Hello From My Website — Publishing Blogs With Just Git Push
date: 2026-07-19
tags: [meta, website]
cover: ./images/cover.png
brief: This post was written as a markdown file in the site repo and published with a git push — no Hashnode involved. Here's how the pipeline works.
---

This post doesn't exist on Hashnode. It lives as a plain markdown file inside
this website's repository, and it was published by doing exactly one thing:

```bash
git push
```

## How it works

The site's build step scans `content/blog/` for post folders, converts the
markdown to HTML, copies any images, and merges everything with the posts
pulled from Hashnode's RSS feed. The GitHub Action that deploys the site runs
that build on every push — so committing a markdown file *is* publishing.

```
content/blog/
  2026-07-19-hello-from-my-website/
    index.md        ← this file
    images/
      cover.png     ← the cover above
```

## Why

Some posts belong everywhere, and Hashnode is great for reach. But some posts
only make sense here — site announcements, experiments, drafts of ideas. Now
both kinds live side by side: same search, same latent-space map, same
reading mode.

If you're reading this on the live site: it worked. 🎉
