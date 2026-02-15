// File: iap-nextjs/app/blog/[slug]/page.jsx
// NO 'use client'; This is a Server Component

import React from 'react';
import Link from 'next/link';
import { client, urlFor } from '../../../lib/client';
import BlogPostLayout from '../../../components/Blog/BlogPostLayout';
import { notFound } from 'next/navigation';

// Generates static paths for each blog post at build time for performance
export async function generateStaticParams() {
  const query = `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`;
  const studies = await client.fetch(query);
  return (studies || []).map((study) => ({
    slug: study.slug,
  }));
}

// Generates SEO metadata for the specific blog post page
export async function generateMetadata({ params }) {
  // Decode the slug to handle spaces (%20) correctly
  const slug = decodeURIComponent(params.slug);

  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      title,
      description,
      mainImage { 
        alt,
        asset->{url} 
      },
    }`, { slug }
  );

  if (!post) {
    return { title: 'Post Not Found | IAPrecision' };
  }

  const pageTitle = `${post.title} | IA Precision Blog`;
  const pageDescription = post.description || 'Read our latest insights on agricultural drone technology at IA Precision.';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.iaprecision.com';
  const imageUrl = post.mainImage?.asset?.url ? urlFor(post.mainImage).width(1200).height(630).fit('crop').url() : `${siteUrl}/assets/og-image-home.png`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: `iaprecision, agricultural drones, ${post.title || 'blog'}, nigeria`,
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: post.mainImage?.alt || post.title,
      }],
      url: `${siteUrl}/blog/${slug}`,
      type: 'article',
      siteName: 'IA Precision',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
    },
  };
}

// Fetches the full data for the blog post
async function getPost(slug) {
  // Use the decoded slug to find the post by its unique slug.
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    description,
    mainImage {
      alt,
      asset->{_id, url, metadata}
    },
    author->{name},
    publishedAt,
    body[]{
      ...,
      _type == "image" => {
        "alt": alt,
        "caption": caption,
        asset->{
          _id,
          url,
          metadata { dimensions }
        }
      }
    }
  }`; 
  const post = await client.fetch(query, { slug }, { next: { tags: [`post:${slug}`] } });
  return post;
}

// The main page component
export default async function BlogDetailsPage({ params }) {
  // Decode the slug to correctly handle URLs with spaces like "%20"
  const slug = decodeURIComponent(params.slug);
  const blogDetails = await getPost(slug);

  if (!blogDetails) {
    notFound(); // Triggers the not-found.js page
  }

  return <BlogPostLayout post={blogDetails} />;
}
