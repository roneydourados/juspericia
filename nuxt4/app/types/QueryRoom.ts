export interface QueryRoomLinkCreateResponse {
  url: string;
  token: string;
  roomId: string;
  userCreateId: number;
  solicitationId: number;
}

export interface QueryRoomLinkValidateResponse {
  valid: boolean;
  roomId: string;
  tokenKit: string;
  userId: string;
  url: string;
}
