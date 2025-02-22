'use client'

import { ActionTooltip } from '@/components/action-tooltip'
import { cn } from '@/lib/utils'
import { Channel, ChannelType, MemberRole, Server } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import { ClipboardEdit, Hash, Lock, Mic, Trash, Video } from 'lucide-react'
import { ModalType, useModal } from '@/hooks/store/use-modal-store'

interface ServerChannelProps {
  channel: Channel
  server: Server
  memberRole?: MemberRole
}

const iconMap = {
  [ChannelType.TEXT]: (
    <Hash
      name='hash'
      className='flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400'
    />
  ),
  [ChannelType.AUDIO]: (
    <Mic
      name='mic'
      className='flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400'
    />
  ),
  [ChannelType.VIDEO]: (
    <Video
      name='video'
      className='flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400'
    />
  )
}

export const ServerChannel = ({
  channel,
  server,
  memberRole
}: ServerChannelProps) => {
  const { onOpen } = useModal()
  const params = useParams()
  const router = useRouter()

  const MyIcon = iconMap[channel.type]

  const onClick = () => {
    router.push(
      `/servers/${params?.serverId || server.id}/channels/${channel.id}`
    )
  }

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation()

    onOpen(action, { channel, server })
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        params?.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      {MyIcon}
      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          params?.channelId === channel.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {channel.name}
      </p>
      {channel.name !== 'general' && memberRole !== MemberRole.GUEST && (
        <div className='ml-auto flex items-center gap-x-2'>
          <ActionTooltip label='Edit'>
            <ClipboardEdit
              onClick={(e) => onAction(e, 'editChannel')}
              name='clipboard-edit'
              className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
            />
          </ActionTooltip>
          <ActionTooltip label='Delete'>
            <Trash
              onClick={(e) => onAction(e, 'deleteChannel')}
              name='trash'
              className='z-50 hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === 'general' && (
        <Lock
          name='lock'
          className='ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400'
        />
      )}
    </button>
  )
}
