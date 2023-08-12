'use client'

import React, { FC, useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { ImagePlusIcon, Trash } from 'lucide-react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary'

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  values: string[];
}

const ImageUpload: FC<ImageUploadProps> = ({ disabled, onChange, onRemove, values }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onUpload = (result: any) => {
    onChange(result.info.secure_url)
  }

  if (!isMounted) return null;

  return (
    <div>
      <div className='mb-4 flex items-center gap-4'>
        {values.map(url => (
          <div key={url} className='relative w-[200px] h-[200px] rounded-md overflow-hidden'>
            <div className='absolute z-10 top-2 right-2'>
              <Button type="button" size='icon' variant='destructive' onClick={() => onRemove(url)}>
                <Trash className='h-4 w-4' />
              </Button>
            </div>
            <Image
              fill
              className='object-cover'
              src={url}
              alt='Image'
            />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}>
        {({ open }) => {
          const onClick = () => {
            open()
          }
          return (
            <Button type='button' variant='secondary' disabled={disabled} onClick={onClick}>
              <ImagePlusIcon className='mr-2 h-4 w-4' />
              Upload an Image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}

export default ImageUpload