export interface QueryRoomLinkCreateResponse {
  url: string;
  token: string;
  roomId: string;
  tokenKit: string;
  userCreateId: number;
  solicitationId: number;
}

export interface QueryRoomLinkValidateResponse {
  valid: boolean;
  roomId: string;
  tokenKit: string;
}
