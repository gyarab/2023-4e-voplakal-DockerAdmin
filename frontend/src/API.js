if (!window.AbortError) {
  window.AbortError = class extends Error {
    constructor() {
      super('Aborted')
    }
  }
}

export class RESTError extends Error {}

export let REST = {
  prefix: '/api/',
  /**
   *
   * @param {Number} status response code
   * @returns true: behaves like ok response; false: throws error
   */
  codeOk: (code) => {
    if (code === 401) return true
    return false
  },

  /**
   *
   * @param {Number} code
   * @returns {Boolean} if the error should be caught
   */
  errorAction(status) {
    const router = window.router
    if (status >= 500) {
      router.push('500')
      return false;
    }
    if (status === 401) {
      //unauthorized
      router.push('login')
      return true
    }
  },

  getURL(path) {
    return REST.prefix + path
  },

  getExtraHeaders(method, path) {
    let header = {}
    Object.assign(header, authHeader())
    return header

    function authHeader() {
      let user = JSON.parse(localStorage.getItem('user'))

      if (user && user.accessToken) {
        // for Node.js Express back-end
        return { 'x-access-token': user.accessToken }
      } else {
        return {}
      }
    }
  },
  async request({ path, body, method, headers, nonJsonOk, signal }) {
    try {
      let res = await fetch(REST.getURL(path), {
        method,
        mode: 'same-origin',
        headers: {
          Accept: 'application/json',
          'X-Anti-CSRF': '1',
          ...this.getExtraHeaders(method, path),
          ...headers,
        },
        body,
        cache: 'default',
        signal,
      })

      if (res.ok || this.codeOk(res.status)) {
        try {
          return await res.json()
        } catch (ex) {
          if (!nonJsonOk) {
            throw new RESTError(`${method} ${path} failed to parse response JSON`)
          }
        }
      } else {
        let errData = {}
        try {
          errData = await res.json()
        } catch (ex) {}

        let err = new RESTError(
          (errData || {}).message || `${method} ${path} failed with status: ${res.status}`,
        )
        err.status = res.status
        err.detail = (errData || {}).detail
        err.reason = (errData || {}).reason
        err.code = (errData || {}).code
        err.serverError = (errData || {}).error
        throw err
      }
    } catch (ex) {
      if (ex instanceof DOMException) {
        throw new AbortError()
      }

      if (ex instanceof RESTError) {
        if (REST.errorAction(ex.status)) return
        else throw ex
      }

      throw new RESTError(`${method} ${path} ${ex.message}`)
    }
  },

  GET(path, params, opts) {
    if (params) {
      params = { ...params }

      for (let [k, v] of Object.entries(params)) {
        if (v === null || v === undefined) {
          delete params[k]
        }
      }
    }

    let up = params ? new URLSearchParams(params) : null

    return REST.request({
      method: 'GET',
      path: path + (up ? '?' + up.toString() : ''),
      ...opts,
    })
  },

  POST(path, data, opts) {
    return REST.request({
      method: 'POST',
      path,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(data),
      ...opts,
    })
  },

  PUT(path, data, opts) {
    return REST.request({
      method: 'PUT',
      path,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(data),
      ...opts,
    })
  },
  
  DELETE(path, body, opts,) {
    return REST.request({
      method: 'DELETE',
      path,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      nonJsonOk: true,
      ...opts,
      body: JSON.stringify(body),
    })
  },

  PATCH(path, data, opts) {
    return REST.request({
      method: 'PATCH',
      path,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(data),
      ...opts,
    })
  },
}
