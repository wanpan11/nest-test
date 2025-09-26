import axios from 'axios';
import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';

import { wxApi } from './common';
import { WxTicketResponse, WxTokenRequest, WxTokenResponse } from './interface';

@Injectable()
export class WeChatService {
  /**
   * 按字段名ASCII码排序并拼接为URL键值对字符串
   */
  private buildSignString(obj: Record<string, any>): string {
    return Object.keys(obj)
      .sort()
      .map(key => `${key}=${obj[key]}`)
      .join('&');
  }

  /**
   * 对字符串进行sha1签名
   */
  private sha1(str: string): string {
    return crypto.createHash('sha1').update(str).digest('hex');
  }

  async getToken(params: WxTokenRequest) {
    try {
      const { data } = await axios.get<WxTokenResponse>(wxApi.getToken, {
        params: { appid: wxApi.appId, secret: wxApi.appsecret, grant_type: 'client_credential' },
      });

      const { data: ticketData } = await axios.get<WxTicketResponse>(wxApi.getTicket, {
        params: { access_token: data.access_token, type: 'jsapi' },
      });

      // 合并参数
      const signParams = {
        ...params,
        ticket: ticketData?.ticket,
      };
      // 按字典序拼接
      const signString = this.buildSignString(signParams);
      // sha1签名
      const signature = this.sha1(signString);

      return signature;
    } catch (error) {
      console.error('Error fetching token:', error);
      throw error;
    }
  }
}
