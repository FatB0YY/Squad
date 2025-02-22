'use client'

import * as z from 'zod'
import { useState, useTransition, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useModal } from '@/hooks/store/use-modal-store'
import { EditChannelSchema } from '@/schemas'

import { FormError } from '../form-error'
import { ChannelType } from '@prisma/client'
import { editChannel } from '@/actions/edit-channel'

export const EditChannelModal = () => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>(undefined)

  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === 'editChannel'
  const { server, channel } = data

  const form = useForm({
    resolver: zodResolver(EditChannelSchema),
    defaultValues: {
      name: '',
      type: channel?.type || ChannelType.TEXT
    }
  })

  useEffect(() => {
    if (channel) {
      form.setValue('name', channel.name)
      form.setValue('type', channel.type)
    }
  }, [form, channel])

  const isLoading = form.formState.isSubmitting || isPending

  const onSubmit = async (values: z.infer<typeof EditChannelSchema>) => {
    startTransition(() => {
      editChannel(values, server.id, channel.id)
        .then((data) => {
          if ('error' in data) {
            // TODO: обработка error
            setError(data.error)
          } else {
            onClose()
            router.refresh()
            form.reset()
            // window.location.reload()
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    })
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={handleClose}
    >
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Edit Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8'
          >
            <div className='space-y-8 px-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                      Channel name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                        placeholder='Enter channel name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel Type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'>
                          <SelectValue placeholder='Select a channel type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className='capitalize'
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormError message={error} />
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button
                variant='primary'
                disabled={isLoading}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
