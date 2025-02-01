# nestjs-libs

Within this repository you can find some utility libs for [NestJS](https://docs.nestjs.com/):

- AsyncLocalStorage based
    - [nestjs-typeorm-transactional](./libs/nestjs-typeorm-transactional/README.md)


## Run tasks

To run the dev server for your app, use:

```sh
bun nx serve nestjs-server
```

To create a production bundle:

```sh
bun nx build nestjs-server
```

To see all available targets to run for a project, run:

```sh
bun nx show project nestjs-server
```
