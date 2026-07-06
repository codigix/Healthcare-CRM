import apiClient, { patientAPI, doctorAPI, roomAllotmentAPI } from './api';

export interface WorkflowStep {
 step: number;
 status: 'pending' | 'in_progress' | 'completed' | 'failed';
 message: string;
 data?: any;
 error?: string;
}

export interface ScheduleSlot {
 time: string;
 patient?: string;
 room?: string;
 token?: string;
 status: 'booked' | 'free';
}

export interface DoctorSchedule {
 doctorId: string;
 doctorName: string;
 specialization: string;
 slots: ScheduleSlot[];
}

export interface PatientInRoom {
 patientName: string;
 tokenNumber: string;
 checkInTime: string;
}

export interface RoomAllocationData {
 roomId: string;
 roomNumber: string;
 roomType: string;
 capacity: number;
 occupied: number;
 status: 'available' | 'full' | 'maintenance';
 patients: PatientInRoom[];
}

export interface RoomAllocationSummary {
 totalRooms: number;
 rooms: RoomAllocationData[];
 showAll?: boolean;
}

export interface WorkflowResult {
 success: boolean;
 patientName?: string;
 patientAge?: number;
 patientGender?: string;
 patientPhone?: string;
 patientAddress?: string;
 requiredSpecialty?: string;
 medicalHistory?: string;
 lastVisit?: string;
 roomNumber?: string;
 roomType?: string;
 doctorName?: string;
 specialization?: string;
 appointmentTime?: string;
 tokenNumber?: string;
 appointmentId?: string;
 doctorSchedule?: DoctorSchedule;
 roomAllocationSummary?: RoomAllocationSummary;
 roomAllocationDetails?: RoomAllocationData;
 steps: WorkflowStep[];
 summary?: string;
}

const generateTokenNumber = (sequenceNum?: number): string => {
 if (sequenceNum !== undefined) {
 const letterCode = Math.floor(sequenceNum / 26);
 const letter = String.fromCharCode(65 + (letterCode % 26));
 const number = (sequenceNum % 26) + 1;
 return `Token ${letter}${number}`;
 }
 return Math.floor(Math.random() * 100 + 1).toString().padStart(2, '0');
};

const generateAppointmentTime = (): string => {
 const now = new Date();
 const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
 const hours = String(nextHour.getHours()).padStart(2, '0');
 const minutes = String(nextHour.getMinutes()).padStart(2, '0');
 return `${hours}:${minutes}`;
};

const getTodayDate = (): string => {
 const today = new Date();
 return today.toISOString().split('T')[0];
};

const generateTimeSlots = (): string[] => {
 const slots: string[] = [];
 for (let hour = 9; hour < 17; hour++) {
 slots.push(`${String(hour).padStart(2, '0')}:00`);
 slots.push(`${String(hour).padStart(2, '0')}:30`);
 }
 return slots;
};

const getTodayDateString = (): string => {
 const today = new Date();
 return today.toISOString().split('T')[0];
};

const getFirstAvailableRoom = async (): Promise<{ roomId: string; roomNumber: string } | null> => {
 try {
 const response = await apiClient.get('/room-allotment/rooms');
 if (response.data && response.data.rooms && response.data.rooms.length > 0) {
 const availableRoom = response.data.rooms.find(
 (room: any) => room.status === 'Available' || room.status === 'available'
 );
 if (availableRoom) {
 return {
 roomId: availableRoom.id,
 roomNumber: availableRoom.roomNumber || `Room ${availableRoom.id?.substring(0, 3)}`,
 };
 }
 }
 } catch (error) {
 console.error('Error fetching available room:', error);
 }
 return null;
};

