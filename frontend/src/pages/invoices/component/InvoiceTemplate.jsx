import React, { forwardRef } from "react";
import { safeNumber } from "@/lib/utils";
import { Phone, Mail, Globe, MapPin, Heart, HeartHandshake, FileText, CheckCircle, Scissors, Crosshair, Box, Badge, Scan } from "lucide-react";
import { resolveAssetUrl } from "@/helper/resolveAssetUrl";

// ============================================================
// NUMBER TO WORDS - INDIAN FORMAT
// ============================================================

const numberToWords = (num) => {
    num = safeNumber(num);

    if (num === 0) return "Zero Only";

    const a = [
        "",
        "One ",
        "Two ",
        "Three ",
        "Four ",
        "Five ",
        "Six ",
        "Seven ",
        "Eight ",
        "Nine ",
        "Ten ",
        "Eleven ",
        "Twelve ",
        "Thirteen ",
        "Fourteen ",
        "Fifteen ",
        "Sixteen ",
        "Seventeen ",
        "Eighteen ",
        "Nineteen ",
    ];

    const b = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
    ];

    const inWords = (n) => {
        if ((n = n.toString()).length > 9) return "overflow";

        n = ("000000000" + n)
            .substr(-9)
            .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);

        if (!n) return "";

        let str = "";

        str +=
            n[1] != 0
                ? (a[Number(n[1])] ||
                    b[n[1][0]] + " " + a[n[1][1]]) +
                "Crore "
                : "";

        str +=
            n[2] != 0
                ? (a[Number(n[2])] ||
                    b[n[2][0]] + " " + a[n[2][1]]) +
                "Lakh "
                : "";

        str +=
            n[3] != 0
                ? (a[Number(n[3])] ||
                    b[n[3][0]] + " " + a[n[3][1]]) +
                "Thousand "
                : "";

        str +=
            n[4] != 0
                ? (a[Number(n[4])] ||
                    b[n[4][0]] + " " + a[n[4][1]]) +
                "Hundred "
                : "";

        str +=
            n[5] != 0
                ? (str !== "" ? "and " : "") +
                (a[Number(n[5])] ||
                    b[n[5][0]] + " " + a[n[5][1]])
                : "";

        return str;
    };

    const wholePart = Math.floor(num);

    const decimalPart = Math.round(
        (num - wholePart) * 100
    );

    let words = inWords(wholePart).trim();

    if (decimalPart > 0) {
        words += ` and ${inWords(decimalPart).trim()} Paise`;
    }

    return `${words} Only`;
};

// ============================================================
// INVOICE TEMPLATE
// ============================================================

