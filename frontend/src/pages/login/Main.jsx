import { useApiMutation } from "@/apis";
import { newLogo } from "@/assets/icon/Icon";
import Button from "@/components/common/Button";
import TextInput from "@/components/common/TextInput";
import { loginSchema } from "@/schema/loginSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const { login: setAuthUser } = useAuth();
    
    // Using standard API mutation for login, disabling encryption for /auth/login
    const loginMutation = useApiMutation("/auth/login", "post", [], false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
        mode: "onBlur"
    });

    const onSubmit = async (data) => {
        const payload = {
            email: data.email?.trim(),
            password: data.password,
        };

        try {
            const response = await loginMutation.mutateAsync(payload);
            
            if (response.success && response.data) {
                setAuthUser(response.data);
                
                // Redirect back to protected route or default to dashboard
                const from = location.state?.from?.pathname || "/dashboard";
                navigate(from, { replace: true });
            }
        } catch (err) {
            console.error("Login Error:", err);
            // Error handling/toasting is done via useApiMutation if configured
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-4">
            <div className="w-full max-w-[430px] rounded-xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
                
                {/* Branding */}
                <div className="mb-8 flex flex-col items-center">
                    <Link to="/" className="mb-4 block h-[50px] w-auto outline-none">
                        {newLogo}
                    </Link>
                    <h1 className="text-2xl font-bold text-[#0F172A] mb-1">
                        Welcome Back
                    </h1>
                    <p className="text-sm font-medium text-[#64748B]">
                        Sign in to continue to your CRM
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* EMAIL */}
                    <TextInput
                        isRequired
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        {...register("email")}
                        error={errors.email?.message}
                        className="rounded-lg py-3 px-4 text-sm"
                        containerClassName="space-y-1"
                    />

                    {/* PASSWORD */}
                    <div className="space-y-1">
                        <TextInput
                            isRequired
                            label="Password"
                            type="password"
                            placeholder="Enter password"
                            {...register("password")}
                            error={errors.password?.message}
                            className="rounded-lg py-3 pl-4 pr-11 text-sm"
                            containerClassName="space-y-1"
                            pswBtnClassName="size-5 right-3 text-[#64748B]"
                        />
                        <div className="flex justify-end pt-1">
                            <Link to="/forgot-password" className="text-sm font-bold text-[#E50914] hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            primaryBtn
                            loading={loginMutation.isPending}
                            disabled={loginMutation.isPending}
                            className="w-full rounded-lg bg-[#E50914] py-3 text-sm font-bold text-white hover:bg-[#E50914]/90 transition-colors"
                        >
                            Sign In
                        </Button>
                    </div>


                </form>
            </div>
        </div>
    );
}