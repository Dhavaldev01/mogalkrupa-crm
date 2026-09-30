import * as yup from "yup";

export const loginSchema = yup.object().shape({
    email: yup
        .string()
        .required("Email is required")
        .email("Please enter a valid email"),

    password: yup
        .string()
        .required("Password is required")
        .min(6, "Minimum 6 characters"),
});