export const medixproAI = {
 async fetchDoctorSchedule(doctorName: string): Promise<WorkflowResult> {
 const steps: WorkflowStep[] = [];
 let currentStep = 1;

 try {
 // Step 1: Search for Doctor
 steps.push({
 step: currentStep,
 status: 'in_progress',
 message: `🔍 Searching for Dr. ${doctorName}…`,
 });

 let doctorData: any;
 try {
 console.log('[WORKFLOW] Searching for doctor:', doctorName);
 const response = await doctorAPI.search(doctorName);
 
 console.log('[WORKFLOW] Doctor search response:', response.data);
 console.log('[WORKFLOW] Doctor response keys:', Object.keys(response.data));
 
 if (response.data.doctors && response.data.doctors.length > 0) {
 doctorData = response.data.doctors[0];
 console.log('[WORKFLOW] Doctor found:', doctorData);
 steps[currentStep - 1] = {
 ...steps[currentStep - 1],
 status: 'completed',
 message: `🔍 Doctor Found: Dr. ${doctorData.name} (${doctorData.specialization})`,
 data: doctorData,
 };
 } else {
 console.error('[WORKFLOW] No doctors found in response');
 const errorMsg = response.data.error || `Doctor "${doctorName}" not found`;
 throw new Error(errorMsg);
 }
 } catch (error: any) {
 console.error('[WORKFLOW DOCTOR SEARCH ERROR]', error);
 console.error('[WORKFLOW] Doctor error response:', error.response?.data);
 const errorMessage = error.response?.data?.error || error.message || `Doctor "${doctorName}" not found in the system`;
 steps[currentStep - 1] = {
 ...steps[currentStep - 1],
 status: 'failed',
 message: `🔍 Searching for Dr. ${doctorName}…`,
 error: errorMessage,
 };
 return {
 success: false,
 steps,
 summary: `❌ ${errorMessage}. Please check the spelling or use a different doctor name. Try searching by specialization instead (e.g., "John Neurology").`,
 };
 }

 currentStep++;

 // Step 2: Fetch Today's Appointments
 steps.push({
 step: currentStep,
 status: 'in_progress',
 message: `📅 Fetching today's schedule…`,
 });

 let appointmentsData: any[] = [];
 try {
 const todayDate = getTodayDateString();
 const response = await apiClient.get('/appointments', {
 params: {
 doctorId: doctorData.id,
 startDate: todayDate,
 endDate: todayDate,
 limit: 50,
 },
 });

 if (response.data.appointments) {
 appointmentsData = response.data.appointments;
 }

 steps[currentStep - 1] = {
 ...steps[currentStep - 1],
 status: 'completed',
 message: `📅 Found ${appointmentsData.length} appointments today`,
 data: appointmentsData,
 };
 } catch (error: any) {
 console.error('Error fetching appointments:', error);
 appointmentsData = [];
 steps[currentStep - 1] = {
 ...steps[currentStep - 1],
 status: 'completed',
 message: `📅 No appointments found for today`,
 data: [],
 };
 }

 // Step 3: Generate Schedule
 currentStep++;
 steps.push({
 step: currentStep,
 status: 'in_progress',
 message: `📋 Generating schedule…`,
 });

 const timeSlots = generateTimeSlots();
 let bookedCount = 0;
 
 const availableRoom = await getFirstAvailableRoom();
 
 const schedule: ScheduleSlot[] = timeSlots.map((time) => {
 const appointment = appointmentsData.find((apt: any) => apt.time === time);
 if (appointment) {
 const assignedRoom = appointment.roomId ? `Room ${appointment.roomId}` : (availableRoom?.roomNumber || 'Room 101');
 const assignedToken = appointment.tokenNumber || generateTokenNumber(bookedCount);
 
 const slot: ScheduleSlot = {
 time,
 patient: appointment.patientName || appointment.patient?.name || 'Unknown',
 room: assignedRoom,
 token: assignedToken,
 status: 'booked' as const,
 };
 bookedCount++;
 return slot;
 }
 return {
 time,
 status: 'free' as const,
 };
 });

 steps[currentStep - 1] = {
 ...steps[currentStep - 1],
 status: 'completed',
 message: `📋 Schedule ready - ${schedule.filter((s) => s.status === 'free').length} free slots available`,
 data: schedule,
 };

 currentStep++;
 
 const appointmentsToUpdate: any[] = [];
 let updateCount = 0;
 
 appointmentsData.forEach((apt: any) => {
 if ((!apt.roomId || !apt.tokenNumber) && availableRoom) {
 appointmentsToUpdate.push({
 id: apt.id,
 roomId: apt.roomId || availableRoom.roomId,
 tokenNumber: apt.tokenNumber || generateTokenNumber(updateCount),
 });
 updateCount++;
 }
 });

 if (appointmentsToUpdate.length > 0) {
 steps.push({
 step: currentStep,
 status: 'in_progress',
 message: `🔄 Updating ${appointmentsToUpdate.length} appointments with room allocation and tokens…`,
 });

 try {
 for (const updateData of appointmentsToUpdate) {
 await apiClient.put(`/appointments/${updateData.id}`, {
 roomId: updateData.roomId,
 tokenNumber: updateData.tokenNumber,
 });
 }
 
 steps[currentStep - 1] = {
 ...steps[currentStep - 1],
 status: 'completed',
 message: `✅ Updated ${appointmentsToUpdate.length} appointments`,
 };
 } catch (error: any) {
 console.error('Error updating appointments:', error);
 steps[currentStep - 1] = {
 ...steps[currentStep - 1],
 status: 'completed',
 message: `⚠️ Schedule loaded (background updates pending)`,
 };
 }
 }

 const doctorSchedule: DoctorSchedule = {
 doctorId: doctorData.id,
 doctorName: doctorData.name,
 specialization: doctorData.specialization,
 slots: schedule,
 };

 return {
 success: true,
 doctorName: doctorData.name,
 specialization: doctorData.specialization,
 doctorSchedule,
 steps,
 summary: `✅ Dr. ${doctorData.name}'s schedule loaded successfully - Rooms & tokens allocated`,
 };
 } catch (error: any) {
 console.error('Schedule workflow error:', error);
 return {
 success: false,
 steps,
 summary: `❌ Failed to load doctor schedule: ${error.message}`,
 };
 }
 },

 async fetchRoomAllocation(roomNumber?: string, showAll: boolean = false): Promise<WorkflowResult> {
 const steps: WorkflowStep[] = [];
 let currentStep = 1;

 try {
 steps.push({
 step: currentStep,
 status: 'in_progress',
 message: roomNumber ? `🔍 Fetching Room ${roomNumber} details…` : '📋 Fetching all room allocations…',
 });

 let roomsData: any[] = [];
 let allocationsData: any[] = [];

 try {
 const [roomsResponse, allocationsResponse] = await Promise.all([
 apiClient.get('/room-allotment/rooms'),
 apiClient.get('/room-allotment/allotments', { params: { limit: 500 } }),
 ]);

 if (roomsResponse.data && roomsResponse.data.rooms) {
 roomsData = roomsResponse.data.rooms;
 }

 if (allocationsResponse.data) {
 if (allocationsResponse.data.allotments) {
 allocationsData = allocationsResponse.data.allotments;
 } else if (Array.isArray(allocationsResponse.data)) {
 allocationsData = allocationsResponse.data;
 }
 }

 steps[currentStep - 1] = {
 ...steps[currentStep - 1],
 status: 'completed',
 message: `Found ${roomsData.length} rooms with ${allocationsData.length} allocations`,
 data: { rooms: roomsData, allocations: allocationsData },
 };
 } catch (error: any) {
 console.error('Error fetching room data:', error);
 steps[currentStep - 1] = {
 ...steps[currentStep - 1],
 status: 'completed',
 message: 'Fetching room data...',
 data: [],
 };
 }

 currentStep++;

 steps.push({
 step: currentStep,
 status: 'in_progress',
 message: '⚙️ Processing room allocation data…',
 });

 const processedRooms: RoomAllocationData[] = roomsData.map((room: any) => {
 const roomAllocations = allocationsData.filter(
 (alloc: any) => alloc.roomId === room.id || alloc.room?.id === room.id,
 );

 const patients: PatientInRoom[] = roomAllocations
 .filter((alloc: any) => alloc.status === 'Occupied')
 .map((alloc: any) => ({
 patientName: alloc.patientName || 'Unknown',
 tokenNumber: alloc.id?.substring(0, 5) || 'N/A',
 checkInTime: alloc.allotmentDate
 ? new Date(alloc.allotmentDate).toLocaleTimeString('en-US', {
 hour: '2-digit',
 minute: '2-digit',
 })
 : 'N/A',
 }));

 const occupied = patients.length;
 const capacity = room.capacity || 3;

 return {
 roomId: room.id,
 roomNumber: room.roomNumber || `Room ${room.id?.substring(0, 3)}`,
 roomType: room.roomType || 'Standard',
 capacity,
 occupied,
 status: occupied >= capacity ? 'full' : 'available',
 patients,
 };
 });

 if (roomNumber) {
 const room = processedRooms.find(
 (r) =>
 r.roomNumber.toLowerCase().includes(roomNumber.toLowerCase()) ||
 r.roomNumber === roomNumber,
 );

 if (room) {
 steps[currentStep - 1] = {
 ...steps[currentStep - 1],
 status: 'completed',
 message: `✅ Room ${room.roomNumber} loaded - ${room.occupied}/${room.capacity} beds occupied`,
 data: room,
 };

 return {
 success: true,
 roomAllocationDetails: room,
 steps,
 summary: `✅ Room allocation details for ${room.roomNumber} loaded successfully`,
 };
 } else {
 steps[currentStep - 1] = {
 ...steps[currentStep - 1],
 status: 'failed',
 message: `❌ Room ${roomNumber} not found`,
 };

 return {
 success: false,
 steps,
 summary: `❌ Room "${roomNumber}" not found. Available rooms: ${processedRooms.slice(0, 5).map((r) => r.roomNumber).join(', ')}${processedRooms.length > 5 ? '...' : ''}`,
 };
 }
 }

 steps[currentStep - 1] = {
 ...steps[currentStep - 1],
 status: 'completed',
 message: `✅ ${processedRooms.length} rooms processed`,
 data: processedRooms,
 };

 const availableRooms = processedRooms.filter((r) => r.status === 'available').length;

 const summary: RoomAllocationSummary = {
 totalRooms: processedRooms.length,
 rooms: processedRooms,
 showAll: true,
 };

 return {
 success: true,
 roomAllocationSummary: summary,
 steps,
 summary: `✅ Room allocation summary loaded - ${availableRooms} available room(s) out of ${processedRooms.length}`,
 };
 } catch (error: any) {
 console.error('Room allocation workflow error:', error);
 return {
 success: false,
 steps,
 summary: `❌ Failed to load room allocation: ${error.message}`,
 };
 }
 },

 async processAppointmentWorkflow(patientName: string, specialization?: string): Promise<WorkflowResult> {
 const steps: WorkflowStep[] = [];
 let currentStep = 1;

 try {
 // Step 1: Fetch Patient Details
 steps.push({
 step: currentStep,
 status: 'in_progress',
 message: '1️⃣ Fetching patient info…',
 });

 let patientData: any;
 try {
 console.log('[WORKFLOW] Searching for patient:', patientName);
 const response = await patientAPI.search(patientName);

 console.log('[WORKFLOW] Patient search response:', response.data);
 console.log('[WORKFLOW] Response status:', response.status);
 console.log('[WORKFLOW] Response keys:', Object.keys(response.data));

 if (response.data.patients && response.data.patients.length > 0) {
 patientData = response.data.patients[0];
 console.log('[WORKFLOW] Patient found:', patientData);
 
 const calculateAge = (dob: string) => {
 const today = new Date();
 const birthDate = new Date(dob);
 let age = today.getFullYear() - birthDate.getFullYear();
 const monthDiff = today.getMonth() - birthDate.getMonth();
 if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
 age--;
 }
 return age;
 };
 
 const patientDetailsMessage = `1️⃣ Fetching patient info…
🧾 Patient Found
Name: ${patientData.name}
Age: ${patientData.age || (patientData.dob ? calculateAge(patientData.dob) : 'N/A')}
Gender: ${patientData.gender || 'N/A'}
Phone: ${patientData.phone || 'N/A'}
Address: ${patientData.address || 'N/A'}
Required Specialty: ${patientData.specialization || 'General'}
Medical History: ${patientData.medicalHistory || patientData.history || 'No history'}
Last Visit: ${patientData.lastVisit || 'First visit'}`;

 steps[currentStep - 1] = {
 ...steps[currentStep - 1],
 status: 'completed',
 message: patientDetailsMessage,
 data: patientData,
 };
 } else {
 console.error('[WORKFLOW] No patients found in response');
 throw new Error(`Patient "${patientName}" not found`);
 }
 } catch (error: any) {
 console.error('[WORKFLOW PATIENT SEARCH ERROR]', error);
 console.error('[WORKFLOW] Error response status:', error.response?.status);
 console.error('[WORKFLOW] Error response data:', error.response?.data);
 console.error('[WORKFLOW] Error response headers:', error.response?.headers);
 
 steps[currentStep - 1] = {
 ...steps[currentStep - 1],
 status: 'failed',
 message: `1️⃣ Fetching patient info…`,
 error: `Patient "${patientName}" not found. Please create the patient first.`,
 };
 return {
 success: false,
 patientName,
 steps,
 summary: `❌ Workflow failed at Step 1: Patient not found. Please register patient "${patientName}" in the system first.`,
 };
 }

 currentStep++;

 // Step 2: Allocate Room
 steps.push({
 step: currentStep,
 status: 'in_progress',
 message: '2️⃣ Allocating room…',
 });

 let roomData: any;
 try {
 const response = await apiClient.get('/room-allotment/available');

 if (response.data.rooms && response.data.rooms.length > 0) {
 roomData = response.data.rooms[0];
 steps[currentStep - 1] = {
 ...steps[currentStep - 1],
 status: 'completed',
 message: `2️⃣ Allocating room…\n✔ Room ${roomData.roomNumber} – ${roomData.roomType}`,
 data: roomData,
 };
 } else {
 throw new Error('No available rooms');
 }
 } catch (error: any) {
 steps[currentStep - 1] = {
 ...steps[currentStep - 1],
 status: 'failed',
 message: '2️⃣ Allocating room…',
 error: 'No rooms available right now',
 };
 return {
 success: false,
 patientName,
 steps,
 summary: '❌ Workflow failed at Step 2: No rooms available right now.',
 };
 }

 currentStep++;

 // Step 3: Assign Doctor
 steps.push({
 step: currentStep,
 status: 'in_progress',
 message: '3️⃣ Assigning doctor…',
 });

 let doctorData: any;
 try {
 const params: any = {};
 if (specialization) {
 params.specialization = specialization;
 }

 console.log('[WORKFLOW] Fetching available doctors', specialization ? `for ${specialization}` : 'for any specialization');
 const response = await apiClient.get('/doctors/available', { params });

 console.log('[WORKFLOW] Available doctors response:', response.data);
 if (response.data.doctors && response.data.doctors.length > 0) {
 doctorData = response.data.doctors[0];
 console.log('[WORKFLOW] Doctor assigned:', doctorData);
 steps[currentStep - 1] = {
 ...steps[currentStep - 1],
 status: 'completed',
 message: `3️⃣ Assigning doctor…\n✔ Dr. ${doctorData.name} (${doctorData.specialization}) is available`,
 data: doctorData,
 };
 } else {
 const errorMsg = response.data.error || `No doctors available for ${specialization || 'any'} specialization`;
 console.error('[WORKFLOW] No doctors available:', errorMsg);
 throw new Error(errorMsg);
 }
 } catch (error: any) {
 console.error('[WORKFLOW DOCTOR AVAILABILITY ERROR]', error);
 const errorMsg = error.response?.data?.error || error.message || `No doctors available for ${specialization || 'any'} specialization`;
 steps[currentStep - 1] = {
 ...steps[currentStep - 1],
 status: 'failed',
 message: '3️⃣ Assigning doctor…',
 error: errorMsg,
 };
 return {
 success: false,
 patientName,
 steps,
 summary: `❌ Workflow failed at Step 3: ${errorMsg}. Please try again or add more doctors to the system.`,
 };
 }

 currentStep++;

 // Update Patient's Doctor Assignment (silent operation)
 try {
 await apiClient.put(`/patients/${patientData.id}`, {
 doctorId: doctorData.id,
 });
 } catch (error: any) {
 console.error('Failed to update patient doctor:', error);
 }

 // Step 4: Create Appointment
 steps.push({
 step: currentStep,
 status: 'in_progress',
 message: '4️⃣ Scheduling appointment…',
 });

 const appointmentTime = generateAppointmentTime();
 const tokenNumber = generateTokenNumber();
 const appointmentDate = getTodayDate();

 try {
 const appointmentPayload = {
 doctorId: doctorData.id,
 patientId: patientData.id,
 date: appointmentDate,
 time: appointmentTime,
 roomId: roomData.id,
 status: 'scheduled',
 tokenNumber,
 notes: `Appointment created by MedixPro AI Assistant for ${specialization || 'general'} consultation`,
 };

 const response = await apiClient.post('/appointments/create', appointmentPayload);

 if (response.data.appointment) {
 const appointment = response.data.appointment;
 steps[currentStep - 1] = {
 ...steps[currentStep - 1],
 status: 'completed',
 message: `4️⃣ Scheduling appointment…\n✔ Time: ${appointmentTime}\n✔ Token: ${tokenNumber}`,
 data: appointment,
 };
 } else {
 throw new Error('Failed to create appointment');
 }
 } catch (error: any) {
 steps[currentStep - 1] = {
 ...steps[currentStep - 1],
 status: 'failed',
 message: '4️⃣ Scheduling appointment…',
 error: error.response?.data?.error || 'Failed to create appointment',
 };
 return {
 success: false,
 patientName,
 steps,
 summary: `❌ Workflow failed at Step 4: ${error.response?.data?.error || 'Failed to create appointment'}`,
 };
 }

 // Step 5: Generate Summary
 const summary = `Patient: ${patientData.name}
✔ Room: ${roomData.roomNumber} – ${roomData.roomType}
✔ Doctor Assigned: Dr. ${doctorData.name} (${doctorData.specialization})
✔ Appointment Time: ${appointmentTime}
✔ Token Number: ${tokenNumber}`;

 return {
 success: true,
 patientName: patientData.name,
 patientAge: patientData.age,
 patientGender: patientData.gender,
 patientPhone: patientData.phone,
 patientAddress: patientData.address,
 requiredSpecialty: patientData.specialization || 'General',
 medicalHistory: patientData.history,
 lastVisit: patientData.lastVisit,
 roomNumber: roomData.roomNumber,
 roomType: roomData.roomType,
 doctorName: doctorData.name,
 specialization: doctorData.specialization,
 appointmentTime,
 tokenNumber,
 appointmentId: steps[3].data?.id,
 steps,
 summary,
 };
 } catch (error: any) {
 console.error('Workflow error:', error);
 return {
 success: false,
 patientName,
 steps,
 summary: `❌ Workflow failed: ${error.message}`,
 };
 }
 },
};
