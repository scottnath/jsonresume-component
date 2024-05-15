import { LitElement, html } from 'lit';
import {choose} from 'lit/directives/choose.js';
import {Task} from '@lit/task';
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

import {getResumeJson} from './get-remote-resume.js';
import style from './style.css?inline' assert { type: 'css' };

/** @typedef {import('jsonresume-theme-microdata/schema.d.ts').ResumeSchema} ResumeJson */

/**
 * @element json-resume
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
 * @csspart basics - style the `basics` section
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
 * @cssprop [--card-border-color=#ccc] - The card border color
 * @cssprop [--card-border-size=1px] - The card border color
 * @cssprop [--card-border-style=solid] - The card border color
 * 
 * @todo no validator, so add warning with links to validate resume.json
 */
export class JsonResume extends LitElement {
  static properties = {
    /**
     * GitHub gist ID. When present, calls the GitHub rest API to fetch a resume.json gist's content.
     * Checked first, if gist is present and has a resume.json, `json_url` and `local_file` will be ignored.
     */
    gist_id: {
      type: String,
      attribute: 'gist_id'
    },
    /**
     * URL to a JSON file. When present, used to fetch a resume.json file from the URL.
     * Checked second or if gist_id does not have a resume.json, `local_file` will be ignored.
     */
    json_url: {
      type: String,
      attribute: 'json_url'
    },
    /**
     * Path to a local resume.json file
     */
    local_file: {
      type: String,
      attribute: 'local_file'
    },
    /**
     * When true, sections of resume (basic, work, etc) will be injected according to their order in resume.json
     */
    preordered: {
      type: Boolean,
      attribute: 'preordered',
    },
    /**
     * The aria-label for the `div` containing the resume. Defaults to `${basics.name}'s resume`
     */
    label: {
      type: String,
      attribute: 'label'
    },
    /**
     * The aria-label for the `div` containing the resume. Defaults to `${basics.name}'s resume`
     */
    globalizeStyles: {
      type: Boolean,
      attribute: 'globalize-styles'
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
    const parts = this._sectionOrder;
    parts.push('contact', 'profiles');
    this.setAttribute('exportparts', parts.join(','));
  }

  /**
   * Generates a `style` tag with variable component styles 
   * @private
   */
  _stylesGenerate = () => {
    return `<style>
      ${this.stylesheet ? this.stylesheet : style}
    </style>`
  }
  
  firstUpdated() {
    if (this.globalizeStyles) {
      const div = document.createElement("div");
      div.innerHTML = this._stylesGenerate();
      this.prepend(div.cloneNode(true))
    }
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
  _resumeGenerate = (resumejson) => {
    if (this.preordered) {
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
    return html`${unsafeHTML(this._stylesGenerate())}<div id="jsonresume" itemscope itemtype="https://schema.org/ProfilePage">
      <article part="resume" itemprop="mainEntity" itemscope itemtype="https://schema.org/Person" aria-label="${ariaLabel}">
      ${resumeSections}
      </article>
    </div>`
  }

  /**
   * Task to wrap getting the resume.json file or `ResumeJson` object
   * @private
   */
  _resumejsonTask = new Task(this, {
    task: async ([gist_id, json_url], {signal}) => {
      if (!this.resumejson && !gist_id && !json_url) {
        throw new Error('resumejson property, or a gist_id or json_url attribute are required')
      }
      let resumejson = {};
      if (this.resumejson) {
        resumejson = this.resumejson
      } else {
        resumejson = await getResumeJson(gist_id, json_url)
      }
      if (!resumejson.basics || !resumejson.basics.name) {
        throw new Error('`.basics` property and `basics.name` required to generate resume')
      }
      return this._resumeGenerate(resumejson);
    },
    args: () => [this.gist_id, this.json_url]
  });
  
  render() {
    return this._resumejsonTask.render({
      pending: () => html`<p>Loading resume.json...</p>`,
      complete: (resumehtml) => html`${resumehtml}`,
      error: (e) => html`<p>${e}</p>`
    });
  }
}

customElements.define('json-resume', JsonResume);