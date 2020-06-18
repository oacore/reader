# CORE PDF Reader

CORE Reader is a full-featured PDF viewer with enhancements especially for academic papers built on top of [PDF.js](https://mozilla.github.io/pdf.js/)

## Installation & Preview

The project requires [**Node.js**][node-download] and
[**NPM**][npm-install] package manager.

After cloning this repository you will need to generate Github Token with package read permission [here][github-token] in order to download our @oacore packages from Github NPM registry.

```sh
export NPM_TOKEN=<github_token_with_packages_read_permission>
npm install      # to install all dependencies
npm run dev      # to start simple development server
```

Open [localhost:3000](http://localhost:3000) to preview.

## Production deployment

For using on production you need to run these commands:

```sh
npm install        # to install all dependencies
npm run build      # to build all files for next server (stored in .next folder)
npm run start      # to start simple development server
```

Server starts listen on `0.0.0.0:3000`

[github-token]: https://github.com/settings/tokens
[node-download]: https://nodejs.org/en/download/
[npm-install]: https://www.npmjs.com/get-npm
