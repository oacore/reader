# CORE PDF Reader

CORE Reader is a full-featured PDF viewer with enhancements especially for academic papers built on top of [PDF.js](https://mozilla.github.io/pdf.js/)


## Installation & Preview

The project requires [__Node.js__][node-download] and
[__Yarn__][yarn-install] package manager.

After cloning this repository you need to generate CORE API key [__here__][core-api] and CORE Recommender API key [__here__][recommender-api]. These API keys need to be put in [__`.env`__][env-file] file.

```sh
yarn install  # to install all dependencies
yarn dev      # to start simple development server
```

Open [localhost:3000](http://localhost:3000) to preview.

[node-download]: https://nodejs.org/en/download/
[yarn-install]: https://yarnpkg.com/lang/en/docs/install/
[core-api]: https://core.ac.uk/api-keys/register/
[env-file]: https://github.com/oacore/reader/blob/master/.env
[recommender-api]: https://core.ac.uk/recommender/register/
