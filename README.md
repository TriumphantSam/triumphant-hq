# Triumphant HQ Website

Modern website for Triumphant HQ built with Next.js 16 + Tailwind CSS v4.

## 🚀 Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠 Features

- **Modern Design**: Glassmorphism, dark mode aesthetic, fluid typography (`clamp()`).
- **Performance**: Optimized images, code splitting, and fast page loads via Next.js.
- **Components**:
  - `Hero`: Main landing section with stats bar suitable for mobile/desktop.
  - `Navigation`: Responsive header with mobile hamburger menu.
  - `Footer`: 4-column layout with quick links.
  - `Contact Form`: Wired to EmailJS (client-side) - no server config needed.
- **Blog**: Tech Diary powered by Markdown files in `content/blog`.

## 📦 Deployment

The easiest way to deploy is using [Vercel](https://vercel.com/new).

1. Push your code to a GitHub repository.
2. Sign up/Log in to Vercel.
3. Import your repository.
4. Click **Deploy**.

Vercel will automatically detect `Next.js` and configure the build settings.

## 🧹 Cleanup Note

If you see `app/api/contact/route.ts` or `.env.local` (with SMTP credentials) in your project, you can safely delete them as the contact form now uses EmailJS directly from the browser.

## 📝 Blog Posts

To add a new blog post:
1. Create a `.md` file in `content/blog/`.
2. Add frontmatter at the top:
   ```markdown
   ---
   title: 'Your Post Title'
   date: '2024-03-20'
   excerpt: 'Short description...'
   category: 'General'
   readTime: '5 min read'
   ---
   ```
3. Write your content below in Markdown.

## 📞 Contact Info

- **Email**: admin@triumphantech.com
- **WhatsApp**: +234 810 771 1190
- **Address**: No 4, Kolawole Close, Ibadan, Nigeria
