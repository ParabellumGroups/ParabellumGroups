import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { employeeService } from '../../services/employeeService';
import { 
  ArrowLeft, 
  Edit, 
  UserCheck, 
  Mail, 
  Phone, 
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  CreditCard,
  FileText,
  Clock,
  Plus,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const EmployeeDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const employeeId = parseInt(id!);
  const { data: employeeData, isLoading, error } = useQuery(
    ['employee', employeeId],
    () => employeeService.getEmployee(employeeId)
  );

  const employee = employeeData?.data?.employee;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Erreur de chargement
            </h3>
            <p className="mt-1 text-sm text-red-700">
              {(error as any)?.message || 'Employé non trouvé'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getContractTypeLabel = (type: string) => {
    const labels = {
      'CDI': 'CDI',
      'CDD': 'CDD',
      'STAGE': 'Stage',
      'FREELANCE': 'Freelance'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/employes')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <UserCheck className="h-8 w-8 mr-3 text-purple-600" />
              {employee.firstName} {employee.lastName}
            </h1>
            <p className="text-gray-600 mt-1">
              {employee.jobTitle} - {employee.department}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(`/employes/${employee.id}/modifier`)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations générales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations personnelles */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h2>
            
            <div className="space-y-4">
              {employee.email && (
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <a 
                      href={`mailto:${employee.email}`}
                      className="text-sm text-blue-600 hover:text-blue-900"
                    >
                      {employee.email}
                    </a>
                  </div>
                </div>
              )}

              {employee.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Téléphone</p>
                    <a 
                      href={`tel:${employee.phone}`}
                      className="text-sm text-blue-600 hover:text-blue-900"
                    >
                      {employee.phone}
                    </a>
                  </div>
                </div>
              )}

              {employee.addressLine1 && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Adresse</p>
                    <p className="text-sm text-gray-600">
                      {employee.addressLine1}<br />
                      {employee.postalCode} {employee.city}<br />
                      {employee.country}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Informations professionnelles</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Poste</p>
                  <p className="text-sm text-gray-600">{employee.jobTitle}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Département</p>
                  <p className="text-sm text-gray-600">{employee.department}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Date d'embauche</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(employee.hireDate), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="h-5 w-5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Type de contrat</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    employee.contractType === 'CDI' ? 'bg-green-100 text-green-800' :
                    employee.contractType === 'CDD' ? 'bg-blue-100 text-blue-800' :
                    employee.contractType === 'STAGE' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {getContractTypeLabel(employee.contractType)}
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Salaire de base</p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(employee.salaryBase)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informations bancaires */}
          {(employee.bankName || employee.bankIban || employee.bankBic) && (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Informations bancaires</h2>
              
              <div className="space-y-4">
                {employee.bankName && (
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Banque</p>
                      <p className="text-sm text-gray-600">{employee.bankName}</p>
                    </div>
                  </div>
                )}

                {employee.bankIban && (
                  <div className="flex items-center">
                    <div className="h-5 w-5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">IBAN</p>
                      <p className="text-sm font-mono text-gray-600">{employee.bankIban}</p>
                    </div>
                  </div>
                )}

                {employee.bankBic && (
                  <div className="flex items-center">
                    <div className="h-5 w-5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">BIC / SWIFT</p>
                      <p className="text-sm font-mono text-gray-600">{employee.bankBic}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistiques */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Statistiques</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Salaires</span>
                </div>
                <span className="text-sm text-gray-600">{employee.salaries?.length || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Congés</span>
                </div>
                <span className="text-sm text-gray-600">{employee.leaves?.length || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Ancienneté</span>
                </div>
                <span className="text-sm text-gray-600">
                  {Math.floor((new Date().getTime() - new Date(employee.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} ans
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/employes/${employee.id}/salaires`)}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Gérer les salaires
              </button>
              
              <button
                onClick={() => navigate(`/employes/${employee.id}/conges`)}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Clock className="h-4 w-4 mr-2" />
                Gérer les congés
              </button>
              
              <button
                onClick={() => navigate(`/employes/${employee.id}/modifier`)}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Historique des salaires */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Historique des salaires</h2>
          <button
            onClick={() => navigate(`/employes/${employee.id}/salaires/nouveau`)}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Nouveau salaire
          </button>
        </div>
        
        {employee.salaries && employee.salaries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Période
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de paiement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salaire brut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salaire net
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employee.salaries.map((salary) => (
                  <tr key={salary.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {salary.payrollPeriodStart && salary.payrollPeriodEnd ? (
                        <>
                          {format(new Date(salary.payrollPeriodStart), 'dd/MM/yyyy', { locale: fr })} - {format(new Date(salary.payrollPeriodEnd), 'dd/MM/yyyy', { locale: fr })}
                        </>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(salary.payDate), 'dd/MM/yyyy', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(salary.grossSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(salary.netSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        salary.status === 'PAID' ? 'bg-green-100 text-green-800' :
                        salary.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {salary.status === 'PAID' ? 'Payé' :
                         salary.status === 'DRAFT' ? 'Brouillon' : 
                         salary.status === 'CANCELLED' ? 'Annulé' : salary.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/employes/${employee.id}/salaires/${salary.id}`)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Aucun historique de salaire disponible.</p>
        )}
      </div>

      {/* Historique des congés */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Historique des congés</h2>
          <button
            onClick={() => navigate(`/employes/${employee.id}/conges/nouveau`)}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Nouveau congé
          </button>
        </div>
        
        {employee.leaves && employee.leaves.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Début
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employee.leaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        leave.type === 'PAID' ? 'bg-green-100 text-green-800' :
                        leave.type === 'UNPAID' ? 'bg-red-100 text-red-800' :
                        leave.type === 'SICK' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {leave.type === 'PAID' ? 'Congés payés' :
                         leave.type === 'UNPAID' ? 'Congés sans solde' :
                         leave.type === 'SICK' ? 'Maladie' :
                         leave.type === 'TRAINING' ? 'Formation' : leave.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(leave.startDate), 'dd/MM/yyyy', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(leave.endDate), 'dd/MM/yyyy', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {leave.duration} jours
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        leave.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        leave.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        leave.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {leave.status === 'APPROVED' ? 'Approuvé' :
                         leave.status === 'PENDING' ? 'En attente' :
                         leave.status === 'REJECTED' ? 'Rejeté' : leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/employes/${employee.id}/conges/${leave.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Aucun historique de congés disponible.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetail;