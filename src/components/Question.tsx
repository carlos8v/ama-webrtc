import { useState } from 'react'

import { useApi } from '../store'

export const Question = () => {
  const [question, setQuestion] = useState('')

  const { mode, send } = useApi()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (question === '') return
    await send(question)
  }

  if (mode !== 'client') return null

  return (
    <form onSubmit={handleSubmit} className="flex flex-col my-4 gap-4">
      <input
        required
        type="text"
        value={question}
        maxLength={255}
        onChange={({ target }) => setQuestion(target.value)}
        className="w-full rounded border border-zinc-700 bg-zinc-800 px-4 py-2"
      />
      <button
        type="submit"
        className="w-44 bg-amber-500 border border-amber-500 rounded px-4 py-2 font-medium text-sm self-end"
      >
        Enviar
      </button>
    </form>
  )
}
