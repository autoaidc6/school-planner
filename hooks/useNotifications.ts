import { useEffect, useRef } from 'react';
import { type Task, type ClassEvent, ReminderOption } from '../types';
import { useLocalStorage } from './useLocalStorage';

const getReminderTime = (event: Task | ClassEvent): Date | null => {
    const eventTime = 'dueDate' in event ? new Date(event.dueDate) : new Date();
    if (!('dueDate' in event)) {
        // For classes, we need to find the next occurrence
        const now = new Date();
        const [hour, minute] = event.startTime.split(':').map(Number);
        
        const classDateTime = new Date(now.getTime());
        classDateTime.setHours(hour, minute, 0, 0);

        const daysUntil = (event.day - now.getDay() + 7) % 7;

        if (daysUntil === 0 && classDateTime < now) {
            // If it's today but the time has passed, schedule for next week
            classDateTime.setDate(classDateTime.getDate() + 7);
        } else {
            classDateTime.setDate(now.getDate() + daysUntil);
        }
        eventTime.setTime(classDateTime.getTime());
    }

    switch (event.reminder) {
        case ReminderOption.None: return null;
        case ReminderOption.AtTime: return eventTime;
        case ReminderOption.FiveMin: return new Date(eventTime.getTime() - 5 * 60 * 1000);
        case ReminderOption.FifteenMin: return new Date(eventTime.getTime() - 15 * 60 * 1000);
        case ReminderOption.OneHour: return new Date(eventTime.getTime() - 60 * 60 * 1000);
        case ReminderOption.OneDay: return new Date(eventTime.getTime() - 24 * 60 * 60 * 1000);
        default: return null;
    }
};


export const useNotifications = (events: (Task | ClassEvent)[]) => {
    const [sentNotifications, setSentNotifications] = useLocalStorage<string[]>('sentNotifications', []);
    const checkedPermission = useRef(false);

    useEffect(() => {
        if (!checkedPermission.current && typeof window !== "undefined" && "Notification" in window) {
             if (Notification.permission === "default") {
                Notification.requestPermission();
            }
            checkedPermission.current = true;
        }

        const interval = setInterval(() => {
            if (typeof window === "undefined" || !("Notification" in window) || Notification.permission !== "granted") return;
            
            const now = new Date();
            
            events.forEach(event => {
                if ('completed' in event && event.completed) return;
                
                const reminderTime = getReminderTime(event);
                if (!reminderTime) return;

                // Use a more robust ID that includes the specific reminder time
                const notificationId = `${event.id}-${reminderTime.getTime()}`;
                
                // Check if reminder time is in the past but within the last minute, and not already sent
                if (reminderTime <= now && (now.getTime() - reminderTime.getTime() < 60000) && !sentNotifications.includes(notificationId)) {
                    const title = 'dueDate' in event ? event.title : `${event.subject} Class`;
                    const body = 'dueDate' in event ? `This is due now.` : `Starts at ${event.startTime}.`;
                    
                    new Notification(`Reminder: ${title}`, { body, tag: event.id });
                    
                    setSentNotifications(prev => [...prev, notificationId]);
                }
            });
        }, 30 * 1000); // Check every 30 seconds

        return () => clearInterval(interval);

    }, [events, sentNotifications, setSentNotifications]);
};
