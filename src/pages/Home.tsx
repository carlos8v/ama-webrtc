import { useState } from 'react'
import { Toaster, toast } from 'sonner'
import { Share } from 'react-feather'

import { useApi } from '../store'
import { mask } from '../utils/mask'

export type HomeProps = {
  handleConnectTo: (peerId: string) => void
}

export const Home = ({ handleConnectTo }: HomeProps) => {
  const [connectToId, setConnectToId] = useState('')

  const roomId = useApi((store) => store.roomId)

  function handleShare() {
    if (!roomId) return
    toast('Código de sala copiado', {
      duration: 3000,
      position: 'bottom-center',
    })
    navigator.clipboard.writeText(roomId)
  }

  function handleConnect(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (connectToId === roomId || !roomId) return

    handleConnectTo(connectToId)
  }

  function handleValue(e: React.ChangeEvent<HTMLInputElement>) {
    const cleanValue = (e.target.value ?? '')
      .toLocaleLowerCase()
      .replace(/[^a-f0-9]/g, '')
    const maskFormat = '########-####-####-####-############'

    setConnectToId(mask(cleanValue, maskFormat))
  }

  return (
    <main className="min-h-screen w-full h-full flex flex-col items-center pt-40 md:pt-0 md:justify-center">
      <Toaster
        toastOptions={{
          className: 'border border-zinc-700 bg-zinc-800 text-white',
        }}
      />
      <p className="text-sm text-zinc-400">Código da sala:</p>
      <span className="max-w-xs md:max-w-lg rounded px-3 py-2 text-white break-all text-center font-medium text-xl flex items-center">
        {roomId ? (
          <>
            <span>{roomId}</span>
            <Share
              onClick={handleShare}
              className="hidden md:block w-4 h-4 ml-2 font-medium text-zinc-400 transition hover:text-white cursor-pointer"
            />
          </>
        ) : (
          'Carregando...'
        )}
      </span>
      {roomId ? (
        <button
          type="button"
          className="block px-2 py-3 md:hidden text-sm text-zinc-400 flex items-center"
          onClick={handleShare}
        >
          Clique aqui para compartilhar o código
          <Share className="ml-2 inline-block w-4 h-4 text-zinc-400" />
        </button>
      ) : null}
      <div className="flex w-full md:max-w-lg items-center gap-2 my-8 px-8">
        <hr className="w-full border-zinc-700" />
        <span className="text-sm font-medium text-zinc-500">ou</span>
        <hr className="w-full border-zinc-700" />
      </div>
      <form
        className="w-full px-8 flex flex-col md:max-w-lg md:flex-row items-center gap-4"
        onSubmit={handleConnect}
      >
        <input
          required
          type="text"
          value={connectToId}
          onChange={handleValue}
          maxLength={36}
          placeholder="Digite o código da sala"
          className="px-4 py-2 rounded border border-zinc-700 bg-zinc-800 w-full min-w-72"
        />
        <button
          type="submit"
          disabled={!roomId}
          className="w-full md:w-44 bg-amber-500 border border-amber-500 rounded px-4 py-2 font-medium text-base"
        >
          {roomId ? 'Conectar-se' : 'Aguarde...'}
        </button>
      </form>
    </main>
  )
}
