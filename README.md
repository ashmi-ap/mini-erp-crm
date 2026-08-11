# Mini ERP CRM

Monorepo scaffold for the ERP/CRM case study.

## Workspace Structure

- `apps/api`: Express + TypeScript backend
- `apps/web`: React + Vite frontend

## Current Scope

This repository currently contains the step 1 scaffold only:

- root workspace setup
- backend and frontend app initialization
- TypeScript configuration
- basic formatting files
- minimal backend health endpoint
- minimal React application

## Assumptions

- Challan cancellation is limited to `DRAFT -> CANCELLED` only.
- `CONFIRMED -> CANCELLED` is not allowed.
- Database, auth, customers, products, inventory, and challans will be added in later steps.

## Commands

- `npm run dev:api`
- `npm run dev:web`
- `npm run build`
- `npm run typecheck`
