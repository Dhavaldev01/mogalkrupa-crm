import { usePermissionContext } from "@/context/PermissionContext";
import { clsx } from "clsx";
import { differenceInSeconds, format, formatDistanceToNowStrict, isThisYear, isToday, isYesterday } from "date-fns";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  // const store = localStorage.getItem("store");
  // return !!token && !!store;
  const loginType = localStorage.getItem("loginType");

  if (!token || !loginType) {
    return false;
  }

  if (loginType == "store") {
    return !!token && !!localStorage.getItem("store");
  }

  if (loginType == "employee") {
    return !!token && !!localStorage.getItem("user");
  }

  return false;
};

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCount(value) {
  if (value == null || value === "") return "00"

  const num = Number(value)

  if (isNaN(num)) return "00"

  // Single digit number
  if (num < 10 && Number.isInteger(num)) {
    return num.toString().padStart(2, "0")
  }

  return num.toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(num) ? 0 : 2,
    maximumFractionDigits: 2,
  })
}

export function formatRupees(value) {
  if (value == null || value === "" || isNaN(value)) return "₹ 00";

  const num = Number(value);

  // zero case
  if (num === 0) return "₹ 00";

  const formattedNumber = Math.abs(num).toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(num) ? 0 : 2,
    maximumFractionDigits: 2,
  });

  if (num < 0) {
    return `- ₹ ${formattedNumber}`;
  }

  return `₹ ${formattedNumber}`;
}

export const safeNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

export const formatCurrency = (value) => {
  const amount = Number(value);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
};

export function formatBadgeCount(value, max = 99) {
  if (value == null || isNaN(value)) return "00";

  const num = Number(value);

  if (num <= 0) return "00";
  if (num < 10) return num.toString().padStart(2, "0");
  if (num <= max) return num.toString();

  return `${max}+`;
}

export function getInitials(fullName) {
  if (!fullName) return ""

  const safeName = String(fullName).trim()
  const parts = safeName.split(" ").filter(Boolean)

  const first = parts[0]?.[0] || ""
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : ""

  return (first + last).toUpperCase()
}

export const formatDateTime = (inputDate) => {
  if (!inputDate) return ""

  const date = new Date(inputDate)
  if (isNaN(date.getTime())) return ""

  const day = date.getDate().toString().padStart(2, "0")
  const month = date.toLocaleString("en-US", { month: "short" })
  const year = date.getFullYear()

  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, "0")
  const ampm = hours >= 12 ? "PM" : "AM"

  hours = hours % 12
  hours = hours ? hours : 12

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`

  return `${day} ${month}, ${year} ${formattedTime}`
}

export const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, "");
  const limited = digits.substring(0, 16);
  const formatted = limited.replace(/(.{4})/g, "$1 ").trim();

  return formatted;
};

export const formatExpiryDate = (value) => {
  let digits = value.replace(/\D/g, "");
  digits = digits.substring(0, 6);

  if (digits.length >= 1) {
    let month = digits.substring(0, 2);

    if (month.length === 1) {
      if (parseInt(month, 10) > 1) {
        month = "0" + month;
        digits = month + digits.substring(1);
      }
    }

    if (month.length === 2) {
      let m = parseInt(month, 10);
      if (m === 0) month = "01";
      if (m > 12) month = "12";
      digits = month + digits.substring(2);
    }
  }

  if (digits.length <= 2) return digits;
  return `${digits.substring(0, 2)} / ${digits.substring(2)}`;
};

export const formatCVV = (value, maxLength = 4) => {
  const digits = value.replace(/\D/g, "");
  return digits.substring(0, maxLength);
};

// breckPoints
export function useResponsive() {
  const [state, setState] = useState({
    isXs: false,
    isSm: false,
    isMd: false,
    isLg: false,
    isXl: false,
    is2Xl: false,
  });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;

      setState({
        isXs: w < 640,
        isSm: w <= 640,
        isMd: w <= 768,
        isLg: w <= 1024,
        isXl: w <= 1280,
        is2Xl: w <= 1536,
        isDeskTab: w > 767,
      });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return state;
}

export const formatDate = (inputDate) => {
  if (!inputDate) return ""

  const date = new Date(inputDate)
  if (isNaN(date.getTime())) return ""

  const day = date.getDate().toString().padStart(2, "0")
  const month = date.toLocaleString("en-US", { month: "short" })
  const year = date.getFullYear()

  return `${day} ${month}, ${year}`
}


export function formatIndianMobile(number) {
  if (!number) return ""

  // Convert to string & remove all non-digits
  const digits = number.toString().replace(/\D/g, "")

  // Get last 10 digits (ignore +91 or extra)
  const mobile = digits.slice(-10)

  if (mobile.length !== 10) return number // fallback if invalid

  const firstPart = mobile.slice(0, 5)
  const secondPart = mobile.slice(5)

  return `+91 ${firstPart} ${secondPart}`
}

export function toTitleCase(text) {
  return text?.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const formatCompactNumber = (value) => {
  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toFixed(1).replace(".0", "")}T`;
  }

  if (absValue >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1).replace(".0", "")}B`;
  }

  if (absValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(".0", "")}M`;
  }

  if (absValue >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(".0", "")}K`;
  }

  return value.toString();
};

export const notificationDateTime = (date) => {
  const value = new Date(date);

  if (isToday(value)) {
    const seconds = differenceInSeconds(new Date(), value);

    if (seconds < 60) {
      return "Just now";
    }

    return formatDistanceToNowStrict(value, {
      addSuffix: true,
    })
      .replace("minutes", "min")
      .replace("minute", "min");
  }

  if (isYesterday(value)) {
    return `Yesterday ${format(value, "h:mm a")}`;
  }

  if (isThisYear(value)) {
    return format(value, "dd MMM, h:mm a");
  }

  return format(value, "dd MMM yyyy, h:mm a");
};

export const useStoreType = () => {
  const { storeType } = usePermissionContext();

  const isVisible = (...types) => types.includes(storeType);

  return {
    storeType,
    isRent: storeType === 1,
    isRetail: storeType === 2,
    isBoth: storeType === 3,
    showRent: isVisible(1, 3),
    showRetail: isVisible(2, 3),
    isVisible,
  };
};

// export const downloadPdf = async (content, fileName = 'document.pdf', customOptions = {}) => {
//   if (!content) return;

//   const htmlString = typeof content === 'string' ? content : content.outerHTML;

//   // 1. Completely isolated hidden iframe create karo
//   const iframe = document.createElement('iframe');
//   iframe.style.position = 'fixed';
//   iframe.style.right = '100%';
//   iframe.style.bottom = '100%';
//   iframe.style.width = '800px';
//   iframe.style.height = '1000px';
//   iframe.style.border = 'none';

//   document.body.appendChild(iframe);

//   // 2. iframe ni andar pure Clean HTML inject karo (vagar koi parent app CSS/Tailwind variables e)
//   const iframeDoc = iframe.contentWindow.document;
//   iframeDoc.open();
//   iframeDoc.write(`
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <style>
//                 * {
//                     box-sizing: border-box;
//                 }
//                 body {
//                     margin: 0;
//                     padding: 20px;
//                     background-color: #ffffff !important;
//                     color: #000000 !important;
//                     font-family: Arial, sans-serif;
//                 }
//             </style>
//         </head>
//         <body>
//             <div id="pdf-content">${htmlString}</div>
//         </body>
//         </html>
//     `);
//   iframeDoc.close();

