import type { Preview } from '@storybook/web-components'
import { setCustomElementsManifest } from "@storybook/web-components";
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';

import customElements from "../custom-elements.json";

setCustomElementsManifest(customElements);

const customViewports = {
  minimum: {
    name: 'minimum',
    styles: {
      width: '400px',
      height: '100%'
    },
  },
  medium: {
    name: 'medium',
    styles: {
      width: '600px',
      height: '100%'
    },
  },
};

const personSchemaWrapper = content => {
  return `<article itemscope itemtype="https://schema.org/Person">${content}</article>`
}
global.psw = personSchemaWrapper

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'fullscreen',
    viewport: {
      viewports: {
        ...MINIMAL_VIEWPORTS,
        ...customViewports,
      },
    },
  },
}

export default preview
