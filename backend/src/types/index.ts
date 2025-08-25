export * from '../../../shared/types';
import { Request } from 'express';

// Types spécifiques au backend
export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  serviceId?: number;
  permissions: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export interface PermissionCheck {
  resource: string;
  action: string;
  serviceId?: number;
}

export interface AuditLogData {
  userId: number;
  action: string;
  resource: string;
  resourceId?: number;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

// Types pour les modules de service
export interface Specialite {
  id: number;
  libelle: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Technicien {
  id: number;
  nom: string;
  prenom: string;
  contact: string;
  specialiteId: number;
  utilisateurId?: number;
  isActive: boolean;
  specialite?: Specialite;
  utilisateur?: User;
}

export interface Mission {
  numIntervention: string;
  natureIntervention: string;
  objectifDuContrat: string;
  description?: string;
  priorite?: string;
  statut?: string;
  dateSortieFicheIntervention: Date;
  clientId: number;
  client?: any;
  interventions?: Intervention[];
}

export interface Intervention {
  id: number;
  dateHeureDebut: Date;
  dateHeureFin?: Date;
  duree?: number;
  missionId: string;
  statut: string;
  commentaire?: string;
  mission?: Mission;
  techniciens?: TechnicienIntervention[];
}

export interface TechnicienIntervention {
  id: number;
  technicienId: number;
  interventionId: number;
  role: string;
  commentaire?: string;
  technicien?: Technicien;
}

export interface RapportMission {
  id: number;
  titre: string;
  contenu: string;
  interventionId?: number;
  technicienId: number;
  missionId: string;
  statut: string;
  dateValidation?: Date;
  commentaire?: string;
  images?: RapportImage[];
}

export interface RapportImage {
  id: number;
  rapportId: number;
  url: string;
  description?: string;
  ordre: number;
}

export interface Materiel {
  id: number;
  reference: string;
  designation: string;
  description?: string;
  quantiteTotale: number;
  quantiteDisponible: number;
  seuilAlerte: number;
  emplacement?: string;
  categorie: string;
  prixUnitaire?: number;
  fournisseur?: string;
  dateAchat?: Date;
  garantie?: string;
  statut: string;
}

export interface SortieMateriel {
  id: number;
  materielId: number;
  interventionId: number;
  technicienId: number;
  quantite: number;
  dateSortie: Date;
  motif?: string;
  retourne: boolean;
  dateRetour?: Date;
  quantiteRetour?: number;
  commentaire?: string;
}

export interface EntreeMateriel {
  id: number;
  materielId: number;
  quantite: number;
  dateEntree: Date;
  source: string;
  prixTotal?: number;
  fournisseur?: string;
  facture?: string;
  commentaire?: string;
}

// Types pour les messages
export interface Message {
  id: number;
  senderId: number;
  recipientId: number;
  subject: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  type: 'internal' | 'external' | 'system';
  status: 'unread' | 'read' | 'replied' | 'archived';
  readAt?: Date;
  archivedAt?: Date;
  parentMessageId?: number;
  createdAt: Date;
  updatedAt: Date;
  sender?: User;
  recipient?: User;
  attachments?: MessageAttachment[];
  replies?: Message[];
}

export interface MessageAttachment {
  id: number;
  messageId: number;
  filename: string;
  url: string;
  size?: number;
  mimeType?: string;
  createdAt: Date;
}