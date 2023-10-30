This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Stack

1. Next.js (using app router)
2. tRPC
   - superjson as transformer
   - zod as validator
3. Drizzle
4. Neon Postgres
   - Neon serverless driver
5. Lucia auth
6. neverthrow
7. Chakra-ui
8. Cypress
9. t3-env
10. ts-reset

## To-do

1. Add Chakra
2. Figure out state management / storing user on the client
3. Add neverthrow
4. Explore https://nextjs.org/docs/app/api-reference/next-config-js/incrementalCacheHandlerPath

## Requirements

- Authenticate users via JWT (login/signup pages + logout button on settings page)
- CRU- users (sign up & settings page - no deleting required)
- CRUD Articles
- CR-D Comments on articles (no updating required)
- GET and display paginated lists of articles
- Favorite articles
- Follow other users

## Added requirements

- Rate limiting
