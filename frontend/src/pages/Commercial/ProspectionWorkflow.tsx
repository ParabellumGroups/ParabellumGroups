import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Target, 
  Search, 
  Phone, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  Users,
  TrendingUp,
  FileText,
  Plus,
  Edit,
  Eye
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { createCrudService } from '../../services/api';
import { CreateProspectModal } from '../../components/Modals/CreateProspectModal';
import { ProspectionFlowChart } from '../../components/Commercial/ProspectionFlowChart';

const prospectService = createCrudService('prospects');

const workflowStages = [
  {
    id: 'preparation',
    name: 'Préparation',
    description: 'Définition de la cible & préparation des outils',
    color: 'bg-blue-100 text-blue-800',
    icon: Target
  },
  {
    id: 'research',
    name: 'Recherche & Qualification',
    description: 'Identification, qualification et priorisation',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Search
  },
  {
    id: 'contact',
    name: 'Prise de Contact',
    description: 'Email & phoning - Objectif: Fixer un RDV',
    color: 'bg-purple-100 text-purple-800',
    icon: Phone
  },
  {
    id: 'discovery',
    name: 'Entretien Découverte',
    description: 'Écoute active & diagnostic - Comprendre le besoin',
    color: 'bg-indigo-100 text-indigo-800',
    icon: Calendar
  },
  {
    id: 'proposal',
    name: 'Proposition & Conclusion',
    description: 'Présentation offre & réponse objections',
    color: 'bg-green-100 text-green-800',
    icon: FileText
  },
  {
    id: 'won',
    name: 'Client Converti',
    description: 'Prospect converti en client',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle
  },
  {
    id: 'lost',
    name: 'Perdu/Nurturing',
    description: 'Analyse échec & nurturing futur',
    color: 'bg-red-100 text-red-800',
    icon: XCircle
  }
];

