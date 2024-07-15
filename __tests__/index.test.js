import {vitest, describe, it, expect, beforeEach} from 'vitest'
import { execute, gql } from '@apollo/client/core'

import { createUploadMiddleware } from '../src/index'

vitest.mock('../src/extractFiles')

const MockQuery = gql`
  query {
    foo
  }
`;

describe('#createUploadMiddleware', () => {
  beforeEach(() => {
    fetch.mockResponseOnce(JSON.stringify({ data: { foo: 'bar' } }));
  });

  it('should pass headers from context', async () => {
    const link = createUploadMiddleware({ uri: 'http://example.com' })
    const headers = { authorization: '1234' }

    await new Promise(r => execute(link, {query: MockQuery, context: {headers}}).subscribe(r))

    expect(fetch).toHaveBeenCalledWith('http://example.com', expect.objectContaining({method: 'POST', headers}))
  })

  it('should pass headers from options', async () => {
    const headers = { authorization: '1234' }
    const link = createUploadMiddleware({
      uri: 'http://example.com',
      headers,
    })

    await new Promise(r => execute(link, {query: MockQuery}).subscribe(r))

    expect(fetch).toHaveBeenCalledWith('http://example.com', expect.objectContaining({method: 'POST', headers}))
  })

  it('should combine headers from options and context', async () => {
    const optionsHeaders = { 'x-spree-token': 'token' }
    const contextHeaders = { authorization: '1234' }
    const link = createUploadMiddleware({
      uri: 'http://example.com',
      headers: optionsHeaders,
    })

    await new Promise(r => execute(link, {query: MockQuery, context: {headers: contextHeaders}}).subscribe(r))

    expect(fetch).toHaveBeenCalledWith('http://example.com', expect.objectContaining({
      method: 'POST', headers: {
      ...contextHeaders,
      ...optionsHeaders
    }}))
  })

  it('uses custom fetch function', async () => {
    const variables = { params: 'stub' }
    const link = createUploadMiddleware({
      uri: 'http://data/',
      fetch: fetch,
    })
    await new Promise(r => execute(link, {query: MockQuery, variables}).subscribe(r))

    expect(fetch).toHaveBeenCalledWith('http://example.com', expect.objectContaining({
      method: 'POST'
    }))
  })
})
