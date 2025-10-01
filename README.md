# MySanta - Gift List Manager

A modern, minimalist web application for creating and sharing gift lists with friends and family.

## Features

- **User Authentication**: Google OAuth and email/password authentication
- **Gift Lists**: Create and manage gift lists for any occasion
- **Product Scraping**: Auto-fill product details from URLs
- **Friend System**: Share lists with friends and family
- **Purchase Tracking**: Hold and purchase items from friends' lists
- **Admin Panel**: User management and platform statistics
- **Responsive Design**: Mobile-first, minimalist UI

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **UI Feedback**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mysanta
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret for NextAuth
- `NEXTAUTH_URL`: Your application URL
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth credentials

4. Set up the database:
```bash
npx prisma db push
npx prisma generate
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Database Schema

The application uses the following main entities:

- **User**: User accounts with authentication
- **List**: Gift lists belonging to users
- **ListItem**: Individual items in gift lists
- **Event**: Special occasions linked to lists
- **Friendship**: Friend relationships between users
- **Notification**: System notifications

## Key Features Implementation

### Authentication
- NextAuth.js with multiple providers
- Google OAuth integration
- Email/password authentication with bcrypt
- Protected routes and middleware

### Gift Lists
- CRUD operations for lists and items
- Web scraping for automatic product detail extraction
- Status tracking (wished, on hold, purchased, etc.)
- Owner vs. friend views with different permissions

### Purchase Flow
- Multi-step purchase process for friends
- Address sharing for gift delivery
- Hold system to prevent duplicate purchases
- Notification system for gift activities

### Admin Panel
- User management with role-based access
- Platform statistics and analytics
- Pagination for large datasets
- Admin-only routes with proper authorization

## Project Structure

```
mysanta/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── lists/             # List management
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── admin/             # Admin-specific components
│   ├── dashboard/         # Dashboard components
│   ├── lists/             # List management components
│   └── ui/                # Reusable UI components
├── lib/                   # Utility libraries
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Prisma client
│   ├── utils.ts           # Helper functions
│   └── validations.ts     # Zod schemas
├── prisma/               # Database schema
└── types/                # TypeScript type definitions
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mysanta"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to your preferred platform (Vercel, Railway, etc.)

3. Set up your production database and environment variables

4. Run database migrations:
```bash
npx prisma db push
```

## Contributing

This is a demonstration project. Feel free to fork and modify as needed.

## License

MIT License