//   // 3. Iframe content and images render thavano wait karo
//   await new Promise((resolve) => setTimeout(resolve, 300));

//   const elementToPrint = iframeDoc.getElementById('pdf-content');

//   // 4. html2pdf Options
//   const defaultOptions = {
//     margin: 5,
//     filename: fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`,
//     image: { type: 'jpeg', quality: 0.98 },
//     html2canvas: {
//       scale: 2,
//       useCORS: true,
//       backgroundColor: '#ffffff',
//       windowWidth: 800
//     },
//     jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
//     ...customOptions
//   };

//   try {
//     await html2pdf().set(defaultOptions).from(elementToPrint).save();
//   } catch (error) {
//     console.error('PDF Generation Error:', error);
//   } finally {
//     // Cleanup iframe
//     if (document.body.contains(iframe)) {
//       document.body.removeChild(iframe);
//     }
//   }
// };

export const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Geolocation is not supported."));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("Location permission is required to login."));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("Unable to get your location."));
            break;
          case error.TIMEOUT:
            reject(new Error("Location request timed out."));
            break;
          default:
            reject(new Error("Failed to get location."));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

// export const getLocation = () => {
//   return new Promise((resolve) => {
//     if (!navigator.geolocation) {
//       return resolve({
//         latitude: null,
//         longitude: null,
//         accuracy: null,
//       });
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         resolve({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//           accuracy: position.coords.accuracy,
//         });
//       },
//       (error) => {
//         console.warn("Location error:", error.message);
//         resolve({
//           latitude: null,
//           longitude: null,
//           accuracy: null,
//         });
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0,
//       }
//     );
//   });
// };

export const getAddress = async (lat, lng) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
    {
      headers: {
        "Accept": "application/json",
      },
    }
  );

  const data = await res.json();

  return {
    city: data.address.state_district || "",
    state: data.address.state || "",
    country: data.address.country || "",
    pincode: data.address.postcode || "",
  };
};

export const toISOStringOrNull = (date) => {
  if (!date) return null;

  const parsedDate = new Date(date);

  return isNaN(parsedDate.getTime())
    ? null
    : parsedDate.toISOString();
};

export const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  const platform = navigator.platform || "";

  let deviceType = "Desktop";

  const isTablet =
    /iPad|Tablet|PlayBook|Silk/i.test(ua) ||
    (
      /Android/i.test(ua) &&
      !/Mobile/i.test(ua)
    );

  const isMobile =
    /Mobi|Android|iPhone|iPod|Windows Phone/i.test(ua);

  if (isTablet) {
    deviceType = "Tablet";
  } else if (isMobile) {
    deviceType = "Mobile";
  }

  let browser = "Unknown";

  if (/Edg\//i.test(ua)) {
    browser = "Microsoft Edge";
  } else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) {
    browser = "Opera";
  } else if (/Chrome\//i.test(ua)) {
    browser = "Google Chrome";
  } else if (/Firefox\//i.test(ua)) {
    browser = "Mozilla Firefox";
  } else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) {
    browser = "Safari";
  }

  let os = "Unknown";

  if (/Windows NT/i.test(ua)) {
    os = "Windows";
  } else if (/Android/i.test(ua)) {
    os = "Android";
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    os = "iOS";
  } else if (/Mac OS X/i.test(ua)) {
    os = "macOS";
  } else if (/Linux/i.test(ua)) {
    os = "Linux";
  }

  return {
    deviceType,
    browser,
    os,
    userAgent: ua,
    platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  };
};