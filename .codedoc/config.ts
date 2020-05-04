import {configuration} from '@codedoc/core';

import {theme} from './theme';
import {guessTitle} from "@codedoc/core/transport";

/** Default site title and meta title. */
const SITE_TITLE = "Lemon Code";
/**
 * Set the environment.
 *
 * In development `config.dest.namespace` needs to be different then the value
 * of when it's deployed to gh-pages so this setting can be used to control
 * that.
 *
 * Set it using: export CODEDOC_DEBUG='1'
 * */
const IS_DEBUG = process.env.CODEDOC_DEBUG === '1';

export const config = /*#__PURE__*/configuration({
  theme,

  page: {
    title: {
      base: SITE_TITLE,
      connector: ' | ',
      // Site title goes after page title, e.g.: "Page | Base"
      extractor: function (content, config) {
        let pageTitle = `${guessTitle(content)}`;
        // For home page, avoid duplicating the site name
        if (pageTitle === SITE_TITLE) {
          pageTitle = 'Home';
        }
        return `${pageTitle} ${config.page.title.connector} ${config.page.title.base}`;
      }
    },
    favicon: '/images/favico.png',
    meta: {
      // Updated dynamically in `.codedoc/content/index.tsx`
      subject: SITE_TITLE,
      description: "For all of that extra juicy code snippets.",
      keywords: ["django", "python", "programming", "clean code"],
    },
  },
  misc: {
    github: {
      user: 'icarovirtual',
      repo: 'lemontext',
      action: 'Sponsor',
      large: true,
      standardIcon: true,
    },
  },
  dest: {
    html: 'dist',
    assets: 'dist',
    // Use sub-folder for project files only when deployed to gh-pages
    namespace: IS_DEBUG ? '' : '/lemontext',
  },

});
