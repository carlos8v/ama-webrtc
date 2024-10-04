import { Peer, DataConnection } from 'peerjs'
import { create } from 'zustand'

type Api = {
  mode: 'client' | 'server'
  peer?: Peer
  conn?: DataConnection
  roomId?: string
  questions: Question[]
  isConnected: boolean
  init: () => void
  connect: (peerId: string) => Promise<boolean>
  send: (message: string) => Promise<void>
  toggleAnswered: (idx: number) => void
}

type Question = {
  question: string
  answered: boolean
}

type QuestionData = {
  method: 'add-question' | 'broadcast'
  questions: Question[]
}

function handleData(data?: QuestionData): Question[] {
  if (!data?.method) return []

  if (data.method === 'add-question')
    return [{ question: data.questions[0].question, answered: false }]

  if (data.method === 'broadcast') return data.questions

  return []
}

export const useApi = create<Api>((set, get) => ({
  mode: 'server',
  isConnected: false,
  peer: undefined,
  peerId: undefined,
  questions: [],
  init: () => {
    const peer = new Peer()

    peer.on('open', (peerId) => {
      set({ peer, roomId: peerId })
    })

    const clientsConn: DataConnection[] = []

    peer.on('connection', (conn) => {
      conn.on('open', () => {
        conn.send({
          method: 'broadcast',
          questions: get().questions,
        })
      })

      clientsConn.push(conn)
      set({ mode: 'server', isConnected: true })

      conn.on('data', (data) => {
        const newQuestions = handleData(data as QuestionData)

        set(({ questions: prev }) => ({
          questions: [...prev, ...newQuestions],
        }))

        clientsConn.forEach((peerConn) => {
          peerConn.send(data)
        })
      })
    })
  },
  connect: async (peerId) => {
    const peer = get().peer
    if (!peer) return false

    const conn = peer.connect(peerId)

    conn.on('data', (data) => {
      const newQuestions = handleData(data as QuestionData)

      set(({ questions: prev }) => ({
        questions: [...prev, ...newQuestions],
      }))
    })

    const timeout = 30000
    const isConnected = await Promise.race<boolean>([
      new Promise((resolve) => conn.on('open', () => resolve(true))),
      new Promise((_, reject) => setTimeout(() => reject(false), timeout)),
    ])

    if (isConnected) {
      set({ isConnected: true, conn, mode: 'client' })
    }

    return isConnected
  },
  send: async (question: string) => {
    const conn = get().conn
    if (!conn) return

    await conn.send({
      method: 'add-question',
      questions: [{ question, answered: false }],
    })
  },
  toggleAnswered: (idx) => {
    set(({ questions: prev }) => ({
      questions: prev.map((question, questionIdx) =>
        questionIdx === idx
          ? { ...question, answered: !question.answered }
          : question
      ),
    }))
  },
}))
