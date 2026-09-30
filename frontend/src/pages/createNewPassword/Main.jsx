import { loginPointList } from "@/assets/data/data";
import { checkBoxIcon, closeIcon, leftArrowIcon, newLogo, secureShieldIcon } from "@/assets/icon/Icon";
import { highlightIcon1, highlightIcon2, highlightIcon3, highlightIcon4, loginAnalyticsIcon, loginAnalyticsWidget, loginBarcodeIcon, loginBarcodeWidget, loginBgLineShap, loginCustomersWidget, loginGstIcon, loginInvoiceWidget, loginMultiStoreWidget, loginPaymentsWidget, loginPointListIcon, loginProductsIcon, loginProductsWidget, loginRupeesIcon, loginShapIcon, loginText3LineIcon } from "@/assets/icon/loginIcon";
import { loginBgImg, loginImg } from "@/assets/image/Main";
import Button from "@/components/common/Button";
import TextInput from "@/components/common/TextInput";
import { cn } from "@/lib/utils";
import { createNewPasswordSchema } from "@/schema/createNewPasswordSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";


export default function CreateNewPassword() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(createNewPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const password = watch("password", "");

    const passwordValidation = {
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        length: password.length >= 8,
    };

    const isPasswordValid = Object.values(passwordValidation).every(Boolean);

    const PasswordRule = ({ valid, text }) => (
        <div
            className={`flex items-center gap-2 text-sm font-medium transition-colors
                ${valid ? "text-success" : "text-danger"
                }`}
        >
            <span className="size-4 min-w-4">
                {valid ? checkBoxIcon : closeIcon}
            </span>

            <span>{text}</span>
        </div>
    );

    const onSubmit = (data) => {
        console.log(data);
    };
    return (
        <div className="lg:flex lg:bg-white sm:bg-[#f5f4f4] bg-white p-4 lg:space-y-0 space-y-4 min-h-svh">
            <div className="lg:block hidden flex-1 min-h-[calc(100svh-40px)] relative z-10 w-full h-full bg-[#F4F5F5] p-[30px] rounded-xl widget-shap bg-center bg-no-repeat bg-cover overflow-hidden">
                <div className="1xl:space-y-[70px] space-y-10">
                    <div className="space-y-2.5">
                        <Link to="/" className="aspect-[150/64] 1xl:w-[150px] w-[120px] block text-primary *:size-full outline-0 ring-0">
                            {newLogo}
                        </Link>
                        <div className="flex items-center gap-1.5 py-2 px-3.5 rounded-full bg-primary/10 border border-primary/10 w-fit text-primary text-xs font-bold tracking-[-1.2%] uppercase">
                            <span className="size-2 min-w-2 rounded-full bg-primary shadow-[0px_-1px_5px_0px_#FFFFFF3D_inset,0px_0.25px_1.5px_0px_#00000040]" />
                            Aapke Business Ki Smart Choice
                        </div>
                    </div>
                    <div className="space-y-4 2xl:max-w-[490px] max-w-[370px] w-full">
                        <div className="space-y-3">
                            <div className="-space-y-1">
                                <h2 className="2xl:text-[50px] text-[40px] font-bold tracking-[-2.25%] text-secondary leading-[1.35]">
                                    One Platform.
                                </h2>
                                <h2 className="2xl:text-[50px] text-[40px] font-bold tracking-[-2.25%] text-secondary leading-[1.35]">
                                    Every Business.
                                </h2>
                                <h2 className="2xl:text-[48px] text-[38px] font-bold tracking-[-2.25%] text-secondary leading-[1.35] relative w-fit">
                                    Complete Control.
                                    <span className="text-primary absolute -right-5 -top-1.5 aspect-[27/29] w-[27px] block">
                                        {loginText3LineIcon}
                                    </span>
                                </h2>
                            </div>
                            <p className="2xl:text-[18px] text-base text-secondary/70 font-medium tracking-[-1.7%] max-w-[390px] w-full">
                                Manage billing, inventory, GST, purchases, sales, reports and customers effortlessly.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-3.5">
                            {loginPointList.map((item, index) => (
                                <div
                                    key={`loginPointList-${index}`}
                                    className={cn(
                                        "flex items-center gap-1.5 text-sm text-white/70 font-medium tracking-[-1.7%] p-1 pr-2.5 rounded-sm",
                                        item?.class
                                    )}>
                                    <span
                                        className={cn(
                                            "flex items-center justify-center size-[19px] min-w-[19px] rounded-sm [corner-shape:squircle] shadow-[0px_0.26px_1.31px_0px_#272D3440,0px_-2px_4px_1px_#272D343D_inset] *:size-[12.29px]",
                                            item?.iconColor
                                        )}>
                                        {item?.icon}
                                    </span>
                                    {item?.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="aspect-[429/348] 2xl:w-[429px] w-[380px] absolute left-0 bottom-0 -z-10 text-primary">
                    {loginShapIcon}
                </div>
                <img
                    src={loginBgImg}
                    alt="Vyapar Note Login"
                    draggable={false}
                    className="aspect-[746/646] 3xl:w-[746px] absolute 3xl:top-1/2 3xl:-translate-y-1/2 3xl:right-20 3xl:bottom-[unset] 2xl:w-[680px] 2xl:bottom-14 2xl:right-10 1xl:w-[550px] bottom-5 right-5 w-[500px] 1lg:block hidden -z-10"
                />
            </div>
            <div className="sm:bg-white lg:shadow-none sm:shadow lg:border-0 sm:border sm:border-secondary/10 sm:rounded-xl 1lg:pl-10 1lg:pr-5 sm:px-4 lg:pt-[30px] lg:pb-4 sm:py-4 w-full 1xl:min-w-[600px] 1xl:max-w-[600px] sm:min-w-[500px] sm:max-w-[500px] lg:mx-0 mx-auto flex flex-col gap-4 lg:min-h-[calc(100svh-40px)] lg:max-h-[calc(100svh-40px)] lg:overflow-y-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-[26px] w-full">
                    <div className="space-y-4">
                        <Link to="/" className="aspect-[150/64] w-20 lg:hidden block text-primary *:size-full outline-0 ring-0">
                            {newLogo}
                        </Link>
                        <div className="sm:space-y-1.5 space-y-1">
                            <h1 className="1xl:text-[40px] sm:text-3xl text-2xl leading-[1.35] font-bold text-secondary">
                                Create new password<span className="text-primary">.</span>
                            </h1>
                            <p className="1xl:text-xl sm:text-[18px] text-base font-medium text-secondary/80">
                                Create a new password. If you forget it later, you can reset it using the "Forgot Password" feature.
                            </p>
                        </div>
                        <div className="lg:space-y-4 space-y-2.5">
                            <div className="space-y-2">
                                <TextInput
                                    isRequired
                                    label="New Password"
                                    type="password"
                                    placeholder="New password"
                                    className="xl:rounded-lg xl:py-3 xl:pl-4 xl:pr-11 xl:text-base xl:leading-[1.25] py-2 pl-3.5 pr-10 rounded-sm text-sm"
                                    containerClassName="xl:space-y-2 space-y-1"
                                    pswBtnClassName="xl:size-5 size-4 xl:min-w-5 min-w-4 xl:right-4 right-3.5"
                                    {...register("password")}
                                    error={errors.password?.message}
                                />
                                {password.length > 0 && !isPasswordValid && (
                                    <div className="space-y-1">
                                        <PasswordRule
                                            valid={passwordValidation.lowercase}
                                            text="At least one lowercase letter (a-z)"
                                        />
                                        <PasswordRule
                                            valid={passwordValidation.length}
                                            text="Minimum 8 characters"
                                        />
                                        <PasswordRule
                                            valid={passwordValidation.uppercase}
                                            text="At least one uppercase letter (A-Z)"
                                        />
                                        <PasswordRule
                                            valid={passwordValidation.number}
                                            text="At least one number (0-9)"
                                        />
                                        <PasswordRule
                                            valid={passwordValidation.special}
                                            text="At least one special character (e.g. !,@,#,$,%,&)"
                                        />
                                    </div>
                                )}
                            </div>
                            <TextInput
                                isRequired
                                label="Confirm New Password"
                                type="password"
                                placeholder="Confirm new password"
                                className="xl:rounded-lg xl:py-3 xl:pl-4 xl:pr-11 xl:text-base xl:leading-[1.25] py-2 pl-3.5 pr-10 rounded-sm text-sm"
                                containerClassName="xl:space-y-2 space-y-1"
                                pswBtnClassName="xl:size-5 size-4 xl:min-w-5 min-w-4 xl:right-4 right-3.5"
                                {...register("confirmPassword")}
                                error={errors.confirmPassword?.message}
                            />
                        </div>
                    </div>
                    <div className="space-y-3.5">
                        <Button
                            type="submit"
                            primaryBtn
                            className="w-full xl:text-base text-sm xl:py-2.5 xl:px-5 py-2 px-4">
                            Continue
                        </Button>
                        <Link to={'/'} className="1xl:text-base text-sm text-primary font-bold underline text-center w-fit mx-auto flex items-center gap-2">
                            <span className="size-4">{leftArrowIcon}</span>
                            Back To Sign in
                        </Link>
                    </div>
                </form>
                <div className="space-y-5 mt-auto lg:block hidden">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm font-medium text-secondary/80 text-center">
                            <div className="flex-1 rounded bg-secondary/10 h-px" />
                            Why Retailers Love Vyapar Note
                            <div className="flex-1 rounded bg-secondary/10 h-px" />
                        </div>
                        <div className="grid 1xl:grid-cols-4 grid-cols-2 gap-3">
                            <div className="bg-primary/10 rounded-md py-4 px-2.5 space-y-4">
                                <div className="size-8 bg-primary text-white rounded-xl [corner-shape:squircle] mx-auto shadow-[0px_-2px_4px_1px_#0000003D_inset,0px_0.26px_1.31px_0px_#E5091440] *:size-6 flex items-center justify-center">
                                    {highlightIcon1}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xs font-bold text-secondary text-center tracking-[-0.5%]">
                                        Secure & Reliable
                                    </h3>
                                    <p className="text-xs font-medium text-secondary/80 text-center tracking-[-1.2%]">
                                        Your data is safe with us
                                    </p>
                                </div>
                            </div>
                            <div className="bg-info/10 rounded-md py-4 px-2.5 space-y-4">
                                <div className="size-8 bg-info text-white rounded-xl [corner-shape:squircle] mx-auto shadow-[0px_-2px_4px_1px_#0000003D_inset,0px_0.26px_1.31px_0px_#1c7cf440] *:size-6 flex items-center justify-center">
                                    {highlightIcon2}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xs font-bold text-secondary text-center tracking-[-0.5%]">
                                        Cloud Backup
                                    </h3>
                                    <p className="text-xs font-medium text-secondary/80 text-center tracking-[-1.2%]">
                                        Automatic backup every day
                                    </p>
                                </div>
                            </div>
                            <div className="bg-success/10 rounded-md py-4 px-2.5 space-y-4">
                                <div className="size-8 bg-success text-white rounded-xl [corner-shape:squircle] mx-auto shadow-[0px_-2px_4px_1px_#0000003D_inset,0px_0.26px_1.31px_0px_#05a85740] *:size-6 flex items-center justify-center">
                                    {highlightIcon3}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xs font-bold text-secondary text-center tracking-[-0.5%]">
                                        Fast & Easy
                                    </h3>
                                    <p className="text-xs font-medium text-secondary/80 text-center tracking-[-1.2%]">
                                        Billing in just a few clicks
                                    </p>
                                </div>
                            </div>
                            <div className="bg-purple-100 rounded-md py-4 px-2.5 space-y-4">
                                <div className="size-8 bg-purple-800 text-white rounded-xl [corner-shape:squircle] mx-auto shadow-[0px_-2px_4px_1px_#0000003D_inset,0px_0.26px_1.31px_0px_#6e11b040] *:size-6 flex items-center justify-center">
                                    {highlightIcon4}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xs font-bold text-secondary text-center tracking-[-0.5%]">
                                        Access Anywhere
                                    </h3>
                                    <p className="text-xs font-medium text-secondary/80 text-center tracking-[-1.2%]">
                                        Use on mobile, tablet & desktop
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-secondary/10 py-2.5 gap-4 flex">
                        <div className="flex items-center gap-2 flex-1">
                            <div className="size-6 min-w-6 text-success *:size-full">
                                {secureShieldIcon}
                            </div>
                            <p className="flex-1 text-[10px] font-medium text-secondary/80 tracking-[-1.5%]">
                                100% Secure Login | Your data is protected with industry standard encryption
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-[10px] font-medium text-secondary/80 text-right">
                                Version 1.0.0
                            </p>
                            <p className="text-[10px] font-medium text-secondary/80 text-right mt-auto">
                                © 2026 <span className="font-bold text-primary">Vyapar Note</span>. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-5 sm:min-w-[500px] sm:max-w-[500px] mx-auto lg:hidden">
                <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm font-medium text-secondary/80 text-center">
                        <div className="flex-1 rounded bg-secondary/10 h-px" />
                        Why Retailers Love Vyapar Note
                        <div className="flex-1 rounded bg-secondary/10 h-px" />
                    </div>
                    <div className="grid 1xl:grid-cols-4 1m:grid-cols-2 gap-3">
                        <div className="1m:block flex items-center bg-primary/10 rounded-md 1m:py-4 1m:px-2.5 p-2.5 1m:space-y-4 1m:space-x-0 space-x-2">
                            <div className="size-8 bg-primary text-white rounded-xl [corner-shape:squircle] 1m:mx-auto shadow-[0px_-2px_4px_1px_#0000003D_inset,0px_0.26px_1.31px_0px_#E5091440] *:size-6 flex items-center justify-center">
                                {highlightIcon1}
                            </div>
                            <div className="1m:space-y-1 space-y-0.5 flex-1">
                                <h3 className="text-xs font-bold text-secondary 1m:text-center tracking-[-0.5%]">
                                    Secure & Reliable
                                </h3>
                                <p className="text-xs font-medium text-secondary/80 1m:text-center tracking-[-1.2%]">
                                    Your data is safe with us
                                </p>
                            </div>
                        </div>
                        <div className="1m:block flex items-center bg-info/10 rounded-md 1m:py-4 1m:px-2.5 p-2.5 1m:space-y-4 1m:space-x-0 space-x-2">
                            <div className="size-8 bg-info text-white rounded-xl [corner-shape:squircle] 1m:mx-auto shadow-[0px_-2px_4px_1px_#0000003D_inset,0px_0.26px_1.31px_0px_#1c7cf440] *:size-6 flex items-center justify-center">
                                {highlightIcon2}
                            </div>
                            <div className="1m:space-y-1 space-y-0.5 flex-1">
                                <h3 className="text-xs font-bold text-secondary 1m:text-center tracking-[-0.5%]">
                                    Cloud Backup
                                </h3>
                                <p className="text-xs font-medium text-secondary/80 1m:text-center tracking-[-1.2%]">
                                    Automatic backup every day
                                </p>
                            </div>
                        </div>
                        <div className="1m:block flex items-center bg-success/10 rounded-md 1m:py-4 1m:px-2.5 p-2.5 1m:space-y-4 1m:space-x-0 space-x-2">
                            <div className="size-8 bg-success text-white rounded-xl [corner-shape:squircle] 1m:mx-auto shadow-[0px_-2px_4px_1px_#0000003D_inset,0px_0.26px_1.31px_0px_#05a85740] *:size-6 flex items-center justify-center">
                                {highlightIcon3}
                            </div>
                            <div className="1m:space-y-1 space-y-0.5 flex-1">
                                <h3 className="text-xs font-bold text-secondary 1m:text-center tracking-[-0.5%]">
                                    Fast & Easy
                                </h3>
                                <p className="text-xs font-medium text-secondary/80 1m:text-center tracking-[-1.2%]">
                                    Billing in just a few clicks
                                </p>
                            </div>
                        </div>
                        <div className="1m:block flex items-center bg-purple-100 rounded-md 1m:py-4 1m:px-2.5 p-2.5 1m:space-y-4 1m:space-x-0 space-x-2">
                            <div className="size-8 bg-purple-800 text-white rounded-xl [corner-shape:squircle] 1m:mx-auto shadow-[0px_-2px_4px_1px_#0000003D_inset,0px_0.26px_1.31px_0px_#6e11b040] *:size-6 flex items-center justify-center">
                                {highlightIcon4}
                            </div>
                            <div className="1m:space-y-1 space-y-0.5 flex-1">
                                <h3 className="text-xs font-bold text-secondary 1m:text-center tracking-[-0.5%]">
                                    Access Anywhere
                                </h3>
                                <p className="text-xs font-medium text-secondary/80 1m:text-center tracking-[-1.2%]">
                                    Use on mobile, tablet & desktop
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-secondary/10 pt-2.5 gap-4 xs:flex xs:space-y-0 space-y-2.5">
                    <div className="flex items-center gap-2 flex-1">
                        <div className="size-6 min-w-6 text-success *:size-full">
                            {secureShieldIcon}
                        </div>
                        <p className="flex-1 text-[10px] font-medium text-secondary/80 tracking-[-1.5%]">
                            100% Secure Login | Your data is protected with industry standard encryption
                        </p>
                    </div>
                    <div className="flex xs:flex-col gap-2">
                        <p className="text-[10px] font-medium text-secondary/80 text-right">
                            Version 1.0.0
                        </p>
                        <p className="text-[10px] font-medium text-secondary/80 text-right xs:mt-auto xs:ml-0 ml-auto">
                            © 2026 <span className="font-bold text-primary">Vyapar Note</span>. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}