# Fast and Furious

Node.js framework for rapid development of real-time single-page web applications.

## Quick Start

### Install

```sh
$ npm install faf
```

### Directory Structure

```
your-app/
  |- client/
  |  |- src/
  |  |  |- app/
  |  |  |  |- %view-name%/
  |  |  |  |  |- %sub-view-name%/
  |  |  |  |  |  |- ...
  |  |  |  |  |- ...
  |  |  |  |  |- %view-name%.js
  |  |  |  |  |- %view-name%.scss
  |  |  |  |  |- %view-name%.spec.js
  |  |  |  |  |- %view-name%.tpl.html
  |  |  |  |- ...
  |  |  |  |- app.js
  |  |  |  |- app.scss
  |  |  |  |- app.spec.js
  |  |  |  |- app.tpl.html
  |  |  |- common/
  |  |  |  |- directives/
  |  |  |  |  |- %directive-name%/
  |  |  |  |  |  |- %directive-name%.js
  |  |  |  |  |  |- %directive-name%.scss
  |  |  |  |  |  |- %directive-name%.spec.js
  |  |  |  |  |  |- %directive-name%.tpl.html
  |  |  |  |  |- ..
  |  |  |  |- filters/
  |  |  |  |  |- ..
  |  |  |  |- services/
  |  |  |  |  |- ..
  |  |- vendor/
  |  |  |- %vendor-name%/
  |  |  |  |- %vendor-file%
  |  |  |  |- ..
  |  |  |- ..
  |- server/
  |  |- configs/
  |  |  |- env.local.js
  |  |  |- vendor.js
  |  |  |- server.dev.js
  |  |  |- server.prod.js
  |  |  |- ...
  |  |- controllers/
  |  |  |- %controller-name%.js
  |  |  |- ...
  |  |- modules/
  |  |  |- %module-name%.js
  |  |  |- ...
  |- index.js
```

### Examples

Sample app (cool chat): [https://github.com/ztrue/faf-sample-app](https://github.com/ztrue/faf-sample-app)
