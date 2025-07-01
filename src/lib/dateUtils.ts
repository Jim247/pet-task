/**
 * Date Utilities for Pet Vaccination Tracker
 * 
 * Centralized date formatting and calculation functions
 * to ensure consistency across the application
 */

/**
 * Formats a date in British format (DD/MM/YYYY)
 * @param date - The date object to format
 * @returns Formatted date string in DD/MM/YYYY format
 */
export const formatDateUK = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
};

/**
 * Calculates the due date for a vaccination (1 year from completion)
 * @param completedAt - The date the vaccination was completed
 * @returns Due date exactly 1 year later
 */
export const calculateDueDate = (completedAt: Date): Date => {
  return new Date(
    completedAt.getFullYear() + 1, 
    completedAt.getMonth(), 
    completedAt.getDate()
  );
};

/**
 * Determines if a vaccination is overdue
 * @param dueDate - The due date for the vaccination
 * @returns True if the vaccination is overdue
 */
export const isOverdue = (dueDate: Date): boolean => {
  return dueDate < new Date();
};

/**
 * Calculates the age of a pet in years
 * @param birthDate - The pet's birth date
 * @returns Age in years (rounded down)
 */
export const calculatePetAge = (birthDate: string): number => {
  return Math.floor(
    (new Date().getTime() - new Date(birthDate).getTime()) / 
    (1000 * 60 * 60 * 24 * 365.25)
  );
};

/**
 * Gets today's date in ISO format (YYYY-MM-DD) for date inputs
 * @returns Today's date in ISO format
 */
export const getTodayISO = (): string => {
  return new Date().toISOString().split('T')[0];
};
