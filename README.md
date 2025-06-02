# Trello Mini Backend

A backend service for a Trello-like task management application.

## Project Structure

```
trello-mini-be/
├── .env                 # Environment configuration
├── .gitignore          # Git ignore rules
├── package.json        # Project dependencies and scripts
├── package-lock.json   # Locked dependency versions
├── tsconfig.json       # TypeScript configuration
├── src/                # Source code directory
│   ├── app.ts              # Express application setup and configuration
│   ├── server.ts           # Server initialization and port configuration
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers for API endpoints
│   ├── middlewares/        # Custom Express middleware functions
│   ├── models/             # Data models and schemas
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic and service layer
│   └── utils/              # Utility functions and helpers
└── .vscode/            # VS Code settings
```

## Prerequisites

- Node.js (LTS version recommended)
- npm or yarn package manager
- Firebase account for authentication and database

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd trello-mini-be
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables:
     - Firebase configuration
     - Database credentials
     - Other service configurations

4. Set up Firebase:
   - Create a Firebase project
   - Generate a service account key from Firebase Console
   - Place the downloaded JSON file as `serviceAccountKey.json` in the root directory
   - **Important**: Never commit `serviceAccountKey.json` to version control

5. Start the development server:
```bash
npm run dev
```

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd trello-mini-be
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables:
     - Firebase configuration
     - Database credentials
     - Other service configurations

4. Start the development server:
```bash
npm run dev
```

## Development

The project uses TypeScript for type safety. The main source code is located in the `src` directory.

## Environment Configuration

The project uses environment variables for configuration. Make sure to set up the following in your `.env` file:
- Firebase credentials
- Database connection strings
- Other service configurations

## Security

- The `serviceAccountKey.json` file contains sensitive credentials and should never be committed to version control
- Ensure proper security measures are in place for production deployment

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

[Add your license information here]
