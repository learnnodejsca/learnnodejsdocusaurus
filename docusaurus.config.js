module.exports = {
  title: 'Learn Node.js',
  tagline: 'Master fullstack JavaScript for FREE',
  url: 'https://learnnodejs.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'learnnodejsca', // Usually your GitHub org/user name.
  projectName: 'learnnodejs', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Learn Node.js',
      logo: {
        alt: 'Learn Node.js',
        src: 'img/favicon-32x32.png',
      },
      items: [
        {
          to: 'docs',
          activeBasePath: 'docs',
          label: 'Book',
          position: 'left',
        },
        {
          href: 'https://github.com/learnnodejsca',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'Twitter',
              href: 'https://twitter.com/alexkluew_dev',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/learnnodejsca',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Alex Kluew. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: 'introduction',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/learnnodejsca/learnnodejs/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/learnnodejsca/learnnodejs/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
