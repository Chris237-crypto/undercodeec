import React, { useEffect } from 'react';
//= Layout
import PreviewLayout from 'layouts/Preview';
//= Components
import Header from 'components/Preview/Header';
import Features from 'components/Preview/Features';
import Demos from 'components/Preview/Demos';
import InnerPages from 'components/Preview/InnerPages';
import BuyNow from 'components/Preview/BuyNow';
import Portfolio from 'components/Preview/Portfolio';
import Codei from 'components/Preview/Codei';
import BestFeatures from 'components/Preview/BestFeatures';
import Responsive from 'components/Preview/Responsive';
import AllFeatures from 'components/Preview/AllFeatures';
import Testimonials from 'components/Preview/Testimonials';
import CallToAction from 'components/Preview/CallToAction';
//= Scripts
import { fixPreviewStylesheetOrder } from 'common/fixStylesheetsOrder';

import Seo from 'components/Seo';
import { Helmet } from "react-helmet";



const LandingPreview = () => {
  useEffect(() => {
    document.body.classList.add('index-main');
    return () => document.body.classList.remove('index-main');
  }, []);

  useEffect(() => {
    fixPreviewStylesheetOrder();
  }, []);

  return (
    <PreviewLayout>
      <Header />
      <Features />
      <Demos />
      <InnerPages />
      <BuyNow />
      <Portfolio />
      <Codei />
      <BestFeatures />
      <Responsive />
      <AllFeatures />
      <Testimonials />
      <CallToAction />
    </PreviewLayout>
  );
};

export const Head = () => {
  return (
    <>
      <Helmet>
        <meta name="google-site-verification" content="TjIVgYGV2-AduD8UBXsIX_Yf0Q7TwAmOp55hVkZI9ss" />
      </Helmet>

      <Seo
        title="Diseño Web Profesional en Quito | Desarrollo de Apps y SEO para Empresas"
        description="Ofrecemos servicios expertos en diseño web, desarrollo de aplicaciones móviles y SEO para empresas, emprendedores y negocios en Quito, Ecuador."
        keywords={[
          'diseño web Quito',
          'desarrollo de apps Quito',
          'seo para páginas web Quito',
          'ecommerce Quito',
          'diseño web para empresas Quito',
          'desarrollo web para emprendedores Quito',
          'agencia de diseño web Quito'
        ]}
        url="https://undercodeec.com/"
      />
      <title>Inicio</title>
      <link rel="stylesheet" href="/assets/css/lib/bootstrap.min.css" />
      <link rel="stylesheet" href="/assets/css/style.css" />
      <link rel="stylesheet" href="/landing-preview/css/preview-style.css" />
    </>
  );
};

export default LandingPreview;
