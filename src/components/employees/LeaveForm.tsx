import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { leaveService, CreateLeaveData } from '../../services/leaveService';
import { employeeService } from '../../services/employeeService';
import { 
  Save, 
  X, 
  Clock, 
  Calendar, 
  AlertCircle
} from 'lucide-react';
import { format, differenceInCalendarDays, addDays } from 'date-fns';
import toast from 'react-hot-toast';

interface LeaveFormProps {
  mode?: 'create' | 'edit';
}

const LeaveForm: React.FC<LeaveFormProps> = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id, leaveId } = useParams();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const employeeId = parseInt(id!);
  const leaveIdNum = leaveId ? parseInt(leaveId) : undefined;
  
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

  const { data: leaveData, isLoading: isLoadingLeave } = useQuery(
    ['leave', leaveIdNum],
    () => leaveService.getLeave(leaveIdNum!),
    {
      enabled: mode === 'edit' && !!leaveIdNum,
      onError: (error: any) => {
        toast.error(error.response?.data?.error?.message || 'Erreur lors du chargement du congé');
        navigate(`/employes/${employeeId}/conges`);
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
  } = useForm<CreateLeaveData>({
    defaultValues: {
      employeeId,
      type: 'PAID',
      startDate: new Date().toISOString().split('T')[0],
      endDate: addDays(new Date(), 5).toISOString().split('T')[0],
      duration: 5,
      status: 'PENDING'
    }
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  // Calcul automatique de la durée
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end >= start) {
        const duration = differenceInCalendarDays(end, start) + 1;
        setValue('duration', duration);
      }
    }
  }, [startDate, endDate, setValue]);

  useEffect(() => {
    if (mode === 'edit' && leaveData?.data?.leave) {
      const leave = leaveData.data.leave;
      reset({
        employeeId: leave.employeeId,
        type: leave.type,
        startDate: new Date(leave.startDate).toISOString().split('T')[0],
        endDate: new Date(leave.endDate).toISOString().split('T')[0],
        duration: leave.duration,
        status: leave.status,
        reason: leave.reason,
        comments: leave.comments
      });
    }
  }, [leaveData, mode, reset]);

  const createLeaveMutation = useMutation(
    (data: CreateLeaveData) => leaveService.createLeave(data),
    {
      onSuccess: () => {
        toast.success('Congé créé avec succès');
        queryClient.invalidateQueries(['employee', employeeId]);
        navigate(`/employes/${employeeId}`);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error?.message || 'Erreur lors de la création du congé');
      },
      onSettled: () => {
        setIsSubmitting(false);
      }
    }
  );

  const updateLeaveMutation = useMutation(
    ({ id, data }: { id: number; data: Partial<CreateLeaveData> }) => 
      leaveService.updateLeave(id, data),
    {
      onSuccess: () => {
        toast.success('Congé mis à jour avec succès');
        queryClient.invalidateQueries(['leave', leaveIdNum]);
        queryClient.invalidateQueries(['employee', employeeId]);
        navigate(`/employes/${employeeId}`);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error?.message || 'Erreur lors de la mise à jour du congé');
      },
      onSettled: () => {
        setIsSubmitting(false);
      }
    }
  );

  const onSubmit = (data: CreateLeaveData) => {
    setIsSubmitting(true);
    if (mode === 'create') {
      createLeaveMutation.mutate(data);
    } else if (leaveIdNum) {
      updateLeaveMutation.mutate({ id: leaveIdNum, data });
    }
  };

  if (isLoadingEmployee || (mode === 'edit' && isLoadingLeave)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            <Clock className="h-8 w-8 mr-3 text-blue-600" />
            {mode === 'create' ? 'Nouveau Congé' : 'Modifier le Congé'}
          </h1>
          <p className="text-gray-600 mt-1">
            {mode === 'create' 
              ? `Créer un nouveau congé pour ${employee.firstName} ${employee.lastName}` 
              : `Modifier le congé de ${employee.firstName} ${employee.lastName}`
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
                Type de congé *
              </label>
              <select
                {...register('type', { required: 'Le type de congé est requis' })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="PAID">Congés payés</option>
                <option value="UNPAID">Congés sans solde</option>
                <option value="SICK">Maladie</option>
                <option value="TRAINING">Formation</option>
                <option value="OTHER">Autre</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut *
              </label>
              <select
                {...register('status', { required: 'Le statut est requis' })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="PENDING">En attente</option>
                <option value="APPROVED">Approuvé</option>
                <option value="REJECTED">Rejeté</option>
                <option value="CANCELLED">Annulé</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Période */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Période</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Date de début *
              </label>
              <input
                type="date"
                {...register('startDate', { required: 'La date de début est requise' })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Date de fin *
              </label>
              <input
                type="date"
                {...register('endDate', { required: 'La date de fin est requise' })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="inline h-4 w-4 mr-1" />
                Durée (jours)
              </label>
              <input
                type="number"
                {...register('duration', { 
                  valueAsNumber: true,
                  min: { value: 0.5, message: 'La durée minimum est de 0.5 jour' }
                })}
                className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Motif et commentaires */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Motif et commentaires</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motif
              </label>
              <input
                type="text"
                {...register('reason')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Motif du congé"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commentaires
              </label>
              <textarea
                {...register('comments')}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Commentaires ou informations supplémentaires..."
              />
            </div>
          </div>
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
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {mode === 'create' ? 'Créer le congé' : 'Mettre à jour'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveForm;