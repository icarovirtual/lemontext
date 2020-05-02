import {configuration} from '@codedoc/core';

import {theme} from './theme';
import {guessTitle} from "@codedoc/core/transport";


export const config = /*#__PURE__*/configuration({
  theme,

  page: {
    title: {
      base: 'Lemon Code',
      connector: ' | ',
      // Site title goes after page title, e.g.: "Page | Base"
      extractor: (content, config) =>
          `${guessTitle(content)} ${config.page.title.connector} ${config.page.title.base}`,
    },
    favicon: '/images/favico.png',
    // TODO: Fill these but dinamically?
    meta: {
      // subject: undefined,
      // description: undefined,
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

});
