import { html } from 'lit';
import {Task} from '@lit/task';

import {getResumeJson} from './get-remote-resume.js';
import style from './style.css?inline' assert { type: 'css' };

import { JsonResumeUI } from "./ui.js";

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
 */
export class JsonResume extends JsonResumeUI {
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
     * When true, sections of resume (basic, work, etc) will be injected according to their order in resume.json
     */
    preordered: {
      type: Boolean,
      attribute: 'preordered',
    },
  };

  /**
   * Generates a `style` tag with variable component styles
   * @param {ResumeJson} resumejson 
   * @private
   */
  _stylesGenerate = (resumejson) => {
    let sheet = new CSSStyleSheet();
    
    if (this.stylesheet) {
      sheet.replaceSync(this.stylesheet);
    } else {
      sheet.replaceSync(style)
    }
    
    if (resumejson.meta?.themeOptions?.colors) {
      const colors = resumejson.meta?.themeOptions?.colors;
      const props = Object.entries(colors).map(([name, [light, dark = light]]) => `--color-${name}-light:${light}; --color-${name}-dark:${dark};`)
      .join(' ')
      sheet.insertRule(`:host, body { ${props} }`, 1)
    }
    
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }

  /**
   * Generate the resume HTML with the <style> element
   * @param {ResumeJson} resumejson
   * @private
   */
  _resumeGenerate = (resumejson) => {
    const rj = {
      ...resumejson,
    }

    if (this.preordered || rj.meta?.themeOptions?.preordered) {
      this._sectionOrder = Object.keys(rj)
      rj.meta = {
        ...resumejson.meta,
        themeOptions: {
          ...resumejson.meta?.themeOptions,
          preordered: true,
        }
      }
    }
    const ariaLabel = this.label || `${rj.basics.name}'s resume`;
    this._stylesGenerate(rj);
    console.log('meow', resumejson)
    return this._resumeGenerater(resumejson)
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
      console.log(resumejson)
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