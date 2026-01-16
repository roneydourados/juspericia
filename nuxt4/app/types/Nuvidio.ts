export interface NuvidioInviteLinkProps {
  id: number;
  userId: number;
  token: string;
  shortLink: string;
  link: string;
  nuvidioId: string;
  expirationDate: string;
}

export interface NuvidioInviteLinkResponse {
  invite: NuvidioInviteLinkProps;
}

export const eventsTypeNuvidioWebhook = [
  "new_client_waiting",
  "new_call_started",
  "client_left_queue",
  "call_finished",
];

export interface NuvidioWebhookRespProps {
  id: number;
  hookType: string;
  hookDescription: string;
  customerId: string;
  customerEmail: string;
  customerTel: string;
  customerName: string;
  nuvidioDepartmentId: number;
  nuvidioDepartment: NuvidioDepartmentProps;
  createdAt: string;
}
