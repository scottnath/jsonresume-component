import { LitElement, html } from 'lit';
import {choose} from 'lit/directives/choose.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import {
  Awards,
  Basics,
  Certificates,
  Education,
  Interests,
  Languages,
  Meta,
  Projects,
  Publications,
  References,
  Skills,
  Volunteer,
  Work
} from 'jsonresume-theme-microdata/components.js';

/** @typedef {import('jsonresume-theme-microdata/schema.d.ts').ResumeSchema} ResumeJson */

/**
 * @element json-resume-ui
 * @description This component is the SSR-friendly UI generation funcitonality 
 *  of <json-resume> and can be used to generate a Declarative Shadow DOM that 
 *  contains the resume HTML and a stylesheet
 * 
 * @slot basics - Replace the entire `basics` HTML section
 * @slot work - Replace the entire `work` HTML section
 * @slot volunteer - Replace the entire `volunteer` HTML section
 * @slot education - Replace the entire `education` HTML section
 * @slot awards - Replace the entire `awards` HTML section
 * @slot certificates - Replace the entire `certificates` HTML section
 * @slot publications - Replace the entire `publications` HTML section
 * @slot skills - Replace the entire `skills` HTML section
 * @slot languages - Replace the entire `languages` HTML section
 * @slot interests - Replace the entire `interests` HTML section
 * @slot references - Replace the entire `references` HTML section
 * @slot projects - Replace the entire `projects` HTML section
 * @slot meta - Replace the entire `meta` HTML section
 * 
 * @csspart jsonresume - resume container
 * @csspart resume - resume main article
 * @csspart basics - style the `basics` section
 * @csspart name - person's name, h1
 * @csspart label - person's title/label, h2
 * @csspart image - person's image
 * @csspart summary - person's summary
 * @csspart contact - contacts/locations list within basics
 * @csspart profiles - profiles list within basics
 * @csspart section-title - styles the `h3` title of all sections
 * @csspart work - style the `work` section
 * @csspart volunteer - style the `volunteer` section
 * @csspart education - style the `education` section
 * @csspart awards - style the `awards` section
 * @csspart certificates - style the `certificates` section
 * @csspart publications - style the `publications` section
 * @csspart skills - style the `skills` section
 * @csspart languages - style the `languages` section
 * @csspart interests - style the `interests` section
 * @csspart references - style the `references` section
 * @csspart projects - style the `projects` section
 * @csspart meta - style the `meta` section
 *
 * @cssprop [--color-background-light] - Background color, light theme
 * @cssprop [--color-dimmed-light] - Dimmed background color, light theme
 * @cssprop [--color-primary-light] - Primary color, light theme
 * @cssprop [--color-secondary-light] - Secondary color, light theme
 * @cssprop [--color-link-light] - Link color, light theme
 * @cssprop [--color-background-dark] - Background color, dark theme
 * @cssprop [--color-dimmed-dark] - Dimmed background color, dark theme
 * @cssprop [--color-primary-dark] - Primary color, dark theme
 * @cssprop [--color-secondary-dark] - Secondary color, dark theme
 * @cssprop [--color-link-dark] - Link color, dark theme
 * @cssprop [--font-size] - Component font size, basis for many `em`-based styles
 * @cssprop [--font-family] - Component font family
 * 
 */
export class JsonResumeUI extends LitElement {
  static properties = {
    /**
     * The aria-label for the `div` containing the resume. Defaults to `${basics.name}'s resume`
     */
    label: {
      type: String,
      attribute: 'label'
    },
    /**
     * Property accepts a JSON Resume object
     */
    resumejson: {
      type: Object,
      attribute: false
    },
    /**
     * Accepts a string containing styles
     * **WARNING** Completely deletes and overrides internal component styles
     */
    stylesheet: {
      type: String,
      attribute: false
    },
    /**
     * @private
     */
    _sectionOrder: {
      type: Array,
      attribute: false,
      state: true,
    },
    /**
     * @private
     */
    _sectionTitles: {
      type: Object,
      attribute: false,
      state: true,
    }
  };

  constructor() {
    super();
    this._sectionOrder = [
      'basics',
      'work',
      'volunteer',
      'education',
      'awards',
      'certificates',
      'publications',
      'skills',
      'languages',
      'interests',
      'references',
      'projects',
      'meta'
    ];
    this._sectionTitles = {
      "work": "Work",
      "volunteer": "Volunteer",
      "education": "Education",
      "awards": "Awards",
      "certificates": "Certificates",
      "publications": "Publications",
      "skills": "Skills",
      "languages": "Languages",
      "interests": "Interests",
      "references": "References",
      "projects": "Projects"
    }
  }
  
  connectedCallback() {
    super.connectedCallback();
    this._exportparts();
  }

  /**
   * Adds the `exportparts` attribute
   * @private
   */
  _exportparts() {
    const parts = this._sectionOrder;
    parts.push('jsonresume', 'resume', 'name', 'label', 'image', 'summary', 'contact', 'profiles', 'section-title');
    this.setAttribute('exportparts', parts.join(','));
  }

  /**
   * Generates a `style` tag with variable component styles
   * @private
   */
  get _generatedStyleTag() {
    if (!this.stylesheet) return;
    let sheet = this.stylesheet;
    if (sheet.includes('/*theme-options*/') && this.resumejson.meta?.themeOptions?.colors) {
      const colors = this.resumejson.meta?.themeOptions?.colors;
      const props = Object.entries(colors).map(([name, [light, dark = light]]) => `--color-${name}-light:${light}; --color-${name}-dark:${dark};`)
      .join(' ')
      sheet = sheet.replace('/*theme-options*/', `:host { ${props} }`);
    }

    return unsafeHTML(`<style>${sheet}</style>`)
  }

  /**
   * Returns a section of a resume
   * @param {string} section - name of a JSON Resume section
   * @param {object} content - content for that section only
   * @private
   */
  _resumeSection = (section, content) => {
    return html`
      ${choose(section, [
        ['basics', () => html`<slot name="basics">
          ${unsafeHTML(Basics(content))}
        </slot>`],
        ['work', () => html`<slot name="work">
          ${unsafeHTML(Work(content, this._sectionTitles[section]))}
        </slot>`],
        ['volunteer', () => html`<slot name="volunteer">${unsafeHTML(Volunteer(content, this._sectionTitles[section]))}</slot>`],
        ['education', () => html`<slot name="education">${unsafeHTML(Education(content, this._sectionTitles[section]))}</slot>`],
        ['awards', () => html`<slot name="awards">${unsafeHTML(Awards(content, this._sectionTitles[section]))}</slot>`],
        ['certificates', () => html`<slot name="certificates">${unsafeHTML(Certificates(content, this._sectionTitles[section]))}</slot>`],
        ['publications', () => html`<slot name="publications">${unsafeHTML(Publications(content, this._sectionTitles[section]))}</slot>`],
        ['skills', () => html`<slot name="skills">${unsafeHTML(Skills(content, this._sectionTitles[section]))}</slot>`],
        ['languages', () => html`<slot name="languages">${unsafeHTML(Languages(content, this._sectionTitles[section]))}</slot>`],
        ['interests', () => html`<slot name="interests">${unsafeHTML(Interests(content, this._sectionTitles[section]))}</slot>`],
        ['references', () => html`<slot name="references">${unsafeHTML(References(content, this._sectionTitles[section]))}</slot>`],
        ['projects', () => html`<slot name="projects">${unsafeHTML(Projects(content, this._sectionTitles[section]))}</slot>`],
        ['meta', () => html`<slot name="meta">${unsafeHTML(Meta(content))}</slot>`],
      ],
      () => html``)}
    `;
  }

  /**
   * Generate the resume HTML with the <style> element
   * @param {ResumeJson} resumejson 
   * @private
   */
  _resumeGenerater = (resumejson) => {
    if (resumejson.meta?.themeOptions?.preordered) {
      this._sectionOrder = Object.keys(resumejson)
    }
    if (resumejson.meta?.themeOptions?.sectionTitles) {
      this._sectionTitles = {
        ...this._sectionTitles,
        ...resumejson.meta?.themeOptions?.sectionTitles
      }
    }
    const resumeSections = this._sectionOrder.map((section) => {
      if (!resumejson[section]) return;
      return this._resumeSection(section, resumejson[section])
    })
    const ariaLabel = this.label || `${resumejson.basics.name}'s resume`;
    const meow = this._generatedStyleTag;
    return html`${meow}<div part="jsonresume" itemscope itemtype="https://schema.org/ProfilePage">
      <article part="resume" itemprop="mainEntity" itemscope itemtype="https://schema.org/Person" aria-label="${ariaLabel}">
      ${resumeSections}
      </article>
    </div>`
  }
  
  render() {
    if (!this.resumejson) {
      throw new Error('resumejson property attribute required')
    }
    return this._resumeGenerater(this.resumejson);
  }
}

customElements.define('json-resume-ui', JsonResumeUI);