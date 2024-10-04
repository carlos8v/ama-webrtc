import { useEffect, useState } from 'react'

import { Home } from './pages/Home'
import { Room } from './pages/Room'

import { useApi } from './store'

function App() {
  const [connectedRoomId, setConnectedRoomId] = useState<string | undefined>(
    undefined
  )
  const { init, connect, roomId, isConnected } = useApi()

  useEffect(() => {
    init()
  }, [])

  async function handleConnectTo(connectToId: string) {
    if (connectToId === roomId) return
    const hasConnected = await connect(connectToId)

    if (hasConnected) {
      setConnectedRoomId(connectToId)
    }
  }

  if (isConnected) {
    return <Room roomId={connectedRoomId ?? roomId} />
  }

  return <Home handleConnectTo={handleConnectTo} />
}

export default App
