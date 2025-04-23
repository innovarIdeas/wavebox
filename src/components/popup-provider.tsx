import { useState, useEffect, type ReactNode } from "react"
import { DynamicPopup } from "./dynamic-popup"
import type { Popup } from "@/lib/types"
import type { FetchActivePopupsSchema } from "@/lib/dtos"
import { fetchActivePopups } from "@/api/popupService"


interface PopupProviderProps {
  path: string;
  children: ReactNode;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // Update the state with the current value
    const updateMatches = () => {
      setMatches(media.matches)
    }

    // Set the initial value
    updateMatches()

    // Add the change listener
    media.addEventListener("change", updateMatches)

    // Clean up
    return () => {
      media.removeEventListener("change", updateMatches)
    }
  }, [query])

  return matches
}

export function PopupProvider({ path, children }: PopupProviderProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isNewVisitor, setIsNewVisitor] = useState(false)
  const [activePopups, setActivePopups] = useState<Popup[]>([])
  const [currentPopupIndex, setCurrentPopupIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is a new visitor
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem(`visited`)
    setIsNewVisitor(!hasVisitedBefore)

    if (!hasVisitedBefore) {
      localStorage.setItem(`visited`, "true")
    }
  }, [])

  // Fetch active popups for the current page
  useEffect(() => {
    const getActivePopups = async () => {
      if (!path) return

      setIsLoading(true)
      try {
        const fetchParams: FetchActivePopupsSchema = {
          path,
          isMobile,
          isNewVisitor,
        }

        const popups = await fetchActivePopups(fetchParams)
        setActivePopups(popups)
      } catch (error) {
        console.error("Failed to fetch active popups:", error)
        setActivePopups([])
      } finally {
        setIsLoading(false)
      }
    }

    getActivePopups()
  }, [path, isMobile, isNewVisitor])

  // Show popups one at a time
  useEffect(() => {
    if (activePopups.length > 0 && currentPopupIndex === null && !isLoading) {
      setCurrentPopupIndex(0)
    }
  }, [activePopups, currentPopupIndex, isLoading])

  // Handle popup close
  const handlePopupClose = () => {
    // Move to the next popup if available
    if (currentPopupIndex !== null && currentPopupIndex < activePopups.length - 1) {
      setCurrentPopupIndex(currentPopupIndex + 1)
    } else {
      setCurrentPopupIndex(null)
    }
  }

  return (
    <>
      {children}

      {currentPopupIndex !== null && activePopups[currentPopupIndex] && (
        <DynamicPopup
          popup={activePopups[currentPopupIndex]}
          onClose={handlePopupClose}
          onAction={(actionType, data) => {
            // Handle popup actions (e.g., form submissions, button clicks)
            console.log("Popup action:", actionType, data)
          }}
        />
      )}
    </>
  )
}
