import Cookies from "js-cookie";

// Set the user data cookie with an expiration time of 1 day
export const setUserDataCookie = (userData) => {
    const expirationTimeInMinutes = 1; // Change this value to set a different expiration times
    const expirationTimeInHours = expirationTimeInMinutes / 60;
    Cookies.set('userInfo', JSON.stringify(userData), { expires: expirationTimeInHours });
    // Schedule the logout function to be called after the expiration time
    // setTimeout(logout, expirationTimeInMinutes * 60 * 1000);

    // eslint-disable-next-line no-undef
    setTimeout(logout, expirationTimeInMinutes * 24 * 60 * 60);
}

const logout = () => {
    // Clear the 'userInfo' cookie
    Cookies.remove('userInfo');
};