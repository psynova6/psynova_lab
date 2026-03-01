# Psynova: Digital Mental Health Platform

Psynova is a modern, responsive web application designed to provide accessible and private mental health support for students. It leverages AI for initial guidance, offers a suite of self-help tools, and facilitates connections with professional therapists in a secure environment.

## Key Features

- **AI Chatbot ('Syna')**: A 24/7 conversational AI assistant for users to discuss their feelings in a safe, non-judgmental space.
- **Coping Tools**: A library of interactive, evidence-based tools to manage stress and anxiety, including guided breathing exercises, mindfulness games, and journaling prompts.
- **Therapist Connection**: A tiered subscription model that allows users to connect with vetted professional therapists for personalized sessions.
- **Quarterly Check-ins**: A guided self-assessment to help users track their mental well-being and progress over time.
- **Progress & Session History**: A dashboard to review past therapy sessions and monitor personal growth.
- **Customizable Reminders**: Users can set personal reminders for tasks, appointments, or self-care activities.
- **Personalized Experience**: Users can customize their profile with a name and avatar.
- **Advanced Notification System**: Users receive timely, relevant notifications and can customize their preferences to control which alerts they get.
- **Persistent Login**: A "Remember Me" option allows users to stay logged in securely on their device across browser sessions.
- **Data Privacy & Security**: A strong commitment to user privacy with end-to-end encryption, clear terms of service, and user control over their data.
- **Accessibility**: The application is designed with accessibility in mind, using ARIA labels for all interactive elements to ensure compatibility with screen readers.
- **Input Validation**: Forms include client-side validation to ensure data integrity and provide a better user experience.

## Tech Stack

- **Frontend**: [React](https://reactjs.org/) (v19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Hooks (`useState`, `useEffect`, `useCallback`, `useMemo`) with a custom hook for local storage persistence.

## Architecture & Key Decisions

The application is architected to be performant, maintainable, and scalable.

1.  **Performance Optimization**:
    - **Code-Splitting**: Modal components (`ChatbotModal`, `AssessmentModal`, etc.) are lazy-loaded using `React.lazy` and `Suspense`. This significantly reduces the initial JavaScript bundle size, leading to faster page load times.
    - **Memoization**: Functional components are wrapped in `React.memo` where appropriate to prevent unnecessary re-renders, improving UI responsiveness. Event handlers are memoized with `useCallback` to stabilize props passed to child components.

2.  **State Management**:
    - **Centralized in `App.tsx`**: For this application's scope, global state is managed within the main `App` component and passed down via props. This keeps state flow predictable.
    - **Persistent State Hook (`usePersistentState`)**: A custom hook was created to abstract the logic of reading from and writing to `localStorage`. This hook keeps UI components clean and centralizes the persistence logic, making it easy to manage what data is saved across sessions.

3.  **Component-Based Structure**: The UI is broken down into small, reusable components located in the `src/components` directory. This promotes separation of concerns and makes the codebase easier to reason about.

4.  **Accessibility (a11y)**: All interactive elements (buttons, inputs) include descriptive `aria-label` attributes to ensure the application is navigable and usable for individuals relying on screen readers.

## Project Structure

```
/
├── public/
│   └── vite.svg        # Favicon
├── src/
│   ├── components/     # Reusable React components
│   ├── hooks/          # Custom React hooks (e.g., usePersistentState)
│   ├── services/       # Mock API services (e.g., chat service)
│   ├── utils/          # Utility functions and constant data
│   ├── App.tsx         # Main application component with state and logic
│   ├── index.tsx       # Application entry point
│   └── types.ts        # TypeScript type definitions
├── .gitignore
├── index.html          # Main HTML entry file
├── metadata.json       # Application metadata
├── README.md           # This file
└── ...
```

## Getting Started

1.  **Dependencies**: The project uses a CDN for React and Tailwind CSS, so no local installation of these is required.
2.  **Running the App**: Open the `index.html` file in a web browser that supports ES modules. All scripts are loaded via an import map defined in the HTML.

## Privacy & Security

User privacy is a cornerstone of Psynera. As detailed in the Terms of Service:
- All sensitive user data is handled with care.
- Chat data is temporary and can be deleted by the user.
- The platform is committed to transparent data practices and gives users full control over their information.
