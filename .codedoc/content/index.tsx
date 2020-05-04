import {RendererLike} from '@connectv/html';
import {File} from 'rxline/fs';
import {ContentNav, Fonts, GithubSearch$, Meta, MetaOptions, Page, ToC} from '@codedoc/core/components';

import {config} from '../config';
import {Header} from './header';
import {Footer} from './footer';

const IS_DEBUG = process.env.CODEDOC_DEBUG === '1';

export function content(_content: HTMLElement, toc: HTMLElement, renderer: RendererLike<any, any>, file: File<string>) {
  // Prepare page title
  let title = config.page.title.extractor(_content, config, file);
  let meta: MetaOptions = {...config.page.meta};
  // Meta title is the same as page title
  meta.subject = title;
  // If there is a description for the page, replace the default value
  let pageDescription = _content.querySelector('[data-meta=description]');
  if (pageDescription) {
    meta.description = pageDescription.innerHTML;
  }
  return (
      <Page title={title}
            favicon={config.page.favicon}
            meta={<Meta {...meta}/>}
            fonts={<Fonts {...config.page.fonts}/>}

            scripts={config.page.scripts}
            stylesheets={config.page.stylesheets}

            header={<Header {...config}/>}
            footer={<Footer {...config}/>}
            toc={
              <ToC search={
                config.misc?.github ?
                    <GithubSearch$
                        repo={config.misc.github.repo}
                        user={config.misc.github.user}
                        root={config.src.base}
                        pick={config.src.pick.source}
                        drop={config.src.drop.source}
                    /> : false
              }>{toc}</ToC>
            }>
        {_content}
        <ContentNav content={_content}/>
      </Page>
  )
}