export const ProspectionWorkflow: React.FC = () => {
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const [selectedStage, setSelectedStage] = useState('preparation');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFlowChart, setShowFlowChart] = useState(true);

  const { data: prospects, isLoading } = useQuery({
    queryKey: ['prospects', selectedStage],
    queryFn: () => prospectService.getAll({ stage: selectedStage, limit: 50 })
  });

  const { data: stats } = useQuery({
    queryKey: ['prospection-stats'],
    queryFn: () => prospectService.getAll({ endpoint: 'stats' })
  });

  const moveProspectMutation = useMutation({
    mutationFn: ({ id, newStage, notes }: { id: number; newStage: string; notes?: string }) =>
      fetch(`/api/v1/prospects/${id}/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ stage: newStage, notes })
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.invalidateQueries({ queryKey: ['prospection-stats'] });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const prospectsList = prospects?.data?.prospects || [];
  const statistics = stats?.data || {};

  const handleMoveProspect = async (prospect: any, newStage: string) => {
    const notes = prompt(`Notes pour le passage à l'étape "${workflowStages.find(s => s.id === newStage)?.name}" :`);
    if (notes !== null) {
      try {
        await moveProspectMutation.mutateAsync({ id: prospect.id, newStage, notes });
      } catch (error) {
        console.error('Erreur lors du déplacement:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflow de Prospection Commerciale</h1>
          <p className="text-gray-600">Gérez votre pipeline de prospection étape par étape</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFlowChart(!showFlowChart)}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center space-x-2"
          >
            <TrendingUp className="h-4 w-4" />
            <span>{showFlowChart ? 'Masquer' : 'Afficher'} Diagramme</span>
          </button>
          {hasPermission('prospects.create') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nouveau Prospect</span>
            </button>
          )}
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Prospects</div>
              <div className="text-2xl font-bold text-gray-900">
                {statistics.totalProspects || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">En Cours</div>
              <div className="text-2xl font-bold text-gray-900">
                {statistics.activeProspects || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Convertis</div>
              <div className="text-2xl font-bold text-gray-900">
                {statistics.convertedProspects || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Taux Conversion</div>
              <div className="text-2xl font-bold text-gray-900">
                {statistics.conversionRate || 0}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagramme de flux */}
      {showFlowChart && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Diagramme du Processus</h3>
          <ProspectionFlowChart />
        </div>
      )}

      {/* Étapes du workflow */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {workflowStages.map((stage) => {
              const Icon = stage.icon;
              const isActive = selectedStage === stage.id;
              const stageCount = statistics.byStage?.[stage.id] || 0;
              
              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStage(stage.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{stage.name}</span>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${stage.color}`}>
                    {stageCount}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenu de l'étape sélectionnée */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {workflowStages.find(s => s.id === selectedStage)?.name}
            </h3>
            <p className="text-gray-600">
              {workflowStages.find(s => s.id === selectedStage)?.description}
            </p>
          </div>

          {/* Liste des prospects pour cette étape */}
          <div className="space-y-4">
            {prospectsList.length > 0 ? (
              prospectsList.map((prospect: any) => (
                <div key={prospect.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{prospect.companyName}</h4>
                          <p className="text-sm text-gray-500">{prospect.contactName} - {prospect.position}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                          prospect.priority === 'A' ? 'bg-red-100 text-red-800' :
                          prospect.priority === 'B' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          Priorité {prospect.priority}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>📧 {prospect.email}</span>
                        <span>📞 {prospect.phone}</span>
                        <span>💰 {prospect.estimatedValue ? `${prospect.estimatedValue.toLocaleString()} FCFA` : 'N/A'}</span>
                        <span>📅 {new Date(prospect.lastContact).toLocaleDateString()}</span>
                      </div>
                      {prospect.notes && (
                        <p className="mt-2 text-sm text-gray-600 italic">"{prospect.notes}"</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="Voir détails">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900" title="Modifier">
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      {/* Actions selon l'étape */}
                      {selectedStage === 'research' && (
                        <button
                          onClick={() => handleMoveProspect(prospect, 'contact')}
                          className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 flex items-center"
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Contacter
                        </button>
                      )}
                      
                      {selectedStage === 'contact' && (
                        <>
                          <button
                            onClick={() => handleMoveProspect(prospect, 'discovery')}
                            className="bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 flex items-center"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            RDV Fixé
                          </button>
                          <button
                            onClick={() => handleMoveProspect(prospect, 'research')}
                            className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700"
                          >
                            Rappeler +tard
                          </button>
                        </>
                      )}
                      
                      {selectedStage === 'discovery' && (
                        <>
                          <button
                            onClick={() => handleMoveProspect(prospect, 'proposal')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 flex items-center"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Proposer
                          </button>
                          <button
                            onClick={() => handleMoveProspect(prospect, 'lost')}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                          >
                            Non qualifié
                          </button>
                        </>
                      )}
                      
                      {selectedStage === 'proposal' && (
                        <>
                          <button
                            onClick={() => handleMoveProspect(prospect, 'won')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 flex items-center"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Signé
                          </button>
                          <button
                            onClick={() => handleMoveProspect(prospect, 'lost')}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                          >
                            Refusé
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Target className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Aucun prospect à cette étape
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {selectedStage === 'preparation' 
                    ? 'Commencez par ajouter des prospects à qualifier'
                    : 'Les prospects apparaîtront ici quand ils atteindront cette étape'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <CreateProspectModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />

      {/* Guide des bonnes pratiques */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Guide des Bonnes Pratiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Target className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-900">Phase 1 : Préparation</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Définir le profil client idéal (ICP)</li>
              <li>• Préparer les outils (CRM, scripts, supports)</li>
              <li>• Fixer les objectifs quantitatifs</li>
            </ul>
          </div>

          <div className="border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Search className="h-5 w-5 text-yellow-600 mr-2" />
              <h4 className="font-medium text-yellow-900">Phase 2 : Recherche</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Identifier les prospects (LinkedIn, annuaires)</li>
              <li>• Qualifier : BANT (Budget, Authority, Need, Timeline)</li>
              <li>• Prioriser : A (chaud), B (tiède), C (froid)</li>
            </ul>
          </div>

          <div className="border border-purple-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Phone className="h-5 w-5 text-purple-600 mr-2" />
              <h4 className="font-medium text-purple-900">Phase 3 : Contact</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Email d'approche personnalisé</li>
              <li>• Appel de suivi sous 48h</li>
              <li>• Objectif : Fixer un RDV découverte</li>
            </ul>
          </div>

          <div className="border border-indigo-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
              <h4 className="font-medium text-indigo-900">Phase 4 : Découverte</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Écoute active (80% écoute, 20% parole)</li>
              <li>• Diagnostic des besoins et enjeux</li>
              <li>• Qualification du budget et timing</li>
            </ul>
          </div>

          <div className="border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <FileText className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="font-medium text-green-900">Phase 5 : Proposition</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Présentation solution adaptée</li>
              <li>• Traitement des objections</li>
              <li>• Techniques de closing</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <TrendingUp className="h-5 w-5 text-gray-600 mr-2" />
              <h4 className="font-medium text-gray-900">Suivi & Nurturing</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Relances programmées</li>
              <li>• Contenu de valeur (newsletters)</li>
              <li>• Maintien de la relation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};