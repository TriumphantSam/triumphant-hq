/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://triumphantech.com',
    generateRobotsTxt: true, // This automatically creates your robots.txt too!
    sitemapSize: 7000,
    outDir: './public', // Ensures the file goes where your server can see it
}