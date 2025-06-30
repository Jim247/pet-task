

'use client';

import { useState, useEffect } from 'react';
import { Prisma } from '@prisma/client';
import { Check, Clock, AlertTriangle } from 'lucide-react';

// Utility function for British date format
const formatDateUK = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
};

// Define the type using Prisma's generated types
type PetWithRecords = Prisma.PetGetPayload<{
  include: {
    records: {
      include: {
        type: true;
      };
    };
  };
}>;

// Define vaccination record type
type VaccinationRecordWithType = {
  id: number;
  completedAt: Date | null;
  type: {
    id: number;
    name: string;
    interval: number;
  };
};

export default function Home() {
  const [pets, setPets] = useState<PetWithRecords[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await fetch('/api/pets');
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const markVaccinationComplete = async (recordId: number) => {
    try {
      const response = await fetch(`/api/vaccinations/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Refresh the pets data
        fetchPets();
      }
    } catch (error) {
      console.error('Error updating vaccination:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      
      {pets.length === 0 ? (
        <p className="text-gray-500">No pets found. Add some pets to get started!</p>
      ) : (
        <div className="w-full max-w-2/3">
          {pets.map((pet) => (
            <div key={pet.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-2xl mb-4 text-black">
                {pet.name}&apos;s Vaccinations
              </h2>
              <div className="text-gray-600">
                {pet.breed && <p>{pet.breed} | {formatDateUK(new Date(pet.birthDate))}</p>}
              </div>
              {pet.records.length === 0 ? (
                <p className="text-gray-400 italic">No vaccinations recorded</p>
              ) : (
                <div className="bg-gray-50 rounded p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-semibold text-highlight">Vaccination</th>
                          <th className="text-left py-2 px-3 font-semibold text-highlight">Status</th>
                          <th className="text-left py-2 px-3 font-semibold text-highlight">Last Completed</th>
                          <th className="text-left py-2 px-3 font-semibold text-highlight">Due Date</th>
                          <th className="text-left py-2 px-3 font-semibold text-highlight">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pet.records.map((record: VaccinationRecordWithType) => {
                          const lastCompleted = record.completedAt;
                          const dueDate = lastCompleted 
                            ? new Date(lastCompleted.getTime() + (record.type.interval * 365 * 24 * 60 * 60 * 1000))
                            : null;
                          const isOverdue = dueDate && dueDate < new Date();
                          
                          return (
                            <tr key={record.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-25">
                              <td className="py-3 px-3 font-medium text-gray-800">{record.type.name}</td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                                  record.completedAt 
                                    ? isOverdue 
                                      ? 'bg-red-100 text-red-800' 
                                      : 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {record.completedAt 
                                    ? isOverdue 
                                      ? <><AlertTriangle className="w-3 h-3" /> Overdue</>
                                      : <><Check className="w-3 h-3" /> Completed</>
                                    : <><Clock className="w-3 h-3" /> Pending</>
                                  }
                                </span>
                              </td>
                              <td className="py-3 px-3 text-gray-600">
                                {record.completedAt 
                                  ? formatDateUK(new Date(record.completedAt))
                                  : '-'
                                }
                              </td>
                              <td className="py-3 px-3 text-gray-600">
                                {dueDate 
                                  ? formatDateUK(new Date(dueDate))
                                  : '-'
                                }
                              </td>
                              <td className="py-3 px-3">
                                <button 
                                  onClick={() => markVaccinationComplete(record.id)}
                                  className="px-3 py-1 bg-highlight text-white text-xs rounded-4xl transition-colors hover:bg-opacity-80"
                                >
                                  {record.completedAt 
                                    ? isOverdue 
                                      ? 'Mark Complete'
                                      : 'Update' 
                                    : 'Mark Complete'
                                  }
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
