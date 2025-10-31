# Veeva Health Buddy

A comprehensive healthcare companion application that provides personalized health management, appointment booking, diet planning, and healthcare resource access.

## Features

- **AI-Powered Chat Interface**: Interactive health consultation and guidance
- **Appointment Booking**: Schedule medical appointments with ease
- **Diet Planner**: Personalized nutrition and meal planning
- **Healthcare Map**: Locate free healthcare facilities near you
- **Health Articles**: Access curated health-related content
- **Report Analyzer**: AI-powered medical report analysis
- **Voice Integration**: Voice-enabled interaction support

## Tech Stack

### Frontend
- **React 18+** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Supabase** for backend services and authentication

### Backend Services
- **Supabase Functions**
  - Health Chat Integration
  - Report Analysis Service

## Project Setup

### Prerequisites
- Node.js (v16.0 or higher)
- npm or Bun package manager
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/hsrshithrx/hackx.git
   cd veeva-health-buddy-main
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   # OR using Bun
   bun install
   ```

3. **Environment Setup**
   - Create a `.env` file in the root directory
   - Add the following environment variables:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Start Development Server**
   ```bash
   npm run dev
   # OR
   bun run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   # OR
   bun run build
   ```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # UI components from shadcn
│   └── ...             # Feature components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/      # Supabase client and types
├── lib/               # Utility libraries
├── pages/             # Page components
└── utils/             # Utility functions
```

## Development Guidelines

- Use TypeScript for type safety
- Follow the component structure in `src/components`
- Use shadcn/ui components for consistent UI
- Implement responsive design using Tailwind CSS
- Add proper error handling and loading states
- Write clean, documented code

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
