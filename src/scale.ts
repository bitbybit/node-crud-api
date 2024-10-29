import cluster from 'node:cluster'
import http from 'node:http'
import { availableParallelism } from 'node:os'
import { App } from './services/App'
import { StoreManager } from './services/StoreManager'
import { getBaseUrl, getPort } from './helpers/env'
import { StoreManagerShared } from './services/StoreManagerShared'

const baseUrl = getBaseUrl()
const primaryPort = getPort()

const forkPorts: number[] = []
const forks: NonNullable<typeof cluster.worker>[] = []

const initWorkers = () => {
  const parallelism = availableParallelism() - 1

  for (let i = 1; i <= parallelism; i++) {
    forkPorts.push(primaryPort + i)
  }

  for (let i = 0; i < forkPorts.length; i++) {
    forks[i] = cluster.fork({ PORT: forkPorts[i] })

    forks[i].on('exit', (code, signal) => {
      console.log(
        `EXIT Worker PID: ${forks[i].process.pid} (code: ${code}, signal: ${signal})`
      )
    })
  }
}

const initProxy = () => {
  let current = 0

  const loadBalancer = http.createServer((req, res) => {
    const port = forkPorts[current]

    current = (current + 1) % forkPorts.length

    const proxy = http.request(
      {
        headers: req.headers,
        hostname: '127.0.0.1',
        method: req.method,
        path: req.url,
        port
      },
      (forkRes) => {
        res.writeHead(forkRes.statusCode ?? 0, forkRes.headers)

        forkRes.pipe(res, { end: true })

        console.log(`${req.url} 127.0.0.1:${primaryPort} -> 127.0.0.1:${port}`)
      }
    )

    req.pipe(proxy, { end: true })
  })

  loadBalancer.listen(primaryPort, () => {
    console.log(`Load balancer: 127.0.0.1:${primaryPort}`)
  })
}

const initStore = () => {
  const store = new StoreManager()

  for (let i = 0; i < forkPorts.length; i++) {
    forks[i].on('message', async (msg) => {
      if (msg.type === 'getUsers') {
        try {
          const data = await store.getUsers()

          forks[i].send({
            type: 'getUsers',
            data
          })
        } catch (e) {
          forks[i].send({
            type: 'getUsersError',
            data: [],
            error: (e as Error)?.message ?? ''
          })
        }
      }

      if (msg.type === 'getUser') {
        try {
          const data = await store.getUser(msg.userId)

          forks[i].send({
            type: 'getUser',
            data
          })
        } catch (e) {
          forks[i].send({
            type: 'getUserError',
            data: {},
            error: (e as Error)?.message ?? ''
          })
        }
      }

      if (msg.type === 'addUser') {
        try {
          const data = await store.addUser(msg.user)

          forks[i].send({
            type: 'addUser',
            data
          })
        } catch (e) {
          forks[i].send({
            type: 'addUserError',
            data: {},
            error: (e as Error)?.message ?? ''
          })
        }
      }

      if (msg.type === 'updateUser') {
        try {
          const data = await store.updateUser(msg.user)

          forks[i].send({
            type: 'updateUser',
            data
          })
        } catch (e) {
          forks[i].send({
            type: 'updateUserError',
            data: {},
            error: (e as Error)?.message ?? ''
          })
        }
      }

      if (msg.type === 'removeUser') {
        try {
          const data = await store.removeUser(msg.userId)

          forks[i].send({
            type: 'removeUser',
            data
          })
        } catch (e) {
          forks[i].send({
            type: 'removeUserError',
            data: undefined,
            error: (e as Error)?.message ?? ''
          })
        }
      }
    })
  }
}

const init = () => {
  if (cluster.isPrimary) {
    console.log(`Master PID: ${process.pid}`)

    initWorkers()
    initProxy()
    initStore()
  } else {
    console.log(`Worker PID: ${process.pid}`)

    const port = Number(process.env.PORT)

    const app = new App({
      baseUrl,
      port,
      store: new StoreManagerShared()
    })

    app.init()

    console.log(`Fork: 127.0.0.1:${port}`)
  }
}

init()
