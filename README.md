# Parky - Parking Space Rental App

A comprehensive parking space rental platform built with React Native and Node.js, allowing users to rent out their parking spaces or find convenient parking spots.

## Features

### For Space Owners (Hosts)
- List and manage parking spaces
- Set pricing and availability schedules
- Handle booking requests
- Track earnings and analytics
- Photo upload and space descriptions

### For Renters (Guests)
- Search for parking spaces by location
- Advanced filtering options
- Book parking spaces
- Manage bookings and payments
- Review and rate experiences

### Core Features
- User authentication and profiles
- Real-time search and filtering
- Booking management system
- Payment processing with Stripe
- Review and rating system
- Push notifications
- Cross-platform support (iOS, Android, Web)

## Tech Stack

### Frontend
- **React Native** with Expo for cross-platform development
- **TypeScript** for type safety
- **React Navigation** for navigation
- **Redux Toolkit** for state management
- **Expo Location** for GPS functionality
- **React Native Maps** for map integration

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database with Sequelize ORM
- **JWT** for authentication
- **Stripe** for payment processing
- **Multer** for file uploads
- **Bcrypt** for password hashing

## Project Structure

```
Parky/
├── src/                    # React Native app source
│   ├── components/         # Reusable components
│   ├── screens/           # App screens
│   ├── navigation/        # Navigation configuration
│   ├── services/          # API services
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── backend/               # Node.js backend
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── middleware/        # Express middleware
│   └── config/            # Configuration files
└── docs/                  # Documentation
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Expo CLI
- iOS Simulator or Android Emulator (for mobile development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Parky
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Copy environment template
   cp backend/.env.example backend/.env
   
   # Edit backend/.env with your configuration
   ```

5. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb parky_dev
   
   # Run migrations
   cd backend
   npm run db:migrate
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the React Native app**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   
   # For Web
   npm run web
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Spaces
- `GET /api/spaces/search` - Search parking spaces
- `GET /api/spaces/:id` - Get space details
- `POST /api/spaces` - Create new space
- `PUT /api/spaces/:id` - Update space
- `DELETE /api/spaces/:id` - Delete space

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/:id/status` - Get payment status

## Database Schema

The application uses the following main entities:
- **Users** - User accounts and profiles
- **ParkingSpaces** - Parking space listings
- **Bookings** - Reservation records
- **Payments** - Payment transactions
- **Reviews** - User reviews and ratings
- **SpacePhotos** - Space images
- **AvailabilitySchedules** - Space availability

## Development

### Code Style
- Use TypeScript for type safety
- Follow React Native best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages

### Testing
```bash
# Run tests (when implemented)
npm test
```

### Building for Production

1. **Build the React Native app**
   ```bash
   # For iOS
   expo build:ios
   
   # For Android
   expo build:android
   ```

2. **Deploy the backend**
   ```bash
   cd backend
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@parky.com or join our Slack channel.

## Roadmap

- [ ] Real-time messaging between hosts and renters
- [ ] Advanced analytics dashboard
- [ ] Mobile app store deployment
- [ ] Integration with smart parking systems
- [ ] Multi-language support
- [ ] Corporate booking solutions
