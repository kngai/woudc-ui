# woudc-ui

> Next version of WOUDC UI using Nuxt and VueJS.

## Build Setup

- Install NodeJS
- Create a **copy** of the `.env.sample` file and **rename** to `.env`
  - `WOUDC_UI_BASE_URL` should be the domain name of your app
  - `WOUDC_UI_ROUTER_BASE` The base URL of the app. For example, if the entire single page application is served under `/app/`, then base should use the value `'/app/'`

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000, dotenv reference to .env file
$ npm run dev

# OR serve with hot reload at localhost:3000, dotenv reference to .env.sample file
$ npx nuxt dev --dotenv .env.sample

# build for production, optional reference to --dotenv to .env.ops file
$ npx nuxt build --dotenv .env.ops

# build for production and launch server for SSR (requires NodeJS server)
$ npm run build
$ npm run start

# generate static deployment: https://nuxtjs.org/guide#static-generated-pre-rendering-
$ npm run generate
# Optional: preview deployment in localhost from /dist
$ npm run start

# OR generate static deployment with optional reference to --dotenv file
$ npx nuxt generate --dotenv .env.ops
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).


## Docker

Docker commands:
```bash
# build
docker build -t woudc-ui .

# run container
docker run -d -p 6081:6081 woudc-ui
```

Docker compose commands:
```bash
# build
docker compose -f docker-compose.yml build

# take down container
docker compose -f docker-compose.yml down

# ensure container is removed
docker container rm -f woudc-ui-nightly

# run container
docker compose -f docker-compose.yml up -d
```

## SPA fallback in deployment

Since not all pages in WOUDC will be pre-generated, a fallback is required to redirect to `200.html` to handle pages with dynamic data.

Apache server mod-rewrite example (deployed to subfolder `/subfolder-name` as the base route):
```xml
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /subfolder-name/
RewriteRule ^subfolder-name/200\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /subfolder-name/200.html [L]
</IfModule>
```

After building your files (`npm run build`), you can copy the `.htaccess` sample to your `/dist` for convenience and modify it to according to your server settings. 

```bash
# modify to your web server specs
vi .htaccess

# build
npm run build

# copy to /dist
cp .htaccess ./dist
```

Or modify your apache `.conf` setting for your application in similar fashion if you're not using `.htaccess` files. Example with application deployed on root domain:
```xml
<Location />
  RewriteEngine On
  RewriteBase /
  RewriteRule ^200\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /200.html [L]
</Location>

## Environment variables (.env)

This project includes a `.env.sample` file. **You must copy the file and rename as `.env` and edit with your environment variables so that Nuxt will load it in by default.** You can have multiple `.env` files and reference it directly on build or dev.

```bash
# Development
$ npx nuxt dev --dotenv .env.sample

# Build
$ npx nuxt generate --dotenv .env.ops
```

## Debian packaging and general release tagging for OPS

- Update `version` in `package.json`
- Ensure `.env` and `woudc-ui.conf` in `/deploy/default` are set correctly 
- Update `/debian/changelog` with `dch` command:
  - `dch -v x.y.z -u medium -D bionic -M` where `x.y.z` is the version (ie. `2.0.0-beta1`)
- Commit the `changelog` into repo: 
  - `git commit -m 'update release version' debian/changelog`
  - `git push upstream master`
- Create git tag in one of two ways:
  - https://github.com/woudc/woudc-ui/releases and click on **Draft a new release** button
  - git command line:
    - `git tag -a x.y.z -m 'tagging x.y.z'`
    - `git push --tags`
- Inform OPS team of URL of `.zip` or `tar.gz` file for install to server
  - example URL: https://github.com/woudc/woudc-ui/releases/tag/2.0.0-beta4

## Linting and Prettier

**Recomendation**: If using VS Code, install the extention, [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint). Then add the following settings to your `settings.json` for ESLint:

```json
    "eslint.options": {
        "extensions": [".html", ".js", ".vue"]
    },
    "eslint.validate": [
        "vue",
        "html",
        "javascript"
    ]
```

Linting is incorporated when running `npm run dev` and when you `git commit`.

Your code can be linted by running `npm run lint` to check for validation. You can also run `npm run lintfix` to apply corrections where it can to your code.

## Design

[Vuetify](https://vuetifyjs.com/en/introduction/why-vuetify) was chosen for the styling and theme, which applies the [Material design specification](https://material.io/design/). [UI components](https://vuetifyjs.com/en/components/api-explorer) from Vuetify should be used for any user interactable components. Some of the UI components have `nuxt` support (ie. for routing).

## SEO

SEO is handled by Nuxt in the [`head()` method](https://nuxtjs.org/api/pages-head). 

### Microdata

In addition, [Microdata](https://schema.org/docs/gs.html) is incorporated to give further context to individual pages (ie. including html attributes `itemscope`, `itemprop`, `itemtype`). To validate your Microdata, use [Google's structured data testing tool](https://search.google.com/structured-data/testing-tool); using "View page source" of your page, and copying and pasting into the code snippet.

### i18n

Translation of SEO text is handled by `nuxt-i18n`. Please see the [nuxt-i18n SEO guide](https://nuxt-community.github.io/nuxt-i18n/seo.html) on how it works and other configuration.

## Translation (i18n)

The i18n framework is configured with [nuxt-i18n](https://nuxt-community.github.io/nuxt-i18n/) and is integrated with `vue-i18n`.

### Routing

Please see the [nuxt-i18n routing guide](https://nuxt-community.github.io/nuxt-i18n/routing.html).

### Translate

To translate text:

- **Recommended**: In VS Code, use the [i18n Ally](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally) extension
- Use [BabelEdit](https://www.codeandweb.com/babeledit/download) and load the `.babel` file in the root of the project. If there are new `.vue` components, they need to be added in (by file or by folder). If translation needs to be sent to a 3rd party translator, BabelEdit can export the translation to a `CSV` which can be sent off to the translator. Once completed, import the `CSV` in to BabelEdit to apply the completed translations.
- Alternatively, use the FOSS program called [i18n Manager](https://github.com/gilmarsquinelato/i18n-manager) to manage translation text.

## Testing

Unit testing is done using [Jest](https://jestjs.io/docs/en/expect#content) and can be run by the command: `npm run test`.

Please see the guide on [testing single file components with Jest](https://vue-test-utils.vuejs.org/guides/#testing-single-file-components-with-jest).

**Tip:** Don't write unit test for every single case. Instead, the next time you get an error in your development, write a unit test in the `/test` folder to help validate your code.

# E2E Testing 

Cypress E2E testing quickly verifies whether each web page is working properly and that API calls are properly returned.

```bash
#install cypress
npm install cypress --save-dev

#run e2e tests
npm run cypress:open
```
