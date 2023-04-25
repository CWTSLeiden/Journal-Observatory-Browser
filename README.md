## The Journal Observatory Browser

The Journal Observatory Browser is a proof-of-concept demonstrator showing the power of integrating journal information from diverse open data sources to support three use-case areas: open access publishing, preprinting and peer review procedures.

The Journal Observatory Browser aggregates data from [DOAJ](https://doaj.org), [Sherpa Romeo](https://sherpa.ac.uk/romeo/), [OpenAlex](https://openalex.org) and [Wikidata](https://www.wikidata.org), as well as data provided by publishers.

The Journal Observatory Browser uses the [Scholarly Communication Platform Framework](https://journalobservatory.org/framework/) developed in the [Journal Observatory](https://journalobservatory.org) project funded by the [Dutch Research Council (NWO)](https://www.nwo.nl/en).

The Journal Observatory Browser has been developed by [Bram van den Boomen](https://orcid.org/0009-0005-5127-1200) and [Nees Jan van Eck](https://orcid.org/0000-0001-8448-4521) at the [Centre for Science and Technology Studies (CWTS)](https://www.cwts.nl) at [Leiden University](https://www.universiteitleiden.nl/en).

The Journal Observatory Browser has been developed in JavaScript using [React](https://github.com/facebook/react), [Material-UI](https://github.com/mui/material-ui), and a few other open source libraries.

## Usage

The Journal Observatory Browser is hosted at https://app.journalobservatory.org.

## License

The Journal Observatory Browser is distributed under the [MIT license](LICENSE).

## Issues

If you encounter any issues, please report them using the [issue tracker](https://github.com/CWTSLeiden/Journal-Observatory-Browser/issues) on GitHub.

## Contribution

You are welcome to contribute to the development of The Journal Observatory Browser. Please follow the typical GitHub workflow: Fork from this repository and make a pull request to submit your changes. Make sure that your pull request has a clear description and that the code has been properly tested.

## Development and deployment

The latest stable version of the code is available from the [`main`](https://github.com/CWTSLeiden/Journal-Observatory-Browser/tree/main) branch on GitHub. The most recent code, which may be under development, is available from the [`develop`](https://github.com/CWTSLeiden/Journal-Observatory-Browser/tree/develop) branch.

### Requirements

To run the Journal Observatory Browser locally and to build production-ready bundles, [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com) need to be installed on your system.

### Setup

Run
```
npm install
```
to install all required Node.js packages.

### Development

Run
```
npm start
```
to build a development version and serve it with hot reload at [http://localhost:3000](http://localhost:3000).

### Deployment

Run
```
npm run build
```
to build a deployment version. The production-ready minified bundle is stored in the `build/` folder.
