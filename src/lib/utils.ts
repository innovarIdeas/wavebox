import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PopupSettingsSchema } from "./dtos";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve(`Lat: ${latitude}, Lon: ${longitude}`);
        },
        (error) => {
          reject(error.message);
        }
      );
    } else {
      reject("Geolocation is not supported by your browser.");
    }
  });
}

/**
 * Utility function to access and validate popup settings
 * @param metadata The metadata object from the popup
 * @returns Typed PopupSettings object
 */
export function getPopupSettings(metadata: PopupSettingsSchema): PopupSettingsSchema {

  const defaultSettings: PopupSettingsSchema = {
    name: "Untitled Popup",
    status: "Inactive",
    position: "center",
    trigger: "immediate",
    duration: 0,
    frequency: "once",
    showOnMobile: true,
    showOnDesktop: true,
    targetPages: "all",
    targetAudience: "all",
    animation: "fade",
    zIndex: 9999,
    showOverlay: true,
    showCloseButton: true
  }

  // If metadata is null or not an object, return defaults
  if (!metadata || typeof metadata !== "object") {
    return defaultSettings
  }

  // Merge with defaults to ensure all properties exist
  return {
    ...defaultSettings,
    ...metadata,
  }
}

/**
 * Check if a popup should be shown based on its settings
 * @param settings The popup settings
 * @param context The current context (page, device, etc.)
 * @returns boolean indicating if popup should be shown
 */
export function shouldShowPopup(
  settings: PopupSettingsSchema,
  context: {
    path: string
    isMobile: boolean
    isNewVisitor?: boolean
    lastShown?: Date
  },
): boolean {
  const { path, isMobile, isNewVisitor, lastShown } = context

  // Check device targeting
  if (isMobile && !settings.showOnMobile) return false
  if (!isMobile && !settings.showOnDesktop) return false

  // Check page targeting
  if (settings.targetPages === "specific" && settings.specificPages) {
    const matchesPage = settings.specificPages.some((page: string) => path === page || path.startsWith(page))
    if (!matchesPage) return false
  }

  // Check audience targeting
  if (settings.targetAudience === "new" && !isNewVisitor) return false
  if (settings.targetAudience === "returning" && isNewVisitor) return false

  // Check date range
  const now = new Date()
  if (settings.startDate && now < settings.startDate) return false
  if (settings.endDate && now > settings.endDate) return false

  // Check frequency
  if (settings.frequency === "once" && lastShown) return false
  if (settings.frequency === "custom" && lastShown && settings.frequencyDays) {
    const daysSinceLastShown = Math.floor((now.getTime() - lastShown.getTime()) / (1000 * 60 * 60 * 24))
    if (daysSinceLastShown < settings.frequencyDays) return false
  }

  return true
}
