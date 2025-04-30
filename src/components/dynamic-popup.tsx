"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X } from "lucide-react"
import { cn, getPopupSettings } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PopupTemplate, Popup } from "@/lib/types"
import { Dialog, DialogContent } from "./ui/dialog"
import { PopupSettingsSchema } from "@/lib/dtos"
import PopupComponent from "./popup-component"

interface DynamicPopupProps {
  popup: {
    id: string;
    content: PopupTemplate;
    metadata: PopupSettingsSchema;
    status: string;
  };
  onClose?: () => void
  onAction?: (actionType: string, data?: Popup) => void
}

export function DynamicPopup({ popup, onClose }: DynamicPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const settings = getPopupSettings(popup.metadata)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const scrollListenerRef = useRef<(() => void) | null>(null)
  const exitIntentListenerRef = useRef<((e: MouseEvent) => void) | null>(null)

  // Function to handle popup close
  const handleClose = useCallback(() => {
    setIsVisible(false)

    // Store the last shown time for frequency tracking
    if (settings.frequency !== "always") {
      localStorage.setItem(`popup_${popup.id}_last_shown`, new Date().toISOString())
    }

    // If it's a "once" popup, mark it as shown permanently
    if (settings.frequency === "once") {
      localStorage.setItem(`popup_${popup.id}_shown`, "true")
    }

    if (onClose) onClose()
  },[onClose, popup.id, settings.frequency])

  // Check if the popup should be shown based on frequency settings
  const shouldShowBasedOnFrequency = useCallback(() => {
    // If already shown in this component lifecycle, don't show again
    if (hasShown) return false

    // For "once" popups, check if it has been shown before
    if (settings.frequency === "once") {
      const shown = localStorage.getItem(`popup_${popup.id}_shown`)
      if (shown === "true") return false
    }

    // For "once-per-session" popups, check session storage
    if (settings.frequency === "once-per-session") {
      const shown = sessionStorage.getItem(`popup_${popup.id}_shown`)
      if (shown === "true") return false
    }

    // For "custom" frequency, check the last shown date
    if (settings.frequency === "custom" && settings.frequencyDays) {
      const lastShown = localStorage.getItem(`popup_${popup.id}_last_shown`)
      if (lastShown) {
        const daysSinceLastShown = Math.floor(
          (new Date().getTime() - new Date(lastShown).getTime()) / (1000 * 60 * 60 * 24),
        )
        if (daysSinceLastShown < settings.frequencyDays) return false
      }
    }

    return true
  }, [hasShown, popup.id, settings.frequency, settings.frequencyDays])

  // Setup trigger based on settings
  useEffect(() => {
    if (popup.status !== "Active" || !shouldShowBasedOnFrequency()) return

    // Clean up any existing listeners
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (scrollListenerRef.current) window.removeEventListener("scroll", scrollListenerRef.current)
    if (exitIntentListenerRef.current) document.removeEventListener("mouseleave", exitIntentListenerRef.current)

    // Set up the appropriate trigger
    switch (settings.trigger) {
      case "immediate":
        setIsVisible(true)
        setHasShown(true)
        break

      case "delay":
        { const delay = settings.triggerValue || 5
        timeoutRef.current = setTimeout(() => {
          setIsVisible(true)
          setHasShown(true)
        }, delay * 1000)
        break }

      case "scroll":
        { const scrollPercentage = settings.triggerValue || 50
        scrollListenerRef.current = () => {
          const scrollPosition = window.scrollY
          const windowHeight = window.innerHeight
          const documentHeight = document.documentElement.scrollHeight
          const scrolled = (scrollPosition / (documentHeight - windowHeight)) * 100

          if (scrolled >= scrollPercentage && !hasShown) {
            setIsVisible(true)
            setHasShown(true)
            window.removeEventListener("scroll", scrollListenerRef.current!)
          }
        }
        window.addEventListener("scroll", scrollListenerRef.current)
        break }

      case "exit-intent":
        exitIntentListenerRef.current = (e: MouseEvent) => {
          // Exit intent is detected when mouse leaves the top of the page
          if (e.clientY <= 0 && !hasShown) {
            setIsVisible(true)
            setHasShown(true)
            document.removeEventListener("mouseleave", exitIntentListenerRef.current!)
          }
        }
        document.addEventListener("mouseleave", exitIntentListenerRef.current)
        break
    }

    // Auto-close popup after duration (if set)
    if (settings.duration && settings.duration > 0) {
      const durationTimeout = setTimeout(() => {
        handleClose()
      }, settings.duration * 1000)

      return () => clearTimeout(durationTimeout)
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (scrollListenerRef.current) window.removeEventListener("scroll", scrollListenerRef.current)
      if (exitIntentListenerRef.current) document.removeEventListener("mouseleave", exitIntentListenerRef.current)
    }
  }, [handleClose, hasShown, popup.id, popup.status, settings, shouldShowBasedOnFrequency])

  // Mark as shown in session storage for once-per-session popups
  useEffect(() => {
    if (isVisible && settings.frequency === "once-per-session") {
      sessionStorage.setItem(`popup_${popup.id}_shown`, "true")
    }
  }, [isVisible, popup.id, settings.frequency])

  // Position classes based on settings
  const getPositionClasses = () => {
    switch (settings.position) {
      case "top-left":
        return "top-4 left-4"
      case "top-right":
        return "top-4 right-4"
      case "bottom-left":
        return "bottom-4 left-4"
      case "bottom-right":
        return "bottom-4 right-4"
      case "center":
      default:
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    }
  }

  // Animation classes based on settings
  const getAnimationClasses = () => {
    switch (settings.animation) {
      case "fade":
        return "animate-in fade-in duration-300"
      case "slide-up":
        return "animate-in slide-in-from-bottom duration-300"
      case "slide-down":
        return "animate-in slide-in-from-top duration-300"
      case "zoom":
        return "animate-in zoom-in duration-300"
      case "none":
      default:
        return ""
    }
  }

  if(!popup) return null

  // If using Dialog component for center position
  if (settings.position === "center") {
    return (
      <Dialog open={isVisible} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent
          className={cn("p-0 border-none overflow-hidden", getAnimationClasses())}
          style={{
            maxWidth: "90vw",
            width: "auto",
            zIndex: settings.zIndex || 9999,
          }}
        >
          <div className="relative p-6">
            {settings.showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            )}
            <PopupComponent {...popup.content.props} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!isVisible) return null

  return (
    <>
      {settings.showOverlay && (
        <div
          className="fixed inset-0 bg-black/50 animate-in fade-in duration-200"
          style={{ zIndex: (settings.zIndex || 9999) - 1 }}
          onClick={handleClose}
        />
      )}

      <div
        className={cn("fixed max-w-md w-full p-6 rounded-lg shadow-lg", getPositionClasses(), getAnimationClasses())}
        style={{
          backgroundColor: "#ffffff",
          zIndex: settings.zIndex || 9999,
        }}
      >
        <PopupComponent {...popup.content.props} />
      </div>
    </>
  )
}
