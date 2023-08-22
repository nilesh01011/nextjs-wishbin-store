import * as Yup from "yup";

// Register User DataSchema
export const registerSchema = Yup.object({
    email: Yup.string().min(3).email().required('!!Email address is required'),
    password: Yup.string().min(6).required('!!Password is required for #hashing'),
    confirm_password: Yup.string().required().oneOf([Yup.ref("password"), null], '!!Password must be match'),
    username: Yup.string().min(3).max(40).required("!!Please enter your full name"),
    mobile_number: Yup.number().min(10).required("!!Mobile number is required"),
    address: Yup.string()
});

// Login User DataSchema
export const loginSchema = Yup.object({
    email: Yup.string().email().required('!!Email address is required'),
    password: Yup.string().min(6).required('!!Password is required for #encrypt'),
});

// Update User DataSchema
export const updateUserDataSchema = Yup.object({
    oldPassword: Yup.string().min(6),
    newPassword: Yup.string().min(6),
    username: Yup.string().min(3).max(40).required("!!Please enter your full name"),
    mobile_number: Yup.number().min(10).required("!!Mobile number is required"),
    address: Yup.string()
})

// Searching for products
export const searchQuerySchema = Yup.object({
    query: Yup.string().min(3).required('!Please enter your product name'),
})

// shipping address
export const shippingAddressSchema = Yup.object({
    address: Yup.string().required('Address is required'),
    zip_code: Yup.string().max(6).required('Zip code are required for fetching location'),
    city: Yup.string().min(5).required('City as required for fetching location'),
    country: Yup.string().min(5).required('country are required for fetching address'),
})

// forget password
export const forgetPasswordSchema = Yup.object({
    email: Yup.string().min(3).email().required('!!Email address is required for reset password...'),
})

// new password
export const newPasswordSchema = Yup.object({
    password: Yup.string().min(6).required('!!Password is required for #encrypt'),
    confirm_password: Yup.string().required().oneOf([Yup.ref("password"), null], '!!Password must be match'),
})

// contact form
export const contactSchema = Yup.object({
    email: Yup.string().min(3).email().required('Please enter your full name'),
    username: Yup.string().min(4).required('Please enter your full name'),
    message: Yup.string().min(5).required('Please enter your message'),
})