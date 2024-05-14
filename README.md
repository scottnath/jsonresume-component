# jsonresume-web-component

A web component (using LitElement) which presents resume content stored in [JSON Resume][jsonresume] format. The HTML structure uses the methods in [jsonresume-theme-microdata][jtm] to generate HTML which includes structured data as microdata in HTML attributes.

## Installation

```javascript
npm i jsonresume-web-component
```

## A modified JSON Resume schema

The JSON structure follows an extension of the [JSON Resume][jsonresume] schema with added schema structure for microdata `itemtype` on some content types, `basics.pronouns`, and `meta.sectionTitles` which allows changing the content of the resume section titles. See the [jsonresume-theme-microdata][jtm] README for details on this adjusted structure.


[microdata-html]: /blahg/microdata-with-html/
[microdata-jsonresume]: /blahg/microdata-with-jsonresume/
[jsonresume]: https://jsonresume.org
[jsonresume-schema]: https://github.com/jsonresume/resume-schema/blob/master/schema.json
[jsonresume-project]: https://jsonresume.org/projects/
[jtm]: https://github.com/scottnath/jsonresume-theme-microdata
[jtm-example]: https://github.com/scottnath/jsonresume-theme-microdata/TBD___
[jte]: https://github.com/rbardini/jsonresume-theme-even