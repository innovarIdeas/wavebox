import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PopupViewProps } from "@/lib/types";

const PopupComponent: React.FC<PopupViewProps> = ({
  title,
  description,
  mediaSrc,
  mediaType = "image",
  buttonText,
  onButtonClick,
  onClose,
  // onClick,
  imagePosition = "left",
  className = "bg-[#f3e8ff]",
  style,
  containerClassName,
  containerStyle,
  imageWrapperClassName,
  imageClassName,
  videoClassName,
  contentWrapperClassName,
  contentWrapperStyle,
  titleClassName,
  descriptionClassName,
  buttonClassName = "bg-primaryTheme-500 hover:bg-primaryTheme-600",
  buttonTextClassName,
  closeButtonClassName = "bg-primaryTheme-500 hover:bg-primaryTheme-600",
  metadata,
  type = "builder",
  onSelectElementById,
}) => {
  const handleClose = () => {
    onClose?.();
  };

  const handleButtonClick = () => {
    onButtonClick?.();
  };

  const effectiveMediaType = type === "builder" || type === "preview" ? (mediaType ?? "image") : mediaType;

  const handleClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest("div")?.classList.contains("relative")) {
      onSelectElementById?.("popup-container");
    } else if (target.closest("div")?.id === "popup-container-inner") {
      onSelectElementById?.("popup-container-inner");
    }
  };

  return (
    <div
      className={cn(
        "flex h-[450px] w-full max-w-[550px] items-center justify-center px-6 py-4 shadow-lg transition-all duration-300",
        className
      )}
      style={style}
      onClick={handleClick}
      id='popup-container'
    >
      <div
        className={cn(
          "relative flex h-full w-full flex-col items-stretch overflow-hidden rounded-lg sm:flex-row",
          containerClassName,
          {
            "flex-col sm:flex-row-reverse": imagePosition === "right",
          }
        )}
        style={containerStyle}
        id='popup-container-inner'
      >
        {(type === "builder" || type === "preview" || metadata?.showCloseButton !== false) && (
          <button
            onClick={handleClose}
            className={cn(
              `absolute ${imagePosition === "left" ? "right-2" : "left-2"} top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-opacity-50 transition-colors hover:bg-opacity-70`,
              closeButtonClassName
            )}
            aria-label='Close'
            id='popup-close-button'
          >
            <X className='h-3 w-3 text-white' />
          </button>
        )}

        {mediaSrc && (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center overflow-hidden sm:w-1/2",
              imageWrapperClassName
            )}
          >
            {effectiveMediaType === "image" ? (
              <img
                src={mediaSrc}
                alt=''
                className={cn("h-full w-full object-cover", imageClassName)}
                width={500}
                height={500}
                loading='lazy'
                id='popup-image'
              />
            ) : (
              <video
                src={mediaSrc}
                className={cn("h-full w-full object-cover", videoClassName)}
                controls
                autoPlay
                muted
                loop
                id='popup-video'
              />
            )}
          </div>
        )}

        <div
          className={cn(
            "flex flex-col justify-center bg-white p-6 md:p-8",
            mediaSrc ? "w-full sm:w-1/2" : "w-full",
            contentWrapperClassName
          )}
          style={contentWrapperStyle}
          id='popup-content-wrapper'
        >
          <h2 className={cn("mb-4 text-lg font-bold tracking-tight md:text-xl", titleClassName)} id='popup-title'>
            {title}
          </h2>
          <p className={cn("mb-4 text-sm md:text-base", descriptionClassName)} id='popup-description'>
            {description}
          </p>
          <Button
            onClick={handleButtonClick}
            className={cn("flex w-full self-center rounded-full", buttonClassName)}
            id='popup-button'
          >
            <span className={cn("text-white", buttonTextClassName)} id='popup-button-text'>
              {buttonText}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopupComponent;
