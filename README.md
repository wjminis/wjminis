# WJMinis

[issues]: https://github.com/wjminis/wjminis/issues/new/choose

WillsterJohnson's Mini packages, a growing collection of JavaScript utility
packages.

## "30 seconds; Tell Me Why I Should Care"

- Always typed with [TypeScript](https://www.typescriptlang.org/)
- Zero external dependencies (excluding framework-specific packages)
- Comprehensive documentation
- [New minis at your request][issues]
- Free and Open Source under the [GPL-3.0 License](./LICENSE)

## Minis

Packages are called "Minis" here for (hopefully) obvious reasons.

Some Minis are not yet released, these will show an "invalid" badge.

|                   Mini                    | Description                                                    |
| :---------------------------------------: | -------------------------------------------------------------- |
|                 **files**                 | **Files, filesystem, and paths**                               |
|         [![files.rw v]][files.rw]         | Read and write files with a simplified API                     |
|      [![files.parse v]][files.parse]      | Enhanced parsers and serializers for various data formats      |
|       [![files.path v]][files.path]       | Simple and powerful paths. Supports URLs                       |
|                 **time**                  | **Make programming time human-friendly**                       |
|    [![time.duration v]][time.duration]    | A micro-DSL for time durations in JavaScript.                  |
|                 **vite**                  | **Packages for use in Vite projects**                          |
|   [![vite.devblocks v]][vite.devblocks]   | Write dev-only code which disappears at build time (Vite only) |
| [![vite.test-inline v]][vite.test-inline] | Write micro tests anywhere in your code (Vite only)            |
|  [![vite.true-paths v]][vite.true-paths]  | TSconfig `paths` are replaced in import statements (Vite only) |
|                **wjminis**                | **Meta packages**                                              |
|  [![wjminis.manager v]][wjminis.manager]  | Beautiful CLI & Web interface for installing/removing Minis    |

[files.rw]: ./packages/files.rw/README.md
[files.rw v]: https://img.shields.io/npm/v/%40wjminis/files.rw?color=444&logo=npm&style=for-the-badge&label=files.rw
[files.parse]: ./packages/files.parse/README.md
[files.parse v]: https://img.shields.io/npm/v/%40wjminis/files.parse?color=444&logo=npm&style=for-the-badge&label=files.parse
[files.path]: ./packages/files.path/README.md
[files.path v]: https://img.shields.io/npm/v/%40wjminis/files.path?color=444&logo=npm&style=for-the-badge&label=files.path
[time.duration]: ./packages/time.duration/README.md
[time.duration v]: https://img.shields.io/npm/v/%40wjminis/time.duration?color=444&logo=npm&style=for-the-badge&label=time.duration
[vite.devblocks]: ./packages/vite.devblocks/README.md
[vite.devblocks v]: https://img.shields.io/npm/v/%40wjminis/vite.devblocks?color=444&logo=npm&style=for-the-badge&label=vite.devblocks
[vite.test-inline]: ./packages/vite.test-inline/README.md
[vite.test-inline v]: https://img.shields.io/npm/v/%40wjminis/vite.test-inline?color=444&logo=npm&style=for-the-badge&label=vite.test-inline
[vite.true-paths]: ./packages/vite.true-paths/README.md
[vite.true-paths v]: https://img.shields.io/npm/v/%40wjminis/vite.true-paths?color=444&logo=npm&style=for-the-badge&label=vite.true-paths
[wjminis.manager]: ./packages/wjminis.manager/README.md
[wjminis.manager v]: https://img.shields.io/npm/v/%40wjminis/wjminis.manager?color=444&logo=npm&style=for-the-badge&label=wjminis.manager

### Apps

All apps are hosted at `*.wjminis.dev`. The names below use [reverse domain name notation], so the
mini app `foo.bar` is actually located at `bar.foo.wjminis.dev`.

Some apps are not yet released, these will show a "resource not found" badge.

[reverse domain name notation]: https://en.wikipedia.org/wiki/Reverse_domain_name_notation

|             Name              | URL                      | Description                                                       |
| :---------------------------: | ------------------------ | ----------------------------------------------------------------- |
| [![thumbnails s]][thumbnails] | [thumbnails.wjminis.dev] | A simple image generator with [ever-increasing][issues] features. |

[thumbnails]: ./apps/thumbnails/README.md
[thumbnails s]: https://img.shields.io/endpoint?url=https%3A%2F%2Fthumbnails.wjminis.dev&color=444&logo=npm&style=for-the-badge&label=thumbnails
[thumbnails.wjminis.dev]: https://thumbnails.wjminis.dev
