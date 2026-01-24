import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const searchterm = searchParams.get('searchterm');
    const category = searchParams.get('category');

    try {
        if (action === 'reviews') {
            // Construct the backend API URL for reviews
            const params = new URLSearchParams({
                page,
                limit,
            });

            if (searchterm) {
                params.append('searchterm', searchterm);
            }

            if (category) {
                params.append('category', category);
            }

            const backendUrl = `${API_BASE_URL}/reviews?${params.toString()}`;

            const response = await fetch(backendUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            });

            if (!response.ok) {
                return NextResponse.json(
                    { error: `Backend error: ${response.status}` },
                    { status: response.status }
                );
            }

            const data = await response.json();

            // Transform the response to match the expected format
            const transformedData = {
                success: true,
                data: {
                    reviews: data.reviews || [],
                    totalReviews: data.totalReviews || 0,
                },
            };

            return NextResponse.json(transformedData);
        }

        return NextResponse.json(
            { error: 'Unknown action' },
            { status: 400 }
        );
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}
