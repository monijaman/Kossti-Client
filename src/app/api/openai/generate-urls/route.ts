import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productName } = body;

    if (!productName || !productName.trim()) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    // Create search-based YouTube URLs - these are guaranteed to work
    const searchQueries = [
      `${productName} review`,
      `${productName} unboxing`,
      `${productName} test`,
      `${productName} features`,
      `${productName} vs`,
      `${productName} comparison`,
      `${productName} tutorial`,
      `${productName} setup`,
      `${productName} specification`,
      `${productName} buy guide`,
      `${productName} pros and cons`,
      `${productName} full review`,
    ];

    // Generate YouTube search URLs that are guaranteed to work
    const youtubeUrls = searchQueries.map(
      (query) =>
        `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
    );

    // Generate valid source URLs from major review and retailer sites
    const sourceUrls = [
      `https://www.amazon.com/s?k=${productName.replace(/\s+/g, '+')}`,
      `https://www.cnet.com/search/?q=${productName.replace(/\s+/g, '+')}`,
      `https://www.techradar.com/search?searchTerm=${productName.replace(/\s+/g, '+')}`,
      `https://www.rtings.com/tools/table`,
      `https://www.bestbuy.com/site/searchpage.jsp?st=${productName.replace(/\s+/g, '+')}`,
    ];

    return NextResponse.json({
      youtubeUrls: youtubeUrls,
      sourceUrl: sourceUrls[0],
      sourceUrls: sourceUrls,
    });
  } catch (error) {
    console.error('Error generating URLs:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to generate URLs';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
