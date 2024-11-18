import React from 'react';
import Head from 'next/head';
import { Navbar } from "@/components/shared/NavBar";
import MobileNav from "@/components/shared/MobileNav";
import Footer from '@/components/shared/footer';

const Terms = () => {
  return (
    <>
      <Head>
        <title>AnimeAbyss Anime Website Terms and Conditions of Use</title>
        <meta name="description" content="Terms and Conditions of Use for AnimeAbyss Anime Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Navbar withNav={true} scrollP={5} shrink={true} />

      <MobileNav hideProfile={true} />
      <div className="bg-black text-white px-4 md:px-12 py-16">
        <h1 className="text-center text-2xl md:text-4xl font-bold mb-8">
          AnimeAbyss Anime Website Terms and Conditions of Use
        </h1>

        <section className="mb-10">
          <h2 className="text-lg md:text-2xl font-semibold mb-4">1. Terms</h2>
          <p className="text-sm md:text-base leading-relaxed">
            By accessing this Website, accessible from{' '}
            <a
              href="https://animeabyss.to"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-blue-400 underline"
            >
              https://animeabyss.to
            </a>, you are agreeing to be bound by these Website Terms and Conditions of Use and agree
            that you are responsible for the agreement with any applicable local laws. If you disagree with
            any of these terms, you are prohibited from accessing this site. The materials contained in this
            Website are protected by copyright and trademark law.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg md:text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="text-sm md:text-base leading-relaxed">
            Permission is granted to temporarily download one copy of the materials on AnimeAbyss Anime's Website for
            personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title,
            and under this license you may not:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm md:text-base">
            <li>Modify or copy the materials;</li>
            <li>Use the materials for any commercial purpose or public display;</li>
            <li>Attempt to reverse engineer any software contained on AnimeAbyss Anime's Website;</li>
            <li>Remove any copyright or other proprietary notations from the materials;</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          <p className="text-sm md:text-base leading-relaxed mt-4">
            This license shall automatically terminate if you violate any of these restrictions and may be
            terminated by AnimeAbyss Anime at any time. Upon terminating your viewing of these materials or upon the
            termination of this license, you must destroy any downloaded materials in your possession whether
            in electronic or printed format.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg md:text-2xl font-semibold mb-4">3. Disclaimer</h2>
          <p className="text-sm md:text-base leading-relaxed">
            All the materials on AnimeAbyss Anime’s Website are provided "as is". AnimeAbyss Anime makes no warranties, may
            it be expressed or implied, therefore negates all other warranties. Furthermore, AnimeAbyss Anime does not make
            any representations concerning the accuracy or reliability of the use of the materials on its Website or
            otherwise relating to such materials or any sites linked to this Website.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg md:text-2xl font-semibold mb-4">4. Limitations</h2>
          <p className="text-sm md:text-base leading-relaxed">
            AnimeAbyss Anime or its suppliers will not be held accountable for any damages that arise with the use or
            inability to use the materials on AnimeAbyss Anime’s Website, even if AnimeAbyss Anime or an authorized representative
            of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdictions
            do not allow limitations on implied warranties or limitations of liability for incidental damages, and these
            limitations may not apply to you.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg md:text-2xl font-semibold mb-4">5. Revisions and Errata</h2>
          <p className="text-sm md:text-base leading-relaxed">
            The materials appearing on AnimeAbyss Anime’s Website may include technical, typographical, or photographic
            errors. AnimeAbyss Anime does not warrant that any of the materials on its Website are accurate, complete, or
            current. AnimeAbyss Anime may make changes to the materials contained on its Website at any time without
            notice. However, AnimeAbyss Anime does not make any commitment to update the materials.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg md:text-2xl font-semibold mb-4">6. Links</h2>
          <p className="text-sm md:text-base leading-relaxed">
            AnimeAbyss Anime has not reviewed all of the sites linked to its Website and is not responsible for the contents
            of any such linked site. The inclusion of any link does not imply endorsement by AnimeAbyss Anime of the site. Use
            of any such linked website is at the user's own risk.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg md:text-2xl font-semibold mb-4">7. Your Privacy</h2>
          <p className="text-sm md:text-base leading-relaxed">
            Please read our Privacy Policy.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg md:text-2xl font-semibold mb-4">8. Governing Law</h2>
          <p className="text-sm md:text-base leading-relaxed">
            Any claim related to AnimeAbyss Anime's Website shall be governed by the laws of the country of origin
            without regards to its conflict of law provisions.
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Terms;
