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
