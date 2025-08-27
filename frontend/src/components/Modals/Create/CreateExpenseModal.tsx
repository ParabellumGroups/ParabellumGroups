import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Receipt, Calendar, Building2, DollarSign } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createCrudService } from '../../../services/api';

const expenseService = createCrudService('expenses');

const createExpenseSchema = z.object({
  supplierId: z.number().optional(),
  category: z.string().min(1, 'Catégorie requise'),
  description: z.string().min(1, 'Description requise'),
  amountHt: z.number().min(0, 'Montant invalide'),
  vatAmount: z.number().min(0).default(0),
  expenseDate: z.string().min(1, 'Date requise'),
  paymentDate: z.string().optional(),
  paymentMethod: z.enum(['TRANSFER', 'CHECK', 'CARD', 'CASH', 'OTHER']),
  receiptUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  notes: z.string().optional()
});

type CreateExpenseFormData = z.infer<typeof createExpenseSchema>;

interface CreateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const expenseCategories = [
  'Fournitures de bureau',
  'Transport',
  'Repas et hébergement',
  'Formation',
  'Équipement informatique',
  'Télécommunications',
  'Marketing',
  'Frais bancaires',
  'Assurances',
  'Maintenance',
  'Autre'
];

export const CreateExpenseModal: React.FC<CreateExpenseModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<CreateExpenseFormData>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      expenseDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'CARD',
      vatAmount: 0
    }
  });

  const amountHt = watch('amountHt');
  const vatAmount = watch('vatAmount');

  const createExpenseMutation = useMutation({
    mutationFn: (data: CreateExpenseFormData) => expenseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      reset();
      onClose();
    }
  });

  const onSubmit = async (data: CreateExpenseFormData) => {
    setIsLoading(true);
    try {
      await createExpenseMutation.mutateAsync(data);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalTtc = () => {
    return (amountHt || 0) + (vatAmount || 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Receipt className="h-5 w-5 mr-2" />
            Créer une Dépense
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                {...register('category')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner une catégorie</option>
                {expenseCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de dépense</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  {...register('expenseDate')}
                  type="date"
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.expenseDate && <p className="mt-1 text-sm text-red-600">{errors.expenseDate.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Description de la dépense..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          {/* Montants */}
          <div className="border-t pt-4">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Montants
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant HT (FCFA)</label>
                <input
                  {...register('amountHt', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.amountHt && <p className="mt-1 text-sm text-red-600">{errors.amountHt.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TVA (FCFA)</label>
                <input
                  {...register('vatAmount', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total TTC</label>
                <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XOF'
                  }).format(calculateTotalTtc())}
                </div>
              </div>
            </div>
          </div>

          {/* Paiement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mode de paiement</label>
              <select
                {...register('paymentMethod')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="TRANSFER">Virement</option>
                <option value="CHECK">Chèque</option>
                <option value="CARD">Carte</option>
                <option value="CASH">Espèces</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de paiement (optionnel)</label>
              <input
                {...register('paymentDate')}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL du reçu</label>
              <input
                {...register('receiptUrl')}
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://exemple.com/recu.pdf"
              />
              {errors.receiptUrl && <p className="mt-1 text-sm text-red-600">{errors.receiptUrl.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Notes sur la dépense..."
            />
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
              {isLoading ? 'Création...' : 'Créer la dépense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};