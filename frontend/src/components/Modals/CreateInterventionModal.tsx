import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar, Clock, FileText, Users, Plus, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createCrudService } from '../../services/api';

const interventionService = createCrudService('interventions');
const missionService = createCrudService('missions');
const technicienService = createCrudService('techniciens');

const createInterventionSchema = z.object({
  dateHeureDebut: z.string().min(1, 'Date de début requise'),
  dateHeureFin: z.string().optional(),
  missionId: z.string().min(1, 'Mission requise'),
  commentaire: z.string().optional(),
  technicienIds: z.array(z.number()).optional()
});

type CreateInterventionFormData = z.infer<typeof createInterventionSchema>;

interface CreateInterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  missionId?: string;
}

export const CreateInterventionModal: React.FC<CreateInterventionModalProps> = ({ 
  isOpen, 
  onClose, 
  missionId 
}) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTechniciens, setSelectedTechniciens] = useState<number[]>([]);

  const { data: missions } = useQuery({
    queryKey: ['missions'],
    queryFn: () => missionService.getAll({ limit: 100 })
  });

  const { data: techniciens } = useQuery({
    queryKey: ['techniciens'],
    queryFn: () => technicienService.getAll({ limit: 100, isActive: true })
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<CreateInterventionFormData>({
    resolver: zodResolver(createInterventionSchema),
    defaultValues: {
      missionId,
      dateHeureDebut: new Date().toISOString().slice(0, 16),
      technicienIds: []
    }
  });

  const dateHeureDebut = watch('dateHeureDebut');
  const dateHeureFin = watch('dateHeureFin');

  const createInterventionMutation = useMutation({
    mutationFn: (data: CreateInterventionFormData) => 
      interventionService.create({ ...data, technicienIds: selectedTechniciens }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interventions'] });
      reset();
      setSelectedTechniciens([]);
      onClose();
    }
  });

  const onSubmit = async (data: CreateInterventionFormData) => {
    setIsLoading(true);
    try {
      await createInterventionMutation.mutateAsync(data);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDuration = () => {
    if (dateHeureDebut && dateHeureFin) {
      const debut = new Date(dateHeureDebut);
      const fin = new Date(dateHeureFin);
      const diffMs = fin.getTime() - debut.getTime();
      const diffMinutes = Math.round(diffMs / (1000 * 60));
      
      if (diffMinutes > 0) {
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        return `${hours}h${minutes.toString().padStart(2, '0')}`;
      }
    }
    return null;
  };

  const toggleTechnicien = (technicienId: number) => {
    setSelectedTechniciens(prev => 
      prev.includes(technicienId)
        ? prev.filter(id => id !== technicienId)
        : [...prev, technicienId]
    );
  };

  if (!isOpen) return null;

  const missionsList = missions?.data?.missions || [];
  const techniciensList = techniciens?.data?.techniciens || [];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Créer une Intervention
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-6">
          {/* Mission */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
            <select
              {...register('missionId')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={!!missionId}
            >
              <option value="">Sélectionner une mission</option>
              {missionsList.map((mission: any) => (
                <option key={mission.numIntervention} value={mission.numIntervention}>
                  {mission.numIntervention} - {mission.objectifDuContrat} ({mission.client?.name})
                </option>
              ))}
            </select>
            {errors.missionId && <p className="mt-1 text-sm text-red-600">{errors.missionId.message}</p>}
          </div>

          {/* Période d'intervention */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date et heure de début</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  {...register('dateHeureDebut')}
                  type="datetime-local"
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.dateHeureDebut && <p className="mt-1 text-sm text-red-600">{errors.dateHeureDebut.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date et heure de fin (optionnel)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  {...register('dateHeureFin')}
                  type="datetime-local"
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Durée calculée */}
          {calculateDuration() && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">
                  Durée calculée: {calculateDuration()}
                </span>
              </div>
            </div>
          )}

          {/* Assignation des techniciens */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Techniciens assignés</label>
            <div className="border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto">
              {techniciensList.length > 0 ? (
                <div className="space-y-2">
                  {techniciensList.map((technicien: any) => (
                    <div key={technicien.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedTechniciens.includes(technicien.id)}
                          onChange={() => toggleTechnicien(technicien.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {technicien.prenom} {technicien.nom}
                          </div>
                          <div className="text-xs text-gray-500">
                            {technicien.specialite?.libelle} • {technicien.contact}
                          </div>
                        </div>
                      </div>
                      {selectedTechniciens.includes(technicien.id) && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {selectedTechniciens.indexOf(technicien.id) === 0 ? 'Responsable' : 'Assistant'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Aucun technicien disponible
                </div>
              )}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {selectedTechniciens.length} technicien(s) sélectionné(s)
              {selectedTechniciens.length > 0 && ' • Le premier sera désigné comme responsable'}
            </div>
          </div>

          {/* Commentaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
              <textarea
                {...register('commentaire')}
                rows={4}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Instructions, objectifs spécifiques, contraintes..."
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Création...' : 'Créer l\'intervention'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};