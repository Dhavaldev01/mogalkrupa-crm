import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { addCustomerSchema } from "@/schema/addCustomerSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import customerService from "@/services/customerService";
import { Building2, UserRound, Phone, MapPin, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import BottomSheet from "@/components/mobile/BottomSheet";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function AddCustomerDialog({ open, onClose, refetchCustomer, initialData }) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const isEdit = !!initialData;

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(addCustomerSchema),
        defaultValues: {
            shopName: "",
            firstName: "",
            lastName: "",
            mobileNumber: "",
            address: "",
        },
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                reset({
                    shopName: initialData.shopName || "",
                    firstName: initialData.firstName || "",
                    lastName: initialData.lastName || "",
                    mobileNumber: initialData.mobileNumber || "",
                    address: initialData.address || "",
                });
            } else {
                reset({
                    shopName: "",
                    firstName: "",
                    lastName: "",
                    mobileNumber: "",
                    address: "",
                });
            }
        }
    }, [open, initialData, reset]);

    const handleClose = () => {
        reset();
        onClose();
    };

    const { mutate: addCustomer, isPending: isAdding } = useMutation({
        mutationFn: (data) => customerService.createCustomer(data),
        onSuccess: (res) => {
            refetchCustomer(res?.data?.data);
            toast.success("Customer added successfully");
            handleClose();
        },
        onError: (err) => {
            if (err?.response?.status === 409) {
                setError("mobileNumber", { type: "server", message: err.response.data.message });
            }
            toast.error(err?.response?.data?.message || "Unable to save customer. Please try again.");
        }
    });

    const { mutate: updateCustomer, isPending: isUpdating } = useMutation({
        mutationFn: (data) => customerService.updateCustomer(initialData?._id, data),
        onSuccess: () => {
            refetchCustomer();
            toast.success("Customer updated successfully");
            handleClose();
        },
        onError: (err) => {
            if (err?.response?.status === 409) {
                setError("mobileNumber", { type: "server", message: err.response.data.message });
            }
            toast.error(err?.response?.data?.message || "Unable to update customer. Please try again.");
        }
    });

    const isPending = isAdding || isUpdating;

    const onSubmit = (data) => {
        const payload = {
            shopName: data?.shopName,
            firstName: data?.firstName,
            lastName: data?.lastName,
            mobileNumber: data?.mobileNumber,
            address: data?.address,
        };

        if (isEdit) {
            updateCustomer(payload);
        } else {
            addCustomer(payload);
        }
    };

    const formContent = (
        <form onSubmit={handleSubmit(onSubmit)} className="px-4 pb-5 flex flex-col h-full overflow-y-auto pt-2 md:pt-0">
                    <div className="space-y-4">
                        {/* Shop Name */}
                        <div>
                            <label className="text-sm font-medium text-[#243044] mb-1.5 block">
                                Shop Name <span className="text-[#E50914]">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#243044]/40 pointer-events-none">
                                    <Building2 size={18} strokeWidth={1.8} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter shop name"
                                    {...register("shopName")}
                                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DED8D3] rounded-[8px] text-sm text-[#243044] placeholder:text-[#243044]/40 outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-all h-[40px]"
                                />
                            </div>
                            {errors?.shopName && <p className="text-xs text-[#E50914] mt-1">{errors.shopName.message}</p>}
                        </div>

                        {/* First / Last Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-[#243044] mb-1.5 block">
                                    First Name <span className="text-[#E50914]">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#243044]/40 pointer-events-none">
                                        <UserRound size={18} strokeWidth={1.8} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter first name"
                                        {...register("firstName")}
                                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DED8D3] rounded-[8px] text-sm text-[#243044] placeholder:text-[#243044]/40 outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-all h-[40px]"
                                    />
                                </div>
                                {errors?.firstName && <p className="text-xs text-[#E50914] mt-1">{errors.firstName.message}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[#243044] mb-1.5 block">
                                    Last Name <span className="text-[#E50914]">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#243044]/40 pointer-events-none">
                                        <UserRound size={18} strokeWidth={1.8} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter last name"
                                        {...register("lastName")}
                                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DED8D3] rounded-[8px] text-sm text-[#243044] placeholder:text-[#243044]/40 outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-all h-[40px]"
                                    />
                                </div>
                                {errors?.lastName && <p className="text-xs text-[#E50914] mt-1">{errors.lastName.message}</p>}
                            </div>
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label className="text-sm font-medium text-[#243044] mb-1.5 block">
                                Mobile Number <span className="text-[#E50914]">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#243044]/40 pointer-events-none">
                                    <Phone size={18} strokeWidth={1.8} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter mobile number"
                                    {...register("mobileNumber")}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
                                    }}
                                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DED8D3] rounded-[8px] text-sm text-[#243044] placeholder:text-[#243044]/40 outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-all h-[40px]"
                                />
                            </div>
                            {errors?.mobileNumber && <p className="text-xs text-[#E50914] mt-1">{errors.mobileNumber.message}</p>}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="text-sm font-medium text-[#243044] mb-1.5 block">
                                Address <span className="text-[#E50914]">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-[#243044]/40 pointer-events-none">
                                    <MapPin size={18} strokeWidth={1.8} />
                                </div>
                                <textarea
                                    placeholder="Enter full address"
                                    {...register("address")}
                                    maxLength={300}
                                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DED8D3] rounded-[8px] text-sm text-[#243044] placeholder:text-[#243044]/40 outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-all min-h-[90px] max-h-[120px] resize-y"
                                />
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <div className="flex-1">
                                    {errors?.address && <p className="text-xs text-[#E50914]">{errors.address.message}</p>}
                                </div>
                                <div className="text-xs font-medium text-[#243044]/60 ml-2 whitespace-nowrap">
                                    {watch("address")?.length || 0}/300
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex sm:flex-row flex-col items-center gap-3 mt-8">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="w-full sm:w-[40%] py-2.5 px-4 bg-white border border-[#DED8D3] text-[#243044] rounded-[8px] text-sm font-bold hover:bg-secondary/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full sm:w-[60%] py-2.5 px-4 bg-[#E50914] text-white rounded-[8px] text-sm font-bold hover:bg-[#C90C15] transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isPending && <Loader2 size={16} className="animate-spin" />}
                            {isEdit ? "Update Customer" : "Save Customer"}
                        </button>
                    </div>
                </form>
    );

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
                <DialogContent showCloseButton={false} className="sm:max-w-[540px] w-[calc(100%-24px)] rounded-[8px] border-none shadow-lg gap-0 p-0 overflow-hidden bg-white">
                    <div className="flex justify-between items-start p-4 pb-4 shrink-0">
                        <div>
                            <DialogTitle className="text-xl font-bold text-[#243044]">
                                {isEdit ? "Edit Customer" : "Add Customer"}
                            </DialogTitle>
                            <p className="text-sm text-[#243044]/60 mt-1">
                                {isEdit ? "Update customer details." : "Enter customer details to add a new customer."}
                            </p>
                        </div>
                        <button type="button" onClick={handleClose} className="text-[#243044]/40 hover:text-[#243044] transition-colors">
                            <X size={20} strokeWidth={2} />
                        </button>
                    </div>
                    {formContent}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <BottomSheet 
            open={open} 
            onOpenChange={(val) => !val && handleClose()} 
            title={isEdit ? "Edit Customer" : "Add Customer"}
        >
            {formContent}
        </BottomSheet>
    );
}