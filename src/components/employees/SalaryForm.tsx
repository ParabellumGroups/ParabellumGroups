import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { salaryService, CreateSalaryData } from '../../services/salaryService';
import { employeeService } from '../../services/employeeService';
import { 
  Save, 
  X, 
  DollarSign, 
  Calendar, 
  AlertCircle
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import toast from 'react-hot-toast';

interface SalaryFormProps {
  mode?: 'create' | 'edit';
}

const SalaryForm: React.FC<SalaryFormProps> = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id, salaryId } = useParams();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const employeeId = parseInt(id!);
  const salaryIdNum = salaryId ? parseInt(salaryId) : undefined;
  
  const { data: employeeData, isLoading: isLoadingEmployee } = useQuery(
    ['employee', employeeId],
    () => employeeService.getEmployee(employeeId),
    {
      onError: (error: any) => {
        toast.error(error.response?.data?.error?.message || 'Erreur lors du chargement de l\'employé');
        navigate('/employes');
      }
    }
  );

  const { data: salaryData, isLoading: isLoadingSalary } = useQuery(
    ['salary', salaryIdNum],
    () => salaryService.getSalary(salaryIdNum!),
    {
      enabled: mode === 'edit' && !!salaryIdNum,
      onError: (error: any) => {
        toast.error(error.response?.data?.error?.message || 'Erreur lors du chargement du salaire');
        navigate(`/employes/${employeeId}/salaires`);
      }
    }
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<CreateSalaryData>({
    defaultValues: {
      employeeId,
      payDate: new Date().toISOString().split('T')[0],
      grossSalary: 0,
      netSalary: 0,
      socialContributions: 0,
      taxDeductions: 0,
      bonuses: 0,
      deductions: 0,
      status: 'DRAFT',
      payrollPeriodStart: startOfMonth(new Date()).toISOString().split('T')[0],
      payrollPeriodEnd: endOfMonth(new Date()).toISOString().split('T')[0]
    }
  });

  const grossSalary = watch('grossSalary');
  const socialContributions = watch('socialContributions');
  const taxDeductions = watch('taxDeductions');
  const bonuses = watch('bonuses');
  const deductions = watch('deductions');

  // Calcul automatique du salaire net
  useEffect(() => {
    const netSalary = grossSalary + bonuses - socialContributions - taxDeductions - deductions;
    setValue('netSalary', Math.max(0, netSalary));
  }, [grossSalary, socialContributions, taxDeductions, bonuses, deductions, setValue]);

  useEffect(() => {
    if (employeeData?.data?.employee && mode === 'create') {
      setValue('grossSalary', employeeData.data.employee.salaryBase);
      
      // Calcul par défaut des cotisations sociales (environ 23% du brut)
      const defaultSocialContributions = employeeData.data.employee.salaryBase * 0.23;
      setValue('socialContributions', Math.round(defaultSocialContributions * 100) / 100);
      
      // Calcul par défaut des impôts (environ 10% du brut)
      const defaultTaxDeductions = employeeData.data.employee.salaryBase * 0.1;
      setValue('taxDeductions', Math.round(defaultTaxDeductions * 100) / 100);
    }
  }, [employeeData, mode, setValue]);

  useEffect(() => {
    if (mode === 'edit' && salaryData?.data?.salary) {
      const salary = salaryData.data.salary;
      reset({
        employeeId: salary.employeeId,
        payDate: new Date(salary.payDate).toISOString().split('T')[0],
        grossSalary: salary.grossSalary,
        netSalary: salary.netSalary,
        socialContributions: salary.socialContributions,
        taxDeductions: salary.taxDeductions,
        bonuses: salary.bonuses,
        deductions: salary.deductions,
        status: salary.status,
        payrollPeriodStart: salary.payrollPeriodStart ? new Date(salary.payrollPeriodStart).toISOString().split('T')[0] : undefined,
        payrollPeriodEnd: salary.payrollPeriodEnd ? new Date(salary.payrollPeriodEnd).toISOString().split('T')[0] : undefined,
        notes: salary.notes
      });
    }
  }, [salaryData, mode, reset]);

  const createSalaryMutation = useMutation(
    (data: CreateSalaryData) => salaryService.createSalary(data),
    {
      onSuccess: () => {
        toast.success('Salaire créé avec succès');
        queryClient.invalidateQueries(['employee', employeeId]);
        navigate(`/employes/${employeeId}`);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error?.message || 'Erreur lors de la création du salaire');
      },
      onSettled: () => {
        setIsSubmitting(false);
      }
    }
  );

  const updateSalaryMutation = useMutation(
    ({ id, data }: { id: number; data: Partial<CreateSalaryData> }) => 
      salaryService.updateSalary(id, data),
    {
      onSuccess: () => {
        toast.success('Salaire mis à jour avec succès');
        queryClient.invalidateQueries(['salary', salaryIdNum]);
        queryClient.invalidateQueries(['employee', employeeId]);
        navigate(`/employes/${employeeId}`);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error?.message || 'Erreur lors de la mise à jour du salaire');
      },
      onSettled: () => {
        setIsSubmitting(false);
      }
    }
  );

  const onSubmit = (data: CreateSalaryData) => {
    setIsSubmitting(true);
    if (mode === 'create') {
      createSalaryMutation.mutate(data);
    } else if (salaryIdNum) {
      updateSalaryMutation.mutate({ id: salaryIdNum, data });
    }
  };

  const handleSetCurrentMonth = () => {
    const now = new Date();
    setValue('payrollPeriodStart', startOfMonth(now).toISOString().split('T')[0]);
    setValue('payrollPeriodEnd', endOfMonth(now).toISOString().split('T')[0]);
  };

  const handleSetPreviousMonth = () => {
    const now = new Date();
    const prevMonth = addMonths(now, -1);
    setValue('payrollPeriodStart', startOfMonth(prevMonth).toISOString().split('T')[0]);
    setValue('payrollPeriodEnd', endOfMonth(prevMonth).toISOString().split('T')[0]);
  };

  if (isLoadingEmployee || (mode === 'edit' && isLoadingSalary)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!employeeData?.data?.employee) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Erreur de chargement
            </h3>
            <p className="mt-1 text-sm text-red-700">
              Employé non trouvé
            </p>
          </div>
        </div>
      </div>
    );
  }

  const employee = employeeData.data.employee;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <DollarSign className="h-8 w-8 mr-3 text-green-600" />
            {mode === 'create' ? 'Nouveau Salaire' : 'Modifier le Salaire'}
          </h1>
          <p className="text-gray-600 mt-1">
            {mode === 'create' 
              ? `Créer un nouveau salaire pour ${employee.firstName} ${employee.lastName}` 
              : `Modifier le salaire de ${employee.firstName} ${employee.lastName}`
            }
          </p>
        </div>
        <button
          onClick={() => navigate(`/employes/${employeeId}`)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <X className="h-4 w-4 mr-2" />
          Annuler
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informations de base */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Informations de base</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Date de paiement *
              </label>
              <input
                type="date"
                {...register('payDate', { required: 'La date de paiement est requise' })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              {errors.payDate && (
                <p className="mt-1 text-sm text-red-600">{errors.payDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut *
              </label>
              <select
                {...register('status', { required: 'Le statut est requis' })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="DRAFT">Brouillon</option>
                <option value="PAID">Payé</option>
                <option value="CANCELLED">Annulé</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Période de paie */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Période de paie</h2>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleSetPreviousMonth}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Mois précédent
              </button>
              <button
                type="button"
                onClick={handleSetCurrentMonth}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Mois courant
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Début de période
              </label>
              <input
                type="date"
                {...register('payrollPeriodStart')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Fin de période
              </label>
              <input
                type="date"
                {...register('payrollPeriodEnd')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Montants */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Montants</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Salaire brut *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  {...register('grossSalary', { 
                    required: 'Le salaire brut est requis',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Le montant doit être positif' }
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 pl-8"
                  placeholder="0.00"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
              </div>
              {errors.grossSalary && (
                <p className="mt-1 text-sm text-red-600">{errors.grossSalary.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Cotisations sociales
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  {...register('socialContributions', { 
                    valueAsNumber: true,
                    min: { value: 0, message: 'Le montant doit être positif' }
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 pl-8"
                  placeholder="0.00"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
              </div>
              {errors.socialContributions && (
                <p className="mt-1 text-sm text-red-600">{errors.socialContributions.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Impôts prélevés
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  {...register('taxDeductions', { 
                    valueAsNumber: true,
                    min: { value: 0, message: 'Le montant doit être positif' }
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 pl-8"
                  placeholder="0.00"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
              </div>
              {errors.taxDeductions && (
                <p className="mt-1 text-sm text-red-600">{errors.taxDeductions.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Primes
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  {...register('bonuses', { 
                    valueAsNumber: true,
                    min: { value: 0, message: 'Le montant doit être positif' }
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 pl-8"
                  placeholder="0.00"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
              </div>
              {errors.bonuses && (
                <p className="mt-1 text-sm text-red-600">{errors.bonuses.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Déductions
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  {...register('deductions', { 
                    valueAsNumber: true,
                    min: { value: 0, message: 'Le montant doit être positif' }
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 pl-8"
                  placeholder="0.00"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
              </div>
              {errors.deductions && (
                <p className="mt-1 text-sm text-red-600">{errors.deductions.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Salaire net
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  {...register('netSalary', { 
                    valueAsNumber: true,
                    min: { value: 0, message: 'Le montant doit être positif' }
                  })}
                  className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-green-500 focus:ring-green-500 pl-8"
                  readOnly
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
          <textarea
            {...register('notes')}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Notes ou commentaires sur ce salaire..."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate(`/employes/${employeeId}`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {mode === 'create' ? 'Créer le salaire' : 'Mettre à jour'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalaryForm;