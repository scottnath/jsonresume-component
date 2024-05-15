import { html } from 'lit';
import {micromark} from 'micromark'
import { microdata } from '@cucumber/microdata';
import { expect } from '@storybook/test';
import { within as shadowWithin } from 'shadow-dom-testing-library';
import stylesEven from 'jsonresume-theme-microdata/style.css?inline';
import { getWcStorybookHelpers } from "wc-storybook-helpers";

import 'profile-components/github-repository';

import resumeLorem from '@/fixtures/lorem.resume.json?raw';
import './index.js';

const { argTypes } = getWcStorybookHelpers("json-resume");

const resumeFixtureLorem = JSON.parse(resumeLorem);
delete resumeFixtureLorem.meta.themeOptions;
const resumeFixtureLoremOpts = JSON.parse(resumeLorem);

const changeSummary = (summary, json = resumeFixtureLorem) => {
  return {
    ...json,
    basics: {
      ...json.basics,
      summary: micromark(`**${summary}**

${json.basics.summary}`),
    }
  }
}

export default {
  title: 'JsonResume',
  component: 'json-resume',
  argTypes,
};

export const GistID = {
  args: {
    gist_id: '9e7a7ceb9425336c6aa08d58afb63b8d'
  },
};

export const JsonUrl = {
  args: {
    json_url: 'https://gist.githubusercontent.com/scottnath/9e7a7ceb9425336c6aa08d58afb63b8d/raw'
  },
};

export const LocalJSON = {
  args: {
    resumejson: resumeFixtureLorem
  },
  play: async ({ args, canvasElement, step }) => {
    const ariaLabel = args.label || `${resumeFixtureLorem.basics.name}'s resume`;
    const screen = shadowWithin(canvasElement);
    const container = await screen.findByShadowLabelText(ariaLabel);
    console.log(container.getRootNode())
    const ppData = microdata('https://schema.org/ProfilePage', container.getRootNode())
    console.log(ppData)
    expect(ppData['@type']).toBe('ProfilePage');
    expect(ppData.mainEntity.name).toBe(resumeFixtureLorem.basics.name)
    expect(ppData.mainEntity.email).toBe(resumeFixtureLorem.basics.email)
    expect(ppData.mainEntity.telephone).toBe(resumeFixtureLorem.basics.phone)
    expect(ppData.mainEntity.url).toBe(resumeFixtureLorem.basics.url)
    if (Array.isArray(resumeFixtureLorem.basics.profiles)) {
      expect(ppData.mainEntity.ContactPoint).toHaveLength(resumeFixtureLorem.basics.profiles.length)
    }
  },
}

export const ThemeEven = {
  args: {
    resumejson: changeSummary('This resume is styled using the `even` theme. The HTML is exactly the same and so is the microdata. The stylesheet is added using the `stylesheet` attribute.'),
    stylesheet: stylesEven
  },
}

export const SectionOrder = {
  args: {
    resumejson: changeSummary('This resume determines the order of the sections according to how they are ordered in the JSON file. This requires adding the attribute `preordered` as in `<json-resume preordered="true"...`'),
    preordered: true,
  }
}

export const SectionTitles = {
  args: {
    resumejson: {
      ...changeSummary('This resume shows alternate title text for some sections. This can be configured in your `resume.json` file by adding an object to `meta.sectionTitles`. You only need to include the titles you want to change.', resumeFixtureLoremOpts),
    },
  }
}

export const Slots = {
  render: (args) => 
  html`<json-resume .resumejson="${args.resumejson}" preordered="${args.preordered}">
      <section slot="work"><h3>I am a slotted H3 header for the Work section</h3><article><h4>I am a slotted H4</h4></article></section>
      <section slot="projects"><h3>Open Source Projects</h3><github-repository full_name="scottnath/profile-components" fetch="true" data-theme="light"></github-repository><github-repository full_name="scottnath/jsonresume-theme-microdata" fetch="true" data-theme="light"></github-repository></section>
    </json-resume>
  `,
  args: {
    resumejson: changeSummary('This resume replaces individual sections using `slots`. There is a slot for every JSON Resume section. In this example, `work` is replaced with a similar HTML structure, but `projects` is replaced with a series of web components. The slotted content does not get styling from the web component.'),
    preordered: true,
  },
}

export const Styling = {
  render: (args) => 
  html`<json-resume .resumejson="${args.resumejson}" preordered="${args.preordered}">
      <section slot="work"><h3>My Work as a Meow</h3><article><h4>Job Title Meow</h4></article></section>
    </json-resume>
  `,
  args: {
    resumejson: changeSummary('This resume has its styles adjusted using CSS custom properties and CSS shadow parts via `::part()`'),
    preordered: true,
  },
  decorators: [(story) => html`<div>
    <style>
      json-resume {
        --color-background: white;
        --color-primary: var(--color-primary-light);
        --color-secondary: var(--color-secondary-light);
        --color-accent: var(--color-accent-light);
      }
      json-resume::part(contact) {
        position: relative;
        top: 0;
        background: black;
        --color-primary: white;
        --color-link: var(--color-link-dark);
        color: var(--color-primary);
      }
      json-resume::part(skills) {
        background: green;
        --color-primary: white;
        color: var(--color-primary);
      }
    </style>
    ${story()}
  </div>`]
}

export const GlobalizeStyles = {
  render: (args) => 
  html`<h3>I am an H3 outside of the resume</h3><json-resume .resumejson="${args.resumejson}" preordered="${args.preordered}" globalize-styles="${args['globalize-styles']}">
      <section slot="work"><h3>I am a slotted H3 header for the Work section</h3><article><h4>I am a slotted H4</h4></article></section>
      <section slot="projects"><h3>SLOTTED! Open Source Projects</h3><github-repository full_name="scottnath/profile-components" fetch="true" data-theme="light"></github-repository><github-repository full_name="scottnath/jsonresume-theme-microdata" fetch="true" data-theme="light"></github-repository></section>
    </json-resume>
  `,
  args: {
    resumejson: changeSummary('This resume injects its stylesheet into the light DOM, which will then style the entire page. This is good if you are using this component standalone for printing, but not so much if your resume is on a page where other elements can be affected.'),
    preordered: true,
    'globalize-styles': true,
  },
}

export const Stylesheet = {
  args: {
    resumejson: changeSummary('This resume replaces the default styles using the `stylesheet` property. You can add an entire stylesheet, but here just a few styles were added. This will **completely override** the default styles.'),
    stylesheet: `
      :host {
        font-family: 'Comic Sans MS'
      }
      [itemscope]#jsonresume > article {
        background: green;
        color: yellow;
      }
      [part="basics"] [itemprop="description"] {
        font-size: 3em;
      }
    `,
    preordered: true
  },
}


export const NoAttr = {
};

export const BadGist = {
  args: {
    gist_id: '12345'
  },
};

export const BadUrl = {
  args: {
    json_url: 'https://gist.githubusercontent.com/scottnath/9e7a7ceb9425336c6aa08d58afb63b8d'
  },
};
