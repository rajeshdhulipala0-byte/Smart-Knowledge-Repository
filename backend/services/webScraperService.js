const axios = require('axios');
const cheerio = require('cheerio');
const { parse } = require('node-html-parser');

class WebScraperService {
  /**
   * Fetch and parse content from a URL
   */
  async scrapeUrl(url) {
    try {
      // Validate URL
      const urlPattern = /^https?:\/\/.+/i;
      if (!urlPattern.test(url)) {
        throw new Error('Invalid URL format');
      }

      // Fetch the webpage
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        timeout: 15000,
        maxRedirects: 5,
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Accept 2xx and 3xx status codes
        },
        // For development: disable SSL verification (remove in production)
        httpsAgent: new (require('https').Agent)({
          rejectUnauthorized: false,
        }),
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Extract metadata
      const title = this.extractTitle($);
      const description = this.extractDescription($);
      const content = this.extractContent($, html);
      const author = this.extractAuthor($);
      const publishedDate = this.extractPublishedDate($);
      const tags = this.extractTags($);
      const imageUrl = this.extractImage($, url);

      return {
        success: true,
        data: {
          title: title || 'Untitled',
          description: description || content.substring(0, 200),
          content: content || '',
          author,
          publishedDate,
          tags,
          imageUrl,
          sourceUrl: url,
        },
      };
    } catch (error) {
      console.error('Web scraping error:', error.message);
      throw new Error(`Failed to scrape URL: ${error.message}`);
    }
  }

  /**
   * Extract title from various sources
   */
  extractTitle($) {
    return (
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      $('h1').first().text() ||
      ''
    ).trim();
  }

  /**
   * Extract description
   */
  extractDescription($) {
    return (
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      ''
    ).trim();
  }

  /**
   * Extract main content
   */
  extractContent($, html) {
    // Remove unwanted elements
    $('script, style, nav, header, footer, aside, iframe, .advertisement, .ads').remove();

    // Try to find main content area
    let content = '';

    // Priority order for content extraction
    const selectors = [
      'article',
      'main',
      '[role="main"]',
      '.post-content',
      '.article-content',
      '.entry-content',
      '.content',
      'body',
    ];

    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length) {
        // Get text content and clean it up
        content = element
          .find('p, h1, h2, h3, h4, h5, h6, li, pre, code')
          .map((i, el) => $(el).text())
          .get()
          .join('\n\n');

        if (content.length > 200) {
          break;
        }
      }
    }

    // Clean up content
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    return content;
  }

  /**
   * Extract author
   */
  extractAuthor($) {
    return (
      $('meta[name="author"]').attr('content') ||
      $('meta[property="article:author"]').attr('content') ||
      $('[rel="author"]').text() ||
      $('.author').first().text() ||
      ''
    ).trim();
  }

  /**
   * Extract published date
   */
  extractPublishedDate($) {
    const dateStr =
      $('meta[property="article:published_time"]').attr('content') ||
      $('meta[name="publish-date"]').attr('content') ||
      $('time').attr('datetime') ||
      '';

    if (dateStr) {
      const date = new Date(dateStr);
      return isNaN(date) ? null : date;
    }
    return null;
  }

  /**
   * Extract tags/keywords
   */
  extractTags($) {
    const keywords = $('meta[name="keywords"]').attr('content');
    if (keywords) {
      return keywords
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .slice(0, 10);
    }

    // Try to extract from article tags
    const articleTags = [];
    $('.tag, .tags a, [rel="tag"]').each((i, el) => {
      if (articleTags.length < 10) {
        articleTags.push($(el).text().trim());
      }
    });

    return articleTags;
  }

  /**
   * Extract main image
   */
  extractImage($, baseUrl) {
    let imageUrl =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('article img').first().attr('src') ||
      $('main img').first().attr('src') ||
      '';

    // Convert relative URL to absolute
    if (imageUrl && !imageUrl.startsWith('http')) {
      try {
        const base = new URL(baseUrl);
        imageUrl = new URL(imageUrl, base.origin).href;
      } catch (e) {
        imageUrl = '';
      }
    }

    return imageUrl;
  }

  /**
   * Get trending tech topics (mock data - in production, use a real API)
   */
  async getTrendingTopics() {
    // Mock trending topics - In production, integrate with RSS feeds or news APIs
    const topics = [
      {
        id: 1,
        title: 'Introduction to Artificial Intelligence and Machine Learning',
        description: 'Explore the fundamentals of AI and ML, their applications, and future trends.',
        url: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
        category: 'AI/ML',
        trending: true,
      },
      {
        id: 2,
        title: 'Getting Started with React Hooks',
        description: 'Learn how to use React Hooks to build modern, functional React components.',
        url: 'https://react.dev/reference/react',
        category: 'Web Development',
        trending: true,
      },
      {
        id: 3,
        title: 'Understanding Blockchain Technology',
        description: 'A comprehensive guide to blockchain, cryptocurrencies, and decentralized systems.',
        url: 'https://en.wikipedia.org/wiki/Blockchain',
        category: 'Blockchain',
        trending: true,
      },
      {
        id: 4,
        title: 'Docker and Containerization Best Practices',
        description: 'Master Docker containers and learn deployment strategies for modern applications.',
        url: 'https://docs.docker.com/get-started/',
        category: 'DevOps',
        trending: true,
      },
      {
        id: 5,
        title: 'Cybersecurity Fundamentals',
        description: 'Essential cybersecurity concepts, threat prevention, and security best practices.',
        url: 'https://en.wikipedia.org/wiki/Computer_security',
        category: 'Security',
        trending: true,
      },
      {
        id: 6,
        title: 'Cloud Computing with AWS',
        description: 'Introduction to Amazon Web Services and cloud infrastructure management.',
        url: 'https://aws.amazon.com/what-is-aws/',
        category: 'Cloud',
        trending: true,
      },
    ];

    return {
      success: true,
      data: topics,
    };
  }

  /**
   * Search web content (returns real Wikipedia URLs)
   * In production, integrate with Google Custom Search API, Bing API, or similar
   */
  async searchWeb(query, limit = 10) {
    try {
      // Return real Wikipedia URLs based on common search topics
      // In production, replace with actual search API
      const searchMap = {
        'javascript': [
          {
            title: 'JavaScript - Wikipedia',
            description: 'JavaScript is a programming language and core technology of the Web, alongside HTML and CSS.',
            url: 'https://en.wikipedia.org/wiki/JavaScript',
            source: 'Wikipedia',
          },
          {
            title: 'JavaScript Frameworks - Wikipedia',
            description: 'Overview of popular JavaScript frameworks including React, Angular, and Vue.',
            url: 'https://en.wikipedia.org/wiki/Comparison_of_JavaScript_frameworks',
            source: 'Wikipedia',
          },
        ],
        'python': [
          {
            title: 'Python (programming language) - Wikipedia',
            description: 'Python is a high-level, general-purpose programming language.',
            url: 'https://en.wikipedia.org/wiki/Python_(programming_language)',
            source: 'Wikipedia',
          },
        ],
        'react': [
          {
            title: 'React (software) - Wikipedia',
            description: 'React is a free and open-source front-end JavaScript library for building user interfaces.',
            url: 'https://en.wikipedia.org/wiki/React_(software)',
            source: 'Wikipedia',
          },
        ],
        'node': [
          {
            title: 'Node.js - Wikipedia',
            description: 'Node.js is a cross-platform, open-source JavaScript runtime environment.',
            url: 'https://en.wikipedia.org/wiki/Node.js',
            source: 'Wikipedia',
          },
        ],
        'sql': [
          {
            title: 'SQL - Wikipedia',
            description: 'SQL (Structured Query Language) is a domain-specific language for managing data in databases.',
            url: 'https://en.wikipedia.org/wiki/SQL',
            source: 'Wikipedia',
          },
        ],
        'machine learning': [
          {
            title: 'Machine Learning - Wikipedia',
            description: 'Machine learning is a field of study in artificial intelligence concerned with algorithms that improve through experience.',
            url: 'https://en.wikipedia.org/wiki/Machine_learning',
            source: 'Wikipedia',
          },
        ],
        'ai': [
          {
            title: 'Artificial Intelligence - Wikipedia',
            description: 'Artificial intelligence is intelligence demonstrated by machines, as opposed to natural intelligence.',
            url: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
            source: 'Wikipedia',
          },
        ],
      };

      const queryLower = query.toLowerCase();
      
      // Find matching results from search map
      let results = [];
      for (const [key, value] of Object.entries(searchMap)) {
        if (queryLower.includes(key) || key.includes(queryLower)) {
          results.push(...value);
        }
      }

      // If no matches found, return generic programming-related Wikipedia articles
      if (results.length === 0) {
        results = [
          {
            title: `Search: ${query}`,
            description: `Explore ${query} concepts with Wikipedia articles and tutorials.`,
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`,
            source: 'Wikipedia',
          },
          {
            title: 'Computer Programming - Wikipedia',
            description: 'Learn about computer programming fundamentals and concepts.',
            url: 'https://en.wikipedia.org/wiki/Computer_programming',
            source: 'Wikipedia',
          },
          {
            title: 'Software Development - Wikipedia',
            description: 'Overview of software development processes and methodologies.',
            url: 'https://en.wikipedia.org/wiki/Software_development',
            source: 'Wikipedia',
          },
        ];
      }

      return {
        success: true,
        data: results.slice(0, limit),
        query,
      };
    } catch (error) {
      throw new Error(`Web search failed: ${error.message}`);
    }
  }
}

module.exports = new WebScraperService();
