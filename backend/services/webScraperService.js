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
        },
        timeout: 15000,
        maxRedirects: 5,
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
   * Search web content (mock implementation)
   * In production, integrate with Google Custom Search API, Bing API, or similar
   */
  async searchWeb(query, limit = 10) {
    try {
      // Mock search results - In production, use a real search API
      const mockResults = [
        {
          title: `${query} - Complete Guide`,
          description: `Learn everything about ${query} with this comprehensive guide covering basics to advanced topics.`,
          url: `https://example.com/${query.toLowerCase().replace(/\s+/g, '-')}`,
          source: 'Example.com',
        },
        {
          title: `Understanding ${query} Concepts`,
          description: `Deep dive into ${query} fundamentals, practical examples, and real-world applications.`,
          url: `https://docs.example.com/${query.toLowerCase()}`,
          source: 'Documentation',
        },
        {
          title: `${query} Tutorial for Beginners`,
          description: `Step-by-step tutorial to master ${query} from scratch with hands-on examples.`,
          url: `https://tutorial.example.com/${query}`,
          source: 'Tutorial Site',
        },
      ];

      return {
        success: true,
        data: mockResults.slice(0, limit),
        query,
      };
    } catch (error) {
      throw new Error(`Web search failed: ${error.message}`);
    }
  }
}

module.exports = new WebScraperService();
