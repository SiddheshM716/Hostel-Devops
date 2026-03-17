# Hostel Management System

A modern web application for managing hostel accommodations, complaints, and maintenance requests. Built with React, TypeScript, and Supabase.

<span>
    <img src="assets/image1" alt="Image 1" width="100%">
    <img src="assets/image2" alt="Image 2" width="100%">
    <img src="assets/image3" alt="Image 3" width="100%">
    <img src="assets/image4" alt="Image 4" width="100%">
    <img src="assets/image5" alt="Image 5" width="100%">
    <img src="assets/image6" alt="Image 6" width="100%">
    <img src="assets/image7" alt="Image 7" width="100%">
    <img src="assets/image8" alt="Image 8" width="100%">
</span>


## Features

### For Students
- View available rooms
- Book hostel rooms
- Raise complaints
- Track complaint status
- View payment history
- Manage bookings

### For Wardens
- Manage room allocations
- Handle complaints
- Track room occupancy
- View student list
- Manage maintenance requests

## Tech Stack

- React
- TypeScript
- Material-UI
- Supabase
- React Router
- Emotion (for styled components)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Supabase account

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd hostel-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/     # Reusable components
├── contexts/      # React contexts
├── lib/          # Utility functions and configurations
├── pages/        # Page components
├── types/        # TypeScript type definitions
└── App.tsx       # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
