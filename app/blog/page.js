// File: iap-nextjs/app/blog/page.jsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { client, urlFor } from '../../lib/client';
import { motion } from 'framer-motion';

const POSTS_PER_PAGE = 15; // You can set this to 20 or any number you like

const BlogPage = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for interactive features
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    const fetchBlogPosts = async () => {
      try {
        // We only need to fetch the posts now, not the categories
        const postsQuery = `*[_type == "post"] | order(publishedAt desc) {
          _id,
          title,
          "slug": slug.current,
          mainImage { asset, alt },
          publishedAt,
          "summary": pt::text(body[0...1])
        }`;
        
        const postsData = await client.fetch(postsQuery);
        setAllPosts(postsData || []);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setAllPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlogPosts();
  }, []);

  // Filter and paginate posts based on search term
  const filteredAndPaginatedPosts = useMemo(() => {
    const filtered = allPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.summary && post.summary.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const paginatedPosts = filtered.slice(startIndex, startIndex + POSTS_PER_PAGE);

    return { posts: paginatedPosts, totalPages };
  }, [searchTerm, allPosts, currentPage]);

  const handlePageChange = (newPage) => {
    // Reset to page 1 if search term changes
    if (currentPage !== 1 && searchTerm) {
        setCurrentPage(1);
    }
    
    if (newPage >= 1 && newPage <= filteredAndPaginatedPosts.totalPages) {
      setCurrentPage(newPage);
      document.getElementById('blog-grid-start')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Reset page to 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-cover bg-center bg-product-hero-image">
        <div className="bg-gradient-to-r from-[#1B2503]/80 to-transparent w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Agricultural Drone Insights & News
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200 mx-auto md:mx-0">
              Stay informed with the latest articles and updates from the IA Precision team.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Search Input Field */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Anchor for scrolling to */}
        <div id="blog-grid-start"></div>

        {/* Blog Posts Grid */}
        {isLoading ? (
          <p className="text-center text-gray-500">Loading articles...</p>
        ) : filteredAndPaginatedPosts.posts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndPaginatedPosts.posts.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post._id}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer h-full flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-full h-56 relative">
                      <Image
                        src={urlFor(post.mainImage).width(500).height(300).auto('format').url()}
                        alt={post.mainImage.alt || post.title}
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <p className="text-sm text-gray-500 mb-2">
                        {formatDate(post.publishedAt)}
                      </p>
                      <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors flex-grow">
                        {post.title}
                      </h2>
                      <p className="text-gray-700 text-sm mt-2 line-clamp-3">{post.summary}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            {filteredAndPaginatedPosts.totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center space-x-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {filteredAndPaginatedPosts.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === filteredAndPaginatedPosts.totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700">No Articles Found</h2>
            <p className="mt-2 text-gray-500">
              Your search for "{searchTerm}" did not match any articles. Please try a different keyword.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
