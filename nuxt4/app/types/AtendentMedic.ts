export interface AtendentMedicProps {
  atendentId: number;
  medicId: number;
  atendent?: UserProps;
  medic?: UserProps;
}

export interface AtendentMedicListProps {
  associations: AtendentMedicProps[];
  medics: UserProps[];
}
