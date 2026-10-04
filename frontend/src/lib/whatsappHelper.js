import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

export const normalizePhone = (phone) => {
  if (!phone) return null;

  const cleaned = phone.toString().replace(/\D/g, "");

  // Backend stores Indian mobile as 10 digits
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }

  // Already contains Indian country code
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return cleaned;
  }

  return null;
};

export const generateAndShareWhatsApp = async (printElement, invoice, settings, toastMessage = "Preparing WhatsApp share...") => {
  if (!printElement) {
    toast.error("Invoice is not ready.");
    return;
  }

  const customerPhone = invoice?.customerSnapshot?.phone;
  const whatsappNumber = normalizePhone(customerPhone);

  if (!whatsappNumber) {
    toast.error("Customer WhatsApp number not available");
    return;
  }

  const toastId = toast.loading(toastMessage);

  try {
    const canvas = await html2canvas(printElement, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: "#FFFFFF",
      width: printElement.scrollWidth,
      height: printElement.scrollHeight,
      windowWidth: printElement.scrollWidth,
      windowHeight: printElement.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      imageTimeout: 15000,
      onclone: (clonedDocument) => {
        const clonedInvoice = clonedDocument.querySelector(".invoice-container");
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

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pdfWidth = 210;
    const pdfHeight = 297;
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const fitRatio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const finalWidth = imgWidth * fitRatio;
    const finalHeight = imgHeight * fitRatio;
    const x = Math.max(0, (pdfWidth - finalWidth) / 2);

    pdf.addImage(imgData, "PNG", x, 0, finalWidth, finalHeight, undefined, "FAST");
    const pdfBlob = pdf.output("blob");
    const filename = `Invoice_${invoice?.invoiceNumber || "Download"}.pdf`;
    const file = new File([pdfBlob], filename, { type: "application/pdf" });
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
      toast.dismiss(toastId);
      try {
        await navigator.share({
          files: [file],
          title: filename
        });
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.error("Error sharing", e);
        }
      }
    } else {
      pdf.save(filename);
      toast.success("PDF downloaded. Opening WhatsApp...", { id: toastId });
      const waLink = `https://wa.me/${whatsappNumber}`;
      const whatsappWindow = window.open(waLink, 'invoiceWhatsApp');
      whatsappWindow?.focus();
    }
  } catch (error) {
    console.error("WhatsApp share error:", error);
    toast.error("Failed to prepare WhatsApp share", { id: toastId });
  }
};
