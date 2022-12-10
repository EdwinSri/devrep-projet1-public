import useSWR, { mutate } from 'swr';

import {
  backend,
  invalidateSWRCache,
} from './api';
import { User } from './userUtil';

type ApiTimeSlot = {
  id: number;
  startDateTime: string;
  endDateTime: string;
  professionalId: number | -1;
  patientId: number | -1;
};

export type TimeSlot = {
  id: number;
  startDateTime: Date;
  endDateTime: Date;
  professionalId: number | null;
  patientId: number | null;
};

export type AddTimeSlotParams = {
  startDateTime: string;
  endDateTime: string;
};

export type RescheduleAppointmentParams = {
  oldTimeSlotId: number;
  newTimeSlotId: number;
};

type ApiSearchResult = {
  firstName: string;
  lastName: string;
  address: string;
  profession: string;
  freeTimeSlots: ApiTimeSlot[];
};

export type SearchResult = {
  firstName: string;
  lastName: string;
  address: string;
  profession: string;
  freeTimeSlots: TimeSlot[];
};

const SWR_KEY_USER_APPOINTMENTS = '*user/appointments';
const SWR_KEY_PRO_SLOTS = '*pro/slots';

function parseApiTimeSlot(slot: ApiTimeSlot): TimeSlot {
  return {
    ...slot,
    startDateTime: new Date(slot.startDateTime),
    endDateTime: new Date(slot.endDateTime),
  };
}

function parseApiSearchResult(result: ApiSearchResult): SearchResult {
  return {
    ...result,
    freeTimeSlots: result.freeTimeSlots.map(parseApiTimeSlot),
  };
}

export function useAppointments() {
  return useSWR(SWR_KEY_USER_APPOINTMENTS, getUserAppointments);
}

function invalidateUserAppointments() {
  mutate(SWR_KEY_USER_APPOINTMENTS);
  invalidateSWRCache();
}

export async function getUserAppointments(): Promise<TimeSlot[]> {
  const res = await backend.get('/api/user/appointments');
  const slots = res.data as ApiTimeSlot[];
  return slots.map(parseApiTimeSlot);
}

export async function bookUserAppointment(timeSlotId: number) {
  await backend.post('/api/user/book-appointment', { timeSlotId });
  invalidateUserAppointments();
}

export async function rescheduleUserAppointment(params: RescheduleAppointmentParams) {
  await backend.post('/api/user/reschedule-appointment', params);
  invalidateUserAppointments();
}

export async function cancelUserAppointment(id: number) {
  await backend.delete('/api/user/appointments/' + id);
  invalidateUserAppointments();
}

export function useProSlots() {
  return useSWR(SWR_KEY_PRO_SLOTS, getProSlots);
}

function invalidateProSlots() {
  mutate(SWR_KEY_PRO_SLOTS);
}

export async function getProSlots(): Promise<TimeSlot[]> {
  const res = await backend.get('/api/pro/slots');
  const slots = res.data as ApiTimeSlot[];
  return slots.map(parseApiTimeSlot);
}

export async function addProSlot(params: AddTimeSlotParams): Promise<number> {
  const res = await backend.post('/api/pro/slots', params);
  invalidateProSlots();
  return res.data.id;
}

export async function deleteProSlot(id: number) {
  await backend.delete('/api/pro/slots/' + id);
  invalidateProSlots();
}

export async function search(query: string): Promise<SearchResult[]> {
  const res = await backend.get('/api/search', {
    params: { query },
  });
  const results = res.data as ApiSearchResult[];
  return results.map(parseApiSearchResult);
}

export async function getProFreeSlots(proId: number): Promise<TimeSlot[]> {
  const res = await backend.get(`/api/pro-info/${proId}/free-slots`);
  const slots = res.data as ApiTimeSlot[];
  return slots.map(parseApiTimeSlot);
}

export async function getProInfo(proId: number): Promise<User> {
  const res = await backend.get(`/api/pro-info/${proId}`);
  return res.data as User;
}
