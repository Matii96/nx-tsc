# Nx-tsc

<div align="center">

[![MIT Licensed](https://img.shields.io/badge/License-MIT-brightgreen)](/LICENSE)

[Typescript](https://www.typescriptlang.org) executor for [Nx workspace](https://nx.dev).

</div>

## Why?

Nx only allows to use webpack as ts builder. While it has benefits like slightly reduced bundle size, it makes using build-reliant libraries like [MikroORM](https://mikro-orm.io) a pain to use as it prevents distribution directory exploration.

## How?

Nx-tsc eliminates this problem by introducing a full-fledged tsc build keeping hot-reload (serve) option.

## Installation

```bash
$ npm i --save-dev @matii96/nx-tsc
```

## Example

App's project.json:

```json
{
  "root": "apps/my-app",
  "sourceRoot": "apps/my-app/src",
  "projectType": "application",
  "targets": {
    "build": {
      "executor": "@matii96/nx-tsc:build",
      "options": {
        "main": "apps/my-app/src/main.js",
        "tsConfig": "apps/my-app/tsconfig.app.json",
        "assets": ["apps/my-app/src/assets"]
      },
      "configurations": {
        "production": {
          "optimization": true,
          "extractLicenses": true,
          "inspect": false,
          "fileReplacements": [
            {
              "replace": "apps/my-app/src/environments/environment.ts",
              "with": "apps/my-app/src/environments/environment.prod.ts"
            }
          ]
        }
      }
    },
    ...
  },
  "tags": []
}
```

App's tsconfig.app.json:

```json
{
  "compilerOptions": {
    "outDir": "../../dist/out-tsc/my-app",
    ...
  },
  ...
}
```

Nothing changes in serve and build commands:

```bash
$ nx serve my-app
$ nx build my-app
```

## Options

| Property       | What it does                                           | Required |
|----------------|--------------------------------------------------------|----------|
| `main`         | The name of the main entry-point file                  | &check;  |
| `tsConfig`     | The name of the Typescript configuration file          | &check;  |
| `assets`       | List of static application assets                      | &check;  |
| `watch`        | Run build when files change                            |          |
| `debounceTime` | Debounce timeout after last file change for watch mode |          |              |

## License

Nx-tsc is [MIT licensed](LICENSE).
