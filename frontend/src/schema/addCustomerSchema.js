import * as yup from "yup";
const mobileRegex = /^[6-9]\d{9}$/;

export const addCustomerSchema = yup.object().shape({
    // image: yup
    //     .mixed()
    //     .nullable()
    //     .test(
    //         "fileType",
    //         "Only image files are allowed",
    //         (value) => {
    //             if (!value) return true; // Image is optional

    //             return [
    //                 "image/jpeg",
    //                 "image/jpg",
    //                 "image/png",
    //                 "image/webp",
    //             ].includes(value.type);
    //         }
    //     )
    //     .test(
    //         "fileSize",
    //         "Image size must be less than 2MB",
    //         (value) => {
    //             if (!value) return true; // Image is optional

    //             return value.size <= 2 * 1024 * 1024;
    //         }
    //     ),
    shopName: yup
        .string()
        .required("Shop name is required"),

    firstName: yup
        .string()
        .required("First name is required"),

    lastName: yup
        .string()
        .required("Last name is required"),

    mobileNumber: yup
        .string()
        .required("Mobile number is required")
        .matches(/^\d+$/, "Mobile number must contain only digits")
        .length(10, "Mobile number must be exactly 10 digits")
        .matches(/^[6-9]/, "Mobile number must start with 6, 7, 8, or 9")
        .matches(mobileRegex, "Enter a valid Indian mobile number"),

    // email: yup
    //     .string()
    //     .matches(
    //         /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    //         {
    //             message: "Enter valid email address",
    //             excludeEmptyString: true,
    //         }
    //     ),

    address: yup
        .string()
        .required("Address is required"),

    // state: yup
    //     .string()
    //     .required("State is required"),

    // city: yup
    //     .string()
    //     .required("City is required"),

    // pincode: yup
    //     .string()
    //     .required("Pincode is required")
    //     .matches(/^[0-9]{6}$/, "Pincode must be 6 digits"),
});