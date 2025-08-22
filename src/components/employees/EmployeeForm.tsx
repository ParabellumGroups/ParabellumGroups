import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { employeeService, CreateEmployeeData } from '../../services/employeeService';
import { 
  Save, 
  X, 
  UserCheck, 
  Mail, 
  Phone, 
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface EmployeeFormProps {
  mode?: 'create' | 'edit';
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const employeeId = id ? parseInt(id) : undefined;
  
  const { data: employeeData, isLoading: isLoadingEmployee } = useQuery(
    ['employee', employeeId],
    () => employeeService.getEmployee(employeeId!),
    {
      enabled: mode === 'edit' && !!employeeId,
      onError: (error: any) => {
        toast.error(error.response?.data?.error?.message || 'Erreur lors du chargement de l\'employé');
        navigate('/employes');
      }
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateEmployeeData>({
    defaultValues: {
      contractType: 'CDI',
      hireDate: new Date().toISOString().split('T')[0],
      country: 'France'
    }
  });

  useEffect(() => {
    if (mode === 'edit' && employeeData?.data?.employee) {
      const employee = employeeData.data.employee;
      reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email || '',
        phone: employee.phone || '',
        addressLine1: employee.addressLine1 || '',
        city: employee.city || '',
        postalCode: employee.postalCode || '',
        country: employee.country || 'France',
        hireDate: new Date(employee.hireDate).toISOString().split('T')[0],
        jobTitle: employee.jobTitle || '',
        department: employee.department || '',
        salaryBase: employee.salaryBase,
        contractType: employee.contractType,
        bankName: employee.bankName || '',
        bankIban: employee.bankIban || '',
        bankBic: employee.bankBic || ''
      });
    }
  }, [employeeData, mode, reset]);

  const createEmployeeMutation = useMutation(
    (data: CreateEmployeeData) => employeeService.createEmployee(data),
    {
      onSuccess: () => {
        toast.success('Employé créé avec succès');
        navigate('/employes');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error?.message || 'Erreur lors de la création de l\'employé');
      },
      onSettled: () => {
        setIsSubmitting(false);
      }
    }
  );

  const updateEmployeeMutation = useMutation(
    ({ id, data }: { id: number; data: Partial<CreateEmployeeData> }) => 
      employeeService.updateEmployee(id, data),
    {
      onSuccess: () => {
        toast.success('Employé mis à jour avec succès');
        queryClient.invalidateQueries(['employee', employeeId]);
        navigate('/employes');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error?.message || 'Erreur lors de la mise à jour de l\'employé');
      },
      onSettled: () => {
        setIsSubmitting(false);
      }
    }
  );

  const onSubmit = (data: CreateEmployeeData) => {
    setIsSubmitting(true);
    if (mode === 'create') {
      createEmployeeMutation.mutate(data);
    } else if (employeeId) {
      updateEmployeeMutation.mutate({ id: employeeId, data });
    }
  };

  if (mode === 'edit' && isLoadingEmployee) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <UserCheck className="h-8 w-8 mr-3 text-purple-600" />
            {mode === 'create' ? 'Nouvel Employé' : 'Modifier l\'Employé'}
          </h1>
          <p className="text-gray-600 mt-1">
            {mode === 'create' 
              ? 'Créez une nouvelle fiche employé' 
              : 'Modifiez les informations de l\'employé'
            }
          </p>
        </div>
        <button
          onClick={() => navigate('/employes')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <X className="h-4 w-4 mr-2" />
          Annuler
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informations personnelles */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <UserCheck className="inline h-4 w-4 mr-1" />
                Prénom *
              </label>
              <input
                type="text"
                {...register('firstName', { required: 'Le prénom est requis' })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Prénom"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <UserCheck className="inline h-4 w-4 mr-1" />
                Nom *
              </label>
              <input
                type="text"
                {...register('lastName', { required: 'Le nom est requis' })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Nom"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="inline h-4 w-4 mr-1" />
                Email
              </label>
              <input
                type="email"
                {...register('email', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email invalide'
                  }
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="email@exemple.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="inline h-4 w-4 mr-1" />
                Téléphone
              </label>
              <input
                type="tel"
                {...register('phone')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="01.23.45.67.89"
              />
            </div>
          </div>
        </div>

        {/* Adresse */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Adresse</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="inline h-4 w-4 mr-1" />
                Adresse
              </label>
              <input
                type="text"
                {...register('addressLine1')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Numéro et nom de rue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code postal
              </label>
              <input
                type="text"
                {...register('postalCode')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="75001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <input
                type="text"
                {...register('city')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Paris"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pays
              </label>
              <input
                type="text"
                {...register('country')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                defaultValue="France"
              />
            </div>
          </div>
        </div>

        {/* Informations professionnelles */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Informations professionnelles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Briefcase className="inline h-4 w-4 mr-1" />
                Poste *
              </label>
              <input
                type="text"
                {...register('jobTitle', { required: 'Le poste est requis' })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Intitulé du poste"
              />
              {errors.jobTitle && (
                <p className="mt-1 text-sm text-red-600">{errors.jobTitle.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Briefcase className="inline h-4 w-4 mr-1" />
                Département *
              </label>
              <select
                {...register('department', { required: 'Le département est requis' })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="">Sélectionner un département</option>
                <option value="Commercial">Commercial</option>
                <option value="Progitek">Progitek</option>
                <option value="Ressources Humaines">Ressources Humaines</option>
                <option value="Comptabilité">Comptabilité</option>
                <option value="Direction">Direction</option>
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Date d'embauche *
              </label>
              <input
                type="date"
                {...register('hireDate', { required: 'La date d\'embauche est requise' })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
              {errors.hireDate && (
                <p className="mt-1 text-sm text-red-600">{errors.hireDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de contrat *
              </label>
              <select
                {...register('contractType', { required: 'Le type de contrat est requis' })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="STAGE">Stage</option>
                <option value="FREELANCE">Freelance</option>
              </select>
              {errors.contractType && (
                <p className="mt-1 text-sm text-red-600">{errors.contractType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Salaire de base *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  {...register('salaryBase', { 
                    required: 'Le salaire est requis',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Le salaire doit être positif' }
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-8"
                  placeholder="0.00"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
              </div>
              {errors.salaryBase && (
                <p className="mt-1 text-sm text-red-600">{errors.salaryBase.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Informations bancaires */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Informations bancaires</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <CreditCard className="inline h-4 w-4 mr-1" />
                Nom de la banque
              </label>
              <input
                type="text"
                {...register('bankName')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Nom de l'établissement bancaire"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IBAN
              </label>
              <input
                type="text"
                {...register('bankIban')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="FR76 1234 5678 9012 3456 7890 123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BIC / SWIFT
              </label>
              <input
                type="text"
                {...register('bankBic')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="ABCDEFGHIJK"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/employes')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {mode === 'create' ? 'Créer l\'employé' : 'Mettre à jour'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;