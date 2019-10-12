import __ from 'lodash'
import '@nuxtjs/axios'
import url from 'url'

export default function fetchJSON(
  originalUrl = '/',
  method = 'GET',
  values = {},
  req,
  messages = {},
  timeout = 20000,
  retrieveBracket
) {
  let removedProtocollUrl = ''
  if (__SERVER__ && !req) {
    return Promise.reject({
      errors: [
        {
          message: 'API client required to have req parameter in Server'
        }
      ]
    })
  }
  if (!__SERVER__ && url.parse(originalUrl).hostname === location.hostname) {
    removedProtocollUrl = originalUrl.replace(/^https?:/, '')
  }
  const defaultErrors = getDefaultErrors(messages)
  const apiUrl =
    method === 'GET'
      ? [removedProtocollUrl || originalUrl, stringify(values)]
          .filter((value) => value)
          .join('?')
      : removedProtocollUrl || originalUrl
  const headers =
    method === 'GET'
      ? getHeader(req)
      : method === 'POST'
      ? postHeader(values, req)
      : method === 'DELETE'
      ? deleteHeader(values, req)
      : ''
  // headers contains credentials which should not be logged
  console.log(
    `## fetch ${
      fetch.name.indexOf('fetchMock') !== -1 ? 'from MOCK ' : ''
    }${apiUrl}`
  )
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(defaultErrors.timeout)
    }, timeout)
    fetch(apiUrl, {
      ...headers,
      agent:
        __SERVER__ &&
        __PROXY__ &&
        __PROXY_IGNORE__.indexOf(url.parse(apiUrl).host) === -1
          ? createAgent(apiUrl, __PROXY__)
          : undefined
    }).then(
      (res) => {
        if (!res.ok) {
          // response status code is out of the 200~299 range
          res.json().then(
            (json) => {
              reject(
                json.errors && json.errors.length
                  ? json
                  : defaultErrors.maintenance
              )
            },
            () => {
              reject(defaultErrors.maintenance)
            }
          )
        } else if (method === 'GET') {
          if (!retrieveBracket) {
            res.json().then(
              (json) => {
                if (json.errors && json.errors.length) {
                  reject(json)
                } else {
                  resolve(json)
                }
              },
              () => {
                reject(res)
              }
            )
          } else {
            res.text().then(
              (text) => {
                if (text !== 'error') {
                  const resObject = JSON.parse(
                    text.substring(text.indexOf('(') + 1, text.lastIndexOf(')'))
                  )
                  if (resObject.successFlag === 'true') {
                    resolve(resObject)
                  } else {
                    reject({
                      errors: []
                    })
                  }
                } else {
                  reject({
                    errors: []
                  })
                }
              },
              (err) => reject(err)
            )
          }
        } else {
          res.json().then(
            (json) => {
              if (json.errors && json.errors.length) {
                reject(json)
              } else {
                resolve(json)
              }
            },
            () => resolve(res)
          )
        }
      },
      (err) => {
        // TODO: convert the error message to user friendly messages
        // network error
        console.error(apiUrl, err)
        reject(defaultErrors.timeout)
      }
    )
  })
}
