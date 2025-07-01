/**
 * Vaccination Status Utilities
 * 
 * Functions for calculating vaccination status and urgency
 * to maintain consistent business logic across the application
 */

import { calculateDueDate, isOverdue } from './dateUtils';

/**
 * Vaccination status types
 */
export type VaccinationStatus = 'completed' | 'due-soon' | 'overdue';

/**
 * Vaccination record interface for status calculations
 */
export interface VaccinationRecord {
  id: number;
  completedAt: Date | null;
  type: {
    id: number;
    name: string;
    interval: number;
  };
}

/**
 * Calculates the vaccination status for a record
 * @param record - The vaccination record to evaluate
 * @returns Status object with current state and due date info
 */
export const getVaccinationStatus = (record: VaccinationRecord) => {
  const lastCompleted = record.completedAt ? new Date(record.completedAt) : null;
  const dueDate = lastCompleted ? calculateDueDate(lastCompleted) : null;
  const isRecordOverdue = dueDate ? isOverdue(dueDate) : false;

  let status: VaccinationStatus;
  if (record.completedAt) {
    status = isRecordOverdue ? 'overdue' : 'completed';
  } else {
    status = 'due-soon';
  }

  return {
    status,
    lastCompleted,
    dueDate,
    isOverdue: isRecordOverdue,
  };
};

/**
 * Calculates urgency score for sorting (0 = lowest urgency, 2 = highest)
 * @param record - The vaccination record to evaluate
 * @returns Urgency score: completed (not overdue) = 0, due soon = 1, overdue = 2
 */
export const getUrgencyScore = (record: VaccinationRecord): number => {
  const { status } = getVaccinationStatus(record);
  
  switch (status) {
    case 'completed':
      return 0;
    case 'due-soon':
      return 1;
    case 'overdue':
      return 2;
    default:
      return 1;
  }
};

/**
 * Gets the display text for a vaccination status
 * @param status - The vaccination status
 * @returns Human-readable status text
 */
export const getStatusText = (status: VaccinationStatus): string => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'due-soon':
      return 'Due Soon';
    case 'overdue':
      return 'Overdue';
    default:
      return 'Unknown';
  }
};
