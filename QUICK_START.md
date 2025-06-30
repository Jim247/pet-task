# Pet Vaccination Tracker - Quick Start 🐾

## One-time Setup
```bash
npm run setup
```
This will install dependencies, generate Prisma client, and set up the database.

## Daily Development Commands

### Start the app
```bash
npm run dev
```
Opens the Next.js app at http://localhost:3000

### View/Edit Database
```bash
npm run db:studio
```
Opens Prisma Studio at http://localhost:5555

### Quick Database Commands
```bash
npm run db:push      # Push schema changes to database
npm run db:generate  # Generate Prisma client after schema changes
```

## Quick Start (Fresh Setup)
1. Clone the repo
2. Run: `npm run setup`
3. Start development: `npm run dev`
4. View database: `npm run db:studio`

## Your Database Schema
- **Pet** - Store pet information (name, birth date)
- **VaccinationType** - Vaccine types with intervals
- **VaccinationRecord** - Track vaccination history

Happy coding! 🚀
