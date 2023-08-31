- migrations

  -> create
  >> npm run knex -- migrate:make create-<table_name>s

  -> run
  >> npm run knex -- migrate:latest

  -> rollback
  >> npm run knex -- migrate:rollback

  -> add
  >> npm run knex -- migrate:make add-<column_name>-to-<table_name>