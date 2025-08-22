import React from 'react';
import { Clock, CheckSquare, TrendingUp, FileText } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, description }) => {
  const getFeaturesList = (title: string) => {
    switch (title) {
      case 'Employés':
        return [
          { icon: CheckSquare, text: 'Gestion des employés', status: 'completed' },
          { icon: CheckSquare, text: 'Gestion des contrats', status: 'completed' },
          { icon: CheckSquare, text: 'Gestion des salaires', status: 'completed' },
          { icon: CheckSquare, text: 'Suivi des congés', status: 'completed' }
        ];
      case 'Rapports':
        return [
          { icon: Clock, text: 'Rapports financiers', status: 'coming' },
          { icon: Clock, text: 'Analyses de ventes', status: 'coming' },
          { icon: Clock, text: 'Suivi de performance', status: 'coming' },
          { icon: Clock, text: 'Exports personnalisés', status: 'coming' }
        ];
      case 'Clients':
        return [
          { icon: CheckSquare, text: 'Gestion complète des fiches clients', status: 'completed' },
          { icon: CheckSquare, text: 'Association aux services', status: 'completed' },
          { icon: CheckSquare, text: 'Historique des interactions', status: 'completed' },
          { icon: Clock, text: 'Import/Export des données', status: 'coming' }
        ];
      case 'Devis':
        return [
          { icon: CheckSquare, text: 'Création de devis personnalisés', status: 'completed' },
          { icon: CheckSquare, text: 'Workflow de validation hiérarchique', status: 'completed' },
          { icon: CheckSquare, text: 'Conversion automatique en factures', status: 'completed' },
          { icon: CheckSquare, text: 'Suivi des statuts', status: 'completed' }
        ];
      case 'Factures':
        return [
          { icon: CheckSquare, text: 'Émission de factures conformes', status: 'completed' },
          { icon: Clock, text: 'Facturation récurrente', status: 'coming' },
          { icon: Clock, text: 'Génération de PDF', status: 'coming' },
          { icon: Clock, text: 'Envoi automatique par email', status: 'coming' }
        ];
      case 'Comptabilité':
        return [
          { icon: Clock, text: 'Plan comptable français', status: 'coming' },
          { icon: Clock, text: 'Écritures automatiques', status: 'coming' },
          { icon: Clock, text: 'Bilan et compte de résultat', status: 'coming' },
          { icon: Clock, text: 'Rapprochement bancaire', status: 'coming' }
        ];
      default:
        return [
          { icon: Clock, text: 'Fonctionnalités en développement', status: 'coming' }
        ];
    }
  };

  const features = getFeaturesList(title);
  const completedFeatures = features.filter(f => f.status === 'completed').length;
  const totalFeatures = features.length;
  const progressPercentage = (completedFeatures / totalFeatures) * 100;

  return (
    <div className="text-center py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <TrendingUp className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
          {description && (
            <p className="text-gray-600 text-lg">{description}</p>
          )}
        </div>

        {/* Barre de progression */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progression</span>
            <span className="text-sm font-medium text-gray-700">{completedFeatures}/{totalFeatures} fonctionnalités</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">{Math.round(progressPercentage)}% terminé</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Fonctionnalités
          </h2>
          <ul className="space-y-3 text-left">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <li key={index} className="flex items-center">
                  <IconComponent className={`h-5 w-5 mr-3 ${
                    feature.status === 'completed' ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <span className={`${
                    feature.status === 'completed' ? 'text-gray-900 font-medium' : 'text-gray-600'
                  }`}>
                    {feature.text}
                  </span>
                  {feature.status === 'completed' && (
                    <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Disponible
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {completedFeatures === totalFeatures ? (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              🎉 Toutes les fonctionnalités sont maintenant disponibles !
            </p>
          </div>
        ) : (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">
              <Clock className="inline h-4 w-4 mr-1" />
              Les fonctionnalités restantes seront bientôt disponibles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComingSoon;