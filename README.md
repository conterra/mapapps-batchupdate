[![devnet-bundle-snapshot](https://github.com/conterra/mapapps-batchupdate/actions/workflows/devnet-bundle-snapshot.yml/badge.svg)](https://github.com/conterra/mapapps-batchupdate/actions/workflows/devnet-bundle-snapshot.yml)
![Static Badge](https://img.shields.io/badge/tested_for_map.apps-4.19.1-%20?labelColor=%233E464F&color=%232FC050)
# Batchupdate Bundle
The Batchupdate Bundle allows the update of feature attributes in the result-ui in batches.

## Sample app
https://demos.conterra.de/mapapps/resources/apps/public_demo_batchupdate/index.html

![Screenshot App](https://github.com/conterra/mapapps-batchupdate/blob/main/screenshot.JPG)

## Installation guide
1. Add the bundle `dn_batchupdate` to your app.
2. Configure batchupdate tools as described in the [Documentation](https://github.com/conterra/mapapps-welcome/tree/main/src/main/js/bundles/dn_batchupdate).

## Development guide
Run the following commands from the project root directory to start a local development server:

```bash
# install all required node modules
$ mvn initialize

# start dev server
$ mvn compile -Denv=dev -Pinclude-mapapps-deps

# run unit tests
$ mvn test -P run-js-tests,include-mapapps-deps
```
