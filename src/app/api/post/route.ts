import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { apiUrl, ...payload } = body;

        if (!apiUrl) {
            return NextResponse.json(
                { error: 'apiUrl is required in request body' },
                { status: 400 }
            );
        }

        // Get auth token from cookies or headers
        const token = request.cookies.get('token')?.value || '';
        
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Construct the backend API URL
        const backendUrl = `${API_BASE_URL}/${apiUrl}`;

        console.log(`[API POST] Proxying to: ${backendUrl}`);

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error(`[API POST] Backend error: ${response.status}`, errorData);
            
            return NextResponse.json(
                { 
                    error: `Backend error: ${response.status}`,
                    details: errorData 
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('[API POST] Error:', error);
        return NextResponse.json(
            { 
                error: 'Internal server error', 
                details: String(error) 
            },
            { status: 500 }
        );
    }
}
