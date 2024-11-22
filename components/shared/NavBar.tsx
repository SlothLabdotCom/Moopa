import { useSearch } from "@/lib/context/isOpenState";
import { getCurrentSeason } from "@/utils/getTimes";
import { ArrowLeftIcon, ArrowUpCircleIcon } from "@heroicons/react/20/solid";
import { UserIcon } from "@heroicons/react/24/solid";
import { signIn, signOut, useSession, getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useEffect, useState } from "react";
import { AniListInfoTypes } from "types/info/AnilistInfoTypes";
import Logo from '../../public/logo.png';
import axios from "axios";
import { Session } from 'next-auth';

const getScrollPosition = (el: Window | Element = window) => {
  if (el instanceof Window) {
    return { x: el.pageXOffset, y: el.pageYOffset };
  } else {
    return { x: el.scrollLeft, y: el.scrollTop };
  }
};

type NavbarProps = {
  info?: AniListInfoTypes | null;
  scrollP?: number;
  toTop?: boolean;
  withNav?: boolean;
  paddingY?: string;
  home?: boolean;
  back?: boolean;
  manga?: boolean;
  shrink?: boolean;
  bgHover?: boolean;
};

export function Navbar({
  info = null,
  scrollP = 200,
  toTop = false,
  withNav = false,
  paddingY = "py-3",
  home = false,
  back = false,
  manga = false,
  shrink = false,
  bgHover = false,
}: NavbarProps) {

  const { data: session, update } = useSession() as {
    data: Session | null;
    update: (data?: Partial<Session>) => Promise<Session | null>;
  };

  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState<{ x: number; y: number } | undefined>();
  const { setIsOpen } = useSearch();
  const [isRegistering, setIsRegistering] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleModalToggle = () => {
    setModalOpen(!modalOpen);
  };

  const handleRegisterToggle = () => {
    setIsRegistering(!isRegistering);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const token = session?.user.accessToken;

      // Register user if in registering mode
      if (isRegistering) {
        const registerResponse = await axios.post(
          `${API_URL}/api/register`,
          {
            email: userEmail,
            password: password,
            name: username,
            password_confirmation: confirmPassword,
          },
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (!registerResponse.data) {
          throw new Error("Registration failed");
        }

        console.log("Registration successful");
      }

      // Login user using the Laravel API
      const loginResponse = await axios.post(
        `${API_URL}/api/login`,
        {
          email: userEmail,
          password: password,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (loginResponse?.data?.error) {
        console.error("Authentication error:", loginResponse.data.error);
        return;
      }

      console.log("Login successful:", loginResponse.data);
      handleModalToggle(); // Close modal or handle UI after successful login

      // Sign in with NextAuth (sending token to the animeabyssProvider)
      const nextAuthResult = await signIn("animeabyssProvider", {
        redirect: false,
        email: userEmail,
        password: password,
        accessToken: loginResponse.data.token,
      });

      if (nextAuthResult?.error) {
        console.error("NextAuth sign-in error:", nextAuthResult.error);
        return; // Handle any NextAuth errors
      }

      console.log("NextAuth login successful");
      // Optionally, handle post-login actions (e.g., redirect, fetch user data, etc.)

    } catch (error: any) {
      console.error("Error:", error);
      // Handle error display to user
    }
  };
  
  const year = new Date().getFullYear();
  const season = getCurrentSeason();

 // Log session state with useEffect
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession(); // Get session
      console.log("Session updated:", session); // Log session state
    };
    checkSession();
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setModalOpen(false);
      }
    };

    if (modalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalOpen]);
  return (
    <>
      <nav
        className={`${home ? "" : "fixed"} ${
          bgHover ? "hover:bg-tersier" : ""
        } z-[200] top-0 px-5 w-full ${
          scrollPosition?.y ?? 0 >= scrollP
            ? home
              ? ""
              : `bg-tersier shadow-tersier shadow-sm ${
                  shrink ? "py-1" : `${paddingY}`
                }`
            : `${paddingY}`
        } transition-all duration-200 ease-linear`}
      >
        <div
          className={`flex items-center justify-between mx-auto ${
            home ? "lg:max-w-[90%] gap-10" : "max-w-screen-2xl"
          }`}
        >
          <div
            className={`flex items-center ${
              withNav ? `${home ? "" : "w-[20%]"} gap-8` : " w-full gap-4"
            }`}
          >
            {info ? (
              <>
                <button
                  type="button"
                  className="flex-center w-7 h-7 text-white"
                  onClick={() => {
                    back ? router.back() : manga ? router.push("/en/search/manga") : router.push("/en");
                  }}
                >
                  <ArrowLeftIcon className="w-full h-full" />
                </button>

                <span
                  className={`font-inter font-semibold w-[50%] line-clamp-1 select-none ${
                    scrollPosition?.y ?? 0 >= scrollP + 80
                      ? "opacity-100"
                      : "opacity-0"
                  } transition-all duration-200 ease-linear`}
                >
                  {info.title.romaji}
                </span>
              </>
            ) : (
              // <></>
              <Link
              href={"/en"}
              className={`flex-center font-outfit font-semibold pb-2 ${
                home ? "text-4xl text-action" : "text-white text-3xl"
              }`}
            >
              <Image src={Logo} alt="Logo" width={200} height={50} />
            </Link>
            )}
          </div>

          {withNav && (
            <ul
              className={`hidden w-full items-center gap-10 pt-2 font-outfit text-[14px] lg:pt-0 lg:flex ${
                home ? "justify-start" : "justify-center"
              }`}
            >
              <li>
              <button
                onClick={() => {
                  window.location.href = `/en/search/anime?season=${season}&year=${year}`;
                }}
                className="transition-all duration-150 ease-linear hover:text-[#BA66DB]"
              >
                This Season
              </button>
            </li>
              <li>
            <button
              onClick={() => {
                window.location.href = '/en/search/manga';
              }}
              className="transition-all duration-150 ease-linear hover:text-[#BA66DB]"
            >
              Manga
            </button>
          </li>
            <li>
              <button
                onClick={() => {
                  window.location.href = '/en/search/anime';
                }}
                className="transition-all duration-150 ease-linear hover:text-[#BA66DB]"
              >
                Anime
              </button>
            </li>
              <li>
                <Link
                  href="/en/schedule"
                  className="transition-all duration-150 ease-linear hover:text-[#BA66DB]"
                >
                  Schedule
                </Link>
              </li>

              {!session || !session.user ? (
              <li>
                <button
                  onClick={handleModalToggle}
                  className="transition-all duration-150 ease-linear hover:text-[#BA66DB]"
                >
                  Sign In
                </button>
              </li>
            ) : (
              <li className="text-center">
                <Link
                  href={`/en/profile/${session.user?.name}`}
                  className="transition-all duration-150 ease-linear hover:text-[#BA66DB]"
                >
                  My List
                </Link>
              </li>
              )}
            </ul>
          )}

          <div className="flex w-[20%] justify-end items-center gap-4">
            <button
              type="button"
              title="Search"
              onClick={() => setIsOpen(true)}
              className="flex-center w-[26px] h-[26px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 15l6 6m-11-4a7 7 0 110-14 7 7 0 010 14z"
                ></path>
              </svg>
            </button>

            {session ? (
                <div className="w-7 h-7 relative flex flex-col items-center group shrink-0">
                  <button
                    type="button"
                    onClick={() => router.push(`/en/profile/${session?.user?.name}`)}
                    className="rounded-full w-7 h-7 bg-white/30 overflow-hidden"
                  >
                    <Image
                      src={session?.user?.image || "/default-avatar.png"}
                      alt="avatar"
                      width={50}
                      height={50}
                      className="w-7 h-7 object-cover"
                    />
                  </button>
                  <div className="hidden group-hover:block absolute z-50 w-28 text-center -bottom-20 text-white shadow-2xl bg-secondary p-1 py-2 rounded-md font-karla font-light">
                    <Link 
                      href={`/en/profile/${session?.user?.name || ''}`} 
                      className="block hover:text-[#BA66DB] mb-2"
                    >
                      Profile
                    </Link>
                    <button 
                      type="button" 
                      onClick={() => signOut({ redirect: true })} 
                      className="hover:text-[#BA66DB]"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              ) : (
              <>
                <button
                  type="button"
                  onClick={handleModalToggle}
                  title="Login"
                  className="w-7 h-7 bg-white/30 rounded-full overflow-hidden shrink-0"
                >
                  <UserIcon className="w-full h-full translate-y-1" />
                </button>

                {modalOpen && (
              <div className="fixed top-0 left-0 w-full h-full bg-black/50 grid place-items-center z-40">
                <div ref={modalRef} className="bg-white p-8 w-96 rounded-lg shadow-md">
                  {/* Centered Button with Larger Size */}
                  <button
                    type="button"
                    onClick={() => signIn("AniListProvider")}
                    title="Login With AniList"
                    className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ease-in-out transform hover:scale-110"
                  >
                    <UserIcon className="w-12 h-12 text-gray-800" />
                  </button>
                  <div className="flex items-center my-4">
                  <span className="flex-1 border-t border-gray-500"></span>
                  <span className="mx-2 text-gray-600">OR</span>
                  <span className="flex-1 border-t border-gray-500"></span>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md text-black"
                      placeholder="Email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>

                  {/* Username Field - Show Only When Registering */}
                  {isRegistering && (
                    <div>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md text-black"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Password Field */}
                  <div>
                    <input
                      type="password"
                      className="w-full p-2 border rounded-md text-black"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  {/* Confirm Password Field - Show Only When Registering */}
                  {isRegistering && (
                    <div>
                      <input
                        type="password"
                        className="w-full p-2 border rounded-md text-black"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="flex flex-col space-y-4 justify-center items-center">
                    <button
                      type="button"
                      onClick={handleRegisterToggle}
                      className="text-[#BA66DB] rounded-md flex items-center justify-center"
                    >
                      {isRegistering ? "Already have an account?" : "Don't have an account?"}
                    </button>
                    <button
                      type="submit"
                      // onClick={() => signIn("animeabyssProvider")}
                      className="w-64 h-14 bg-[#BA66DB] text-white rounded-md flex items-center justify-center"
                    >
                      {isRegistering ? "Register" : "Login"}
                    </button>
                   </div>
                      </form>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
