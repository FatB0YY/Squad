import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { ChannelType, MemberRole } from '@prisma/client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ServerHeader } from './server-header'
import { ServerSearch } from './server-search'
import { ServerSection } from './server-section'
import { ServerChannel } from './server-channel'
import { ServerMember } from './server-member'
import { getServerData } from '@/actions/get-server-data'
import { redirect } from 'next/navigation'

interface ServerSidebarProps {
  serverId: string
}

const iconMap = {
  [ChannelType.TEXT]: (
    <Hash
      name='hash'
      className='mr-2 h-4 w-4'
    />
  ),
  [ChannelType.AUDIO]: (
    <Mic
      name='mic'
      className='mr-2 h-4 w-4'
    />
  ),
  [ChannelType.VIDEO]: (
    <Video
      name='video'
      className='mr-2 h-4 w-4'
    />
  )
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck
      name='shield-check'
      className='mr-2 h-4 w-4 text-indigo-500'
    />
  ),
  [MemberRole.ADMIN]: (
    <ShieldAlert
      name='shield-alert'
      className='mr-2 h-4 w-4 text-rose-500'
    />
  )
}

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const { data, error } = await getServerData(serverId)

  if (!data || error) {
    return redirect('/')
  }

  const {
    audioChannels,
    memberRole,
    members,
    server,
    textChannels,
    videoChannels
  } = data

  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
      <ServerHeader
        server={server}
        role={memberRole}
      />
      <ScrollArea className='flex-1 px-3'>
        <div className='mt-2'>
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                items: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                items: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: 'Video Channels',
                type: 'channel',
                items: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: 'Members',
                type: 'member',
                items: members?.map((member) => ({
                  id: member.id,
                  name: member.user.name || member.user.email || member.user.id,
                  icon: roleIconMap[member.role]
                }))
              }
            ]}
          />
        </div>
        <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />
        {!!textChannels?.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.TEXT}
              memberRole={memberRole}
              label='Text Channels'
              server={server}
            />
            <div className='space-y-[2px]'>
              {textChannels.map((channel) => (
                <ServerChannel
                  channel={channel}
                  key={channel.id}
                  memberRole={memberRole}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.AUDIO}
              memberRole={memberRole}
              label='Voice Channels'
              server={server}
            />
            <div className='space-y-[2px]'>
              {audioChannels.map((channel) => (
                <ServerChannel
                  channel={channel}
                  key={channel.id}
                  memberRole={memberRole}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.VIDEO}
              memberRole={memberRole}
              label='Video Channels'
              server={server}
            />

            <div className='space-y-[2px]'>
              {videoChannels.map((channel) => (
                <ServerChannel
                  channel={channel}
                  key={channel.id}
                  memberRole={memberRole}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='members'
              memberRole={memberRole}
              label='Members'
              server={server}
            />
            <div className='space-y-[2px]'>
              {members.map((member) => (
                <ServerMember
                  key={member.id}
                  member={member}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
