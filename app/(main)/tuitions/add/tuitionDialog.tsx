import type React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTuitionPage } from '@/lib/context/page/tuitionPageContext';
import { addTuition, updateTuition } from '@/lib/firebase/tuition';
import { Tuition } from '@/lib/models/tuition';
import { useStudents } from '@/lib/context/collection/studentsContext';
import { useSubjects } from '@/lib/context/collection/subjectContext';
import Currency from '@/lib/models/currency';
import TuitionStatus from '@/lib/models/tuitionStatus';
import { Invoice } from '@/lib/models/invoice';
import { addInvoice } from '@/lib/firebase/invoice';
import { InvoiceStatus } from '@/lib/models/invoiceStatus';
import axios from 'axios';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useLevels } from '@/lib/context/collection/levelContext';
import { useTutors } from '@/lib/context/collection/tutorContext';

export default function TuitionDialogForm() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { levels } = useLevels();
  const { tuition, student, tutor, subject, setTuition } = useTuitionPage();
  const { students } = useStudents();
  const { tutors } = useTutors();
  const { subjects } = useSubjects();

  const [name, setName] = useState(tuition?.name || '');
  const [studentId, setStudentId] = useState(tuition?.studentId || student?.id || '');
  const [tutorId, setTutorId] = useState(tuition?.tutorId || tutor?.id || '');
  const [subjectId, setSubjectId] = useState(tuition?.subjectId || subject?.id || '');
  const [status, setStatus] = useState(tuition?.status || '');
  const [levelId, setLevelId] = useState(tuition?.levelId || '');
  const [currency, setCurrency] = useState<Currency>(tuition?.currency || Currency.MYR);
  const [studentPrice, setStudentPrice] = useState(tuition?.studentPrice || 0);
  const [tutorPrice, setTutorPrice] = useState(tuition?.tutorPrice || 0);
  const [startDateTime, setStartDateTime] = useState(tuition?.startTime?.slice(0, 16) || '');
  const [duration, setDuration] = useState(tuition?.duration || 60);
  const [repeatWeeks, setRepeatWeeks] = useState(1);

  // ... (keep all the existing useEffect and function definitions)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ... (keep the existing handleSubmit logic)
    setIsOpen(false);  // Close the dialog after submission
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{tuition ? 'Edit Tuition' : 'Add Tuition'}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tuition ? 'Edit Tuition' : 'Add Tuition'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <label htmlFor="student" className="block text-sm font-medium text-gray-700">Student:</label>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose Student" />
              </SelectTrigger>
              <SelectContent>
                {students.map(student => (
                  <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Repeat similar Select components for tutor, subject, level, status, and currency */}
          
          <div>
            <label htmlFor="studentPrice" className="block text-sm font-medium text-gray-700">Student Price / hour:</label>
            <Input
              type="number"
              id="studentPrice"
              value={studentPrice}
              onChange={(e) => setStudentPrice(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          
          {/* Repeat similar Input components for tutorPrice, startDateTime, duration */}
          
          {tuition === null && (
            <div>
              <label htmlFor="repeatWeeks" className="block text-sm font-medium text-gray-700">Repeat Weeks:</label>
              <Input
                type="number"
                id="repeatWeeks"
                value={repeatWeeks}
                onChange={(e) => setRepeatWeeks(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}