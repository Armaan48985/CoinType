import Image from 'next/image'
import React from 'react'

const icon = () => {
  return (
    <Image
        src='/battle.png'
        alt='sword'
        width={15}
        height={1}
    />
  )
}

export default icon