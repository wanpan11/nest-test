import axios from 'axios';
import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';

import { wxApi } from './common';
import { WxTicketResponse, WxTokenRequest, WxTokenResponse } from './interface';

@Injectable()
export class WeChatService {
  /**
   * 微信官方签名算法：将 jsapi_ticket、nonceStr、timestamp、url 按照字典序排序后拼接，用 sha1 加密
   */
  private sha1(str: string): string {
    return crypto.createHash('sha1').update(str, 'utf8').digest('hex');
  }

  async getToken(params: WxTokenRequest) {
    try {
      const { data } = await axios.get<WxTokenResponse>(wxApi.getToken, {
        params: { appid: wxApi.appId, secret: wxApi.appsecret, grant_type: 'client_credential' },
      });

      const { data: ticketData } = await axios.get<WxTicketResponse>(wxApi.getTicket, {
        params: { access_token: data.access_token, type: 'jsapi' },
      });

      // 微信官方签名参数：jsapi_ticket, nonceStr, timestamp, url
      const ticket = ticketData?.ticket;
      const { noncestr, timeStamp, url } = params;
      const arr = [
        `jsapi_ticket=${ticket}`,
        `noncestr=${noncestr}`,
        `timestamp=${timeStamp}`,
        `url=${url}`,
      ];
      const signString = arr.join('&');
      const signature = this.sha1(signString);

      return signature;
    } catch (error) {
      console.error('Error fetching token:', error);
      throw error;
    }
  }
}
