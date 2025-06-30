

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
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);
  const [completionDate, setCompletionDate] = useState('');

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
    setSelectedRecord(recordId);
    setCompletionDate(new Date().toISOString().split('T')[0]);
    setShowDateModal(true);
  };

  const handleDateSubmit = async () => {
    if (!selectedRecord || !completionDate) return;

    try {
      const response = await fetch(`/api/vaccinations/${selectedRecord}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completedAt: new Date(completionDate).toISOString(),
        }),
      });

      if (response.ok) {
        setShowDateModal(false);
        setSelectedRecord(null);
        setCompletionDate('');
        fetchPets();
      }
    } catch (error) {
      console.error('Error updating vaccination:', error);
    }
  };

  const closeDateModal = () => {
    setShowDateModal(false);
    setSelectedRecord(null);
    setCompletionDate('');
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
                          const lastCompleted = record.completedAt ? new Date(record.completedAt) : null;
                          const dueDate = lastCompleted 
                            ? new Date(lastCompleted.getFullYear() + 1, lastCompleted.getMonth(), lastCompleted.getDate())
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
                                  ? formatDateUK(dueDate)
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

      {/* Date Selection Modal */}
      {showDateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 mx-4">
            <h3 className="text-lg font-semibold mb-4 text-black">Select Completion Date</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Completed (DD/MM/YYYY)
              </label>
              <input
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDateModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDateSubmit}
                className="px-4 py-2 bg-highlight text-white rounded-md hover:bg-opacity-80"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
