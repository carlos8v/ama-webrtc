import z from 'zod'
import { useForm } from 'react-hook-form'
import { RefreshCw } from 'react-feather'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { useApi } from '../store'
import { classnames } from '../utils/classnames'

const schema = z.object({
  question: z.string().max(255),
})

export const Question = () => {
  const { mode, send } = useApi()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      question: '',
    },
    resolver: zodResolver(schema),
  })

  const sendQuestion = useMutation({
    mutationKey: ['send'],
    mutationFn: async (question: string) => {
      await send(question)
    },
    onSettled: () => reset({ question: '' }),
  })

  async function onSubmit(data: z.infer<typeof schema>) {
    if (data.question === '') return
    sendQuestion.mutate(data.question)
  }

  if (mode !== 'client') return null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex my-4 gap-4">
      <div className="w-full">
        <input
          {...register('question')}
          required
          type="text"
          autoComplete="off"
          disabled={sendQuestion.isPending}
          maxLength={255}
          className={classnames({
            'w-full rounded border border-zinc-700 bg-zinc-800 px-4 py-2': true,
            'cursor-not-allowed text-zinc-600': sendQuestion.isPending,
          })}
        />
        {errors?.question?.message ? (
          <span className="block mt-2 text-xs text-zinc-500">
            {errors?.question?.message}
          </span>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={sendQuestion.isPending}
        className={classnames({
          'w-44 h-fit bg-amber-500 border border-amber-500 rounded px-4 py-2 font-medium text-base flex items-center justify-center':
            true,
          'brightness-50 cursor-not-allowed': sendQuestion.isPending,
        })}
      >
        {sendQuestion.isPending ? (
          <>
            <RefreshCw className="inline-block animate-spin w-4 h-4 mr-2" />
            <span>Aguarde...</span>
          </>
        ) : (
          <span>Enviar</span>
        )}
      </button>
    </form>
  )
}
