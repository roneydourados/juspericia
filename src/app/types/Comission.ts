export interface ComissionProps {
  publicId?: string;
  ownerId?: number;
  comissionCategory?: string;
  comissionUserId?: number;
  comissionDate?: string;
  comissionDatePaid?: string;
  comissionBase?: number;
  comissionValue?: number;
  comissionPercentage?: number;
  comissionStatus?: string; //pending, paid, canceled, etc..
  comissionType?: string; //seller, medic, etc..
  comissionObservation?: string;
  user?: UserProps;
  histories?: ComissionHistoryProps[];
}

export interface ComissionHistoryProps {
  createdAt: string;
  observation: string;
}
