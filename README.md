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

```html
<script type="module">
  import 'https://esm.run/jsonresume-component'
</script>
```

### Use the web component by giving it your `gist` ID

```html
<json-resume gist_id="9e7a7ceb9425336c6aa08d58afb63b8d"></json-resume>
```

## A modified JSON Resume schema

The JSON structure follows an extension of the [JSON Resume][jsonresume] schema with added schema structure for microdata `itemtype` on some content types, `basics.pronouns`, and `meta.themeOptions` which allows changing the content of the resume section titles, colors, and other theme opts. See the [jsonresume-theme-microdata][jtm] README for details on this adjusted structure.


[microdata-html]: /blahg/microdata-with-html/
[microdata-jsonresume]: /blahg/microdata-with-jsonresume/
[jsonresume]: https://jsonresume.org
[jsonresume-schema]: https://github.com/jsonresume/resume-schema/blob/master/schema.json
[jsonresume-project]: https://jsonresume.org/projects/
[jtm]: https://github.com/scottnath/jsonresume-theme-microdata
[jtm-example]: https://github.com/scottnath/jsonresume-theme-microdata/TBD___
[jte]: https://github.com/rbardini/jsonresume-theme-even