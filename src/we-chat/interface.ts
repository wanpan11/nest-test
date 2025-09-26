export interface WxTokenRequest {
  timeStamp: string;
  noncestr: string;
  url: string;
}
export interface WxTokenResponse {
  access_token: string;
  expires_in: number;
}

export interface WxTicketResponse {
  errcode: number;
  errmsg: string;
  ticket: string;
  expires_in: number;
}
