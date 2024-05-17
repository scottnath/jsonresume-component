import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'
import { customElementsManifestToMarkdown } from '@custom-elements-manifest/to-markdown';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const template = fs.readFileSync(path.join(__dirname, '../README.hbs'), 'utf8');

const manifest = JSON.parse(fs.readFileSync('./custom-elements.json', 'utf-8'));
const markdown = customElementsManifestToMarkdown(manifest, {
  heading: 3,
  private: 'hidden',
  omitSections: [
    'main-heading',
    'super-class',
    'attributes'
  ]
});

const final = template.replace('{{>main}}', markdown)

fs.writeFileSync('./README.md', final);