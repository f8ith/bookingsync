import fs from 'fs';
import config from './config.js';
const got = (await import('got')).default
import type { SearchParameters } from 'got'

interface Json {
  [x: string]: string | number | boolean | Date | Json | JsonArray;
}

interface JsonArray extends Array<string | number | boolean | Date | Json | JsonArray> { }

export class APIClient {
  private baseUrl: string;
  private instance: typeof got;

  constructor() {
    this.baseUrl = config.baseUrl
  }

  async initialize() {
    let credentials = await this.auth()

    this.instance = got.extend({
      prefixUrl: this.baseUrl,
      headers: {
        'X-Company-Login': credentials.company,
        'X-Token': credentials.token
      },
      handlers: [
        (options, next) => {
          Error.captureStackTrace(options.context);
          return next(options);
        }
      ],
      hooks: {
        beforeError: [
          error => {
            (error as any).source = (error as any).options.context.stack.split('\n');
            return error;
          }
        ]
      }
    });

  }

  async auth() {
    if (fs.existsSync('./credentials.json')) return JSON.parse(fs.readFileSync('./credentials.json').toString());
    const credentials = await got.post(config.baseUrl + '/admin/auth', {
      json: {
        "company": config.company,
        "login": config.login,
        "password": config.password
      }
    }).text();
    fs.writeFileSync('./credentials.json', credentials)
    return JSON.parse(credentials)
  }

  async get(url: string, params: SearchParameters) {
    try {
      return await this.instance.get(url, {
        searchParams: params,
      }).json()
    } catch (err) {
      console.error(err);
    }
  }

  async put(url: string, json: Json) {
    return await this.instance.put(url, {
      json: json,
    }).json()
  }

  async post(url: string, json: Json) {
    return await this.instance.post(url, {
      json: json,
    }).json()
  }

  async delete(url: string, json: Json) {
    return await this.instance.delete(url, {
      json: json,
    }).json()
  }

  async getClient(id: Number) {
    const data = await this.get(`admin/clients/${id}`, {}) as any
    return {
      id: data.id,
      code: data.code,
      name: data.name,
      phone: data.phone
    }
  }

  async getClientList() {
    return await this.get('admin/clients', {})
  }

  async getBooking(id: Number) {
    const data = await this.get(`admin/bookings/${id}`, {}) as any
    return {
      id: data.id,
      code: data.code,
      startDatetime: data.start_datetime,
      endDatetime: data.end_datetime,
      duration: data.duration,
      serviceId: data.service_id,
      clientId: data.client_id
    }
  }

  async getService(id: Number) {
    const data = await this.get(`admin/bookings/${id}`, {}) as any
    return {
      id: data.id,
      name: data.name,
      price: data.price,
      currency: data.currency,
      isActive: data.is_active,
      isVisible: data.is_visible,
      duration: data.duration
    }
  }

  async getServiceList() {
    return await this.get('admin/services', {})
  }

}

