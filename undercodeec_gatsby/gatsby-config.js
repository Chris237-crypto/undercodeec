module.exports = {
  siteMetadata: {
    title: 'Undercodeec',
    description: 'Undercodeec - Diseño web impactante y funcional para tu negocio.',
    author: 'Undercodeec',
    siteUrl: 'https://undercodeec.com', // sitemap xml

  },
  plugins: [
    'gatsby-plugin-resolve-src',
    'gatsby-plugin-eslint',
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true, // útil para ver qué clases se eliminan
        develop: false, // solo activa en producción
        safelist: [
          'row',
          'col',
          /^btn-/,
          /^modal/,
          /^fade/,
          /^show/,
          /^text-/,
          /^carousel/,
          /^swiper-/,
          /^lg-/,
          /^lightgallery/
        ],
      },
    },

    `gatsby-plugin-react-helmet`, // <-- Agrega esta línea
    `gatsby-plugin-sitemap`, // <-- Agrega el plugin sitemap aquí
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        policy: [
          {
            userAgent: '*',
            allow: '/',
            // Disallow can ser usado para bloquear carpetas o páginas específicas
            // disallow: ['/admin', '/secret']
          },
        ],
        // Opcional: puedes crear reglas específicas para entornos de desarrollo o staging
        host: 'https://undercodeec.com',
        sitemap: 'https://undercodeec.com/sitemap.xml',
      },
    },


  ],
  trailingSlash: 'always',
};
