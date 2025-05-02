import { cookies } from "next/headers";

const CheckAuth = async () =>  {
    
    const countryCode = (await cookies()).get('country-code')?.value;

 
    console.log("countryCode:", countryCode); // Log the value to the console
    return countryCode;
};

export default CheckAuth;
