import { useEffect, useRef, useState } from "react";
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAniList } from "../../../lib/anilist/useAnilist";
import { getHeaders, getRandomId } from "@/utils/imageUtils";
import HTMLFlipBook from "react-pageflip";
import { Navbar } from "@/components/shared/NavBar";
import MobileNav from "@/components/shared/MobileNav";

export default function FirstPanel({
  aniId,
  data,
  hasRun,
  currentId,
  seekPage,
  setSeekPage,
  visible,
  setVisible,
  chapter,
  nextChapter,
  prevChapter,
  paddingX,
  session,
  mobileVisible,
  setMobileVisible,
  setCurrentPage,
  number,
  mangadexId,
}) {
  const { markProgress } = useAniList(session);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageRefs = useRef([]);
  const scrollContainerRef = useRef();
  const [imageQuality, setImageQuality] = useState(80);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = scrollContainerRef.current.scrollTop;
      let index = 0;

      for (let i = 0; i < imageRefs.current.length; i++) {
        const img = imageRefs.current[i];
        if (
          scrollTop >= img?.offsetTop - scrollContainerRef.current.offsetTop &&
          scrollTop <
            img.offsetTop -
              scrollContainerRef.current.offsetTop +
              img.offsetHeight
        ) {
          index = i;
          break;
        }
      }

      if (index === data?.length - 3 && !hasRun.current) {
        if (session) {
          if (aniId?.length > 6) return;
          const currentChapter = chapter.chapters?.find(
            (x) => x.id === currentId
          );
          if (currentChapter) {
            const chapterNumber =
              currentChapter.number ?? chapter.chapters.indexOf(currentChapter) + 1;
            markProgress({ mediaId: aniId, progress: chapterNumber });
            console.log("marking progress");
          }
        }
        hasRun.current = true;
      }

      setCurrentPage(index + 1);
      setCurrentImageIndex(index);
      setSeekPage(index);
    };

    scrollContainerRef?.current?.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", handleScroll, {
          passive: true,
        });
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, session, chapter]);

  useEffect(() => {
    if (scrollContainerRef.current && seekPage !== currentImageIndex) {
      const targetImageRef = imageRefs.current[seekPage];
      if (targetImageRef) {
        scrollContainerRef.current.scrollTo({
          top: targetImageRef.offsetTop - scrollContainerRef.current.offsetTop,
          behavior: "smooth",
        });
      }
    }
  }, [seekPage, currentImageIndex]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, [currentId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      root.style.setProperty("--dynamic-padding", `${paddingX}px`);
    }
  }, [paddingX]);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      handleResize(); // Set initial state
      window.addEventListener("resize", handleResize); // Listen for window resize
      return () => window.removeEventListener("resize", handleResize); // Cleanup
    }
  }, []);

  return (
    <section className="flex-grow flex flex-col items-center relative mt-2">
      {/* Render Navbar or MobileNav based on the screen size */}
      {isMobile ? (
        <MobileNav />
      ) : (
        <Navbar withNav={true} paddingY="py-1 lg:py-3" />
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
                  i.url,
                )}${
                  i?.headers?.Referer
                    ? `&headers=${encodeURIComponent(
                        JSON.stringify(i?.headers),
                      )}`
                    : `&headers=${encodeURIComponent(
                        JSON.stringify(getHeaders(chapter.providerId))
                      )}`
                    }`}
                alt={index}
                width={500}
                height={800}
                quality={imageQuality}
                onClick={() => setMobileVisible(!mobileVisible)}
                className="w-auto max-w-full h-auto max-h-full bg-[#bbb] object-contain"
                priority
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
                  i.url,
                )}${
                  i?.headers?.Referer
                    ? `&headers=${encodeURIComponent(
                        JSON.stringify(i?.headers),
                      )}`
                    : `&headers=${encodeURIComponent(
                        JSON.stringify(getHeaders(chapter.providerId))
                      )}`
                    }`}
                alt={index}
                width={500}
                height={680}
                quality={imageQuality}
                priority
              />
            </div>
          ))}
        </HTMLFlipBook>
      )}
    </section>
  );
}