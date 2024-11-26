import { Navbar } from "@/components/shared/NavBar"; 
import MobileNav from "@/components/shared/MobileNav";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAniList } from "../../../lib/anilist/useAnilist";
import { getHeaders, getRandomId } from "@/utils/imageUtils";
import HTMLFlipBook from "react-pageflip";

export default function FirstPanel({
  aniId,
  data,
  hasRun,
  currentId,
  chapter,
  paddingX,
  session,
  mobileVisible,
  setMobileVisible,
}) {
  const { markProgress } = useAniList(session);
  const imageRefs = useRef([]);
  const [imageQuality, setImageQuality] = useState(50);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Set Dynamic Padding
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      root.style.setProperty("--dynamic-padding", `${paddingX}px`);
    }
  }, [paddingX]);

  // Mark Progress
  useEffect(() => {
    if (hasRun.current) return;

    if (session) {
      if (aniId?.length > 6) return;
      const currentChapter = chapter.chapters?.find((x) => x.id === currentId);
      if (currentChapter) {
        const chapterNumber =
          currentChapter.number ?? chapter.chapters.indexOf(currentChapter) + 1;
        markProgress({ mediaId: aniId, progress: chapterNumber });
        console.log("marking progress");
      }
    }

    hasRun.current = true;
  }, [data, session, chapter]);

  // Check Device Type (Mobile or Web)
  useEffect(() => {
    const checkDeviceType = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on mount
    checkDeviceType();

    // Add event listener for resizing
    window.addEventListener("resize", checkDeviceType);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", checkDeviceType);
    };
  }, []);

  // Return null or load the component only if it's mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // If no data or data is not an array, show the message
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <section className="flex-grow flex flex-col items-center justify-center relative mt-4">
        {/* Render Navbar or MobileNav based on the screen size */}
        {isMobile ? (
          <MobileNav />
        ) : (
          <Navbar
          withNav={true}
          shrink={true}
          paddingY="py-1 lg:py-3"
          className="pb-4"  // Add padding-bottom here
        />
        )}
        <div className="flex justify-center items-center h-full text-center">
          <p>No content available to display.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-grow flex flex-col items-center relative mt-2">
      {/* Render Navbar or MobileNav based on the screen size */}
      {isMobile ? (
        <MobileNav />
      ) : (
        <Navbar
          withNav={true}
          paddingY="py-1 lg:py-3"
        />
      )}

      {isMobile ? (
        // Mobile: Just display images without scroll
        <div className="w-full flex flex-col items-center justify-center">
          {data.map((i, index) => (
            <div
              key={getRandomId()}
              className="w-screen lg:h-auto lg:w-full flex justify-center items-center"
              ref={(el) => (imageRefs.current[index] = el)}
            >
              <Image
                src={`https:///shiroko.co/api/image/?url=${encodeURIComponent(
                  i.url
                )}${
                  i?.headers?.Referer
                    ? `&headers=${encodeURIComponent(
                        JSON.stringify(i?.headers)
                      )}`
                    : `&headers=${encodeURIComponent(
                        JSON.stringify(getHeaders(chapter.providerId))
                      )}`}`}
                alt={index}
                width={500}
                height={800}
                quality={imageQuality}
                onClick={() => setMobileVisible(!mobileVisible)}
                className="w-auto max-w-full h-auto max-h-full bg-[#bbb] object-contain"
              />
            </div>
          ))}
        </div>
      ) : (
        // Web: HTML Flipbook
        <HTMLFlipBook width={500} height={680} className="mt-12 overflow-hidden">
          {data.map((i, index) => (
            <div key={getRandomId()} className="flip-book-page">
              <Image
                src={`https:///shiroko.co/api/image/?url=${encodeURIComponent(
                  i.url
                )}${
                  i?.headers?.Referer
                    ? `&headers=${encodeURIComponent(
                        JSON.stringify(i?.headers)
                      )}`
                    : `&headers=${encodeURIComponent(
                        JSON.stringify(getHeaders(chapter.providerId))
                      )}`}`}
                alt={index}
                width={500}
                height={680}
                quality={imageQuality}
              />
            </div>
          ))}
        </HTMLFlipBook>
      )}
    </section>
  );
}
