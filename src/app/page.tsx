

'use client';

import { useState, useEffect } from 'react';
import { Check, Clock, AlertTriangle, ChevronUp, ChevronDown, Plus } from 'lucide-react';

// Utility function for British date format
const formatDateUK = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
};

// Define the type using Prisma's generated types
type PetWithRecords = {
  id: number;
  name: string;
  breed: string | null;
  birthDate: string;
  records: {
    id: number;
    completedAt: Date | null;
    type: {
      id: number;
      name: string;
      interval: number;
    };
  }[];
};

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
  const [editingRecord, setEditingRecord] = useState<number | null>(null);
  const [completionDate, setCompletionDate] = useState('');
  const [sortBy, setSortBy] = useState<'urgency' | 'status' | 'dueDate'>('urgency');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [newVaccinationType, setNewVaccinationType] = useState('');
  const [newCompletionDate, setNewCompletionDate] = useState('');
  const [vaccinationTypes, setVaccinationTypes] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    fetchPets();
    fetchVaccinationTypes();
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

  const fetchVaccinationTypes = async () => {
    try {
      const response = await fetch('/api/vaccination-types');
      const data = await response.json();
      setVaccinationTypes(data);
    } catch (error) {
      console.error('Error fetching vaccination types:', error);
    }
  };

  const markVaccinationComplete = async (recordId: number) => {
    setEditingRecord(recordId);
    setCompletionDate(new Date().toISOString().split('T')[0]);
  };

  const handleDateSubmit = async (recordId: number) => {
    if (!completionDate) return;

    try {
      const response = await fetch(`/api/vaccinations/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completedAt: new Date(completionDate).toISOString(),
        }),
      });

      if (response.ok) {
        setEditingRecord(null);
        setCompletionDate('');
        fetchPets();
      }
    } catch (error) {
      console.error('Error updating vaccination:', error);
    }
  };

  const cancelEdit = () => {
    setEditingRecord(null);
    setCompletionDate('');
  };

  const handleSort = (column: 'status' | 'dueDate') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const openAddModal = (petId: number) => {
    setSelectedPetId(petId);
    setShowAddModal(true);
    setNewCompletionDate(new Date().toISOString().split('T')[0]);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setSelectedPetId(null);
    setNewVaccinationType('');
    setNewCompletionDate('');
  };

  const handleAddVaccination = async () => {
    if (!selectedPetId || !newVaccinationType || !newCompletionDate) return;

    try {
      const response = await fetch('/api/vaccination-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          petId: selectedPetId,
          typeId: newVaccinationType,
          completedAt: new Date(newCompletionDate).toISOString(),
        }),
      });

      if (response.ok) {
        closeAddModal();
        fetchPets();
      } else {
        console.error('Failed to add vaccination record');
      }
    } catch (error) {
      console.error('Error adding vaccination:', error);
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
    <div className="min-h-screen flex items-center justify-center p-8 shadow-2xl">
      
      {pets.length === 0 ? (
        <p className="text-gray-500">No pets found. Add some pets to get started!</p>
      ) : (
        <div className="w-full max-w-4/5">
          {pets.map((pet) => (
            <div key={pet.id} className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl text-black">
                  {pet.name}&apos;s Vaccinations
                </h2>
                <button 
                  onClick={() => openAddModal(pet.id)}
                  className="flex items-center gap-2 px-6 py-3 bg-highlight text-white text-base rounded-full transition-colors hover:bg-opacity-80"
                >
                  <Plus className="w-5 h-5" />
                  ADD VACCINATION
                </button>
              </div>
              <div className="text-gray-600 mb-4">
                {pet.breed && (
                  <p>
                    {pet.breed} | {Math.floor((new Date().getTime() - new Date(pet.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25))} years old
                  </p>
                )}
              </div>
              <div className="bg-white rounded-3xl border border-gray-200 p-6">
              {pet.records.length === 0 ? (
                <p className="text-gray-400 italic">No vaccinations recorded</p>
              ) : (
                <div className="rounded p-4">
                  <div className="overflow-x-auto rounded-2xl border border-gray-200">
                    <table className="w-full">
                      <thead>
                        <tr className="border-gray-200">
                          <th className="text-left py-4 px-6 font-semibold text-highlight">Vaccination</th>
                          <th 
                            className="text-center py-4 px-6 font-semibold text-highlight cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => handleSort('status')}
                          >
                            <div className="flex items-center justify-center gap-1">
                              Status 
                              <div className="flex flex-col">
                                {sortBy === 'status' ? (
                                  sortDirection === 'asc' ? 
                                    <ChevronUp className="w-3 h-3" /> : 
                                    <ChevronDown className="w-3 h-3" />
                                ) : (
                                  <>
                                    <ChevronUp className="w-3 h-3 text-gray-400 -mb-1" />
                                    <ChevronDown className="w-3 h-3 text-gray-400" />
                                  </>
                                )}
                              </div>
                            </div>
                          </th>
                          <th className="text-left py-4 px-6 font-semibold text-highlight">Last Completed</th>
                          <th 
                            className="text-left py-4 px-6 font-semibold text-highlight cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => handleSort('dueDate')}
                          >
                            <div className="flex items-center gap-1">
                              Due Date 
                              <div className="flex flex-col">
                                {sortBy === 'dueDate' ? (
                                  sortDirection === 'asc' ? 
                                    <ChevronUp className="w-3 h-3" /> : 
                                    <ChevronDown className="w-3 h-3" />
                                ) : (
                                  <>
                                    <ChevronUp className="w-3 h-3 text-gray-400 -mb-1" />
                                    <ChevronDown className="w-3 h-3 text-gray-400" />
                                  </>
                                )}
                              </div>
                            </div>
                          </th>
                          <th className="text-center py-4 px-6 font-semibold text-highlight">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pet.records
                          .sort((a, b) => {
                            if (sortBy === 'urgency') {
                              const aCompleted = a.completedAt ? new Date(a.completedAt) : null;
                              const aDueDate = aCompleted 
                                ? new Date(aCompleted.getFullYear() + 1, aCompleted.getMonth(), aCompleted.getDate())
                                : null;
                              const aIsOverdue = aDueDate && aDueDate < new Date();
                              
                              const bCompleted = b.completedAt ? new Date(b.completedAt) : null;
                              const bDueDate = bCompleted 
                                ? new Date(bCompleted.getFullYear() + 1, bCompleted.getMonth(), bCompleted.getDate())
                                : null;
                              const bIsOverdue = bDueDate && bDueDate < new Date();
                              
                              // Sort order: completed (not overdue) = 0, due soon = 1, overdue = 2
                              const aUrgency = a.completedAt ? (aIsOverdue ? 2 : 0) : 1;
                              const bUrgency = b.completedAt ? (bIsOverdue ? 2 : 0) : 1;
                              
                              return aUrgency - bUrgency;
                            } else if (sortBy === 'status') {
                              const aCompleted = a.completedAt ? new Date(a.completedAt) : null;
                              const aDueDate = aCompleted 
                                ? new Date(aCompleted.getFullYear() + 1, aCompleted.getMonth(), aCompleted.getDate())
                                : null;
                              const aIsOverdue = aDueDate && aDueDate < new Date();
                              
                              const bCompleted = b.completedAt ? new Date(b.completedAt) : null;
                              const bDueDate = bCompleted 
                                ? new Date(bCompleted.getFullYear() + 1, bCompleted.getMonth(), bCompleted.getDate())
                                : null;
                              const bIsOverdue = bDueDate && bDueDate < new Date();
                              
                              const aStatus = a.completedAt ? (aIsOverdue ? 'Overdue' : 'Complete') : 'Due Soon';
                              const bStatus = b.completedAt ? (bIsOverdue ? 'Overdue' : 'Complete') : 'Due Soon';
                              
                              const result = aStatus.localeCompare(bStatus);
                              return sortDirection === 'asc' ? result : -result;
                            } else if (sortBy === 'dueDate') {
                              const aCompleted = a.completedAt ? new Date(a.completedAt) : null;
                              const aDueDate = aCompleted 
                                ? new Date(aCompleted.getFullYear() + 1, aCompleted.getMonth(), aCompleted.getDate())
                                : new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate());
                              
                              const bCompleted = b.completedAt ? new Date(b.completedAt) : null;
                              const bDueDate = bCompleted 
                                ? new Date(bCompleted.getFullYear() + 1, bCompleted.getMonth(), bCompleted.getDate())
                                : new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate());
                              
                              const result = aDueDate.getTime() - bDueDate.getTime();
                              return sortDirection === 'asc' ? result : -result;
                            }
                            return 0;
                          })
                          .map((record: VaccinationRecordWithType) => {
                          const lastCompleted = record.completedAt ? new Date(record.completedAt) : null;
                          const dueDate = lastCompleted 
                            ? new Date(lastCompleted.getFullYear() + 1, lastCompleted.getMonth(), lastCompleted.getDate())
                            : null;
                          const isOverdue = dueDate && dueDate < new Date();
                          
                          return (
                            <tr key={record.id} className="border border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                              <td className="py-5 px-6 font-medium text-gray-800">{record.type.name}</td>
                              <td className="py-5 px-6 text-center">
                                <span className={`px-2 py-2 rounded-full text-xs font-medium flex items-center justify-center gap-1 ${
                                  record.completedAt 
                                    ? isOverdue 
                                      ? 'bt-red' 
                                      : 'bt-green'
                                    : 'bt-yellow'
                                }`}>
                                  {record.completedAt 
                                    ? isOverdue 
                                      ? <><AlertTriangle className="w-3 h-3" /> Overdue</>
                                      : <><Check className="w-3 h-3" /> Completed</>
                                    : <><Clock className="w-3 h-3" /> Due Soon</>
                                  }
                                </span>
                              </td>
                              <td className="py-5 px-6 text-gray-600">
                                {record.completedAt 
                                  ? formatDateUK(new Date(record.completedAt))
                                  : '-'
                                }
                              </td>
                              <td className="py-5 px-6 text-gray-600">
                                {dueDate 
                                  ? formatDateUK(dueDate)
                                  : '-'
                                }
                              </td>
                              <td className="py-5 px-6 text-center">
                                {!(record.completedAt && !isOverdue) && (
                                  editingRecord === record.id ? (
                                    <div className="flex items-center gap-2 justify-center">
                                      <input
                                        type="date"
                                        value={completionDate}
                                        onChange={(e) => setCompletionDate(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-highlight focus:border-highlight"
                                      />
                                      <button 
                                        onClick={() => handleDateSubmit(record.id)}
                                        className="w-6 h-6 bg-highlight text-white text-xs rounded-full hover:bg-opacity-80 flex items-center justify-center"
                                      >
                                        <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                                          <path d="M1 4.5L4.5 8L11 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      </button>
                                      <button 
                                        onClick={cancelEdit}
                                        className="w-6 h-6 bg-transparent text-highlight border border-highlight text-xs rounded-full hover:bg-highlight hover:text-white flex items-center justify-center transition-colors"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={() => markVaccinationComplete(record.id)}
                                      className="px-3 py-2 bg-highlight text-white text-xs rounded-full transition-colors hover:bg-opacity-80"
                                    >
                                      Mark Complete
                                    </button>
                                  )
                                )}
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
            </div>
          ))}
        </div>
      )}

      {/* Add Vaccination Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Add Vaccination</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vaccination Type
                </label>
                <select
                  value={newVaccinationType}
                  onChange={(e) => setNewVaccinationType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-highlight focus:border-highlight"
                >
                  <option value="">Select vaccination type...</option>
                  {vaccinationTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completion Date
                </label>
                <input
                  type="date"
                  value={newCompletionDate}
                  onChange={(e) => setNewCompletionDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-highlight focus:border-highlight"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeAddModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVaccination}
                disabled={!newVaccinationType || !newCompletionDate}
                className="flex-1 px-4 py-2 bg-highlight text-white rounded-full text-sm hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Vaccination
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
