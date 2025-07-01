# Pet Vaccination Tracker 🐾

A full-stack Next.js application for tracking pet vaccinations, built for a technical interview brief. This application demonstrates modern React/TypeScript development patterns, database integration, and thoughtful UI/UX design.

## ✅ Features Implemented

### Core Requirements (All Complete)
- ✅ **Pet vaccination display** - Sortable table with comprehensive vaccination records
- ✅ **Addable vaccination types** - Dynamic vaccination types stored in database
- ✅ **Due date calculation** - Exactly 1 year from last completion or when pet turns 1 year old
- ✅ **Status tracking** - Completed, Due Soon (≤30 days), Overdue with visual indicators
- ✅ **Mark vaccinations complete** - Inline editing with date picker functionality
- ✅ **British date format** - DD/MM/YYYY format throughout the application
- ✅ **Database integration** - SQLite with Prisma ORM for robust data management
- ✅ **REST API** - Complete CRUD endpoints for all operations
- ✅ **Next.js with TypeScript** - Modern full-stack architecture

### Advanced Features Added
- 🎯 **Sortable table** - Click column headers to sort by status, due date, etc.
- 🎨 **Professional UI** - Custom color palette, Comfortaa font, responsive design
- � **Inline editing** - Mark vaccinations complete directly in the table
- 🔄 **Modal forms** - Add new vaccination records with dynamic type dropdown
- 🏷️ **Status badges** - Color-coded badges with Lucide icons for visual clarity
- 🧩 **Modular architecture** - Reusable components and utility functions
- 📚 **Comprehensive documentation** - Detailed code comments and setup instructions

### Technical Excellence
- **TypeScript** - Full type safety throughout the application
- **Component Architecture** - Reusable StatusBadge and SortableHeader components
- **Utility Libraries** - Separated concerns for dates, status calculation, and sorting
- **API Design** - RESTful endpoints with proper error handling
- **Code Organization** - Clean folder structure with logical separation
- **Performance** - Optimized rendering and efficient state management

### Suggested Improvements
### Suggested Improvements

#### Core Features
- Status filters (show only overdue/due soon)
- SSR implementation for better performance
- New vaccination type creation via UI
- (AI suggested) Enhanced error handling and user feedback

#### User Experience/Business Related 
- Accessibility improvements (ARIA labels, keyboard navigation)
- Mobile optimization for better responsive design
- Pet photo upload and management
- Integrate breed-specific medical issues modal
- Pet weight and vitals tracking

#### System Architecture
- Tie pet to owner record and CMS
- Add data validation and sanitization
- Implement caching for better performance
- (AI suggested) Add real-time updates with WebSocket
- Implement proper logging system

#### Security
- (AI suggested) Add rate limiting
- (AI suggested) Implement input validation
- (AI suggested) Add API authentication
- (AI suggested) Data encryption at rest


## 🚀 Quick Start

### One-time Setup
```bash
npm run setup
```
This will install dependencies, generate Prisma client, and set up the database.

### Daily Development Commands

#### Start the app
```bash
npm run dev
```
Opens the Next.js app at http://localhost:3000

#### View/Edit Database
```bash
npm run db:studio
```
Opens Prisma Studio at http://localhost:5555

#### Quick Database Commands
```bash
npm run db:push      # Push schema changes to database
npm run db:generate  # Generate Prisma client after schema changes
npm run seed         # Populate database with sample data
```

### Quick Start (Fresh Setup)
1. Clone the repo
2. Run: `npm run setup`
3. Seed the database: `npm run seed`
4. Start development: `npm run dev`
5. View database: `npm run db:studio`

## 📊 Database Schema
- **Pet** - Store pet information (name, species, breed, birth date)
- **VaccinationType** - Vaccine types with recurrence intervals
- **VaccinationRecord** - Track vaccination history with completion dates

## 🔧 Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (easily switchable to PostgreSQL/MySQL)
- **UI Components**: Lucide React icons, custom components
- **Development**: ESLint, Prettier, Turbopack

## 🎯 Future Enhancement Suggestions

### Bonus Features (Interview Brief)
- [ ] **SSR Implementation** - Server-side rendering for better performance
- [ ] **Status Filters** - Filter table by overdue, due soon, completed vaccinations

### Product Enhancements
- [ ] **Multi-pet Support** - Switch between different pets in the same household
- [ ] **Vaccination Type Management** - Add/edit vaccination types via UI
- [ ] **Reminder System** - Email/SMS notifications for upcoming vaccinations
- [ ] **Veterinarian Integration** - Connect with local vet practices
- [ ] **Photo Upload** - Add pet photos and vaccination certificates
- [ ] **Export Functionality** - Generate PDF vaccination records

### Technical Improvements
- [ ] **Authentication** - User accounts and pet ownership
- [ ] **API Documentation** - Swagger/OpenAPI specification
- [ ] **Testing Suite** - Unit and integration tests
- [ ] **Deployment** - Production deployment with Vercel/Railway
- [ ] **Mobile App** - React Native companion app
- [ ] **Accessibility** - WCAG compliance improvements
- [ ] **Performance** - Advanced caching and optimization
- [ ] **Monitoring** - Error tracking and analytics

### Advanced Features
- [ ] **Batch Operations** - Mark multiple vaccinations complete
- [ ] **Data Visualization** - Charts showing vaccination compliance
- [ ] **Search & Filtering** - Advanced search across pets and records
- [ ] **Backup & Sync** - Cloud backup and multi-device sync
- [ ] **Integration APIs** - Connect with veterinary management systems

## 📝 Development Notes

### Code Structure
```
src/
├── app/                 # Next.js app directory
│   ├── api/            # REST API endpoints
│   ├── globals.css     # Global styles and Tailwind
│   └── page.tsx        # Main application component
├── components/         # Reusable UI components
├── lib/               # Utility functions and helpers
└── ...
```

### Key Files
- `/src/app/page.tsx` - Main UI component with state management
- `/src/lib/dateUtils.ts` - Date formatting and calculation utilities
- `/src/lib/vaccinationUtils.ts` - Status calculation and business logic
- `/src/components/StatusBadge.tsx` - Reusable status indicator component
- `/prisma/schema.prisma` - Database schema definition

Happy coding! 🚀
