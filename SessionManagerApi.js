import { UserEntity } from './UserEntity.js';

export class SessionManager {
  constructor() {
    this.baseUrl = 'http://localhost:5064/api/session-manager/users';
  }

  async fetchWithHeaders(url, options = {}) {
    const headers = new Headers();
    headers.append('X-Api-Key', localStorage.getItem('apiKey'));       
    headers.append('accept', "*/*");   

    // append headers from options.headers
    if (options.headers) {
      for (const [key, value] of Object.entries(options.headers)) {
        headers.append(key, value);
      }
    }

    const requestOptions = {
      ...options,
      headers: headers
    };

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  }

  async getUsers() {
    const response = await this.fetchWithHeaders(this.baseUrl);
    const users = await response.json();
    return users.map(user => new UserEntity(user.Id, user.Name, user.IsLocked));
  }

  async addUser(user) {
    const response = await this.fetchWithHeaders(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });
    return new UserEntity(user.Id, user.Name, user.IsLocked);
  }

  async updateUser(user) {
    const response = await this.fetchWithHeaders(this.baseUrl, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });    
  }

  async getUserById(id) {
    const url = `${this.baseUrl}/${id}`;
    const response = await this.fetchWithHeaders(url);
    const user = await response.json();
    return new UserEntity(user.Id, user.Name, user.IsLocked);
  }

  async deleteUserById(id) {
    const url = `${this.baseUrl}/${id}`;
    const response = await this.fetchWithHeaders(url, { method: 'DELETE' });
    return response.json();
  }

  async getUserByName(name) {
    const url = `${this.baseUrl}/${name}`;
    const response = await this.fetchWithHeaders(url);
    const user = await response.json();
    return new UserEntity(user.Id, user.Name, user.IsLocked);
  }

  async lockUser(id) {
    const url = `${this.baseUrl}/${id}/lock`;
    const response = await this.fetchWithHeaders(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async unlockUser(id) {
    const url = `${this.baseUrl}/${id}/unlock`;
    const response = await this.fetchWithHeaders(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
  }

}