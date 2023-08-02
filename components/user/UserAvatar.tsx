import { AvatarProps } from '@radix-ui/react-avatar'
import { User } from 'next-auth'
import React, { FC } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Image from 'next/image'
import { User as UserIcon } from 'lucide-react'

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, 'name' | 'image'>
}


const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className='relative aspect-square h-full w-full'>
          <Image
            fill
            src={user.image}
            alt='profile picture'
            referrerPolicy='no-referrer'
            sizes='50px'
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className='sr-only'>{user?.name}</span>
          <UserIcon className='h-4 w-4' />
        </AvatarFallback>
      )}
    </Avatar>
  )
}

export default UserAvatar