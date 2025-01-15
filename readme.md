# portfolio tracking project

Portfolio manager to track a portfolio over time. Facilitates the maintenance of a list of transactions of arbitrary assets and produces analytics based on that list, such as aggregates of the assets currently held, the historic price action of those assets, as well as the historic and current performance of the portfolio. 

### future plans:
- import from exchange data
- export data for tax purposes
- wallet monitoring for automatic transaction imports

## getting started

#### requirements:   
- deno
- docker (for postgres, use other db credentials and don't use `./run_local_db_docker.sh`)

1. Create a `.env` file in the project root based on `./.env.example`

2. `deno run local`

> default api key: 12345

## migrations

```sh
# create a local postgres db:
./run_local_db_docker.sh

# generate migration files based on `./drizzle/schema.ts`:  
deno --env -A --node-modules-dir npm:drizzle-kit generate --name=migration_name

# add custom migration(empty migration file to fill out):
deno --env -A --node-modules-dir npm:drizzle-kit generate --custom --name=migration_name

# apply migrations db:
deno --env -A --node-modules-dir npm:drizzle-kit migrate
```

## deploying

Auto deploys to deno deploy on push to master, via `.github/workflows/deploy.yml`
