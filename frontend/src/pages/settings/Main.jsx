import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import InvoiceTemplate from "@/pages/invoices/component/InvoiceTemplate";
import { resolveAssetUrl } from "@/helper/resolveAssetUrl";
import settingsService from "@/services/settingsService";
import Button from "@/components/common/Button";
import { toast } from "sonner";
import { safeNumber } from "@/lib/utils";
import { 
    Settings as SettingsIcon, 
    Save, 
    Upload, 
    Building2, 
    FileText, 
    Printer, 
    Coins, 
    SlidersHorizontal,
    Camera,
    X,
    Plus,
    Trash2
} from "lucide-react";


const Input = ({ label, name, value, onChange, placeholder, type = 'text', required = false }) => (
    <div className="space-y-1.5 w-full">
        <label className="text-xs font-bold text-secondary uppercase block">
            {label} {required && <span className="text-primary">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full text-sm py-2.5 px-3 border border-secondary/10 rounded-[8px] outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all"
        />
    </div>
);

const Toggle = ({ label, name, checked, onChange }) => (
    <label className="flex items-center justify-between cursor-pointer py-2 border-b border-secondary/5 last:border-0">
        <span className="text-sm font-bold text-secondary">{label}</span>
        <div className="relative">
            <input type="checkbox" name={name} checked={checked === true} onChange={onChange} className="sr-only" />
            <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-secondary/20'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-4' : ''}`}></div>
        </div>
    </label>
);

export default function Settings() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("Company Details");
    const fileInputRef = useRef(null);
    const qrInputRef = useRef(null);
    
    const [formData, setFormData] = useState({
        shopSubtitle: "CNC & Tools",
        owner1Name: "",
        phone1: "",
        whatsappNumber: "",
        address: "",
        city: "",
        state: "Gujarat",
        pincode: "",
        email: "",
        website: "",
        gstin: "",
        upiId: "",
        bankName: "",
        accountNumber: "",
        ifsc: "",
        logoUrl: "",
        qrCodeUrl: "",
        invoicePrefix: "INV-",
        defaultNotes: "Thank you for your business.",
        defaultTerms: "",
        paperSize: "A4",
        showLogo: true,
        showGstin: true,
        showPhone: true,
        showEmail: true,
        showWebsite: true,
        showAddress: true,
        showQrCode: false,
        showTerms: true,
        showNotes: true,
        shopName: "Mogal Krupa CNC & Laser",
    });

    const { data: res, isLoading } = useQuery({
        queryKey: ["settings"],
        queryFn: () => settingsService.getSettings()
    });

    const isInitialized = useRef(false);

    useEffect(() => {
        if (res?.data?.data && !isInitialized.current) {
            console.log("SETTINGS API DATA:", res.data.data);
            console.log("QR FROM API:", res.data.data.qrCodeUrl);
            setFormData(prev => ({ ...prev, ...res.data.data }));
            isInitialized.current = true;
        }
    }, [res?.data?.data]);

    const updateMutation = useMutation({
        mutationFn: (data) => settingsService.updateSettings(data),
        onSuccess: () => {
            queryClient.invalidateQueries(["settings"]);
            toast.success("Settings saved successfully");
        },
        onError: () => {
            toast.error("Failed to save settings");
        }
    });

    const uploadMutation = useMutation({
        mutationFn: (file) => {
            const fd = new FormData();
            fd.append("image", file);
            return settingsService.uploadImage(fd);
        }
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === "checkbox" ? checked : value 
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        const { businessType, businessCategory, currency, ...payload } = formData;
        console.log("ACTUAL SAVE PAYLOAD:", payload);
        updateMutation.mutate(payload);
    };

    console.log("QR AT SETTINGS (formData.qrCodeUrl):", formData.qrCodeUrl);

    const handleRemoveImage = (fieldName) => {
        if (window.confirm("Are you sure you want to remove this image?")) {
            setFormData(prev => ({ ...prev, [fieldName]: "" }));
        }
    };

    const handleFileUpload = async (e, fieldName) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        try {
            const res = await uploadMutation.mutateAsync(file);
            if (res.data?.url) {
                setFormData(prev => ({ ...prev, [fieldName]: res.data.url }));
                toast.success("Image uploaded successfully");
            }
        } catch (error) {
            toast.error("Failed to upload image");
        }
    };

    
    
    const tabs = [
        { id: "Company Details", icon: Building2 },
        { id: "Invoice Settings", icon: FileText },
        { id: "Print Settings", icon: Printer },
        { id: "Payment & Tax", icon: Coins },
        { id: "Preferences", icon: SlidersHorizontal },
    ];

    if (isLoading) {
        return (
            <div className="p-4 w-full flex-1 max-w-[1600px] mx-auto min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="text-secondary font-bold">Loading Settings...</div>
            </div>
        );
    }

    return (
        <div className="p-4 w-full flex-1 max-w-[1600px] mx-auto min-h-[calc(100vh-64px)]">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="size-9 rounded bg-primary text-white flex items-center justify-center">
                    <SettingsIcon size={20} strokeWidth={2} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-secondary leading-tight">Settings</h1>
                    <p className="text-xs font-medium text-secondary/60">Manage your company details, invoice settings and preferences.</p>
                </div>
            </div>

            {/* Layout: Left Form, Right Preview */}
            <div className="flex flex-col xl:flex-row gap-4 items-start">
                
                {/* LEFT: SETTINGS FORM */}
                <div className="w-full xl:w-1/2 flex flex-col gap-4 bg-white p-1 rounded-[8px] shadow-sm border border-secondary/10">
                    
                    {/* Horizontal Tabs */}
                    <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-b border-secondary/10 px-2 pt-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                                    activeTab === tab.id 
                                        ? "border-primary text-primary" 
                                        : "border-transparent text-secondary/70 hover:text-secondary hover:bg-secondary/5 rounded-t-md"
                                }`}
                            >
                                <tab.icon size={16} strokeWidth={2} />
                                {tab.id}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSave} className="p-4 flex flex-col gap-4">
                        
                        {/* Company Details Tab */}
                        {activeTab === "Company Details" && (
                            <div className="space-y-5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-base font-bold text-secondary">Company Details</h3>
                                        <p className="text-xs font-medium text-secondary/60">These details will be shown on your invoice and other documents.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <input type="file" ref={fileInputRef} onChange={(e) => handleFileUpload(e, "logoUrl")} className="hidden" accept="image/*" />
                                            <Button type="button" onClick={() => fileInputRef.current?.click()} className="py-2 px-3 text-xs bg-white text-primary border border-primary/30 hover:bg-primary/5 rounded-[8px] font-bold flex items-center gap-1.5 shadow-sm">
                                                <Upload size={14} strokeWidth={2} /> {formData.logoUrl ? "Change Logo" : "Upload Logo"}
                                            </Button>
                                        </div>
                                        {formData.logoUrl && (
                                            <Button type="button" onClick={() => handleRemoveImage("logoUrl")} className="p-2 text-red-500 hover:bg-red-50 rounded-[8px] border border-red-200">
                                                <Trash2 size={14} />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input label="Business Name" name="shopName" value={formData.shopName} onChange={handleChange} placeholder="e.g. Mogal Krupa CNC & Laser" required />
                                    <Input label="Owner Name" name="owner1Name" value={formData.owner1Name} onChange={handleChange} placeholder="e.g. Dhaval Patel" />
                                    <Input label="GST Number" name="gstin" value={formData.gstin} onChange={handleChange} placeholder="e.g. 24ABCDE1234F1Z5" />
                                    <Input label="Mobile No." name="phone1" value={formData.phone1} onChange={handleChange} placeholder="e.g. 98246 79179" required />
                                    <Input label="WhatsApp Number" name="whatsappNumber" value={formData.whatsappNumber || ""} onChange={handleChange} placeholder="e.g. +91 98765 43210" />
                                    <Input label="Email" name="email" value={formData.email} onChange={handleChange} type="email" placeholder="e.g. contact@mogal.com" />
                                    <div className="sm:col-span-2">
                                        <Input label="Website" name="website" value={formData.website} onChange={handleChange} placeholder="e.g. www.mogal.com" />
                                    </div>
                                    <div className="sm:col-span-2 space-y-1.5 w-full">
                                        <label className="text-xs font-bold text-secondary uppercase block">Address <span className="text-primary">*</span></label>
                                        <textarea
                                            name="address"
                                            value={formData.address || ""}
                                            onChange={handleChange}
                                            required
                                            placeholder="Full Shop Address"
                                            className="w-full text-sm py-2.5 px-3 border border-secondary/10 rounded-[8px] outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white min-h-[80px] transition-all resize-none"
                                        />
                                    </div>
                                    <Input label="City" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
                                    <Input label="State" name="state" value={formData.state} onChange={handleChange} placeholder="State" required />
                                    <div className="sm:col-span-2">
                                        <Input label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" required />
                                    </div>
                                </div>

                            </div>
                        )}

                        {/* Invoice Settings Tab */}
                        {activeTab === "Invoice Settings" && (
                            <div className="space-y-5">
                                <div>
                                    <h3 className="text-base font-bold text-secondary">Invoice Settings</h3>
                                    <p className="text-xs font-medium text-secondary/60">Configure invoice numbering and default templates.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input label="Invoice Prefix" name="invoicePrefix" value={formData.invoicePrefix} onChange={handleChange} placeholder="e.g. INV-" required />
                                    </div>
                                    <div className="space-y-1.5 w-full">
                                        <label className="text-xs font-bold text-secondary uppercase block">Default Notes</label>
                                        <textarea
                                            name="defaultNotes"
                                            value={formData.defaultNotes || ""}
                                            onChange={handleChange}
                                            placeholder="e.g. Thank you for your business."
                                            className="w-full text-sm py-2.5 px-3 border border-secondary/10 rounded-[8px] outline-none focus:border-primary bg-white min-h-[60px] transition-all resize-none"
                                        />
                                    </div>
                                    <div className="space-y-3 w-full">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold text-secondary uppercase block">Terms & Conditions</label>
                                            <Button type="button" onClick={() => {
                                                const terms = formData.defaultTerms ? formData.defaultTerms.split('\n') : [];
                                                terms.push("New Term");
                                                setFormData(prev => ({ ...prev, defaultTerms: terms.join('\n') }));
                                            }} className="py-1 px-2 text-xs bg-primary/10 text-primary hover:bg-primary/20 rounded font-bold flex items-center gap-1">
                                                <Plus size={12} /> Add Term
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            {(formData.defaultTerms ? formData.defaultTerms.split('\n') : []).map((term, idx, arr) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-secondary/50 w-4">{idx + 1}.</span>
                                                    <input 
                                                        type="text" 
                                                        value={term} 
                                                        onChange={(e) => {
                                                            const newTerms = [...arr];
                                                            newTerms[idx] = e.target.value;
                                                            setFormData(prev => ({ ...prev, defaultTerms: newTerms.join('\n') }));
                                                        }} 
                                                        className="flex-1 text-sm py-2 px-3 border border-secondary/10 rounded-[6px] outline-none focus:border-primary bg-white" 
                                                    />
                                                    <button type="button" onClick={() => {
                                                        const newTerms = [...arr];
                                                        newTerms.splice(idx, 1);
                                                        setFormData(prev => ({ ...prev, defaultTerms: newTerms.join('\n') }));
                                                    }} className="p-2 text-secondary/50 hover:text-red-500 hover:bg-red-50 rounded-[6px]">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            {(!formData.defaultTerms || formData.defaultTerms.trim() === '') && (
                                                <p className="text-xs text-secondary/50 italic">No terms added.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Print Settings Tab */}
                        {activeTab === "Print Settings" && (
                            <div className="space-y-5">
                                <div>
                                    <h3 className="text-base font-bold text-secondary">Print Settings</h3>
                                    <p className="text-xs font-medium text-secondary/60">Control what information displays on the printed invoice.</p>
                                </div>
                                <div className="space-y-1.5 w-full max-w-[200px]">
                                    <label className="text-xs font-bold text-secondary uppercase block">Paper Size</label>
                                    <select name="paperSize" value={formData.paperSize} onChange={handleChange} className="w-full text-sm py-2.5 px-3 border border-secondary/10 rounded-[8px] outline-none focus:border-primary bg-white">
                                        <option value="A4">A4 (Default)</option>
                                    </select>
                                </div>
                                <div className="space-y-0 pt-2">
                                    <Toggle label="Show Logo" name="showLogo" checked={formData.showLogo} onChange={handleChange} />
                                    <Toggle label="Show GSTIN" name="showGstin" checked={formData.showGstin} onChange={handleChange} />
                                    <Toggle label="Show Phone" name="showPhone" checked={formData.showPhone} onChange={handleChange} />
                                    <Toggle label="Show Email" name="showEmail" checked={formData.showEmail} onChange={handleChange} />
                                    <Toggle label="Show Website" name="showWebsite" checked={formData.showWebsite} onChange={handleChange} />
                                    <Toggle label="Show Address" name="showAddress" checked={formData.showAddress} onChange={handleChange} />
                                    <Toggle label="Show QR Code" name="showQrCode" checked={formData.showQrCode} onChange={handleChange} />
                                    <Toggle label="Show Terms" name="showTerms" checked={formData.showTerms} onChange={handleChange} />
                                    <Toggle label="Show Notes" name="showNotes" checked={formData.showNotes} onChange={handleChange} />
                                </div>
                            </div>
                        )}

                        {/* Payment & Tax Tab */}
                        {activeTab === "Payment & Tax" && (
                            <div className="space-y-5">
                                <div>
                                    <h3 className="text-base font-bold text-secondary">Payment & Bank Details</h3>
                                    <p className="text-xs font-medium text-secondary/60">Bank account and UPI details for receiving payments.</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input label="UPI ID" name="upiId" value={formData.upiId} onChange={handleChange} placeholder="e.g. 9876543210@upi" />
                                    <div className="sm:col-span-2">
                                        <Input label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="e.g. State Bank of India" />
                                    </div>
                                    <Input label="Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="Account No" />
                                    <Input label="IFSC Code" name="ifsc" value={formData.ifsc} onChange={handleChange} placeholder="IFSC Code" />
                                </div>
                                
                                <div className="border-t border-secondary/10 pt-6 mt-2 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {/* QR CODE */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-sm font-bold text-secondary uppercase">UPI QR Code</h3>
                                                {formData.qrCodeUrl && (
                                                    <Button type="button" onClick={() => handleRemoveImage("qrCodeUrl")} className="p-1.5 text-red-500 hover:bg-red-50 rounded-[6px] border border-red-200">
                                                        <Trash2 size={12} />
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="flex gap-4 items-center">
                                                <div 
                                                    onClick={() => qrInputRef.current?.click()}
                                                    className="w-24 h-24 border-2 border-dashed border-secondary/20 rounded-[8px] flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-secondary/50 overflow-hidden relative"
                                                >
                                                    <input type="file" ref={qrInputRef} onChange={(e) => handleFileUpload(e, "qrCodeUrl")} className="hidden" accept="image/*" />
                                                    {formData.qrCodeUrl ? (
                                                        <img src={resolveAssetUrl(formData.qrCodeUrl)} alt="QR Code" className="w-full h-full object-contain p-1" />
                                                    ) : (
                                                        <>
                                                            <Camera size={20} className="mb-1" />
                                                            <span className="text-[10px] font-bold">Upload QR</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preferences Tab */}
                        {activeTab === "Preferences" && (
                            <div className="space-y-5">
                                <div>
                                    <h3 className="text-base font-bold text-secondary">Preferences</h3>
                                    <p className="text-xs font-medium text-secondary/60">General application preferences.</p>
                                </div>
                                <p className="text-sm font-medium text-secondary/60">All preferences are currently set to Mogal Traders defaults.</p>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="border-t border-secondary/10 pt-5 mt-2 flex">
                            <Button 
                                type="submit" 
                                loading={updateMutation.isPending} 
                                primaryBtn 
                                className="py-2.5 px-5 text-sm bg-primary text-white hover:brightness-110 rounded-[8px] font-bold shadow-sm flex items-center gap-2 border-0"
                            >
                                <Save size={16} strokeWidth={2.5} /> Save Changes
                            </Button>
                        </div>
                    </form>
                </div>

                {/* RIGHT: LIVE INVOICE PREVIEW */}
                <div className="w-full xl:w-1/2 sticky top-5">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h2 className="text-base font-bold text-secondary">Invoice Preview</h2>
                            <p className="text-xs font-medium text-secondary/60">This is how your company details will appear on the invoice.</p>
                        </div>
                        <select className="text-sm py-1.5 px-3 border border-secondary/10 rounded-[6px] outline-none font-bold text-secondary bg-white shadow-sm">
                            <option>A4 (Default)</option>
                        </select>
                    </div>

                    <div className="bg-white border border-secondary/10 shadow-lg rounded-[2px] overflow-hidden select-none" style={{ transform: "scale(0.85)", transformOrigin: "top left", width: "117.65%", marginBottom: "-15%" }}>
                        <InvoiceTemplate 
                            invoice={{
                                invoiceNumber: "INV-0001",
                                date: new Date().toISOString(),
                                dueDate: new Date().toISOString(),
                                customerSnapshot: {
                                    shopName: "Customer Name",
                                    name: "Customer Contact",
                                    phone: "+91 98765 43210",
                                    address: "Customer Address, City, State - 000000"
                                },
                                items: [
                                    { jarkan: 4230, site: 250, rate: 0.10, dotAmount: 423.00, siteAmount: 250, total: 673.00 },
                                    { jarkan: 7128, site: 300, rate: 0.18, dotAmount: 1283.04, siteAmount: 300, total: 1583.04 },
                                    { jarkan: 2660, site: 250, rate: 0.10, dotAmount: 266.00, siteAmount: 250, total: 516.00 },
                                ],
                                dotTotal: 1972.04,
                                siteTotal: 800,
                                grandTotal: 2772.04,
                                paidAmount: 0,
                                pendingAmount: 2772.04,
                                invoiceDiscount: 0,
                                notes: formData.defaultNotes || "Thank you for your business."
                            }}
                            settings={formData}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
