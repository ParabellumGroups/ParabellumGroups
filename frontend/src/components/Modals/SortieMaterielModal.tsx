import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Package, Plus, Trash2, User, Wrench, AlertTriangle } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createCrudService } from '../../services/api';

const materielService = createCrudService('materiels');
const interventionService = createCrudService('interventions');
const technicienService = createCrudService('techniciens');

const sortieItemSchema = z.object({
  materielId: z.number().min(1, 'Matériel requis'),
  quantite: z.number().min(1, 'Quantité invalide'),
  motif: z.string().optional()
});

const createSortieSchema = z.object({
  interventionId: z.number().min(1, 'Intervention requise'),
  technicienId: z.number().min(1, 'Technicien requis'),
  items: z.array(sortieItemSchema).min(1, 'Au moins un matériel requis'),
  commentaire: z.string().optional()
});

type CreateSortieFormData = z.infer<typeof createSortieSchema>;

interface SortieMaterielModalProps {
  isOpen: boolean;
  onClose: () => void;
  interventionId?: number;
}

export const SortieMaterielModal: React.FC<SortieMaterielModalProps> = ({ 
  isOpen, 
  onClose, 
  interventionId 
}) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { data: materiels } = useQuery({
    queryKey: ['materiels-available'],
    queryFn: () => materielService.getAll({ statut: 'actif', limit: 100 })
  });

  const { data: interventions } = useQuery({
    queryKey: ['interventions-active'],
    queryFn: () => interventionService.getAll({ statut: 'en_cours', limit: 100 })
  });

  const { data: techniciens } = useQuery({
    queryKey: ['techniciens-active'],
    queryFn: () => technicienService.getAll({ isActive: true, limit: 100 })
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch
  } = useForm<CreateSortieFormData>({
    resolver: zodResolver(createSortieSchema),
    defaultValues: {
      interventionId,
      items: [{ materielId: 0, quantite: 1, motif: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const watchedItems = watch('items');

  const createSortieMutation = useMutation({
    mutationFn: async (data: CreateSortieFormData) => {
      // Créer chaque sortie individuellement
      const results = [];
      for (const item of data.items) {
        const result = await fetch(`/api/v1/materiels/${item.materielId}/sortie`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            interventionId: data.interventionId,
            technicienId: data.technicienId,
            quantite: item.quantite,
            motif: item.motif,
            commentaire: data.commentaire
          })
        });
        results.push(await result.json());
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiels'] });
      queryClient.invalidateQueries({ queryKey: ['interventions'] });
      reset();
      onClose();
    }
  });

  const onSubmit = async (data: CreateSortieFormData) => {
    setIsLoading(true);
    try {
      await createSortieMutation.mutateAsync(data);
    } catch (error) {
      console.error('Erreur lors de la sortie:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableStock = (materielId: number) => {
    const materiel = materielsList.find((m: any) => m.id === materielId);
    return materiel?.quantiteDisponible || 0;
  };

  const isStockSufficient = (materielId: number, quantite: number) => {
    return getAvailableStock(materielId) >= quantite;
  };

  if (!isOpen) return null;

  const materielsList = materiels?.data?.materiels || [];
  const interventionsList = interventions?.data?.interventions || [];
  const techniciensList = techniciens?.data?.techniciens || [];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-screen overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Sortie de Matériel
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-6">
          {/* Intervention et technicien */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Intervention</label>
              <select
                {...register('interventionId', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={!!interventionId}
              >
                <option value="">Sélectionner une intervention</option>
                {interventionsList.map((intervention: any) => (
                  <option key={intervention.id} value={intervention.id}>
                    #{intervention.id} - {intervention.mission?.numIntervention} ({intervention.mission?.client?.name})
                  </option>
                ))}
              </select>
              {errors.interventionId && <p className="mt-1 text-sm text-red-600">{errors.interventionId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Technicien</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  {...register('technicienId', { valueAsNumber: true })}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un technicien</option>
                  {techniciensList.map((technicien: any) => (
                    <option key={technicien.id} value={technicien.id}>
                      {technicien.prenom} {technicien.nom} - {technicien.specialite?.libelle}
                    </option>
                  ))}
                </select>
              </div>
              {errors.technicienId && <p className="mt-1 text-sm text-red-600">{errors.technicienId.message}</p>}
            </div>
          </div>

          {/* Matériels à sortir */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900">Matériels à sortir</h4>
              <button
                type="button"
                onClick={() => append({ materielId: 0, quantite: 1, motif: '' })}
                className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => {
                const selectedMaterielId = watchedItems[index]?.materielId;
                const selectedQuantite = watchedItems[index]?.quantite || 0;
                const stockDisponible = getAvailableStock(selectedMaterielId);
                const stockSuffisant = isStockSufficient(selectedMaterielId, selectedQuantite);

                return (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Matériel {index + 1}</span>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Matériel</label>
                        <select
                          {...register(`items.${index}.materielId` as const, { valueAsNumber: true })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Sélectionner</option>
                          {materielsList.map((materiel: any) => (
                            <option key={materiel.id} value={materiel.id}>
                              {materiel.designation} ({materiel.reference}) - Stock: {materiel.quantiteDisponible}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                        <input
                          {...register(`items.${index}.quantite` as const, { valueAsNumber: true })}
                          type="number"
                          min="1"
                          className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                            selectedMaterielId && !stockSuffisant 
                              ? 'border-red-300 bg-red-50' 
                              : 'border-gray-300'
                          }`}
                        />
                        {selectedMaterielId && (
                          <div className={`text-xs mt-1 ${stockSuffisant ? 'text-green-600' : 'text-red-600'}`}>
                            {stockSuffisant ? (
                              `✓ Stock disponible: ${stockDisponible}`
                            ) : (
                              <div className="flex items-center">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Stock insuffisant: {stockDisponible}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Motif</label>
                        <input
                          {...register(`items.${index}.motif` as const)}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Installation, réparation..."
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Commentaire général */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire général</label>
            <textarea
              {...register('commentaire')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Commentaire sur cette sortie de matériel..."
            />
          </div>

          {/* Vérification stock */}
          {watchedItems.some((item, index) => 
            item.materielId && !isStockSufficient(item.materielId, item.quantite || 0)
          ) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-red-800">
                  Attention : Stock insuffisant pour certains matériels
                </span>
              </div>
            </div>
          )}

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
              disabled={isLoading || watchedItems.some((item, index) => 
                item.materielId && !isStockSufficient(item.materielId, item.quantite || 0)
              )}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer la sortie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};