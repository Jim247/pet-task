/**
 * Sorting Utilities for Vaccination Records
 * 
 * Centralized sorting logic for vaccination table
 */

import { VaccinationRecord, getVaccinationStatus, getUrgencyScore, getStatusText } from './vaccinationUtils';
import { calculateDueDate } from './dateUtils';

export type SortBy = 'urgency' | 'status' | 'dueDate';
export type SortDirection = 'asc' | 'desc';

/**
 * Sorts vaccination records based on the specified criteria
 * @param records - Array of vaccination records to sort
 * @param sortBy - The sorting criteria
 * @param sortDirection - The sorting direction
 * @returns Sorted array of vaccination records
 */
export const sortVaccinationRecords = (
  records: VaccinationRecord[],
  sortBy: SortBy,
  sortDirection: SortDirection
): VaccinationRecord[] => {
  return [...records].sort((a, b) => {
    switch (sortBy) {
      case 'urgency':
        return sortByUrgency(a, b);
      
      case 'status':
        return sortByStatus(a, b, sortDirection);
      
      case 'dueDate':
        return sortByDueDate(a, b, sortDirection);
      
      default:
        return 0;
    }
  });
};

/**
 * Sorts by urgency (completed -> due soon -> overdue)
 */
const sortByUrgency = (a: VaccinationRecord, b: VaccinationRecord): number => {
  const aUrgency = getUrgencyScore(a);
  const bUrgency = getUrgencyScore(b);
  return aUrgency - bUrgency;
};

/**
 * Sorts by status text alphabetically
 */
const sortByStatus = (a: VaccinationRecord, b: VaccinationRecord, direction: SortDirection): number => {
  const aStatus = getStatusText(getVaccinationStatus(a).status);
  const bStatus = getStatusText(getVaccinationStatus(b).status);
  
  const result = aStatus.localeCompare(bStatus);
  return direction === 'asc' ? result : -result;
};

/**
 * Sorts by due date chronologically
 */
const sortByDueDate = (a: VaccinationRecord, b: VaccinationRecord, direction: SortDirection): number => {
  const aCompleted = a.completedAt ? new Date(a.completedAt) : null;
  const aDueDate = aCompleted 
    ? calculateDueDate(aCompleted)
    : new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate());
  
  const bCompleted = b.completedAt ? new Date(b.completedAt) : null;
  const bDueDate = bCompleted 
    ? calculateDueDate(bCompleted)
    : new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate());
  
  const result = aDueDate.getTime() - bDueDate.getTime();
  return direction === 'asc' ? result : -result;
};
