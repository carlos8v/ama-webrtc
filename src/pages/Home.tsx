import { useMutation } from '@tanstack/react-query'
import { Toaster, toast } from 'sonner'
import { Share, RefreshCw } from 'react-feather'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

import { useApi } from '../store'
import { mask } from '../utils/mask'
import { classnames } from '../utils/classnames'

export type HomeProps = {
  setConnectedRoomId: (peerId: string) => void
}

const schema = z.object({
  roomId: z.string().uuid('Código inválido'),
})

export const Home = ({ setConnectedRoomId }: HomeProps) => {
  const roomId = useApi((store) => store.roomId)
  const connect = useApi((store) => store.connect)

  const connectToRoom = useMutation({
    mutationKey: ['connect'],
    mutationFn: async (connectToId: string) => {
      if (connectToId === roomId) return
      const hasConnected = await connect(connectToId)

      if (hasConnected) {
        setConnectedRoomId(connectToId)
      } else {
        toast('Não foi possível achar a sala', {
          duration: 5000,
          position: 'bottom-center',
        })
      }
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      roomId: '',
    },
    resolver: zodResolver(schema),
  })

  function handleConnect(data: z.infer<typeof schema>) {
    if (data.roomId === roomId || !roomId) return
    connectToRoom.mutate(data.roomId)
  }

  function handleShare() {
    if (!roomId) return
    toast('Código de sala copiado', {
      duration: 3000,
      position: 'bottom-center',
    })
    navigator.clipboard.writeText(roomId)
  }

  function handleValue(e: React.ChangeEvent<HTMLInputElement>) {
    const cleanValue = (e.target.value ?? '')
      .toLocaleLowerCase()
      .replace(/[^a-f0-9]/g, '')
    const maskFormat = '########-####-####-####-############'

    return mask(cleanValue, maskFormat)
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
        className="w-full px-8 flex flex-col md:max-w-lg md:flex-row items-baseline gap-4"
        onSubmit={handleSubmit(handleConnect)}
      >
        <div>
          <input
            {...register('roomId')}
            required
            type="text"
            onChange={handleValue}
            maxLength={36}
            disabled={connectToRoom.isPending}
            placeholder="Digite o código da sala"
            className={classnames({
              'px-4 py-2 rounded border border-zinc-700 bg-zinc-800 w-full min-w-72 transition':
                true,
              'cursor-not-allowed text-zinc-600': connectToRoom.isPending,
            })}
          />
          {errors?.roomId?.message ? (
            <span className="block mt-2 text-xs text-zinc-500">
              {errors?.roomId?.message}
            </span>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={!roomId || connectToRoom.isPending}
          className={classnames({
            'w-full md:w-48 bg-amber-500 border border-amber-500 bg-amber-500 rounded px-4 py-2 font-medium text-base':
              true,
            'brightness-50 cursor-not-allowed': !roomId,
            'cursor-not-allowed	': connectToRoom.isPending,
          })}
        >
          {roomId && !connectToRoom.isPending ? (
            'Conectar-se'
          ) : (
            <>
              <RefreshCw className="inline-block animate-spin w-4 h-4 mr-2" />
              <span>Aguarde...</span>
            </>
          )}
        </button>
      </form>
    </main>
  )
}
