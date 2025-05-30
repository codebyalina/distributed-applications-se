// src/pages/Profile/AvatarUpload.tsx

import React, { useState } from 'react'
import axios from 'axios'

interface AvatarUploadProps {
  token: string
  currentUrl: string
  onUpload: (url: string) => void
}

export default function AvatarUpload({ token, currentUrl, onUpload }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    setPreview(URL.createObjectURL(file))

    const formData = new FormData()
    formData.append('avatar', file)

    setUploading(true)
    setError('')
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/profile/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      const data = res.data as { avatar_url: string }
      onUpload(data.avatar_url)
      setPreview(null)
    } catch {
      setError('Грешка при качване на аватар!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <img
        src={preview || currentUrl}
        alt="Avatar Preview"
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          marginBottom: 10,
          border: '2px solid #7C4DFF'
        }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        style={{
          marginBottom: 8,
          color: '#b39ddb',
          fontWeight: 600,
        }}
      />
      {error && (
        <div className="animated-message error show" style={{ marginTop: 12 }}>
          {error}
        </div>
      )}
    </div>
  )
}
