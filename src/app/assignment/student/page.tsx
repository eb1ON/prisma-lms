'use client'
import { useEffect, useState } from 'react'

interface Assignment {
  id: string
  title: string
  description: string
  fileUrl: string | null
  createdAt: string
}

export default function StudentPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])

  const studentSchoolYear = 4 // 👈 ЭНД 4 эсвэл 5-г гараар өг

  useEffect(() => {
    fetch(`/api/assignments?course=${studentSchoolYear}`)
      .then(res => res.json())
      .then(data => setAssignments(data))
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Таны курст тохирох даалгавар</h1>
      {assignments.length === 0 ? (
        <p>Даалгавар алга байна.</p>
      ) : (
        assignments.map((a) => (
          <div key={a.id} className="border p-4 mb-3">
            <h2 className="font-semibold">{a.title}</h2>
            <p>{a.description}</p>
            {a.fileUrl && (
              <a href={a.fileUrl} download className="text-blue-600">Файл татах</a>
            )}
          </div>
        ))
      )}
    </div>
  )
}
