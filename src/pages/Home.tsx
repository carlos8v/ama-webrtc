import { useState } from 'react'
import { Share } from 'react-feather'

import { useApi } from '../store'

export type HomeProps = {
  handleConnectTo: (peerId: string) => void
}

export const Home = ({ handleConnectTo }: HomeProps) => {
  const [connectToId, setConnectToId] = useState('')

  const roomId = useApi((store) => store.roomId)

  function handleShare() {
    if (!roomId) return
    navigator.clipboard.writeText(roomId)
  }

  function handleConnect(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (connectToId === roomId || !roomId) return

    handleConnectTo(connectToId)
  }

  return (
    <main className="min-h-screen w-full h-full flex flex-col items-center justify-center">
      <p className="text-sm text-zinc-400">Código da sala:</p>
      <span className="rounded px-3 py-2 text-white font-medium text-xl flex items-center">
        {roomId ? roomId : 'Carregando...'}
        {roomId ? (
          <Share
            onClick={handleShare}
            className="w-4 h-4 ml-2 font-medium text-zinc-400 transition hover:text-white cursor-pointer"
          />
        ) : null}
      </span>
      <div className="flex w-full max-w-lg items-center gap-2 my-8">
        <hr className="w-full border-zinc-700" />
        <span className="text-sm font-medium text-zinc-500">ou</span>
        <hr className="w-full border-zinc-700" />
      </div>
      <form className="flex items-center gap-4" onSubmit={handleConnect}>
        <input
          required
          type="text"
          value={connectToId}
          placeholder="Digite o código da sala"
          onChange={({ target }) => setConnectToId(target.value)}
          className="px-4 py-2 rounded border border-zinc-700 bg-zinc-800 w-full min-w-72"
        />
        <button
          type="submit"
          className="w-44 bg-amber-500 border border-amber-500 rounded px-4 py-2 font-medium text-base"
        >
          Conectar-se
        </button>
      </form>
    </main>
  )
}
