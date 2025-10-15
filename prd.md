# Product Requirements Document: School Planner Pro

## 1. Overview

**School Planner Pro** is a comprehensive digital planner designed for students of all ages, from primary school to college. The application's primary goal is to provide students with a single, intuitive platform to organize their academic life, manage tasks and assignments, and keep track of their class schedules, ensuring they have everything under control.

## 2. Goals and Objectives

*   **Centralize Academic Information:** Provide a single source of truth for all tasks, exams, classes, and reminders.
*   **Enhance Organization:** Help students develop better organizational habits and time management skills.
*   **Prevent Missed Deadlines:** Reduce the likelihood of forgetting assignments or classes through clear scheduling and timely reminders.
*   **Simplify Planning:** Offer an intuitive and visually appealing interface that makes planning simple and fast.
*   **Leverage AI Assistance:** Provide smart tools, like an AI-powered study plan generator, to help students break down complex tasks.

## 3. User Personas

*   **Alex (High School Student):** Juggles multiple subjects, extracurricular activities, and college prep. Needs a quick and easy way to log homework, see their daily schedule at a glance, and plan for upcoming exams.
*   **Maria (College Student):** Manages a complex timetable with lectures, labs, and study groups. Needs a robust weekly timetable, a way to manage long-term research assignments, and reminders for shifting deadlines.
*   **Sam (Middle School Student):** Is just beginning to manage their own schedule and deadlines. Needs a simple, visually engaging tool with clear reminders to help build foundational organizational skills.

## 4. Features

### 4.1. Core Views

*   **Overview (Dashboard):**
    *   The default landing page.
    *   Displays an "Today" section with a chronological list of the current day's classes and tasks.
    *   Features a "Weekly Report" with a line chart visualizing the number of events/tasks over the past seven days.

*   **Agenda:**
    *   A list-based view of all tasks (Homework, Exams, Assignments, etc.).
    *   Tasks are grouped by due date: "Today," "Tomorrow," and "Upcoming."
    *   Users can mark tasks as complete, which visually distinguishes them (e.g., strikethrough).
    *   Each task displays its subject, category, and any set reminders.

*   **Timetable:**
    *   A weekly grid view from Monday to Sunday.
    *   Displays all scheduled classes in their respective time slots.
    *   Classes are color-coded by subject for easy identification.
    *   Provides a clear visual representation of a student's weekly commitments.

*   **Calendar:**
    *   A traditional monthly calendar interface.
    *   Days with scheduled events are marked with small, color-coded dots.
    *   Selecting a day displays a detailed list of its associated tasks and classes in a side panel.

### 4.2. Event Management

*   **Add Event Modal:**
    *   Accessible via a prominent floating action button (+).
    *   Allows users to add two types of events: **Tasks** or **Classes**.
    *   **Task Fields:** Title, Subject, Category, Due Date, Description/Sub-tasks, Reminder.
    *   **Class Fields:** Subject, Day of the Week, Start Time, End Time, Reminder.

*   **Reminder System:**
    *   Users can set a reminder for any task or class.
    *   Reminder options include: "None," "At time of event," "5 minutes before," "15 minutes before," "1 hour before," and "1 day before."
    *   Events with active reminders are marked with a bell icon across all relevant views.

### 4.3. AI-Powered Study Planner

*   **Integration:** Utilizes the Google Gemini API.
*   **Functionality:** Within the "Add Task" modal, a user can click "AI Study Plan."
*   **Process:** The AI takes the task's title and subject and generates a checklist of actionable sub-tasks.
*   **Outcome:** The generated plan is automatically populated into the task's description field, helping students break down large assignments into smaller, manageable steps.

## 5. Design and User Experience (UX)

*   **Aesthetics:** A clean, modern, and uncluttered interface inspired by Google's Material Design.
*   **Color Palette:** A friendly and accessible color scheme. Subjects are assigned distinct, consistent colors for quick recognition.
*   **Typography:** Utilizes the "Inter" font for high legibility and a modern feel.
*   **Interactivity:** Smooth transitions, clear visual feedback for actions (e.g., toggling tasks), and intuitive controls.

## 6. Technical Specifications

*   **Frontend Framework:** React
*   **Styling:** Tailwind CSS
*   **Charting Library:** Recharts
*   **AI Integration:** `@google/genai` for Gemini API calls.
*   **State Management:** Local component state managed with React Hooks (`useState`).
*   **Data Structure:** Initial data is mocked in `constants.ts`. No backend or database is implemented in the current version.

## 7. Future Enhancements (Out of Scope for V1)

*   User authentication and cloud data persistence.
*   Cross-device synchronization.
*   Native push notifications for reminders.
*   Ability to edit and delete existing events.
*   A dedicated "Subjects" management page.
*   Grade tracking and GPA calculation.
*   Dark mode theme.
