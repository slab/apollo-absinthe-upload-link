import {
  HttpLink,
  ApolloLink,
  concat,
  parseAndCheckHttpResponse,
  Observable,
} from '@apollo/client/core'
import { print } from 'graphql/language/printer'

import extractFiles from './extractFiles'
import { isObject } from './validators'

export const createUploadMiddleware = ({ uri, headers, fetch: customFetch, credentials }) =>
  new ApolloLink((operation, forward) => {
    if (typeof FormData !== 'undefined' && isObject(operation.variables)) {
      const { variables, files } = extractFiles(operation.variables)

      if (files.length > 0) {
        const context = operation.getContext()
        const { headers: contextHeaders } = context
        const formData = new FormData()

        formData.append('query', print(operation.query))
        formData.append('variables', JSON.stringify(variables))
        files.forEach(({ name, file }) => formData.append(name, file))

        let options = {
          method: 'POST',
          headers: Object.assign({}, contextHeaders, headers),
          body: formData,
          credentials,
        }

        // add context.fetchOptions to fetch options
        options = Object.assign(context.fetchOptions || {}, options)

        const runtimeFetch = customFetch || fetch;

          return new Observable(observer => {
            runtimeFetch(uri, options)
              .then(response => {
                operation.setContext({ response })
                return response
              })
              .then(parseAndCheckHttpResponse(operation))
              .then(result => {
                // we have data and can send it to back up the link chain
                observer.next(result)
                observer.complete()
                return result
              })
              .catch(err => {
                if (err.result && err.result.errors && err.result.data) {
                  observer.next(err.result)
                }
                observer.error(err)
              })
          })
      }
    }

    return forward(operation)
  })

export const createLink = opts =>
  concat(createUploadMiddleware(opts), new HttpLink(opts))

export { ReactNativeFile } from './validators'
