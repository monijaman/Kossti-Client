const getCountryFromIP = async (): Promise<string | undefined> => {
    // Retrieve IP address from headers
    const ip = headers().get('x-forwarded-for') || headers().get('remoteAddress') || '127.0.0.1';

    if (ip) {
        try {
            // Perform the fetch request asynchronously
            const response = await fetch(`http://ip-api.com/json/${ip}`);

            if (response.ok) {
                // Parse the JSON response
                const data: CountryResponse = await response.json();
                return data.countryCode;  // Return the country code from the response
            } else {
                return "en"
            }
        } catch (error) {
            console.error('Error fetching country data:', error);
            return undefined;
        }
    }

    return undefined;  // Return undefined if no IP address is found
};