import { MetadataRoute } from 'next';
import { getForgeProducts } from '@/lib/digital-forge';

const SITE_URL = 'https://triumphantech.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const forgeProducts = await getForgeProducts();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/digital-forge`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/digital-forge/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/digital-forge/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/tech-diary`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/data-deletion`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = forgeProducts.map((product) => ({
    url: `${SITE_URL}/digital-forge/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: product.featured ? 0.9 : 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
