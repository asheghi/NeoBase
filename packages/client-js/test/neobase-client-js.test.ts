import { getClient } from '../src/neobase-client-js'
import axios from 'axios'

const PROJECT = 'test-project'
const COLLECTION = 'test-collection'
const data_list = [
  { id: 1, name: 'alex' },
  { id: 2, name: 'jimmy' },
  { id: 3, name: 'johny' }
]
const payload = {
  foo: 'bar'
}

const client = getClient(PROJECT)
jest.spyOn(client.axiosClient, 'post').mockImplementation(async (url, data, config) => {
  if (url.endsWith('find')) {
    return {
      data: data_list,
      statusCode: 200
    }
  }
  if (url.endsWith('findOne')) {
    return {
      data: data_list[0],
      statusCode: 200
    }
  }
})
const axPost = client.axiosClient.post

describe('Client', () => {
  describe('getClient function', () => {
    describe('on invalid arguments', () => {
      describe('given no project', () => {
        it('should trhow error', () => {
          expect(() => {
            // @ts-ignore
            getClient()
          }).toThrow()
        })
      })
      // todo check for invalid options
    })
    describe('on valid arguments', () => {
      it('should return client object', () => {
        const client = getClient(PROJECT)
        expect(typeof client.Collection).toBe('function')
        expect(typeof client.Auth.login).toBe('function')
        expect(typeof client.Auth.login).toBe('function')
        expect(typeof client.Auth.me).toBe('function')
        expect(typeof client.setAxiosClient).toBe('function')
        expect(client.axiosClient).toBeTruthy()
      })
    })
  })

  describe('client.Collection', () => {
    describe('given invalid argument', () => {
      it('should throw', () => {
        // @ts-ignore
        expect(() => client.Collection()).toThrow()
      })
    })

    describe('given collection name', () => {
      it('should return methods object', () => {
        const col = client.Collection(COLLECTION)
        expect(col).toBeTruthy()
        expect(typeof col.find).toBe('function')
        expect(typeof col.findOne).toBe('function')
        expect(typeof col.count).toBe('function')
        expect(typeof col.create).toBe('function')
        expect(typeof col.updateOne).toBe('function')
        expect(typeof col.deleteOne).toBe('function')
        expect(typeof col.deleteMany).toBe('function')
      })
      describe('collection methods', () => {
        const col = client.Collection(COLLECTION)
        describe('client.Collection.find method', async () => {
          describe('given no argument', () => {
            it('should return data array', async () => {
              const res = await col.find()
              expect(axPost).toBeCalledWith(`documents/${PROJECT}/${COLLECTION}/find`, {})
            })
          })
          describe('given arguments', () => {
            it('should return data array', async () => {
              const res = await col.find(
                { foo: 'bar' },
                { _id: -1 },
                {
                  sort: 'age',
                  limit: 85,
                  skip: 65
                }
              )
              expect(axPost).toBeCalledWith(`documents/${PROJECT}/${COLLECTION}/find`, {
                filter: { foo: 'bar' },
                options: { skip: 65, sort: 85 },
                projection: { _id: -1 }
              })
            })
          })
          describe('given chined arguments', () => {
            it('should return data array', async () => {
              const res = await col
                .find({ foo: 'bar' })
                .limit(85)
                .skip(65)
                .sort('age')
                .projection({ _id: -1 })
              expect(axPost).toBeCalledWith(`documents/${PROJECT}/${COLLECTION}/find`, {
                filter: { foo: 'bar' },
                options: { skip: 65, sort: 85 },
                projection: { _id: -1 }
              })
            })
          })
        })

        describe('client.Collection.findOne method', async () => {
          describe('given no argument', () => {
            it('should return data array', async () => {
              const res = await col.findOne()
              expect(axPost).toBeCalledWith(`documents/${PROJECT}/${COLLECTION}/findOne`, {})
            })
          })
          describe('given arguments', () => {
            it('should return data array', async () => {
              const res = await col.findOne({ foo: 'bar' }, { _id: -1 })
              expect(axPost).toBeCalledWith(`documents/${PROJECT}/${COLLECTION}/findOne`, {
                filter: { foo: 'bar' },
                projection: { _id: -1 }
              })
            })
          })
          describe('given chained arguments', () => {
            it('should return data array', async () => {
              const res = await col.findOne({ foo: 'bar' }).projection({ _id: -1 })
              expect(axPost).toBeCalledWith(`documents/${PROJECT}/${COLLECTION}/findOne`, {
                filter: { foo: 'bar' },
                projection: { _id: -1 }
              })
            })
          })
        })

        describe('count method', async () => {
          describe('given no argument', () => {
            it('should return unfiltered count', async () => {
              const res = await col.count()
              expect(axPost).toBeCalledWith(`documents/${PROJECT}/${COLLECTION}/count`, {})
            })
          })
          describe('given a filter', () => {
            it('should return filtered count', async () => {
              const res = await col.count({ foo: 'bar' })
              expect(axPost).toBeCalledWith(`documents/${PROJECT}/${COLLECTION}/count`, {
                filter: {
                  foo: 'bar'
                }
              })
            })
          })
        })

        describe('create method', async () => {
          describe('given a payload', () => {
            it('create a document', async () => {
              const res = await col.create(payload)
              expect(axPost).toBeCalledWith(`documents/${PROJECT}/${COLLECTION}/create`, payload)
            })
          })
        })

        describe('updateOne method', async () => {
          describe('given a payload', () => {
            it('create a document', async () => {
              const res = await col.create(payload)
              expect(axPost).toBeCalledWith(`documents/${PROJECT}/${COLLECTION}/create`, payload)
            })
          })
        })

        describe('deleteOne method', async () => {
          describe('given a payload', () => {
            it('should call api properly', async () => {
              const res = await col.deleteOne(payload)
              expect(axPost).toBeCalledWith(`documents/${PROJECT}/${COLLECTION}/deleteOne`, payload)
            })
          })
        })

        describe('deleteMany method', async () => {
          describe('given a payload', () => {
            it('should call api properly', async () => {
              const res = await col.deleteMany(payload)
              expect(axPost).toBeCalledWith(
                `documents/${PROJECT}/${COLLECTION}/deleteMany`,
                payload
              )
            })
          })
        })
      })
    })
  })
  describe('Client.Auth', () => {
    describe('login with valid credentials', () => {
      it('it should call api properly', async () => {
        await client.Auth.login(payload)
        expect(axPost).toBeCalledWith(`auth/${PROJECT}/login`, payload)
      })
    })

    describe('register with valid credentials', () => {
      it('it should call api properly', async () => {
        await client.Auth.register(payload)
        expect(axPost).toBeCalledWith(`auth/${PROJECT}/register`, payload)
      })
    })

    describe('me with valid token', () => {
      it('it should call api properly', async () => {
        jest.spyOn(client.axiosClient, 'get').mockImplementation(async (url, config) => {
          return {
            data: {
              user: {}
            },
            statusCode: 200
          }
        })
        await client.Auth.me(payload)
        expect(client.axiosClient.get).toBeCalledWith(`auth/${PROJECT}/me`, {
          headers: { 'x-auth-token': { foo: 'bar' } }
        })
      })
    })
  })
})
