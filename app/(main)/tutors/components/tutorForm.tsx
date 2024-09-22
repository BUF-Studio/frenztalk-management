'use client'

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, X } from "lucide-react"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Textarea } from "@/app/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import { toast } from "@/app/components/hooks/use-toast";
import { useTutorPage } from "@/lib/context/page/tutorPageContext"
import { useSubjects } from "@/lib/context/collection/subjectContext"
import { Tutor } from "@/lib/models/tutor"
import { updateTutor } from "@/lib/firebase/tutor"

interface TutorFormProps {
  initialTutor?: Tutor | null
}

const TutorForm: React.FC<TutorFormProps> = ({ initialTutor }) => {
  const router = useRouter()
  const { subjects } = useSubjects()
  const { setTutor } = useTutorPage()
  const [formData, setFormData] = useState({
    name: "",
    des: "",
    status: "active",
    preferSubjects: [] as string[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [prefer, setPrefer] = useState("")

  useEffect(() => {
    if (initialTutor) {
      console.log("initialTutor", initialTutor)
      setFormData({
        name: initialTutor.name || "",
        des: initialTutor.des || "",
        status: initialTutor.status || "active",
        preferSubjects: initialTutor.subjects.filter((subject): subject is string => subject !== null) || [],
      })
    }
    setIsLoading(false)
  }, [initialTutor])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const updatedTutor = new Tutor(
        initialTutor?.id || null,
        formData.name,
        formData.preferSubjects,
        formData.des,
        formData.status,
        ""
      )
      await updateTutor(updatedTutor)
      setTutor(updatedTutor)
      toast({
        title: initialTutor ? "Tutor Updated" : "Tutor Created",
        description: `Successfully ${initialTutor ? "updated" : "added"} tutor: ${formData.name}`,
        variant: "default",
      })
      router.back()
    } catch (error) {
      console.error("Error saving tutor:", error)
      toast({
        title: "Error",
        description: "Failed to save tutor. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addPreferSubject = () => {
    if (prefer !== "") {
      setFormData((prevData) => ({
        ...prevData,
        preferSubjects: [...prevData.preferSubjects, prefer],
      }))
      setPrefer("")
    }
  }

  const removePreferSubject = (subjectId: string) => {
    setFormData((prevData) => ({
      ...prevData,
      preferSubjects: prevData.preferSubjects.filter((id) => id !== subjectId),
    }))
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <Textarea
        name="des"
        value={formData.des}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <Select
        value={formData.status}
        onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="frozen">Frozen</SelectItem>
        </SelectContent>
      </Select>
      <div>
        <h3 className="mb-2 font-semibold">Preferred Subjects</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.preferSubjects.map((subjectId) => {
            const subjectDetails = subjects.find((sub) => sub.id === subjectId)
            return (
              <div key={subjectId} className="flex items-center bg-primary/10 rounded-full px-3 py-1">
                <span className="text-sm">{subjectDetails ? subjectDetails.name : "Unknown Subject"}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-1 p-0 h-auto"
                  onClick={() => removePreferSubject(subjectId)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>
        <div className="flex gap-2">
          <Select value={prefer} onValueChange={setPrefer}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose prefer subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects
                .filter((sub) => sub.id !== null && !formData.preferSubjects.includes(sub.id))
                .map((sub) => (
                  <SelectItem key={sub.id} value={sub.id || ""}>
                    {sub.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={addPreferSubject} disabled={!prefer}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-6">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Saving..." : initialTutor ? "Update Tutor" : "Add Tutor"}
        </Button>
      </div>
    </form>
  )
}

export default TutorForm