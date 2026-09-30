import { emailFillIcon } from "@/assets/icon/Icon";
import Button from "@/components/common/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useEffect, useState } from "react";

export default function OtpVerificationDialog({ open, onClose }) {
    const INITIAL_TIME = 60;

    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (!open) return;

        setTimeLeft(INITIAL_TIME);
        setCanResend(false);
    }, [open]);

    useEffect(() => {
        if (!open || canResend) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [open, canResend]);

    const handleResend = () => {
        // API Call
        // await resendOtp();

        setTimeLeft(INITIAL_TIME);
        setCanResend(false);
    };
    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="sm:max-w-[450px] rounded-md border border-secondary/10 gap-0 p-0">
                <DialogHeader className="hidden">
                    <DialogTitle />
                </DialogHeader>
                <div className="py-4 px-5 space-y-3">
                    <div>
                        <h2 className="text-xl font-bold text-secondary">
                            OTP code verification
                        </h2>
                        <p className="text-sm font-medium text-secondary/80">
                            We have an OTP code to your email and <span className="text-primary">ravichodvadiya777@gmail.com</span> Enter the OTP code below to verify
                        </p>
                    </div>
                    <div className="w-full">
                        <InputOTP maxLength={6}>
                            <InputOTPGroup className="gap-x-2 w-full">
                                <InputOTPSlot
                                    index={0}
                                    className="bg-white flex items-center w-full rounded-lg p-2 border border-secondary/10 shadow-xs text-base font-medium text-secondary placeholder:text-secondary/50 outline-none transition-all data-[active=true]:ring-3 data-[active=true]:ring-primary/20 data-[active=true]:border-primary leading-tight flex-1 min-h-11 h-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-secondary/10 text-center"
                                />
                                <InputOTPSlot
                                    index={1}
                                    className="bg-white flex items-center w-full rounded-lg p-2 border border-secondary/10 shadow-xs text-base font-medium text-secondary placeholder:text-secondary/50 outline-none transition-all data-[active=true]:ring-3 data-[active=true]:ring-primary/20 data-[active=true]:border-primary leading-tight flex-1 min-h-11 h-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-secondary/10 text-center"
                                />
                                <InputOTPSlot
                                    index={2}
                                    className="bg-white flex items-center w-full rounded-lg p-2 border border-secondary/10 shadow-xs text-base font-medium text-secondary placeholder:text-secondary/50 outline-none transition-all data-[active=true]:ring-3 data-[active=true]:ring-primary/20 data-[active=true]:border-primary leading-tight flex-1 min-h-11 h-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-secondary/10 text-center"
                                />
                                <InputOTPSlot
                                    index={3}
                                    className="bg-white flex items-center w-full rounded-lg p-2 border border-secondary/10 shadow-xs text-base font-medium text-secondary placeholder:text-secondary/50 outline-none transition-all data-[active=true]:ring-3 data-[active=true]:ring-primary/20 data-[active=true]:border-primary leading-tight flex-1 min-h-11 h-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-secondary/10 text-center"
                                />
                                <InputOTPSlot
                                    index={4}
                                    className="bg-white flex items-center w-full rounded-lg p-2 border border-secondary/10 shadow-xs text-base font-medium text-secondary placeholder:text-secondary/50 outline-none transition-all data-[active=true]:ring-3 data-[active=true]:ring-primary/20 data-[active=true]:border-primary leading-tight flex-1 min-h-11 h-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-secondary/10 text-center"
                                />
                                <InputOTPSlot
                                    index={5}
                                    className="bg-white flex items-center w-full rounded-lg p-2 border border-secondary/10 shadow-xs text-base font-medium text-secondary placeholder:text-secondary/50 outline-none transition-all data-[active=true]:ring-3 data-[active=true]:ring-primary/20 data-[active=true]:border-primary leading-tight flex-1 min-h-11 h-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-secondary/10 text-center"
                                />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <div className="text-sm font-medium text-secondary/80">
                        {canResend ? (
                            <>
                                Didn't receive the code?{" "}
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="text-primary hover:underline cursor-pointer"
                                >
                                    Resend Code
                                </button>
                            </>
                        ) : (
                            <>
                                You can resend code in{" "}
                                <span className="text-primary">
                                    {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                                    {String(timeLeft % 60).padStart(2, "0")}
                                </span>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-end py-2.5 px-4 gap-2 border-t border-secondary/10">
                    <Button
                        onClick={onClose}
                        primaryBtn
                        className="text-xs font-medium py-2 px-4 ml-auto bg-white hover:bg-secondary/5 border-secondary/10 text-secondary min-w-24">
                        Back
                    </Button>
                    <Button
                        link
                        url={'/create-new-password'}
                        primaryBtn
                        className="text-xs font-medium py-2 px-4 min-w-24">
                        Continue
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}