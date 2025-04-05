'use client'

import { useState } from 'react'

export default function TeacherPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    course: '4', // default 4-р курс гэж үзье
  })
  const [file, setFile] = useState<File | null>(null)

  // ✨ ЭНД `teacherId`-г ГАРААР өгч болно
  const teacherId = 'mk20c026' // Prisma Studio дотор байгаа `Users.user_id`-тай таарна

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('description', form.description)
    formData.append('course', form.course)
    formData.append('teacherId', teacherId)
    if (file) formData.append('file', file)

    const res = await fetch('/api/assignments', {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      alert('Амжилттай нэмэгдлээ!')
      setForm({ title: '', description: '', course: '4' })
      setFile(null)
    } else {
      alert('Алдаа гарлаа')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Хичээл нэмэх</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Гарчиг"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Тайлбар"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <select
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <option key={i} value={i}>
              {i}-р курс
            </option>
          ))}
        </select>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button type="submit">Хадгалах</button>
      </form>
    </div>
  )
}
