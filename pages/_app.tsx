import "../styles/globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/router";
import { AnimatePresence, motion as m } from "framer-motion";
import NextNProgress from "nextjs-progressbar";
import { SessionProvider } from "next-auth/react";
import { SkeletonTheme } from "react-loading-skeleton";
import SearchPalette from "@/components/searchPalette";
import { SearchProvider } from "@/lib/context/isOpenState";
import { WatchPageProvider } from "@/lib/context/watchPageProvider";
import { useEffect } from "react";
import { unixTimestampToRelativeTime } from "@/utils/getTimes";
// import SecretPage from "@/components/secret";
import { Toaster, toast } from "sonner";
import type { AppProps } from "next/app";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();

  useEffect(() => {
    async function getBroadcast() {
      try {
        const res = await fetch("/api/v2/admin/broadcast", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Broadcast-Key": "get-broadcast",
          },
        });
        const data = await res.json();
        if (data?.show === true) {
          toast.message(`Update Notice!`, {
            position: "bottom-right",
            important: true,
            duration: 100000,
            className: "font-karla",
            description: `${data.message} ${
              data?.startAt ? unixTimestampToRelativeTime(data.startAt) : ""
            }`,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
    getBroadcast();
  }, []);

  const handleCheatCodeEntered = () => {
    alert("Cheat code entered!"); // You can replace this with your desired action
  };

  return (
    <>
      <SessionProvider session={session}>
        <SearchProvider>
          <WatchPageProvider>
            <AnimatePresence mode="wait">
              <SkeletonTheme baseColor="#232329" highlightColor="#2a2a32">
                <Toaster richColors theme="dark" closeButton />
                {/* <SecretPage
                  cheatCode={"aofienaef"}
                  onCheatCodeEntered={handleCheatCodeEntered}
                /> */}
                <m.div
                  key={`route-${router.route}`}
                  transition={{ duration: 0.5 }}
                  initial="initialState"
                  animate="animateState"
                  exit="exitState"
                  variants={{
                    initialState: {
                      opacity: 0,
                    },
                    animateState: {
                      opacity: 1,
                    },
                    exitState: {},
                  }}
                  className="z-50 w-screen"
                >
                  <NextNProgress
                    color="#BA66DB"
                    startPosition={0.3}
                    stopDelayMs={200}
                    height={3}
                    showOnShallow={true}
                  />

                  <SearchPalette />
                  <Component {...pageProps} />
                </m.div>
              </SkeletonTheme>
            </AnimatePresence>
          </WatchPageProvider>
        </SearchProvider>
      </SessionProvider>
    </>
  );
}
