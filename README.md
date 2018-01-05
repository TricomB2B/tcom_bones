# Drupal 8 Base Theme

This is the repository for TricomB2B's Drupal 8 base theme. It's kewl!

## Requirements

First things first, this is a gulp-based workflow, so you'll need [Node](https://nodejs.org/), [NPM](https://www.npmjs.com/), [Yarn](https://yarnpkg.com/), and [Gulp](http://gulpjs.com/) installed.

#### Install Node and NPM

If you do not already have Node and NPM installed, follow the instructions on the [Official Node Installation Page](https://nodejs.org/en/download/package-manager/). Recommended to install the LTS version (labeled "Recommended for most users").

#### Install Yarn

This is an alternate package manager to NPM. It is much faster, improves dependency management, and allows for a lock on package versioning, which is beneficial when working with a team.

Follow the [Official Yarn Installation](https://yarnpkg.com/en/docs/install) instructions for your OS.

#### Install Gulp

From a shell prompt:

```sh
$ npm install -g gulp-cli
```

You're now ready to go!

## Theme Installation

In your Drupal 8 installation, copy or clone this repository into `/themes/custom/`. At this point you **must** change the name of the theme directory to something more project-specific, as well as rename and edit the theme's directory, `.info.yml`,  `.libraries.yml`, and `.theme` files and edit with a project specific theme name. Your name should be all lowercase, with underscores instead of spaces.

Next install the dependencies:

```sh
$ cd /path/to/drupal/themes/custom/example
$ yarn
```

And build the default CSS and JavaScript

```sh
$ gulp build
```

Follow the file specific sections below for information on what to edit in the files to complete installation.

#### Libraries File

`*.libraries.yml`

```yaml
main:
  version: 1.x
  css:
    theme:
      css/main.css: { minified: false }
  js:
    js/main.js: { minified: false }

main-min:
  version: 1.x
  css:
    theme:
      css/main.min.css: {}
  js:
    js/main.min.js: {}

```

This file defines the various "libraries" the theme can utilize. To get started, we've provided a minified and non-minified library for the main theme JavaScript and CSS files. These files are dynamically built and must be built prior to theme activation (see above under Theme Installation). See the [Drupal Theme Documentation](https://www.drupal.org/docs/8/theming) for more information on this file, its options and structure.

#### Info File

`*.info.yml`

```yaml
name: TriComB2B Base Theme
type: theme
description: "TriComB2B's base Drupal 8 starter theme. Hack away!"
core: 8.x
version: 8.x-1.0.0
libraries:
  - tricom_drupal_8_base/main-min
base theme: stable
regions:
  header: Header
  content: Content
  footer: Footer
```

`name` and `description` should be adjusted on a per-project basis. `name` should be the same name you selected for the theme, but you can use spaces here as well as capitilization. This is the "display name" that will be shown in Drupal admin area.

`version` should stay unchanged so we have a reference point to which version of the base theme was used.

`libraries` is a definition of the libraries we've defined in the `*.libraries.yml` file that should be included on every page. Note that we've included `main-min` by default, but you must edit `tricom_drupal_8_base` with your theme's name.

`regions` is a list of regions that should be available. By default we've only included a few.

More information on the options available in this file can be found in the [Drupal Theme Documentation](https://www.drupal.org/docs/8/theming).

#### Theme File

`*.theme`

```php
<?php
/**
 * THEME FUNCTIONS
 */

// return the URL to the given file (generally used for images in theme)
function tricom_drupal_8_base_get_url ($path) {
  return file_create_url(drupal_get_path('theme', 'tricom_drupal_8_theme') . '/' . $path);
}

// add a standard viewport meta tag to the head of every document
// viewport meta tag is no longer required in drupal 8.
// this function is here as an example as well as to act as a stub
// for other page_attachments requirements
function tricom_drupal_8_base_page_attachments (&$page) {
  $viewport = array(
    '#tag'        => 'meta',
    '#attributes' => array(
      'name'    => 'viewport',
      'content' => 'width=device-width,initial-scale=1.0',
    )
  );

  //$page['#attached']['html_head'][] = [$viewport, 'viewport'];
}
```

This is a PHP file with the various theme functions and page processing. We've included a couple by default, but they must be edited in order to work. Simply change all instances of `tricom_drupal_8_base` with your theme's name.

`*_page_attachments` acts as stub and example for injecting tags into the page (typically the header).

`*_get_url` returns a URL for the given path relative to the root of the theme.

#### Complete Installation

At this point the theme can be activated. Flush your Drupal caches and in `Admin->Appearance` you can install and set your new theme as the default.

## Additional Theme Info

#### SVGs

For client logos, try to use SVG format. SVG is well-supported across modern browsers, is scalable and coloration can generally be modified via CSS. In short, it just works better for logos, looks good at any resolution, sizes well with `em`s, and has a reasonably small filesize.

For icons, also use SVGs, for many of the same reasons. Something like Font Awesome is nice, but is often fairly heavy-weight and if you only use a few glyphs, you've added a lot of CSS for very little value. [Entypo+](http://www.entypo.com/) is an SVG icon library I've often utilized, but you can also find all [FontAwesome glyphs as SVGs](https://github.com/encharm/Font-Awesome-SVG-PNG).

One thing to keep in mind is that for full SVG support you will need to provide both a width and height property in the CSS. Most browsers will handle automatically scaling one property or the other as necessary, but not all of them do. Providing a width and height will resolve most SVG sizing issues in certain browsers (Internet Explorer, hah). You will also likely want to set `pointer-events: none` on all SVGs, as there is a known browser limitation (IE and Edge, hah). We have already done this for you in our default Sass files.

You can include a `logo.svg` in the theme's root to act as a general logo you can use in the various templates. Not a bad idea on client sites as it makes accessing this vector file much easier. We've included one by default, but it should be replaced or removed.

#### Templates

Drupal 8 themes do not require any templates to function. However you can create Twig templates as needed, and they must live under the `./templates` directory. For more information on auto-replacing core templates, see [Twig Template naming conventions](https://www.drupal.org/node/2354645).

We've provided both `node.html.twig` and `page.html.twig` template files in our theme. However, these are just direct copies of the built-in templates. We've provided them for easy access to a commonly edit template, and just to provide examples of custom templating. They can be removed or modified as needed.

#### CSS and JS

All CSS and JS source code is under `./src`. We've provided little CSS or JS by default. Some very basic styling is provided, a CSS sanitizer/normalizer, and a few files that are more or less just there to get you hacking away. We have styled a few pieces of the Admin Toolbar which should prevent your other styles from modifying the admin toolbar's style.

For JS all we have provided is a modernizer-like touchevents test, which injects either a `touchevents` or `no-touchevents` class into the HTML tag, so that you can target various styles to specific device capabilities. We've also included a couple example files that should be copied when creating new Vanilla or jQuery JS modules. We've included Babel into the workflow, which will allow you to use ES6 features.

Note that jQuery is not included by default in Drupal 8. Do everything you can to use Vanilla JavaScript. If jQuery is absolutely required, you must set it as a dependency in the theme's `*.libraries.yml` file. See the documentation for more information on proper syntax here.

## Gulp

The Gulp workflow is designed around JavaScript and Sass capabilities. The biggest chunk of what Gulp does for us is concatenating, compiling, and minifying the JavaScript and Sass codebase. Here is a high-level bullet of the Gulp feature-set:

- Lint, concatenate, compile ES6 syntax, and minify JavaScript.
- Concatenate, compile, and minify Sass.
- Launch a [BrowserSync](https://browsersync.io/) server for live-reload and CSS injection.
- Watch all `.js`, `.scss`, and `.php` files for changes, and react to those changes as needed.
- Capability to concatenate and minify SVG files.
- Capability to optimize `.png` and `.jpg`/`.jpeg` images via the [TinyPNG](https://tinypng.com/) API.

#### Running Gulp

Most of the time while developing, you will have Gulp running in the background. You should launch Gulp via a terminal window, and just leave it running while you work. Here is how you would run the default task:

```sh
$ cd /path/to/drupal/sites/all/themes/tricom
$ gulp
[14:02:48] Requiring external module babel-register
[14:02:49] Using gulpfile ~/Projects/tricom-drupal-7-base/gulpfile.babel.js
[14:02:49] Starting 'fonts'...
[14:02:49] Finished 'fonts' after 2.83 ms
[14:02:49] Starting 'styles'...
[14:02:49] Starting 'js-lint'...
[14:02:49] Starting 'browser-sync-local'...
[14:02:49] Finished 'browser-sync-local' after 21 ms
[14:02:49] Starting 'watch'...
[14:02:51] Finished 'watch' after 1.39 s
[BS] Access URLs:
 ----------------------------------------
       Local: http://localhost:3000
    External: http://192.168.179.107:3000
 ----------------------------------------
          UI: http://localhost:3001
 UI External: http://192.168.179.107:3001
 ----------------------------------------
[BS] Serving files from: ./
[14:02:51] Finished 'js-lint' after 1.76 s
[14:02:51] Starting 'scripts'...
[14:02:52] Finished 'styles' after 3.04 s
[BS] 2 files changed (main.min.js.map, main.min.js)
[14:02:52] Finished 'scripts' after 1.13 s
[14:02:52] Starting 'default'...
[14:02:52] Finished 'default' after 2.29 μs
```

Note that the task does not end. Gulp is now actively watching all of your `.js`, `.scss`, `.php`, and `.twig` files for changes. Once a change is detected, it will re-run the relevant task and reload your browser once finished.

#### Gulpfile Settings

There are a handful of settings you can modify in `gulpfile.babel.js`. These can all be found at the top of the file.

```js
// Proxy URL (optional)
const proxyUrl = '*.dev';
// API keys
const TINYPNG_KEY = '';
// fontList
const fonts = [];
// vendors
const jsVendorList  = [];
const cssVendorList = [];
```

- **proxyUrl** - If you like to set up your local dev environment using vHosts, you can run BrowserSync and have it proxy a local URL. Use this variable for informing BrowserSync of this URL.
- **TINYPNG_KEY** - This is your API key to interface with TinyPNG. You can sign up for a free account which gives you 500 free requests per month.
- **fontList** - This is an array of any font files that will be required by the project. For the most part these will just be copied from the `src` directory over to the `dist` directory.
- **jsVendorList** - This is an array list of 3rd party JavaScript libraries. The list will be concatenated and minified and made available in `./dist/vendors`. If you are adding vendor libraries, be sure to include the `./dist/vendors/vendors.min.js` in your `.info` file.
- **cssVendorList** - Same as `jsVendors`, just for CSS libraries instead.

#### Gulp Tasks

Here's a list of the most common task chains made available via Gulp.

- `gulp` - Default task. Compiles source code, launches a standalone BrowserSync server, and watches for changes.
- `gulp local` - Same as the default task.
- `gulp proxy` - Compiles source code, launches a proxied BrowserSync server, and watches for changes. Note that in order for this to work, you must set the `proxyUrl` setting in the gulpfile.
- `gulp build` - Compiles source code and vendor files.
- `gulp vendors` - Compiles vendor files.
- `gulp images` - Concatenates SVG icons (in `./img/icons/*.svg`) and outputs an SVGStore file, optimizes all `.png` and `.jpg`/`.jpeg` files via TinyPNG API.

There are many more one-off gulp tasks. The are all documented in the gulpfile, feel free to peruse.

## License

See LICENSE file.