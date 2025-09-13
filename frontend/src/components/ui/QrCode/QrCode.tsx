import React, { useEffect, useState } from 'react'
import * as QRCode from 'qrcode'

// Use the correct options type for QRCode.toDataURL
type QRCodeToDataURLOptions = Parameters<typeof QRCode.toDataURL>[1]

interface QRCodeImgProps {
  text: string
  options?: QRCodeToDataURLOptions
}

const QrCode: React.FC<QRCodeImgProps> = ({ text, options }) => {
  const [imgUrl, setImgUrl] = useState<string>('')

  useEffect(() => {
    if (text) {
      QRCode.toDataURL(text, options || {})
        .then((url) => setImgUrl(url))
        .catch((error) => {
          console.error('QR Code generation error:', error)
          setImgUrl('')
        })
    } else {
      setImgUrl('')
    }
  }, [text, options])

  return imgUrl ? (
    <img
      src={imgUrl}
      alt="QR Code"
      style={{
        width: '100%',
      }}
    />
  ) : null
}

export { QrCode }
