import { emailFillIcon } from "@/assets/icon/Icon";
import Button from "@/components/common/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function SuccessEmailSendDialog({ open, onClose, onClick }) {
    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="sm:max-w-[400px] rounded-md border border-secondary/10 gap-0 p-0">
                <DialogHeader className="hidden">
                    <DialogTitle />
                </DialogHeader>
                <div className="py-4 px-5 space-y-2">
                    <div className="bg-success/10 shadow-[inset_0_-2px_0_0_#05a85733] border border-success/10 p-2 *:size-6 w-fit text-success rounded-md">
                        {emailFillIcon}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-secondary">
                            Check your email
                        </h2>
                        <p className="text-base font-medium text-secondary/80">
                            We have sent a password recover instructions to your email
                        </p>
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
                        onClick={onClick}
                        type="button"
                        primaryBtn
                        className="text-xs font-medium py-2 px-4 min-w-24">
                        Next
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}