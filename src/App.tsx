import { useEffect, useState } from 'react'

import { Home } from './pages/Home'
import { Room } from './pages/Room'

import { useApi } from './store'

function App() {
  const [connectedRoomId, setConnectedRoomId] = useState<string | undefined>(
    undefined
  )
  const { init, roomId, isConnected } = useApi()

  useEffect(() => {
    init()
  }, [])

  if (isConnected) {
    return <Room roomId={connectedRoomId ?? roomId} />
  }

  return <Home setConnectedRoomId={setConnectedRoomId} />
}

export default App
