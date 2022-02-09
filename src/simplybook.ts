//import fs from 'fs';
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
    const credentials = await this.auth()

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
        afterResponse: [
          async (response, retryWithMergedOptions) => {
            if (response.statusCode === 401) {
              const updatedOptions = {
                headers: {
                  token: (await this.auth()).token
                }
              };

              this.instance.defaults.options.merge(updatedOptions);

              return retryWithMergedOptions(updatedOptions);
            }

            return response;
          }
        ],
        beforeError: [
          error => {
            (error as any).source = (error as any).options.context.stack.split('\n');
            return error;
          }
        ]
      },
      mutableDefaults: true
    });

    //    await this.refreshToken(credentials)

  }

  async auth() {
    //    if (fs.existsSync('./credentials.json')) return JSON.parse(fs.readFileSync('./credentials.json').toString());
    const credentials = await got.post(config.baseUrl + '/admin/auth', {
      json: {
        "company": config.company,
        "login": config.login,
        "password": config.password
      }
    }).text();
    //    fs.writeFileSync('./credentials.json', credentials)
    return JSON.parse(credentials)
  }

  async refreshToken(credentials: any) {
    await this.post('admin/auth/refresh-token', {
      "company": config.company,
      "refresh_token": credentials.refresh_token,
    })
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
    try {
      return await this.instance.put(url, {
        json: json,
      }).json()
    } catch (err) {
      console.error(err);
    }
  }

  async post(url: string, json: Json) {
    try {
      return await this.instance.post(url, {
        json: json,
      }).json()
    } catch (err) {
      console.error(err);
    }
  }

  async delete(url: string, json: Json) {
    try {
      return await this.instance.delete(url, {
        json: json,
      }).json()
    } catch (err) {
      console.error(err);
    }
  }

  async getClient(id: Number) {
    const data = await this.get(`admin/clients/${id}`, {}) as any
    return {
      id: parseInt(data.id),
      email: data.email,
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
      id: parseInt(data.id),
      code: parseInt(data.code),
      start_datetime: new Date(data.start_datetime),
      end_datetime: new Date(data.end_datetime),
      duration: parseInt(data.duration),
      service_id: parseInt(data.service_id),
      client_id: parseInt(data.client_id)
    }
  }

  async getService(id: Number) {
    const data = await this.get(`admin/services/${id}`, {}) as any
    return {
      id: parseInt(data.id),
      name: data.name,
      price: parseInt(data.price),
      currency: data.currency,
      is_active: data.is_active,
      is_visible: data.is_visible,
      duration: parseInt(data.duration)
    }
  }

  async getServiceList() {
    return await this.get('admin/services', {})
  }

}
