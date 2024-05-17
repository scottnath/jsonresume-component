# jsonresume-component

`<json-resume>` is a web component (using LitElement) which presents resume content stored in [JSON Resume][jsonresume] format. The HTML structure uses the components from [jsonresume-theme-microdata][jtm] to generate HTML which includes structured data as microdata in HTML attributes.


## NPM / Node.js usage

### Install dependencies

```sh
npm i jsonresume-component
```

```javascript
import { JsonResume } from 'jsonresume-component/src/index.js';
```

```html
<JsonResume gist_id="9e7a7ceb9425336c6aa08d58afb63b8d"></JsonResume>
```

## Browser usage

The web component is lightly-bundled in that it puts all non-`lit` external files in a single .js file, which is located at `./dist/json-resume.js` in the NPM package.

### include `lit` dependencies

`<json-resume>` uses [`lit`](https://lit.dev) and [`@lit/task`](https://lit.dev/docs/data/task/) which must be imported into your HTML file. You can include dependencies with an [importmap](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) like this:

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://esm.run/lit",
      "@lit/task": "https://esm.run/@lit/task"
    }
  }
</script>
```

### Add jsonresume-component

`unpkg` points directly to the lightly-bundled web component file, which does not include `lit`.

```html
<script type="module">
  import 'https://unpkg.com/jsonresume-component'
</script>
```

### Use the web component by giving it your `gist` ID

```html
<json-resume gist_id="54682f0aa17453d46cdc74bdef3172a3"></json-resume>
```

### The web component accepts a `resume.json` url

```html
<json-resume json_url="https://gist.githubusercontent.com/scottnath/54682f0aa17453d46cdc74bdef3172a3/raw/resume.json"></json-resume>
```

## Options 

### A modified JSON Resume schema

The JSON structure follows an extension of the [JSON Resume][jsonresume] schema with added schema structure for microdata `itemtype` on some content types, `basics.pronouns`, and `meta.themeOptions` which allows changing the content of the resume section titles, colors, and other theme opts. See the [jsonresume-theme-microdata][jtm] README for details on this adjusted structure.


## class: `JsonResume`, `json-resume`

### Fields

| Name              | Privacy | Type      | Default | Description                                                                                                                                                                                                    | Inherited From |
| ----------------- | ------- | --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `gist_id`         | public  | `string`  |         | GitHub gist ID. When present, calls the GitHub rest API to fetch a resume.json gist's content.&#xA;Checked first, if gist is present and has a resume.json, \`json\_url\` and \`local\_file\` will be ignored. |                |
| `json_url`        | public  | `string`  |         | URL to a JSON file. When present, used to fetch a resume.json file from the URL.&#xA;Checked second or if gist\_id does not have a resume.json, \`local\_file\` will be ignored.                               |                |
| `preordered`      | public  | `boolean` |         | When true, sections of resume (basic, work, etc) will be injected according to their order in resume.json                                                                                                      |                |
| `label`           | public  | `string`  |         | The aria-label for the \`div\` containing the resume. Defaults to \`${basics.name}'s resume\`                                                                                                                  |                |
| `globalizeStyles` | public  | `boolean` |         | When styles are generated internally, repeat them onto the global document (page)&#xA;\*\*WARNING\*\* Completely deletes and overrides page styles                                                             |                |
| `resumejson`      | public  | `object`  |         | Property accepts a JSON Resume object                                                                                                                                                                          |                |
| `stylesheet`      | public  | `string`  |         | Accepts a string containing styles&#xA;\*\*WARNING\*\* Completely deletes and overrides internal component styles                                                                                              |                |

### CSS Properties

| Name                  | Default | Description           |
| --------------------- | ------- | --------------------- |
| `--card-border-color` | `#ccc`  | The card border color |
| `--card-border-size`  | `1px`   | The card border color |
| `--card-border-style` | `solid` | The card border color |

### CSS Parts

| Name           | Description                        |
| -------------- | ---------------------------------- |
| `basics`       | style the \`basics\` section       |
| `work`         | style the \`work\` section         |
| `volunteer`    | style the \`volunteer\` section    |
| `education`    | style the \`education\` section    |
| `awards`       | style the \`awards\` section       |
| `certificates` | style the \`certificates\` section |
| `publications` | style the \`publications\` section |
| `skills`       | style the \`skills\` section       |
| `languages`    | style the \`languages\` section    |
| `interests`    | style the \`interests\` section    |
| `references`   | style the \`references\` section   |
| `projects`     | style the \`projects\` section     |
| `meta`         | style the \`meta\` section         |

### Slots

| Name           | Description                                      |
| -------------- | ------------------------------------------------ |
| `basics`       | Replace the entire \`basics\` HTML section       |
| `work`         | Replace the entire \`work\` HTML section         |
| `volunteer`    | Replace the entire \`volunteer\` HTML section    |
| `education`    | Replace the entire \`education\` HTML section    |
| `awards`       | Replace the entire \`awards\` HTML section       |
| `certificates` | Replace the entire \`certificates\` HTML section |
| `publications` | Replace the entire \`publications\` HTML section |
| `skills`       | Replace the entire \`skills\` HTML section       |
| `languages`    | Replace the entire \`languages\` HTML section    |
| `interests`    | Replace the entire \`interests\` HTML section    |
| `references`   | Replace the entire \`references\` HTML section   |
| `projects`     | Replace the entire \`projects\` HTML section     |
| `meta`         | Replace the entire \`meta\` HTML section         |

<hr/>

## Exports

| Kind                        | Name          | Declaration | Module       | Package |
| --------------------------- | ------------- | ----------- | ------------ | ------- |
| `js`                        | `JsonResume`  | JsonResume  | src/index.js |         |
| `custom-element-definition` | `json-resume` | JsonResume  | src/index.js |         |



[microdata-html]: /blahg/microdata-with-html/
[microdata-jsonresume]: /blahg/microdata-with-jsonresume/
[jsonresume]: https://jsonresume.org
[jsonresume-schema]: https://github.com/jsonresume/resume-schema/blob/master/schema.json
[jsonresume-project]: https://jsonresume.org/projects/
[jtm]: https://github.com/scottnath/jsonresume-theme-microdata
[jtm-example]: https://github.com/scottnath/jsonresume-theme-microdata/TBD___
[jte]: https://github.com/rbardini/jsonresume-theme-even