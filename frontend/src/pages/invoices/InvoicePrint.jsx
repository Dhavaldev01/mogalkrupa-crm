import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { invoiceService, settingsService } from "@/services";
import { Printer, Download, ArrowLeft, MessageCircle } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import InvoiceTemplate from "./component/InvoiceTemplate";
import { toast } from "sonner";
import { generateAndShareWhatsApp, normalizePhone } from "@/lib/whatsappHelper";

export default function InvoicePrint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);
  const previewViewportRef = useRef(null);
  const [mobilePreview, setMobilePreview] = useState({
    scale: 1,
    width: null,
    height: null,
  });

  // ============================
  // FETCH INVOICE
  // ============================
  const {
    data: res,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoiceService.getById(id),
    enabled: !!id,
  });

  // ============================
  // FETCH SETTINGS
  // ============================
  const { data: settingsRes } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsService.get(),
  });

  const invoice = res?.data?.data;
  const settings = settingsRes?.data?.data || {};

  // Keep the real invoice at A4 size, but scale its on-screen preview to fit
  // narrow mobile viewports. Print/PDF generation still uses the untouched
  // 210mm x 297mm InvoiceTemplate.
  useEffect(() => {
    const fitInvoicePreview = () => {
      const invoiceEl = printRef.current;
      const viewportEl = previewViewportRef.current;

      if (!invoiceEl || !viewportEl) return;

      const invoiceWidth = invoiceEl.offsetWidth;
      const invoiceHeight = invoiceEl.offsetHeight;
      const availableWidth = viewportEl.clientWidth;
      const isMobile = window.innerWidth <= 768;

      if (!isMobile || !invoiceWidth || availableWidth >= invoiceWidth) {
        setMobilePreview({ scale: 1, width: null, height: null });
        return;
      }

      const scale = Math.min(1, availableWidth / invoiceWidth);

      setMobilePreview({
        scale,
        width: invoiceWidth * scale,
        height: invoiceHeight * scale,
      });
    };

    const frame = requestAnimationFrame(fitInvoicePreview);
    window.addEventListener("resize", fitInvoicePreview);

    const observer = new ResizeObserver(fitInvoicePreview);
    if (previewViewportRef.current) observer.observe(previewViewportRef.current);
    if (printRef.current) observer.observe(printRef.current);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", fitInvoicePreview);
      observer.disconnect();
    };
  }, [invoice, settingsRes]);


  // ============================
  // PRINT
  // ============================
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: invoice
      ? `Invoice_${invoice.invoiceNumber}`
      : "Invoice",
  });

  // ============================
  // DOWNLOAD PDF
  // ============================
  const handleDownloadPDF = async () => {
    if (!printRef.current) {
      toast.error("Invoice is not ready.");
      return;
    }

    const toastId = toast.loading("Generating PDF...");

    try {
      const element = printRef.current;

      /*
       * Capture only InvoiceTemplate.
       * Action buttons / page background are NOT included.
       */
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: "#FFFFFF",

        width: element.scrollWidth,
        height: element.scrollHeight,

        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,

        scrollX: 0,
        scrollY: 0,

        imageTimeout: 15000,

        onclone: (clonedDocument) => {
          const clonedInvoice =
            clonedDocument.querySelector(".invoice-container");

          if (clonedInvoice) {
            clonedInvoice.style.margin = "0";
            clonedInvoice.style.boxShadow = "none";
            clonedInvoice.style.transform = "none";
          }
        },
      });

      if (!canvas.width || !canvas.height) {
        throw new Error("Invoice canvas could not be generated.");
      }

      /*
       * PNG gives noticeably better invoice/text quality than JPEG.
       */
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // ============================
      // A4 SIZE
      // ============================
      const pdfWidth = 210;
      const pdfHeight = 297;

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      /*
       * IMPORTANT:
       *
       * Fit the COMPLETE invoice inside ONE A4 page.
       *
       * Old code calculated heightLeft and called pdf.addPage().
       * Even a tiny overflow could therefore create a blank page 2.
       *
       * We intentionally do not call addPage() here.
       */
      const widthRatio = pdfWidth / imgWidth;
      const heightRatio = pdfHeight / imgHeight;

      const fitRatio = Math.min(widthRatio, heightRatio);

      const finalWidth = imgWidth * fitRatio;
      const finalHeight = imgHeight * fitRatio;

      /*
       * Center invoice horizontally.
       * Keep it at the top vertically.
       */
      const x = Math.max(0, (pdfWidth - finalWidth) / 2);
      const y = 0;

      pdf.addImage(
        imgData,
        "PNG",
        x,
        y,
        finalWidth,
        finalHeight,
        undefined,
        "FAST"
      );

      /*
       * NO pdf.addPage()
       *
       * Normal invoice = exactly one A4 PDF page.
       */

      pdf.save(
        `Invoice_${invoice?.invoiceNumber || "Download"}.pdf`
      );

      toast.success("PDF downloaded successfully", {
        id: toastId,
      });
    } catch (error) {
      console.error("PDF generation error:", error);

      toast.error("Failed to generate PDF", {
        id: toastId,
      });
    }
  };

  // ============================
  // WHATSAPP SHARE
  // ============================
  const handleWhatsAppShare = () => {
    generateAndShareWhatsApp(printRef.current, invoice, settings);
  };


  // ============================
  // LOADING
  // ============================
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F1ED]">
        <div className="text-center">
          <div className="font-bold text-[#0F172A]">
            Loading Invoice...
          </div>
        </div>
      </div>
    );
  }

  // ============================
  // ERROR
  // ============================
  if (isError || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F1ED]">
        <div className="text-center">
          <div className="font-bold text-[#E50914]">
            Invoice not found.
          </div>

          <button
            onClick={() => navigate("/invoices")}
            className="mt-4 px-4 py-2 rounded-lg bg-[#E50914] text-white text-sm font-semibold"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  // ============================
  // PAGE
  // ============================
  return (
    <div className="min-h-screen bg-[#F4F1ED] py-8 px-4 flex flex-col items-center print:bg-white print:p-0">

      {/* =====================================
          WEB ONLY ACTION BAR
      ====================================== */}
      <div className="w-[210mm] max-w-full mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">

        {/* BACK */}
        <button
          onClick={() => navigate("/invoices")}
          className="
            flex
            items-center
            gap-2
            text-[#64748B]
            hover:text-[#0F172A]
            font-semibold
            text-sm
            transition-colors
          "
        >
          <ArrowLeft size={16} />

          Back to Invoices
        </button>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">

          {/* PRINT */}
          <button
            onClick={handlePrint}
            className="
              flex
              items-center
              gap-2
              bg-white
              border
              border-[#E5E7EB]
              text-[#0F172A]
              py-2
              px-4
              rounded-lg
              text-sm
              font-semibold
              shadow-sm
              hover:bg-[#F8FAFC]
              transition-colors
            "
          >
            <Printer
              size={16}
              className="text-[#64748B]"
            />

            Print
          </button>

          {/* DOWNLOAD */}
          <button
            onClick={handleDownloadPDF}
            className="
              flex
              items-center
              gap-2
              bg-[#E50914]
              text-white
              py-2
              px-4
              rounded-lg
              text-sm
              font-semibold
              shadow-sm
              hover:bg-[#C90C15]
              transition-colors
            "
          >
            <Download size={16} />

            Download PDF
          </button>

          {/* WHATSAPP */}
          <button
            onClick={handleWhatsAppShare}
            disabled={!normalizePhone(invoice?.customerSnapshot?.phone)}
            title={!normalizePhone(invoice?.customerSnapshot?.phone) ? "Customer WhatsApp number not available" : ""}
            className="
              flex
              items-center
              gap-2
              bg-[#25D366]
              text-white
              py-2
              px-4
              rounded-lg
              text-sm
              font-semibold
              shadow-sm
              hover:bg-[#1DA851]
              transition-colors
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <MessageCircle size={16} />
            Send on WhatsApp
          </button>

        </div>
      </div>

      {/* =====================================
          INVOICE PREVIEW
      ====================================== */}

      <div
        ref={previewViewportRef}
        className="
          invoice-preview-viewport
          w-full
          flex
          justify-center
          overflow-hidden
          print:overflow-visible
        "
      >
        <div
          className="invoice-preview-wrapper print:shadow-none shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          style={{
            width: mobilePreview.width ? `${mobilePreview.width}px` : undefined,
            height: mobilePreview.height ? `${mobilePreview.height}px` : undefined,
          }}
        >
          <div
            className="invoice-preview-scale-stage"
            style={{
              width: "210mm",
              transform: `scale(${mobilePreview.scale})`,
              transformOrigin: "top left",
            }}
          >
            <InvoiceTemplate
              ref={printRef}
              invoice={invoice}
              settings={settings}
            />
          </div>
        </div>
      </div>

      {/* =====================================
          PRINT FIX
      ====================================== */}

      <style>
        {`
          @page {
            size: A4 portrait;
            margin: 0;
          }

          @media print {

            html,
            body,
            #root {
              margin: 0 !important;
              padding: 0 !important;

              width: 210mm !important;

              background: #ffffff !important;

              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            body {
              overflow: visible !important;
            }

            .invoice-preview-viewport {
              width: 210mm !important;
              display: block !important;
              overflow: visible !important;
            }

            .invoice-preview-wrapper {
              width: 210mm !important;
              height: 297mm !important;

              margin: 0 !important;
              padding: 0 !important;

              box-shadow: none !important;

              overflow: visible !important;
            }

            .invoice-preview-scale-stage {
              width: 210mm !important;
              height: 297mm !important;
              transform: none !important;
            }

            .invoice-container {
              width: 210mm !important;
              height: 297mm !important;

              min-height: 0 !important;
              max-height: 297mm !important;

              margin: 0 !important;
              padding: 0 !important;

              box-shadow: none !important;

              overflow: hidden !important;

              box-sizing: border-box !important;

              page-break-before: avoid !important;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;

              break-before: avoid-page !important;
              break-after: avoid-page !important;
              break-inside: avoid-page !important;

              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .invoice-container * {
              box-sizing: border-box !important;
            }

            .print\\:hidden {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}