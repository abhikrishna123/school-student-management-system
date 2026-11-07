// Simple API Helper for College Internal Mark Project
// Uses standard fetch with simple error handling

const API_BASE = '/api';

export async function getStatus() {
  try {
    const res = await fetch(`${API_BASE}/status`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching status:', error);
    return { success: false, connected: false, dbMode: 'Offline' };
  }
}

export async function connectMongo(mongoUri) {
  try {
    const res = await fetch(`${API_BASE}/connect-db`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mongoUri }),
    });
    return await res.json();
  } catch (error) {
    console.error('Error connecting to mongo:', error);
    return { success: false, message: error.message };
  }
}

export async function getDashboardStats() {
  try {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}

export async function getStudents(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.classGrade) query.append('classGrade', params.classGrade);
    if (params.section) query.append('section', params.section);

    const res = await fetch(`${API_BASE}/students?${query.toString()}`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
}

export async function getStudentById(id) {
  try {
    const res = await fetch(`${API_BASE}/students/${id}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching student:', error);
    return null;
  }
}

export async function createStudent(studentData) {
  try {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    return await res.json();
  } catch (error) {
    console.error('Error creating student:', error);
    return { success: false, message: error.message };
  }
}

export async function updateStudent(id, studentData) {
  try {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    return await res.json();
  } catch (error) {
    console.error('Error updating student:', error);
    return { success: false, message: error.message };
  }
}

export async function deleteStudent(id) {
  try {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (error) {
    console.error('Error deleting student:', error);
    return { success: false, message: error.message };
  }
}

export async function getSubjects(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.classGrade) query.append('classGrade', params.classGrade);

    const res = await fetch(`${API_BASE}/subjects?${query.toString()}`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
}

export async function createSubject(subjectData) {
  try {
    const res = await fetch(`${API_BASE}/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subjectData),
    });
    return await res.json();
  } catch (error) {
    console.error('Error creating subject:', error);
    return { success: false, message: error.message };
  }
}

export async function getMarks(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.classGrade) query.append('classGrade', params.classGrade);
    if (params.examType) query.append('examType', params.examType);
    if (params.studentId) query.append('studentId', params.studentId);

    const res = await fetch(`${API_BASE}/marks?${query.toString()}`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching marks:', error);
    return [];
  }
}

export async function saveMarks(marksData) {
  try {
    const res = await fetch(`${API_BASE}/marks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(marksData),
    });
    return await res.json();
  } catch (error) {
    console.error('Error saving marks:', error);
    return { success: false, message: error.message };
  }
}

export async function saveBatchMarks(batchData) {
  try {
    const res = await fetch(`${API_BASE}/marks/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batchData),
    });
    return await res.json();
  } catch (error) {
    console.error('Error saving batch marks:', error);
    return { success: false, message: error.message };
  }
}

export async function getAttendance(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.date) query.append('date', params.date);
    if (params.classGrade) query.append('classGrade', params.classGrade);
    if (params.section) query.append('section', params.section);

    const res = await fetch(`${API_BASE}/attendance?${query.toString()}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return null;
  }
}

export async function saveAttendance(attendanceData) {
  try {
    const res = await fetch(`${API_BASE}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attendanceData),
    });
    return await res.json();
  } catch (error) {
    console.error('Error saving attendance:', error);
    return { success: false, message: error.message };
  }
}
