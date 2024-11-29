import { cookies } from "next/headers";

const CheckAuth = () => {
    const countryCode = cookies().get("country-code")?.value; // Retrieve the 'country-code' cookie if available

    console.log("countryCode:", countryCode); // Log the value to the console
    return countryCode;
};

export default CheckAuth;
