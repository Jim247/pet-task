/**
 * Status Badge Component
 * 
 * Reusable component for displaying vaccination status with icons and colors
 */

import { Check, Clock, AlertTriangle } from 'lucide-react';
import { VaccinationStatus } from '../lib/vaccinationUtils';

interface StatusBadgeProps {
  status: VaccinationStatus;
  className?: string;
}

/**
 * Status badge component with icon and colored styling
 * @param status - The vaccination status to display
 * @param className - Additional CSS classes
 */
export const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const getStatusConfig = (status: VaccinationStatus) => {
    switch (status) {
      case 'completed':
        return {
          icon: <Check className="w-3 h-3" />,
          text: 'Completed',
          colorClass: 'bt-green',
        };
      case 'due-soon':
        return {
          icon: <Clock className="w-3 h-3" />,
          text: 'Due Soon',
          colorClass: 'bt-yellow',
        };
      case 'overdue':
        return {
          icon: <AlertTriangle className="w-3 h-3" />,
          text: 'Overdue',
          colorClass: 'bt-red',
        };
      default:
        return {
          icon: <Clock className="w-3 h-3" />,
          text: 'Unknown',
          colorClass: 'bt-yellow',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`px-2 py-2 rounded-full text-xs font-medium flex items-center justify-center gap-1 ${config.colorClass} ${className}`}>
      {config.icon}
      {config.text}
    </span>
  );
};