const InvoiceTemplate = forwardRef(
    ({ invoice, settings }, ref) => {
        if (!invoice || !settings) return null;

        // ========================================================
        // DATE
        // ========================================================

        const formattedDate = invoice.date
            ? new Date(invoice.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            : "";

        const formattedDueDate = invoice.dueDate
            ? new Date(invoice.dueDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            : formattedDate;

        // ========================================================
        // FINANCIAL VALUES
        // ========================================================

        const dotTotal = safeNumber(invoice.dotTotal);
        const siteTotal = safeNumber(invoice.siteTotal);

        const invoiceDiscount = safeNumber(
            invoice.invoiceDiscount
        );

        const grandTotal = safeNumber(invoice.grandTotal);

        const paidAmount = safeNumber(invoice.paidAmount);

        const pendingAmount = Math.max(
            0,
            safeNumber(invoice.pendingAmount)
        );

        const subtotal = dotTotal + siteTotal;

        // ========================================================
        // CUSTOMER
        // ========================================================

        const customer =
            invoice.customerSnapshot || {};

        // ========================================================
        // ITEMS
        // ========================================================

        const items = Array.isArray(invoice.items)
            ? invoice.items
            : [];

        return (
            <div
                ref={ref}
                className="
          invoice-container
          bg-white
          mx-auto
          box-border
          relative
          flex
          flex-col
          font-sans
          overflow-hidden
        "
                style={{
                    color: "#0F172A",
                    width: "210mm",
                    height: "297mm",
                    minHeight: "297mm",
                    maxHeight: "297mm",
                    boxSizing: "border-box",
                }}
            >
                {/* ===================================================
            1. HEADER
        ==================================================== */}

                <div
                    className="
            flex
            justify-between
            items-center
            border-b
            border-[#F1D5D5]
            bg-white
            relative
            h-[150px]
            py-6
            px-8
            break-inside-avoid
            shrink-0
          "
                >
                    <div className="flex flex-col justify-center relative z-10 w-[240px] shrink-0">
                        {settings.showLogo && settings.logoUrl ? (
                            <img
                                src={resolveAssetUrl(settings.logoUrl)}
                                alt="Logo"
                                crossOrigin="anonymous"
                                className="max-h-[90px] w-auto object-contain object-left"
                            />
                        ) : (
                            <div className="flex flex-col text-left">
                                <h1 style={{ fontFamily: '"Noto Sans Gujarati", sans-serif', fontWeight: 900 }} className="text-[34px] text-[#E31E24] leading-none tracking-tight">
                                    {settings.shopName || "મોગલ કૃપા"}
                                </h1>
                                <p style={{ fontFamily: '"Noto Sans Gujarati", sans-serif', fontWeight: 800 }} className="text-[14px] text-[#0F1B2D] mt-1 tracking-wide">
                                    {settings.shopSubtitle || "CNC & લેસર"}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="w-[1px] h-[70px] bg-[#E5E7EB] shrink-0"></div>

                    {/* SERVICES */}
                    <div className="flex flex-col justify-center gap-2 relative z-10 w-[240px] pl-4 shrink-0">
                        <div className="flex items-center gap-2.5"><Scissors size={16} className="text-[#E31E24]" strokeWidth={2.5} /><span className="text-[13px] uppercase font-bold text-[#0F1B2D]">CNC CUTTING</span></div>
                        <div className="flex items-center gap-2.5"><Crosshair size={16} className="text-[#E31E24]" strokeWidth={2.5} /><span className="text-[13px] uppercase font-bold text-[#0F1B2D]">LASER CUTTING</span></div>
                        <div className="flex items-center gap-2.5"><Box size={16} className="text-[#E31E24]" strokeWidth={2.5} /><span className="text-[13px] uppercase font-bold text-[#0F1B2D]">ACRYLIC | MDF | WOOD</span></div>
                        <div className="flex items-center gap-2.5"><Badge size={16} className="text-[#E31E24]" strokeWidth={2.5} /><span className="text-[13px] uppercase font-bold text-[#0F1B2D]">METAL | SIGNAGE</span></div>
                    </div>

                    <div className="w-[1px] h-[70px] bg-[#E5E7EB] shrink-0"></div>

                    {/* CONTACT */}
                    <div className="flex flex-col justify-center gap-1.5 relative z-10 text-[12.5px] text-[#0F1B2D] flex-1 pl-4 pr-6">
                        {settings.showPhone && settings.phone1 && (
                            <div className="flex items-start gap-2.5">
                                <Phone size={16} className="text-[#E31E24] shrink-0 mt-[1px]" strokeWidth={2.5} />
                                <span className="font-semibold leading-tight">{settings.phone1}</span>
                            </div>
                        )}
                        {settings.showEmail && settings.email && (
                            <div className="flex items-start gap-2.5">
                                <Mail size={16} className="text-[#E31E24] shrink-0 mt-[1px]" strokeWidth={2.5} />
                                <span className="font-semibold leading-tight">{settings.email}</span>
                            </div>
                        )}
                        {settings.showWebsite && settings.website && (
                            <div className="flex items-start gap-2.5">
                                <Globe size={16} className="text-[#E31E24] shrink-0 mt-[1px]" strokeWidth={2.5} />
                                <span className="font-semibold leading-tight">{settings.website.replace(/^https?:\/\//, "")}</span>
                            </div>
                        )}
                        {settings.showAddress && settings.address && (
                            <div className="flex items-start gap-2.5">
                                <MapPin size={16} className="text-[#E31E24] shrink-0 mt-[2px]" strokeWidth={2.5} />
                                <span className="font-semibold leading-[1.3] max-w-[280px]">
                                    {settings.address}
                                    {[settings.city, settings.state].filter(Boolean).length > 0 && `, ${[settings.city, settings.state].filter(Boolean).join(", ")}`}
                                    {settings.pincode ? ` - ${settings.pincode}` : ""}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* TOP RIGHT DECORATION */}
                    <div className="absolute top-0 right-0 w-[180px] h-[180px] pointer-events-none overflow-hidden z-0">
                        {/* Lighter translucent pink triangle */}
                        <div 
                            className="absolute top-0 right-[20px] w-[110px] h-[110px] bg-[#FDECEC]"
                            style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
                        ></div>
                        {/* Solid red diagonal triangle */}
                        <div 
                            className="absolute top-0 right-0 w-[130px] h-[130px] bg-gradient-to-br from-[#E31E24] to-[#C8102E]"
                            style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
                        >
                            {/* Faint white diagonal lines */}
                            <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, #ffffff 4px, #ffffff 5px)' }}></div>
                        </div>
                    </div>
                </div>

                {/* ===================================================
            2. INVOICE TITLE
        ==================================================== */}

                <div
                    className="
            mt-6
            px-10
            flex
            justify-between
            items-end
            break-inside-avoid
            shrink-0
          "
                >
                    <h2
                        className="
              text-[32px]
              font-extrabold
              tracking-wide
              text-[#0F1B2D]
              leading-none
            "
                    >
                        INVOICE
                    </h2>

                    {/* META */}
                    <div className="flex text-left pb-1">
                        <div className="flex flex-col border-r border-[#E5E7EB] pr-5">
                            <p className="font-semibold text-[#64748B] text-[9.5px]">
                                Invoice No.
                            </p>
                            <p className="font-bold text-[#E31E24] text-[13.5px] mt-0.5">
                                {invoice.invoiceNumber}
                            </p>
                        </div>

                        <div className="flex flex-col border-r border-[#E5E7EB] px-5">
                            <p className="font-semibold text-[#64748B] text-[9.5px]">
                                Date
                            </p>
                            <p className="font-bold text-[#0F1B2D] text-[13.5px] mt-0.5">
                                {formattedDate}
                            </p>
                        </div>

                        {invoice.dueDate && (
                            <div className="flex flex-col pl-5">
                                <p className="font-semibold text-[#64748B] text-[9.5px]">
                                    Due Date
                                </p>
                                <p className="font-bold text-[#0F1B2D] text-[13.5px] mt-0.5">
                                    {formattedDueDate}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ===================================================
            3. BILL TO (FULL WIDTH)
        ==================================================== */}

                <div className="px-10 mt-4 mb-4 break-inside-avoid shrink-0">
                    <div className="w-full border border-[#E5E7EB] bg-[#F8FAFC]/50 rounded-[10px] flex shadow-sm overflow-hidden">
                        <div className="flex-1 p-4 relative">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E50914]" />
                            <div className="flex items-center gap-1.5 mb-2">
                                <p className="text-[11px] font-bold text-[#E50914] uppercase tracking-wide">
                                    Bill To
                                </p>
                            </div>

                            <p className="text-[17px] font-extrabold text-[#0F2747] leading-tight">
                                {customer.shopName || customer.name || "Customer"}
                            </p>

                            {customer.shopName && customer.name && (
                                <p className="text-[12px] font-semibold text-[#64748B] mt-0.5">
                                    {customer.name}
                                </p>
                            )}

                            <div className="mt-3 space-y-1.5">
                                {customer.phone && (
                                    <div className="flex items-center gap-2 text-[11px] text-[#0F172A] font-medium">
                                        <Phone size={11} className="text-[#E50914]" />
                                        <span>
                                            {String(customer.phone).startsWith("+") ? customer.phone : `+91 ${customer.phone}`}
                                        </span>
                                    </div>
                                )}

                                {customer.address && (
                                    <div className="flex items-start gap-2 text-[11px] text-[#0F172A] font-medium max-w-[280px]">
                                        <MapPin size={11} className="text-[#E50914] mt-0.5 shrink-0" />
                                        <span className="leading-snug">
                                            {customer.address}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===================================================
            4. ITEMS TABLE
        ==================================================== */}

                <div className="px-10 mb-3 shrink-0">
                    <table className="w-full text-left border-collapse border border-[#E5E7EB]">
                        <thead
                            className="bg-[#E50914] text-white"
                            style={{
                                display: "table-header-group",
                            }}
                        >
                            <tr>
                                <th className="py-2 px-3 font-semibold text-[10px] uppercase tracking-wide w-[6%] border-r border-white/20">
                                    #
                                </th>

                                <th className="py-2 px-3 font-semibold text-[10px] uppercase tracking-wide text-center border-r border-white/20">
                                    Jarkan No.
                                </th>

                                <th className="py-2 px-3 font-semibold text-[10px] uppercase tracking-wide text-center border-r border-white/20">
                                    Site
                                </th>

                                <th className="py-2 px-3 font-semibold text-[10px] uppercase tracking-wide text-center border-r border-white/20">
                                    Rate (₹)
                                </th>

                                <th className="py-2 px-3 font-semibold text-[10px] uppercase tracking-wide text-center border-r border-white/20">
                                    Dot Amount (₹)
                                </th>

                                <th className="py-2 px-3 font-semibold text-[10px] uppercase tracking-wide text-center border-r border-white/20">
                                    Site Amount (₹)
                                </th>

                                <th className="py-2 px-3 font-semibold text-[10px] uppercase tracking-wide text-right">
                                    Total (₹)
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {items.map((item, idx) => (
                                <tr
                                    key={item._id || idx}
                                    className="border-b border-[#E5E7EB] break-inside-avoid"
                                >
                                    <td className="py-2.5 px-3 text-[#64748B] text-[11px] border-r border-[#E5E7EB]">
                                        {idx + 1}
                                    </td>

                                    <td className="py-2.5 px-3 text-center font-medium text-[11px] text-[#0F1B2D] border-r border-[#E5E7EB]">
                                        {item.jarkan}
                                    </td>

                                    <td className="py-2.5 px-3 text-center font-medium text-[11px] text-[#0F1B2D] border-r border-[#E5E7EB]">
                                        {item.site}
                                    </td>

                                    <td className="py-2.5 px-3 text-center text-[#64748B] text-[11px] border-r border-[#E5E7EB]">
                                        {safeNumber(
                                            item.rate
                                        ).toFixed(2)}
                                    </td>

                                    <td className="py-2.5 px-3 text-center text-[#64748B] text-[11px] border-r border-[#E5E7EB]">
                                        {safeNumber(
                                            item.dotAmount
                                        ).toFixed(2)}
                                    </td>

                                    <td className="py-2.5 px-3 text-center text-[#64748B] text-[11px] border-r border-[#E5E7EB]">
                                        {safeNumber(
                                            item.siteAmount
                                        ).toFixed(2)}
                                    </td>

                                    <td className="py-2.5 px-3 text-right font-bold text-[#0F2747] text-[11.5px]">
                                        {safeNumber(
                                            item.total
                                        ).toFixed(2)}
                                    </td>
                                </tr>
                            ))}

                            {items.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-5 text-center text-[11px] text-[#64748B]"
                                    >
                                        No invoice items
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ===================================================
            6. BOTTOM SECTION (TERMS, NOTES & TOTALS)
        ==================================================== */}

                <div
                    className="
            px-10
            mb-6
            flex
            justify-between
            gap-6
            break-inside-avoid
            shrink-0
          "
                >
                    {/* LEFT: Amount in Words + Terms + Notes */}
                    <div className="flex-1 flex flex-col gap-4 min-w-0">
                        {/* AMOUNT IN WORDS */}
                        <div>
                            <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-widest mb-1">
                                Amount in Words
                            </p>
                            <p className="text-[12px] font-bold text-[#0F1B2D] capitalize">
                                {numberToWords(grandTotal)}
                            </p>
                            <div className="w-12 h-[2px] bg-[#E50914] mt-1.5 rounded-full"></div>
                        </div>

                        {/* TERMS & NOTES (Two columns separated by vertical line) */}
                        {((settings.showTerms && settings.defaultTerms) || (settings.showNotes && invoice.notes)) && (
                            <div className="flex gap-4 border border-[#E5E7EB] rounded-[10px] p-4 bg-[#F8FAFC]/50 min-w-0 relative overflow-hidden">
                                {/* Faint pink geometric watermark behind notes */}
                                <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#FDECEC] rounded-tl-full opacity-30 pointer-events-none"></div>
                                
                                {settings.showTerms && settings.defaultTerms && (
                                    <div className={`flex-1 min-w-0 ${settings.showNotes && invoice.notes ? 'border-r border-[#E5E7EB] pr-4' : ''}`}>
                                        <p className="text-[10px] font-bold text-[#E50914] uppercase mb-2 tracking-wide flex items-center gap-1.5">
                                            <CheckCircle size={12} className="text-[#E50914]" />
                                            Terms & Conditions
                                        </p>
                                        <div className="text-[9.5px] text-[#0F1B2D] leading-relaxed">
                                            {settings.defaultTerms.split('\n').map((term, i) => (
                                                <div key={i} className="mb-1">{term}</div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {settings.showNotes && invoice.notes && (
                                    <div className="flex-1 min-w-0 relative z-10">
                                        <p className="text-[10px] font-bold text-[#E50914] uppercase mb-2 tracking-wide flex items-center gap-1.5">
                                            <FileText size={12} className="text-[#E50914]" />
                                            Notes
                                        </p>
                                        <p className="text-[9.5px] text-[#0F1B2D] whitespace-pre-wrap leading-relaxed">
                                            {invoice.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: TOTALS */}
                    <div className="w-[260px] shrink-0">
                        <div className="bg-white border border-[#E5E7EB] rounded-[10px] overflow-hidden shadow-sm">
                            <div className="p-3.5 space-y-2">
                                <div className="flex justify-between text-[11px] font-semibold text-[#64748B]">
                                    <span>Dot Total (₹)</span>
                                    <span className="text-[#0F1B2D]">₹{dotTotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-[11px] font-semibold text-[#64748B]">
                                    <span>Site Total (₹)</span>
                                    <span className="text-[#0F1B2D]">₹{siteTotal.toFixed(2)}</span>
                                </div>

                                {invoiceDiscount > 0 && (
                                    <>
                                        <div className="flex justify-between text-[11px] font-semibold text-[#64748B] pt-1.5 border-t border-[#E5E7EB]">
                                            <span>Subtotal (₹)</span>
                                            <span className="text-[#0F1B2D]">₹{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-[11px] font-semibold text-[#E50914]">
                                            <span>Discount (₹)</span>
                                            <span>- ₹{invoiceDiscount.toFixed(2)}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* GRAND TOTAL */}
                            <div className="bg-[#FFF1F2] border-y border-[#FECACA] px-4 py-3 flex justify-between items-center">
                                <span className="text-[12px] font-bold text-[#E50914] uppercase tracking-wide">
                                    Grand Total
                                </span>
                                <span className="text-[18px] font-black text-[#E50914]">
                                    ₹{grandTotal.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FLEX SPACER */}
                <div className="flex-grow min-h-0" />

                {/* ===================================================
            7. FOOTER AREA (QR, Thank You)
        ==================================================== */}
                
                <div className="px-10 mb-5 flex justify-between items-center shrink-0">
                    {/* LEFT: QR CODE & PAYMENT METHODS CARD */}
                    <div className="flex items-center shrink-0">
                        {settings.qrCodeUrl || settings.showQrCode ? (
                            <div className="w-[360px] h-[155px] bg-[#FEF2F2] border border-[#FEE2E2] rounded-[12px] shadow-sm flex items-center p-5 relative overflow-hidden shrink-0" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                                {/* subtle red accent at bottom */}
                                <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-[#E50914] opacity-90"></div>
                                
                                {/* QR CODE LEFT */}
                                <div className="w-[110px] h-[110px] shrink-0 bg-white border border-[#FEE2E2] rounded-[10px] p-2 shadow-sm flex items-center justify-center relative z-10">
                                    {settings.qrCodeUrl ? (
                                        <img
                                            src={resolveAssetUrl(settings.qrCodeUrl)}
                                            alt="QR Code"
                                            crossOrigin="anonymous"
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-50 rounded-[6px]"></div>
                                    )}
                                </div>

                                {/* RIGHT SIDE TEXT & LOGOS */}
                                <div className="flex flex-col justify-center ml-5 relative z-10">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Scan size={18} className="text-[#E50914]" strokeWidth={3} />
                                        <p className="text-[20px] font-[800] text-[#0F1B2D] leading-none tracking-tight">
                                            Scan to Pay
                                        </p>
                                    </div>
                                    <p className="text-[12px] text-[#64748B] font-semibold leading-none mb-4">
                                        Open any UPI app & scan
                                    </p>
                                    
                                    <div className="flex items-center gap-2">
                                        <div className="bg-white border border-[#E5E7EB] rounded-[6px] px-2 py-1 flex items-center justify-center shadow-sm h-[26px] w-auto">
                                            <img src="/payments/gpay.svg" alt="GPay" className="h-[14px] w-auto object-contain" />
                                        </div>
                                        <div className="bg-white border border-[#E5E7EB] rounded-[6px] px-2 py-1 flex items-center justify-center shadow-sm h-[26px] w-auto">
                                            <img src="/payments/phonepe.svg" alt="PhonePe" className="h-[14px] w-auto object-contain" />
                                        </div>
                                        <div className="bg-white border border-[#E5E7EB] rounded-[6px] px-2 py-1 flex items-center justify-center shadow-sm h-[26px] w-auto">
                                            <img src="/payments/paytm.svg" alt="Paytm" className="h-[14px] w-auto object-contain" />
                                        </div>
                                        <div className="bg-white border border-[#E5E7EB] rounded-[6px] px-2 py-1 flex items-center justify-center shadow-sm h-[26px] w-auto">
                                            <img src="/payments/upi.svg" alt="UPI" className="h-[14px] w-auto object-contain" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-[360px] h-[155px]"></div>
                        )}
                    </div>

                    {/* RIGHT: THANK YOU CARD */}
                    <div className="flex-1 flex justify-end shrink-0">
                        <div className="bg-[#F8FAFC]/80 border border-[#E5E7EB] rounded-[10px] flex flex-col items-center justify-center h-[75px] w-[240px] shadow-sm">
                            <HeartHandshake size={20} className="text-[#E31E24] mb-2" strokeWidth={2.5} />
                            <div className="text-[13px] font-bold text-[#0F1B2D] text-center leading-tight">
                                Thank you for<br/>
                                choosing {settings.shopName || "Mogal Krupa CNC & Laser"}
                            </div>
                            <div className="w-8 h-[2.5px] bg-[#E31E24] mt-2 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* ===================================================
            FLEX SPACER
        ==================================================== */}

                <div className="flex-grow min-h-0" />

                {/* ===================================================
            7. FOOTER
        ==================================================== */}

                <div
                    className="
            w-full
            relative
            shrink-0
            bg-[#E50914]
            h-[34px]
            flex
            items-center
            justify-between
            pl-10
          "
                >
                    <p className="text-[10px] font-bold text-white tracking-[0.2em] uppercase">
                        {settings.shopName ||
                            "MOGAL KRUPA CNC & LASER"}
                    </p>

                    <div className="flex h-full">
                        <div
                            className="w-[15px] h-full bg-white/20"
                            style={{
                                clipPath:
                                    "polygon(100% 0, 0 100%, 100% 100%)",
                            }}
                        />

                        <div
                            className="w-[15px] h-full bg-white/40"
                            style={{
                                clipPath:
                                    "polygon(100% 0, 0 100%, 100% 100%)",
                            }}
                        />

                        <div
                            className="w-[30px] h-full bg-white"
                            style={{
                                clipPath:
                                    "polygon(100% 0, 0 100%, 100% 100%, 100% 0)",
                            }}
                        />
                    </div>
                </div>

                {/* ===================================================
            PRINT CSS
        ==================================================== */}

                <style
                    dangerouslySetInnerHTML={{
                        __html: `
              @page {
                size: A4 portrait;
                margin: 0;
              }

              .invoice-container {
                width: 210mm;
                height: 297mm;
                min-height: 297mm;
                max-height: 297mm;

                box-sizing: border-box;

                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }

              @media print {

                html,
                body,
                #root {
                  margin: 0 !important;
                  padding: 0 !important;

                  width: 210mm !important;
                  height: 297mm !important;

                  background: #ffffff !important;

                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }

                body {
                  overflow: hidden !important;
                }

                body * {
                  visibility: hidden;
                }

                .sidebar,
                .navbar,
                .print\\:hidden {
                  display: none !important;
                }

                .invoice-container,
                .invoice-container * {
                  visibility: visible;

                  box-sizing: border-box !important;

                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }

                .invoice-container {
                  position: absolute !important;

                  left: 0 !important;
                  top: 0 !important;

                  width: 210mm !important;
                  height: 297mm !important;

                  min-height: 297mm !important;
                  max-height: 297mm !important;

                  margin: 0 !important;
                  padding: 0 !important;

                  overflow: hidden !important;

                  box-shadow: none !important;

                  page-break-before: avoid !important;
                  page-break-after: avoid !important;
                  page-break-inside: avoid !important;

                  break-before: avoid-page !important;
                  break-after: avoid-page !important;
                  break-inside: avoid-page !important;
                }

                .break-inside-avoid {
                  break-inside: avoid !important;
                  page-break-inside: avoid !important;
                }

                .invoice-container table {
                  page-break-inside: auto;
                }

                .invoice-container thead {
                  display: table-header-group;
                }

                .invoice-container tr,
                .invoice-container td,
                .invoice-container th {
                  break-inside: avoid !important;
                  page-break-inside: avoid !important;
                }

                img {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
              }
            `,
                    }}
                />
            </div>
        );
    }
);

InvoiceTemplate.displayName =
    "InvoiceTemplate";

export default InvoiceTemplate;