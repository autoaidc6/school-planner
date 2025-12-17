# School Planner Pro

School Planner Pro is a comprehensive, all-in-one academic planner designed to help students organize their school life, manage time effectively, and track academic progress.

## Features

- **Dashboard**: Get a bird's-eye view of your day with upcoming events and weekly reports.
- **Agenda & Timetable**: Manage tasks and view class schedules in list or grid formats.
- **Calendar**: Monthly view for long-term planning.
- **Grade Tracker**: Track assignments, weights, and calculate current grades against goals.
- **Focus Timer**: Built-in Pomodoro timer with work/break intervals and picture-in-picture mode.
- **AI Study Assistant**: Generate actionable study plans and sub-task checklists using Google Gemini AI.
- **Guest Mode**: Use the app instantly with local storage, no login required.
- **Cloud Sync**: Sign in to sync data across devices via Firebase.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend (Optional)**: Firebase (Auth, Firestore)
- **AI**: Google GenAI SDK (Gemini 2.5 Flash)
- **Visualizations**: Recharts

## Setup

1. **Environment Variables**:
   Ensure `process.env.API_KEY` (Gemini) and Firebase config variables are available.

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Application**:
   ```bash
   npm run dev
   ```

## Project Structure

- **`/components`**: UI components and page views (Agenda, Overview, etc.).
- **`/hooks`**: Custom hooks for data persistence (LocalStorage/Firestore) and notifications.
- **`/services`**: Integrations with Firebase and Gemini AI.
- **`/types`**: TypeScript definitions for the data model.
