import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from 'next/image'
import Logo from '../../public/logo.png'

function Footer() {
  const [year] = useState(new Date().getFullYear());
  const [season] = useState(getCurrentSeason());

  const [checked, setChecked] = useState(false);

  const router = useRouter();

  function switchLang() {
    setChecked(!checked);
    if (checked) {
      router.push("/en");
    } else {
      router.push("/id");
    }
  }

  return (
    <footer className="flex-col w-full">
      <div className="text-[#dbdcdd] z-40 bg-[#0c0d10] lg:flex lg:h-[12rem] w-full lg:items-center lg:justify-between">
        <div className="mx-auto flex w-[90%] lg:w-[95%] xl:w-[80%] flex-col space-y-10 py-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:py-0">
          <div className="flex flex-col gap-2">
          <div className="flex gap-2 font-outfit text-4xl cursor-pointer">
          <Link href="/">
            <Image 
              src={Logo} 
              alt="AnimeAbyss Logo" 
              width={200}
              height={100}
            />
          </Link>
        </div>
            <p className="font-karla lg:text-[0.8rem] text-[0.65rem] text-[#9c9c9c]  lg:w-[520px] italic">
            AnimeAbyss does not store any files on our server, we only linked to the media which is hosted on 3rd party services.
            </p>
          </div>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:gap-[9.06rem] text-[#a7a7a7] text-sm lg:text-end">
            <div className="flex flex-col gap-10 font-karla font-bold lg:flex-row lg:gap-[5.94rem]">
              <ul className="flex flex-col gap-y-[0.7rem] ">
                <li className="cursor-pointer hover:text-[#BA66DB]">
                  <Link href={`/en/search/anime?season=${season}&year=${year}`}>
                    This Season
                  </Link>
                </li>
                <li className="cursor-pointer hover:text-[#BA66DB]">
                  <Link href={`/en/search/anime`}>Popular Anime</Link>
                </li>
                <li className="cursor-pointer hover:text-[#BA66DB]">
                  <Link href={`/en/search/manga`}>Popular Manga</Link>
                </li>
                <li className="cursor-pointer hover:text-[#BA66DB]">
                  <Link href={`en/terms`}>Terms of services</Link>
                </li>
              </ul>
              <ul className="flex flex-col gap-y-[0.7rem]">
                <li className="cursor-pointer hover:text-[#BA66DB]">
                  <Link href={`/en/search/anime?format=MOVIE`}>Movies</Link>
                </li>
                <li className="cursor-pointer hover:text-[#BA66DB]">
                  <Link href={`/en/search/anime?format=TV`}>TV Shows</Link>
                </li>
                <li className="cursor-pointer hover:text-[#BA66DB]">
                  <Link href={`/en/dmca`}>DMCA</Link>
                </li>
                <li className="cursor-pointer hover:text-[#BA66DB]">
                <Link
                href="mailto://animeabyss@tuta.io"
                target="_blank"
              >
               Contact
              </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-tersier border-t border-white/5">
        <div className="mx-auto flex w-[90%] lg:w-[95%] xl:w-[80%] flex-col pb-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:py-0">
          <p className="flex items-center gap-1 font-karla lg:text-[0.81rem] text-[0.7rem] text-[#CCCCCC] py-3">
            &copy; {new Date().getFullYear()} <a
          href="https://animeabyss.to/"
          target="_blank"
          className="text-inherit font-bold text-sm"
        >
          AnimeAbyss.to
        </a>
        . All Rights Reserved.
          </p>
          <div className="flex items-center gap-5">
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

function getCurrentSeason() {
  const now = new Date();
  const month = now.getMonth() + 1; // getMonth() returns 0-based index

  switch (month) {
    case 12:
    case 1:
    case 2:
      return "WINTER";
    case 3:
    case 4:
    case 5:
      return "SPRING";
    case 6:
    case 7:
    case 8:
      return "SUMMER";
    case 9:
    case 10:
    case 11:
      return "FALL";
    default:
      return "UNKNOWN SEASON";
  }
}
