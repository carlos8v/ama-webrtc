import { Toaster, toast } from 'sonner'
import { Share } from 'react-feather'

import { Question } from '../components/Question'

import { useApi } from '../store'
import { classnames } from './../utils/classnames'

export type RoomProps = {
  roomId?: string
}

export const Room = ({ roomId }: RoomProps) => {
  const mode = useApi((api) => api.mode)
  const questions = useApi((api) => api.questions)
  const toggleAnswered = useApi((api) => api.toggleAnswered)

  function handleShare() {
    if (!roomId) return
    navigator.clipboard.writeText(roomId)
    toast('Código de sala copiado', {
      duration: 3000,
      position: 'bottom-center',
    })
  }

  return (
    <main className="min-h-screen w-full h-full flex flex-col items-center px-4 py-8">
      <Toaster
        toastOptions={{
          className: 'border border-zinc-700 bg-zinc-800 text-white',
        }}
      />
      <section className="w-full max-w-4xl mx-auto">
        <div>
          <p className="mb-8">
            <span className="text-sm text-zinc-400 mr-2">Código da sala:</span>
            {roomId ? (
              <span className="block mt-1 md:mt-0 md:inline-flex items-center">
                <span className="text-sm rounded font-medium bg-zinc-800 px-2 py-1.5">
                  {roomId}
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 inline-flex items-center justify-center group"
                >
                  <Share className="inline-block w-4 h-4 font-medium text-zinc-400 transition group-hover:text-white cursor-pointer" />
                </button>
              </span>
            ) : null}
          </p>
          <hr className="border-zinc-700" />
        </div>
        <Question />
        <div className="py-4">
          <ul className="flex flex-col gap-4">
            {questions.map(({ question, answered }, idx) => (
              <li className="group" key={idx}>
                <div className="flex flex-col">
                  <span
                    className={classnames({
                      'text-base group-hover:text-white break-all transition':
                        true,
                      'text-zinc-400': !answered,
                      'line-through text-zinc-500': answered,
                    })}
                  >
                    {idx + 1}. {question}
                  </span>
                  {mode === 'server' ? (
                    <button
                      className={classnames({
                        'mt-1.5 transition inline-block w-fit text-sm': true,
                        'text-amber-500': answered,
                        'text-zinc-600 hover:text-amber-500': !answered,
                      })}
                      onClick={() => toggleAnswered(idx)}
                    >
                      Marcar como respondido
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
