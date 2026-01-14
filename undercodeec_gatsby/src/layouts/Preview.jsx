//= React
import React, { useEffect, useRef } from "react";
import { Script } from "gatsby";
//= Scripts
import navbarScrollEffect from "common/navbarScrollEffect";
import initScrollAnimations from "common/initScrollAnimations";
//= Components
import PreLoader from "components/PreLoader";
import ScrollToTop from "components/ScrollToTop";
import Navbar from 'components/Navbars/PreviewNav';

//= Global CSS
import "styles/globals.css";
import "styles/preloader.css";

const PreviewLayout = ({ children }) => {
  const navbarRef = useRef(null);

  useEffect(() => {
    navbarScrollEffect(navbarRef.current);
  }, [navbarRef]);

  // Inicializar animaciones de scroll
  useEffect(() => {
    initScrollAnimations();
  }, []);

  return (
    <>
      <PreLoader />
      <Navbar navbarRef={navbarRef} />
      <main>
        {children}
      </main>
      <ScrollToTop />
      
      <Script src="/landing-preview/js/parallax.min.js"></Script>
      <Script src="/assets/js/main.js"></Script>
    </>
  );
};

export default PreviewLayout;
