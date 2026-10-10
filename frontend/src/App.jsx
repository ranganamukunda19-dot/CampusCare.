import { useEffect, useState } from 'react'



import './App.css'





const API_URL = 'https://campuscare-backend-5hs4.onrender.com'





function App() {



  // =========================================================



  // PAGE



  // =========================================================







  const [page, setPage] = useState('dashboard')







  // =========================================================



  // DASHBOARD



  // =========================================================







  const [dashboard, setDashboard] = useState(null)





// =========================================================

// SCHEDULING

// =========================================================



 const [scheduleTasks, setScheduleTasks] = useState([])

 const [scheduleTaskName, setScheduleTaskName] = useState('')

 const [scheduleTaskType, setScheduleTaskType] = useState('')

 const [scheduleTime, setScheduleTime] = useState('')

 const [scheduleLoading, setScheduleLoading] = useState(false)







  // =========================================================



  // STUDENTS



  // =========================================================







  const [students, setStudents] = useState([])







  const [name, setName] = useState('')



  const [email, setEmail] = useState('')



  const [phone, setPhone] = useState('')



  const [department, setDepartment] = useState('')



  const [year, setYear] = useState('')







  // =========================================================



  // ROOMS



  // =========================================================







  const [rooms, setRooms] = useState([])







  const [roomNumber, setRoomNumber] = useState('')



  const [capacity, setCapacity] = useState('')







  // =========================================================



  // ATTENDANCE



  // =========================================================







  const [attendance, setAttendance] = useState([])







  const [attendanceStudent, setAttendanceStudent] = useState('')



  const [attendanceDate, setAttendanceDate] = useState('')



  const [attendancePresent, setAttendancePresent] = useState('1')



  // =========================================================

  // ML ATTENDANCE PREDICTION

  // =========================================================



  const [predictionStudentId, setPredictionStudentId] = useState('')

  const [attendancePrediction, setAttendancePrediction] = useState('')

  const [predictionLoading, setPredictionLoading] = useState(false)

  const [predictionError, setPredictionError] = useState('')







  // =========================================================



  // COMPLAINTS



  // =========================================================







  const [complaints, setComplaints] = useState([])







  // =========================================================



  // ALLOCATIONS



  // =========================================================







  const [allocations, setAllocations] = useState([])







  const [allocationStudent, setAllocationStudent] = useState('')



  const [allocationRoom, setAllocationRoom] = useState('')







  const [complaintStudent, setComplaintStudent] = useState('')



  const [complaintCategory, setComplaintCategory] = useState('')



  const [complaintDescription, setComplaintDescription] = useState('')







  // =========================================================



  // LOAD DASHBOARD



  // =========================================================







  const loadDashboard = () => {



    fetch(`${API_URL}/dashboard`)



      .then((response) => {



        if (!response.ok) {



          throw new Error('Failed to load dashboard')



        }







        return response.json()



      })



      .then((data) => {



        setDashboard(data)



      })



      .catch((error) => {



        console.error('Dashboard error:', error)



      })



  }







  // =========================================================



  // LOAD STUDENTS



  // =========================================================







  const loadStudents = () => {



    fetch(`${API_URL}/students`)



      .then((response) => {



        if (!response.ok) {



          throw new Error('Failed to load students')



        }







        return response.json()



      })



      .then((data) => {



        setStudents(data)



      })



      .catch((error) => {



        console.error('Students error:', error)



      })



  }







  // =========================================================



  // LOAD ROOMS



  // =========================================================







  const loadRooms = () => {



    fetch(`${API_URL}/rooms`)



      .then((response) => {



        if (!response.ok) {



          throw new Error('Failed to load rooms')



        }







        return response.json()



      })



      .then((data) => {



        setRooms(data)



      })



      .catch((error) => {



        console.error('Rooms error:', error)



      })



  }







  // =========================================================



  // LOAD ATTENDANCE



  // =========================================================







  const loadAttendance = () => {



    fetch(`${API_URL}/attendance`)



      .then((response) => {



        if (!response.ok) {



          throw new Error('Failed to load attendance')



        }







        return response.json()



      })



      .then((data) => {



        setAttendance(data)



      })



      .catch((error) => {



        console.error('Attendance error:', error)



      })



  }







  // =========================================================



  // LOAD COMPLAINTS



  // =========================================================







  const loadComplaints = () => {



    fetch(`${API_URL}/complaints`)



      .then((response) => {



        if (!response.ok) {



          throw new Error('Failed to load complaints')



        }







        return response.json()



      })



      .then((data) => {



        setComplaints(data)



      })



      .catch((error) => {



        console.error('Complaints error:', error)



      })



  }







  // =========================================================



  // =========================================================

  // SCHEDULING FUNCTIONS

  // =========================================================

  const loadSchedule = async () => {
    try {
      const response = await fetch(`${API_URL}/schedule`)
      if (!response.ok) throw new Error('Failed to load schedule')
      const data = await response.json()
      setScheduleTasks(data)
    } catch (error) {
      console.error('Schedule loading error:', error)
    }
  }

  const addScheduleTask = async (event) => {
    event.preventDefault()
    if (!scheduleTaskName.trim()) return alert('Please enter a task name.')
    if (!scheduleTaskType.trim()) return alert('Please enter a task type.')
    if (!scheduleTime) return alert('Please select a scheduled time.')

    setScheduleLoading(true)
    try {
      const query = new URLSearchParams({
        task_name: scheduleTaskName.trim(),
        task_type: scheduleTaskType.trim(),
        scheduled_time: scheduleTime.replace('T', ' ')
      })
      const response = await fetch(`${API_URL}/schedule?${query.toString()}`, { method: 'POST' })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(typeof data.detail === 'string' ? data.detail : 'Failed to create schedule')
      }
      alert('Schedule task added successfully!')
      setScheduleTaskName('')
      setScheduleTaskType('')
      setScheduleTime('')
      loadSchedule()
    } catch (error) {
      alert(error.message)
    } finally {
      setScheduleLoading(false)
    }
  }

  const completeScheduleTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/schedule/${taskId}/complete`, { method: 'PUT' })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(typeof data.detail === 'string' ? data.detail : 'Failed to complete schedule task')
      }
      loadSchedule()
    } catch (error) {
      alert(error.message)
    }
  }

  // LOAD EVERYTHING WHEN APP STARTS



  // =========================================================






  // =========================================================
  // ALLOCATION FUNCTIONS
  // =========================================================
// =========================================================
// ALLOCATION FUNCTIONS
// =========================================================

const loadAllocations = async () => {
  try {
    const response = await fetch(`${API_URL}/allocations`)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        typeof data.detail === 'string'
          ? data.detail
          : 'Failed to load allocations'
      )
    }

    setAllocations(data)
  } catch (error) {
    console.error('Allocations error:', error)
  }
}


const addAllocation = async (event) => {
  event.preventDefault()

  // Check student and room selection
  if (!allocationStudent || !allocationRoom) {
    alert('Please select a student and a room.')
    return
  }

  const studentId = Number(allocationStudent)
  const roomId = Number(allocationRoom)

  // Check whether student already has a room
  const alreadyAllocated = allocations.some(
    (allocation) =>
      Number(allocation.student_id) === studentId
  )

  if (alreadyAllocated) {
    alert('This student already has a room allocation.')
    return
  }

  // Find selected room
  const selectedRoom = rooms.find(
    (room) =>
      Number(room.room_id) === roomId
  )

  if (!selectedRoom) {
    alert('Selected room was not found.')
    return
  }

  // Check room capacity
  if (
    Number(selectedRoom.occupied) >=
    Number(selectedRoom.capacity)
  ) {
    alert('This room is already full.')
    return
  }

  try {

    // Current date and time
    const now = new Date()

    const allocatedAt =
      `${now.getFullYear()}-` +
      `${String(now.getMonth() + 1).padStart(2, '0')}-` +
      `${String(now.getDate()).padStart(2, '0')} ` +
      `${String(now.getHours()).padStart(2, '0')}:` +
      `${String(now.getMinutes()).padStart(2, '0')}:` +
      `${String(now.getSeconds()).padStart(2, '0')}`


    // Data sent to FastAPI
    const allocationData = {
      student_id: studentId,
      room_id: roomId,
      allocated_at: allocatedAt
    }


    console.log(
      'Sending allocation data:',
      allocationData
    )


    // Send allocation to backend
    const response = await fetch(
      `${API_URL}/allocations`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(allocationData)
      }
    )


    const data = await response.json()


    console.log(
      'Allocation response:',
      data
    )


    // Handle backend error
    if (!response.ok) {

      let errorMessage =
        'Failed to allocate room.'

      if (data.detail) {

        if (typeof data.detail === 'string') {
          errorMessage = data.detail
        }

        else if (Array.isArray(data.detail)) {
          errorMessage =
            data.detail
              .map((error) => error.msg)
              .join(', ')
        }
      }

      throw new Error(errorMessage)
    }


    // Success
    alert(
      'Room allocated successfully!'
    )


    // Clear selections
    setAllocationStudent('')
    setAllocationRoom('')


    // Refresh data
    await loadAllocations()
    await loadRooms()
    await loadDashboard()

  }

  catch (error) {

    console.error(
      'Allocation error:',
      error
    )

    alert(
      error.message ||
      'Failed to allocate room'
    )
  }
}


const deleteAllocation = async (
  allocationId
) => {

  const confirmed =
    window.confirm(
      'Are you sure you want to remove this room allocation?'
    )

  if (!confirmed) {
    return
  }

  try {

    const response = await fetch(
      `${API_URL}/allocations/${allocationId}`,
      {
        method: 'DELETE'
      }
    )


    const data =
      await response.json()


    if (!response.ok) {

      throw new Error(
        typeof data.detail === 'string'
          ? data.detail
          : 'Failed to remove allocation'
      )
    }


    alert(
      'Room allocation removed successfully!'
    )


    await loadAllocations()
    await loadRooms()
    await loadDashboard()

  }

  catch (error) {

    console.error(
      'Remove allocation error:',
      error
    )

    alert(
      error.message ||
      'Failed to remove allocation'
    )
  }
}
  // LOAD EVERYTHING WHEN APP STARTS

useEffect(() => {



  loadDashboard()



  loadStudents()



  loadRooms()



  loadAttendance()



  loadComplaints()



  loadAllocations()



  loadSchedule()



}, [])





  // =========================================================



  // ADD STUDENT



  // =========================================================







  const addStudent = async (event) => {



    event.preventDefault()







    try {



      const studentData = {



        name: name,



        email: email,



        phone: phone,



        department: department,



        year: year ? Number(year) : null



      }







      const response = await fetch(`${API_URL}/students`, {



        method: 'POST',



        headers: {



          'Content-Type': 'application/json'



        },



        body: JSON.stringify(studentData)



      })







      const data = await response.json()







      if (!response.ok) {



        throw new Error(data.detail || 'Failed to add student')



      }







      alert('Student added successfully!')







      setName('')



      setEmail('')



      setPhone('')



      setDepartment('')



      setYear('')







      loadStudents()



      loadDashboard()



    } catch (error) {



      alert(error.message)



    }



  }







  // =========================================================



  // ADD ROOM



  // =========================================================







  const addRoom = async (event) => {



    event.preventDefault()







    try {



      const roomData = {



        room_number: roomNumber,



        capacity: Number(capacity)



      }







      const response = await fetch(`${API_URL}/rooms`, {



        method: 'POST',



        headers: {



          'Content-Type': 'application/json'



        },



        body: JSON.stringify(roomData)



      })







      const data = await response.json()







      if (!response.ok) {



        throw new Error(data.detail || 'Failed to add room')



      }







      alert('Room added successfully!')







      setRoomNumber('')



      setCapacity('')







      loadRooms()



      loadDashboard()



    } catch (error) {



      alert(error.message)



    }



  }







  // =========================================================



  // DELETE ROOM



  // =========================================================







  const deleteRoom = async (roomId) => {



    const confirmDelete = window.confirm(



      'Are you sure you want to delete this room?'



    )







    if (!confirmDelete) {



      return



    }







    try {



      const response = await fetch(`${API_URL}/rooms/${roomId}`, {



        method: 'DELETE'



      })







      const data = await response.json()







      if (!response.ok) {



        throw new Error(data.detail || 'Failed to delete room')



      }







      alert('Room deleted successfully!')







      loadRooms()



      loadDashboard()



    } catch (error) {



      alert(error.message)



    }



  }







  // =========================================================



  // ADD ATTENDANCE



  // =========================================================







  const addAttendance = async (event) => {



    event.preventDefault()







    if (!attendanceStudent) {



      alert('Please select a student.')



      return



    }







    if (!attendanceDate) {



      alert('Please select a date.')



      return



    }







    try {



      const attendanceData = {



        student_id: Number(attendanceStudent),



        attendance_date: attendanceDate,



        present: Number(attendancePresent)



      }







      const response = await fetch(`${API_URL}/attendance`, {



        method: 'POST',



        headers: {



          'Content-Type': 'application/json'



        },



        body: JSON.stringify(attendanceData)



      })







      const data = await response.json()







      if (!response.ok) {



        throw new Error(data.detail || 'Failed to save attendance')



      }







      alert('Attendance saved successfully!')







      setAttendanceStudent('')



      setAttendanceDate('')



      setAttendancePresent('1')







      loadAttendance()



    } catch (error) {



      alert(error.message)



    }



  }







  // =========================================================



  // DELETE ATTENDANCE



  // =========================================================







  const deleteAttendance = async (attendanceId) => {



    const confirmDelete = window.confirm(



      'Are you sure you want to delete this attendance record?'



    )







    if (!confirmDelete) {



      return



    }







    try {



      const response = await fetch(



        `${API_URL}/attendance/${attendanceId}`,



        {



          method: 'DELETE'



        }



      )







      const data = await response.json()







      if (!response.ok) {



        throw new Error(



          data.detail || 'Failed to delete attendance'



        )



      }







      alert('Attendance deleted successfully!')







      loadAttendance()



    } catch (error) {



      alert(error.message)



    }



  }







  // =========================================================



  // ADD COMPLAINT



  // =========================================================







  const addComplaint = async (event) => {



    event.preventDefault()







    if (!complaintStudent) {



      alert('Please select a student.')



      return



    }







    if (!complaintCategory) {



      alert('Please select a complaint category.')



      return



    }







    if (!complaintDescription.trim()) {



      alert('Please enter the complaint description.')



      return



    }











    try {



  const complaintData = {



    student_id: Number(complaintStudent),



    category: complaintCategory,



    description: complaintDescription,



    status: 'Pending',



    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')



  };







  const response = await fetch(`${API_URL}/complaints`, {



    method: 'POST',



    headers: {



      'Content-Type': 'application/json'



    },



    body: JSON.stringify(complaintData)



  });







  const data = await response.json();







  if (!response.ok) {



    throw new Error(



      typeof data.detail === 'string'



        ? data.detail



        : JSON.stringify(data.detail)



    );



  }







  alert('Complaint submitted successfully!');







  setComplaintStudent('');



  setComplaintCategory('');



  setComplaintDescription('');







  loadComplaints();



  loadDashboard();







} catch (error) {



  alert(error.message);



}







  }







  // =========================================================



  // UPDATE COMPLAINT STATUS



  // =========================================================







  const updateComplaintStatus = async (



    complaintId,



    newStatus



  ) => {



    try {



      const complaintData = {



        status: newStatus



      }







      const response = await fetch(



        `${API_URL}/complaints/${complaintId}`,



        {



          method: 'PUT',



          headers: {



            'Content-Type': 'application/json'



          },



          body: JSON.stringify(complaintData)



        }



      )







      const data = await response.json()







      if (!response.ok) {



        throw new Error(



          data.detail || 'Failed to update complaint'



        )



      }







      loadComplaints()



      loadDashboard()



    } catch (error) {



      alert(error.message)



    }



  }







  // =========================================================



  // DELETE COMPLAINT



  // =========================================================







  const deleteComplaint = async (complaintId) => {



    const confirmDelete = window.confirm(



      'Are you sure you want to delete this complaint?'



    )







    if (!confirmDelete) {



      return



    }







    try {



      const response = await fetch(



        `${API_URL}/complaints/${complaintId}`,



        {



          method: 'DELETE'



        }



      )







      const data = await response.json()







      if (!response.ok) {



        throw new Error(



          data.detail || 'Failed to delete complaint'



        )



      }







      alert('Complaint deleted successfully!')







      loadComplaints()



      loadDashboard()



    } catch (error) {



      alert(error.message)



    }



  }







  // =========================================================

  // ML ATTENDANCE PREDICTION

  // =========================================================



  const predictStudentAttendance = async (event) => {

    event.preventDefault()



    if (!predictionStudentId) {

      alert('Please select a student.')

      return

    }



    setPredictionLoading(true)

    setAttendancePrediction('')

    setPredictionError('')



    try {

      const response = await fetch(

        `${API_URL}/ml/predict-attendance/${Number(predictionStudentId)}`

      )



      const data = await response.json()



      if (!response.ok) {

        throw new Error(

          typeof data.detail === 'string'

            ? data.detail

            : 'Failed to predict attendance'

        )

      }



      setAttendancePrediction(data.prediction)

    } catch (error) {

      console.error('ML prediction error:', error)

      setPredictionError(error.message)

    } finally {

      setPredictionLoading(false)

    }

  }



  // =========================================================



  // SIDEBAR MENU



  // =========================================================







  const menuItems = [



    {



      id: 'dashboard',



      icon: '🏠',



      label: 'Dashboard'



    },



    {



      id: 'students',



      icon: '👨‍🎓',



      label: 'Students'



    },



    {



      id: 'rooms',



      icon: '🛏️',



      label: 'Rooms'



    },



    {



      id: 'attendance',



      icon: '✓',



      label: 'Attendance'



    },



    {



      id: 'complaints',



      icon: '⚠️',



      label: 'Complaints'



    },



    {



      id: 'allocations',



      icon: '🔑',



      label: 'Allocations'



    },
    {
      id: 'scheduling',
      icon: '📅',
      label: 'Scheduling'
    }



  ]







  // =========================================================



  // PAGE TITLES



  // =========================================================







  const pageInfo = {



    dashboard: {



      title: 'Dashboard',



      subtitle: 'Overview of your CampusCare hostel'



    },







    students: {



      title: 'Students',



      subtitle: 'Manage hostel student information'



    },







    rooms: {



      title: 'Rooms',



      subtitle: 'Manage hostel rooms and occupancy'



    },







    attendance: {



      title: 'Attendance',



      subtitle: 'Track mess attendance records'



    },







    complaints: {



      title: 'Complaints',



      subtitle: 'Manage and track student complaints'



    },







    allocations: {



      title: 'Allocations',



      subtitle: 'Manage student room allocations'



    },

    scheduling: {
      title: 'Scheduling',
      subtitle: 'Manage hostel tasks and schedules'
    }



  }







  // =========================================================



  // STATUS CLASS



  // =========================================================







  const getStatusClass = (status) => {



    if (status === 'Resolved') {



      return 'status-resolved'



    }







    if (status === 'In Progress') {



      return 'status-progress'



    }







    return 'status-pending'



  }







  // =========================================================



  // LOADING



  // =========================================================







  if (!dashboard) {



    return (



      <div



        style={{



          minHeight: '100vh',



          display: 'flex',



          alignItems: 'center',



          justifyContent: 'center',



          background: '#f1f5f9',



          fontFamily: 'Arial, sans-serif'



        }}



      >



        <div



          style={{



            background: 'white',



            padding: '40px',



            borderRadius: '16px',



            boxShadow: '0 5px 20px rgba(0,0,0,0.08)',



            textAlign: 'center'



          }}



        >



          <div style={{ fontSize: '40px', marginBottom: '15px' }}>



            🏫



          </div>







          <h2 style={{ margin: 0, color: '#172033' }}>



            CampusCare



          </h2>







          <p style={{ color: '#64748b' }}>



            Loading dashboard...



          </p>



        </div>



      </div>



    )



  }







  // =========================================================



  // MAIN UI



  // =========================================================







  return (



    <div className="app">







      {/* =====================================================



          SIDEBAR



      ====================================================== */}







      <aside className="sidebar">







        <div className="sidebar-logo">



          <div className="logo-icon">



            🏫



          </div>







          <div>



            <h1>CampusCare</h1>



            <span>Hostel Management</span>



          </div>



        </div>







        <div className="sidebar-section-title">



          MAIN MENU



        </div>







        <nav>







          {menuItems.map((item) => (



            <button



              key={item.id}



              className={



                page === item.id



                  ? 'sidebar-button active'



                  : 'sidebar-button'



              }



              onClick={() => setPage(item.id)}



            >







              <span className="sidebar-icon">



                {item.icon}



              </span>







              <span>



                {item.label}



              </span>







            </button>



          ))}







        </nav>







        <div className="sidebar-footer">



          <div className="system-status">



            <span className="online-dot"></span>







            <div>



              <strong>System Online</strong>



              <small>CampusCare API</small>



            </div>



          </div>



        </div>







      </aside>







      {/* =====================================================



          MAIN CONTENT



      ====================================================== */}







      <main className="main-content">







        {/* PAGE HEADER */}







        <div className="page-header">







          <div>



            <h2>



              {pageInfo[page].title}



            </h2>







            <p>



              {pageInfo[page].subtitle}



            </p>



          </div>







          <div className="header-badge">



            ● Live



          </div>







        </div>







        {/* ===================================================



            DASHBOARD



        ==================================================== */}







        {page === 'dashboard' && (



          <>







            <div className="dashboard-welcome">







              <div>



                <h3>



                  Welcome to CampusCare 👋



                </h3>







                <p>



                  Manage students, rooms, attendance,



                  complaints and hostel operations from one place.



                </p>



              </div>







            </div>







            <div

              style={{

                background: 'white',

                borderRadius: '16px',

                padding: '24px',

                marginBottom: '24px',

                boxShadow: '0 5px 20px rgba(0,0,0,0.06)',

                border: '1px solid #e2e8f0'

              }}

            >

              <h3 style={{ margin: '0 0 6px', color: '#172033' }}>

                🤖 AI Attendance Prediction

              </h3>

              <p style={{ margin: 0, color: '#64748b' }}>

                Use the CampusCare ML model to predict a student's attendance status.

              </p>



              <form

                onSubmit={predictStudentAttendance}

                style={{

                  display: 'flex',

                  gap: '12px',

                  alignItems: 'center',

                  flexWrap: 'wrap',

                  marginTop: '20px'

                }}

              >

                <select

                  value={predictionStudentId}

                  onChange={(event) => {

                    setPredictionStudentId(event.target.value)

                    setAttendancePrediction('')

                    setPredictionError('')

                  }}

                  style={{

                    padding: '11px 14px',

                    border: '1px solid #cbd5e1',

                    borderRadius: '10px',

                    minWidth: '240px',

                    fontSize: '14px'

                  }}

                >

                  <option value="">Select a student</option>

                  {students.map((student) => (

                    <option key={student.student_id} value={student.student_id}>

                      {student.student_id} - {student.name}

                    </option>

                  ))}

                </select>



                <button

                  type="submit"

                  disabled={predictionLoading || !predictionStudentId}

                  style={{

                    padding: '11px 18px',

                    border: 'none',

                    borderRadius: '10px',

                    background: '#2563eb',

                    color: 'white',

                    cursor: predictionLoading || !predictionStudentId ? 'not-allowed' : 'pointer',

                    opacity: predictionLoading || !predictionStudentId ? 0.6 : 1,

                    fontWeight: '600'

                  }}

                >

                  {predictionLoading ? 'Predicting...' : 'Predict Attendance'}

                </button>

              </form>



              {attendancePrediction && (

                <div

                  style={{

                    marginTop: '18px',

                    padding: '16px',

                    borderRadius: '10px',

                    background: attendancePrediction === 'Good Attendance' ? '#ecfdf5' : '#fff7ed',

                    border: attendancePrediction === 'Good Attendance' ? '1px solid #a7f3d0' : '1px solid #fed7aa'

                  }}

                >

                  <strong style={{ color: '#172033' }}>

                    Prediction: {attendancePrediction}

                  </strong>

                </div>

              )}



              {predictionError && (

                <div

                  style={{

                    marginTop: '18px',

                    padding: '16px',

                    borderRadius: '10px',

                    background: '#fef2f2',

                    border: '1px solid #fecaca',

                    color: '#b91c1c'

                  }}

                >

                  {predictionError}

                </div>

              )}

            </div>



            <div className="dashboard-grid">







              <div className="dashboard-card">







                <div className="dashboard-card-top">



                  <div className="dashboard-card-icon blue">



                    👨‍🎓



                  </div>







                  <span>Students</span>



                </div>







                <h3>



                  {dashboard.total_students}



                </h3>







                <p>



                  Registered students



                </p>







              </div>











              <div className="dashboard-card">







                <div className="dashboard-card-top">



                  <div className="dashboard-card-icon purple">



                    🏢



                  </div>







                  <span>Rooms</span>



                </div>







                <h3>



                  {dashboard.total_rooms}



                </h3>







                <p>



                  Total hostel rooms



                </p>







              </div>











              <div className="dashboard-card">







                <div className="dashboard-card-top">



                  <div className="dashboard-card-icon orange">



                    🛏️



                  </div>







                  <span>Occupied</span>



                </div>







                <h3>



                  {dashboard.total_occupied}



                </h3>







                <p>



                  Occupied beds



                </p>







              </div>











              <div className="dashboard-card">







                <div className="dashboard-card-top">



                  <div className="dashboard-card-icon green">



                    ✓



                  </div>







                  <span>Available</span>



                </div>







                <h3>



                  {dashboard.available_beds}



                </h3>







                <p>



                  Available beds



                </p>







              </div>











              <div className="dashboard-card">







                <div className="dashboard-card-top">



                  <div className="dashboard-card-icon red">



                    ⚠️



                  </div>







                  <span>Complaints</span>



                </div>







                <h3>



                  {dashboard.total_complaints}



                </h3>







                <p>



                  Total complaints



                </p>







              </div>











              <div className="dashboard-card">







                <div className="dashboard-card-top">



                  <div className="dashboard-card-icon yellow">



                    ⏳



                  </div>







                  <span>Pending</span>



                </div>







                <h3>



                  {dashboard.pending_complaints}



                </h3>







                <p>



                  Complaints pending



                </p>







              </div>







            </div>







            <div className="dashboard-bottom-grid">







              <div className="dashboard-info-card">







                <div className="section-heading">







                  <div>



                    <h3>



                      Hostel Overview



                    </h3>







                    <p>



                      Current accommodation summary



                    </p>



                  </div>







                  <span className="info-icon">



                    🏠



                  </span>







                </div>







                <div className="overview-row">







                  <span>



                    Total rooms



                  </span>







                  <strong>



                    {dashboard.total_rooms}



                  </strong>







                </div>







                <div className="overview-row">







                  <span>



                    Occupied beds



                  </span>







                  <strong>



                    {dashboard.total_occupied}



                  </strong>







                </div>







                <div className="overview-row">







                  <span>



                    Available beds



                  </span>







                  <strong>



                    {dashboard.available_beds}



                  </strong>







                </div>







              </div>











              <div className="dashboard-info-card">







                <div className="section-heading">







                  <div>



                    <h3>



                      Complaint Overview



                    </h3>







                    <p>



                      Current complaint status



                    </p>



                  </div>







                  <span className="info-icon">



                    ⚠️



                  </span>







                </div>







                <div className="overview-row">







                  <span>



                    Total complaints



                  </span>







                  <strong>



                    {dashboard.total_complaints}



                  </strong>







                </div>







                <div className="overview-row">







                  <span>



                    Pending



                  </span>







                  <strong>



                    {dashboard.pending_complaints}



                  </strong>







                </div>







                <div className="overview-row">







                  <span>



                    Resolved



                  </span>







                  <strong>



                    {dashboard.resolved_complaints}



                  </strong>







                </div>







              </div>







            </div>







          </>



        )}







        {/* ===================================================



            STUDENTS



        ==================================================== */}







        {page === 'students' && (



          <>







            <div className="form-card">







              <div className="section-heading">







                <div>



                  <h3>



                    Add New Student



                  </h3>







                  <p>



                    Enter the student's hostel information below.



                  </p>



                </div>







                <span className="info-icon">



                  👨‍🎓



                </span>







              </div>







              <form onSubmit={addStudent}>







                <label>



                  Student Name



                </label>







                <input



                  type="text"



                  placeholder="Enter student name"



                  value={name}



                  onChange={(event) =>



                    setName(event.target.value)



                  }



                  required



                />











                <label>



                  Email Address



                </label>







                <input



                  type="email"



                  placeholder="student@example.com"



                  value={email}



                  onChange={(event) =>



                    setEmail(event.target.value)



                  }



                  required



                />











                <label>



                  Phone Number



                </label>







                <input



                  type="text"



                  placeholder="Enter phone number"



                  value={phone}



                  onChange={(event) =>



                    setPhone(event.target.value)



                  }



                />











                <label>



                  Department



                </label>







                <input



                  type="text"



                  placeholder="Example: Computer Science"



                  value={department}



                  onChange={(event) =>



                    setDepartment(event.target.value)



                  }



                />











                <label>



                  Year



                </label>







                <input



                  type="number"



                  placeholder="Example: 3"



                  min="1"



                  max="6"



                  value={year}



                  onChange={(event) =>



                    setYear(event.target.value)



                  }



                />











                <button type="submit">



                  + Add Student



                </button>







              </form>







            </div>











            <div className="list-header">







              <div>



                <h3>



                  Registered Students



                </h3>







                <p>



                  {students.length} student



                  {students.length !== 1 ? 's' : ''} registered



                </p>



              </div>







            </div>











            {students.length === 0 ? (







              <div className="empty-state">







                <div>



                  👨‍🎓



                </div>







                <h3>



                  No students found



                </h3>







                <p>



                  Add your first student using the form above.



                </p>







              </div>







            ) : (







              <div className="record-grid">







                {students.map((student) => (







                  <div



                    className="record-card"



                    key={student.student_id}



                  >







                    <div className="record-card-header">







                      <div className="avatar">



                        {student.name



                          ? student.name.charAt(0).toUpperCase()



                          : 'S'}



                      </div>







                      <div>







                        <h3>



                          {student.name}



                        </h3>







                        <span>



                          Student ID #{student.student_id}



                        </span>







                      </div>







                    </div>







                    <div className="record-details">







                      <div>



                        <span>Email</span>



                        <strong>



                          {student.email}



                        </strong>



                      </div>







                      <div>



                        <span>Phone</span>



                        <strong>



                          {student.phone || 'Not provided'}



                        </strong>



                      </div>







                      <div>



                        <span>Department</span>



                        <strong>



                          {student.department || 'Not provided'}



                        </strong>



                      </div>







                      <div>



                        <span>Year</span>



                        <strong>



                          {student.year || 'Not provided'}



                        </strong>



                      </div>







                    </div>







                  </div>







                ))}







              </div>







            )}







          </>



        )}







        {/* ===================================================



            ROOMS



        ==================================================== */}







        {page === 'rooms' && (



          <>







            <div className="form-card">







              <div className="section-heading">







                <div>



                  <h3>



                    Add New Room



                  </h3>







                  <p>



                    Create a hostel room and define its capacity.



                  </p>



                </div>







                <span className="info-icon">



                  🛏️



                </span>







              </div>







              <form onSubmit={addRoom}>







                <label>



                  Room Number



                </label>







                <input



                  type="text"



                  placeholder="Example: A104"



                  value={roomNumber}



                  onChange={(event) =>



                    setRoomNumber(event.target.value)



                  }



                  required



                />











                <label>



                  Room Capacity



                </label>







                <input



                  type="number"



                  placeholder="Example: 4"



                  min="1"



                  value={capacity}



                  onChange={(event) =>



                    setCapacity(event.target.value)



                  }



                  required



                />











                <button type="submit">



                  + Add Room



                </button>







              </form>







            </div>











            <div className="list-header">







              <div>



                <h3>



                  Hostel Rooms



                </h3>







                <p>



                  {rooms.length} room



                  {rooms.length !== 1 ? 's' : ''} configured



                </p>



              </div>







            </div>











            {rooms.length === 0 ? (







              <div className="empty-state">







                <div>



                  🛏️



                </div>







                <h3>



                  No rooms found



                </h3>







                <p>



                  Add your first hostel room using the form above.



                </p>







              </div>







            ) : (







              <div className="record-grid">







                {rooms.map((room) => (







                  <div



                    className="record-card"



                    key={room.room_id}



                  >







                    <div className="record-card-header">







                      <div className="room-icon">



                        🛏️



                      </div>







                      <div>







                        <h3>



                          Room {room.room_number}



                        </h3>







                        <span>



                          Room ID #{room.room_id}



                        </span>







                      </div>







                    </div>







                    <div className="record-details">







                      <div>



                        <span>Capacity</span>



                        <strong>



                          {room.capacity} beds



                        </strong>



                      </div>







                      <div>



                        <span>Occupied</span>



                        <strong>



                          {room.occupied} beds



                        </strong>



                      </div>







                      <div>



                        <span>Available</span>



                        <strong>



                          {Math.max(



                            room.capacity - room.occupied,



                            0



                          )} beds



                        </strong>



                      </div>







                      <div>



                        <span>Status</span>







                        <strong>



                          <span



                            className={



                              room.status === 'Available'



                                ? 'status-badge status-resolved'



                                : room.status === 'Full'



                                  ? 'status-badge status-pending'



                                  : 'status-badge status-progress'



                            }



                          >



                            {room.status}



                          </span>



                        </strong>







                      </div>







                    </div>







                    <button



                      className="delete-button"



                      onClick={() =>



                        deleteRoom(room.room_id)



                      }



                    >



                      Delete Room



                    </button>







                  </div>







                ))}







              </div>







            )}







          </>



        )}







        {/* ===================================================



            ATTENDANCE



        ==================================================== */}







        {page === 'attendance' && (



          <>







            <div className="form-card">







              <div className="section-heading">







                <div>



                  <h3>



                    Mark Attendance



                  </h3>







                  <p>



                    Record daily mess attendance for students.



                  </p>



                </div>







                <span className="info-icon">



                  ✓



                </span>







              </div>







              <form onSubmit={addAttendance}>







                <label>



                  Student



                </label>







                <select



                  value={attendanceStudent}



                  onChange={(event) =>



                    setAttendanceStudent(event.target.value)



                  }



                  required



                >







                  <option value="">



                    Select the student



                  </option>







                  {students.map((student) => (







                    <option



                      key={student.student_id}



                      value={student.student_id}



                    >



                      {student.name} - ID #{student.student_id}



                    </option>







                  ))}







                </select>











                <label>



                  Attendance Date



                </label>







                <input



                  type="date"



                  value={attendanceDate}



                  onChange={(event) =>



                    setAttendanceDate(event.target.value)



                  }



                  required



                />











                <label>



                  Attendance Status



                </label>







                <select



                  value={attendancePresent}



                  onChange={(event) =>



                    setAttendancePresent(event.target.value)



                  }



                >







                  <option value="1">



                    Present



                  </option>







                  <option value="0">



                    Absent



                  </option>







                </select>











                <button type="submit">



                  Save Attendance



                </button>







              </form>







            </div>











            <div className="list-header">







              <div>



                <h3>



                  Attendance Records



                </h3>







                <p>



                  {attendance.length} attendance record



                  {attendance.length !== 1 ? 's' : ''}



                </p>



              </div>







            </div>











            {attendance.length === 0 ? (







              <div className="empty-state">







                <div>



                  ✓



                </div>







                <h3>



                  No attendance records



                </h3>







                <p>



                  Attendance records will appear here.



                </p>







              </div>







            ) : (







              <div className="record-grid">







                {attendance.map((record) => (







                  <div



                    className="record-card"



                    key={record.attendance_id}



                  >







                    <div className="record-card-header">







                      <div className="attendance-icon">



                        {record.present === 1



                          ? '✓'



                          : '✕'}



                      </div>







                      <div>







                        <h3>



                          Attendance #{record.attendance_id}



                        </h3>







                        <span>



                          Student ID #{record.student_id}



                        </span>







                      </div>







                    </div>







                    <div className="record-details">







                      <div>



                        <span>Date</span>







                        <strong>



                          {record.attendance_date}



                        </strong>



                      </div>







                      <div>



                        <span>Status</span>







                        <strong>



                          <span



                            className={



                              record.present === 1



                                ? 'status-badge status-resolved'



                                : 'status-badge status-pending'



                            }



                          >



                            {record.present === 1



                              ? 'Present'



                              : 'Absent'}



                          </span>



                        </strong>



                      </div>







                    </div>







                    <button



                      className="delete-button"



                      onClick={() =>



                        deleteAttendance(



                          record.attendance_id



                        )



                      }



                    >



                      Delete Record



                    </button>







                  </div>







                ))}







              </div>







            )}







          </>



        )}







        {/* ===================================================



            COMPLAINTS



        ==================================================== */}







        {page === 'complaints' && (



          <>







            <div className="form-card">







              <div className="section-heading">







                <div>



                  <h3>



                    Submit New Complaint



                  </h3>







                  <p>



                    Report a hostel issue or maintenance problem.



                  </p>



                </div>







                <span className="info-icon">



                  ⚠️



                </span>







              </div>







              <form onSubmit={addComplaint}>







                <label>



                  Student



                </label>







                <select



                  value={complaintStudent}



                  onChange={(event) =>



                    setComplaintStudent(event.target.value)



                  }



                  required



                >







                  <option value="">



                    Select the student



                  </option>







                  {students.map((student) => (







                    <option



                      key={student.student_id}



                      value={student.student_id}



                    >



                      {student.name} - ID #{student.student_id}



                    </option>







                  ))}







                </select>











                <label>



                  Complaint Category



                </label>







                <select



                  value={complaintCategory}



                  onChange={(event) =>



                    setComplaintCategory(event.target.value)



                  }



                  required



                >







                  <option value="">



                    Select complaint category



                  </option>







                  <option value="Room">



                    🛏️ Room



                  </option>







                  <option value="Mess">



                    🍽️ Mess



                  </option>







                  <option value="Water">



                    💧 Water



                  </option>







                  <option value="Electricity">



                    ⚡ Electricity



                  </option>







                  <option value="Cleaning">



                    🧹 Cleaning



                  </option>







                  <option value="Maintenance">



                    🔧 Maintenance



                  </option>







                  <option value="Other">



                    📌 Other



                  </option>







                </select>











                <label>



                  Complaint Description



                </label>







                <textarea



                  placeholder="Describe the problem clearly..."



                  value={complaintDescription}



                  onChange={(event) =>



                    setComplaintDescription(event.target.value)



                  }



                  required



                  rows="5"



                />











                <button type="submit">



                  Submit Complaint



                </button>







              </form>







            </div>











            <div className="list-header">







              <div>



                <h3>



                  Complaint Records



                </h3>







                <p>



                  {complaints.length} complaint



                  {complaints.length !== 1 ? 's' : ''} recorded



                </p>



              </div>







            </div>











            {complaints.length === 0 ? (







              <div className="empty-state">







                <div>



                  ✓



                </div>







                <h3>



                  No complaints found



                </h3>
                <p>
                  There are currently no complaint records.
                </p>
              </div>
            ) : (
              <div className="complaint-list">
                {complaints.map((complaint) => (
                  <div

                    className="complaint-card"
                    key={complaint.complaint_id}
                  >
                    <div className="complaint-header">
                      <div>
                        <div className="complaint-title-row">
                          <h3>
                            Complaint #{complaint.complaint_id}
                          </h3>
                          <span
                            className={`status-badge ${getStatusClass(
                              complaint.status
                            )}`}
                          >
                            {complaint.status}
                          </span>
                        </div>
                        <p>
                          Student ID #{complaint.student_id}
                        </p>
                      </div>
                      <div className="complaint-category">
                        {complaint.category}
                      </div>
                    </div>
                    <div className="complaint-description">
                      <span>
                        DESCRIPTION
                      </span>
                      <p>
                        {complaint.description}
                      </p>
                    </div>
                    <div className="complaint-footer">
                      <div>
                        <small>
                          Created
                        </small>
                        <strong>
                          {complaint.created_at}
                        </strong>
                      </div>
                      <div className="complaint-actions">

                        <select
                          value={complaint.status}
                          onChange={(event) =>
                            updateComplaintStatus(
                              complaint.complaint_id,
                              event.target.value
                            )

                          }

                        >
                          <option value="Pending">
                            Pending
                          </option>
                          <option value="In Progress">
                            In Progress
                          </option>
                          <option value="Resolved">
                            Resolved
                          </option>

                        </select>

                        <button
                          className="delete-button"
                          onClick={() =>
                            deleteComplaint(
                              complaint.complaint_id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {/* ===================================================
            ALLOCATIONS
        ==================================================== */}

        {/* ===================================================

            SCHEDULING

        ==================================================== */}

        {page === 'scheduling' && (
          <>
            <div className="form-card">
              <div className="section-heading">
                <div>
                  <h3>Create Schedule Task</h3>
                  <p>Add a hostel task with its type and scheduled time.</p>
                </div>
                <span className="info-icon">📅</span>
              </div>

              <form onSubmit={addScheduleTask}>
                <label>Task Name</label>
                <input type="text" value={scheduleTaskName} onChange={(event) => setScheduleTaskName(event.target.value)} placeholder="Example: Room Cleaning" required />

                <label>Task Type</label>
                <select value={scheduleTaskType} onChange={(event) => setScheduleTaskType(event.target.value)} required>
                  <option value="">Select task type</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Mess">Mess</option>
                  <option value="Inspection">Inspection</option>
                  <option value="Other">Other</option>
                </select>

                <label>Scheduled Time</label>
                <input type="datetime-local" value={scheduleTime} onChange={(event) => setScheduleTime(event.target.value)} required />

                <button type="submit" disabled={scheduleLoading}>
                  {scheduleLoading ? 'Adding...' : 'Add Schedule Task'}
                </button>
              </form>
            </div>

            <div className="table-card">
              <div className="section-heading">
                <div>
                  <h3>Scheduled Tasks</h3>
                  <p>View and manage hostel tasks.</p>
                </div>
              </div>

              {scheduleTasks.length === 0 ? (
                <div className="empty-state">No scheduled tasks yet.</div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th><th>Task</th><th>Type</th><th>Scheduled Time</th><th>Status</th><th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleTasks.map((task) => (
                        <tr key={task.task_id}>
                          <td>{task.task_id}</td>
                          <td>{task.task_name}</td>
                          <td>{task.task_type}</td>
                          <td>{task.scheduled_time}</td>
                          <td>
                            <span className={task.status === 'Completed' ? 'status-resolved' : 'status-pending'}>
                              {task.status}
                            </span>
                          </td>
                          <td>
                            {task.status === 'Completed' ? (
                              <span>✓ Completed</span>
                            ) : (
                              <button type="button" onClick={() => completeScheduleTask(task.task_id)}>
                                Mark Completed
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {page === 'allocations' && (
          <>
            <div className="form-card">
              <div className="section-heading">
                <div>
                  <h3>Allocate Student to Room</h3>
                  <p>Select a student and an available room.</p>
                </div>
                <span className="info-icon">🔑</span>
              </div>

              <form onSubmit={addAllocation}>
                <label>Student</label>
                <select
                  value={allocationStudent}
                  onChange={(event) => setAllocationStudent(event.target.value)}
                  required
                >
                  <option value="">Select student</option>
                  {students
                    .filter(
                      (student) =>
                        !allocations.some(
                          (allocation) =>
                            Number(allocation.student_id) ===
                            Number(student.student_id)
                        )
                    )
                    .map((student) => (
                      <option key={student.student_id} value={student.student_id}>
                        {student.name} (ID: {student.student_id})
                      </option>
                    ))}
                </select>

                <label>Available Room</label>
                <select
                  value={allocationRoom}
                  onChange={(event) => setAllocationRoom(event.target.value)}
                  required
                >
                  <option value="">Select room</option>
                  {rooms
                    .filter(
                      (room) => Number(room.occupied) < Number(room.capacity)
                    )
                    .map((room) => (
                      <option key={room.room_id} value={room.room_id}>
                        {room.room_number} — {room.occupied}/{room.capacity} occupied
                      </option>
                    ))}
                </select>

                <button type="submit">Allocate Room</button>
              </form>
            </div>

            <div className="table-card">
              <div className="section-heading">
                <div>
                  <h3>Current Room Allocations</h3>
                  <p>View students and their assigned hostel rooms.</p>
                </div>
              </div>

              {allocations.length === 0 ? (
                <div className="empty-state">
                  <div>🛏️</div>
                  <h3>No room allocations found</h3>
                  <p>Allocate a student to a room using the form above.</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Student</th>
                        <th>Room</th>
                        <th>Allocated At</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allocations.map((allocation) => {
                        const student = students.find(
                          (item) =>
                            Number(item.student_id) ===
                            Number(allocation.student_id)
                        )

                        const room = rooms.find(
                          (item) =>
                            Number(item.room_id) === Number(allocation.room_id)
                        )

                        return (
                          <tr key={allocation.allocation_id}>
                            <td>{allocation.allocation_id}</td>
                            <td>
                              {student
                                ? `${student.name} (ID: ${student.student_id})`
                                : `Student #${allocation.student_id}`}
                            </td>
                            <td>
                              {room
                                ? `${room.room_number} (${room.occupied}/${room.capacity})`
                                : `Room #${allocation.room_id}`}
                            </td>
                            <td>{allocation.allocated_at}</td>
                            <td>
                              <button
                                type="button"
                                className="delete-button"
                                onClick={() =>
                                  deleteAllocation(allocation.allocation_id)
                                }
                              >
                                Remove Allocation
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="table-card">
              <div className="section-heading">
                <div>
                  <h3>Room Availability</h3>
                  <p>Check occupied and available beds.</p>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Room</th>
                      <th>Capacity</th>
                      <th>Occupied</th>
                      <th>Available Beds</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => {
                      const availableBeds =
                        Number(room.capacity) - Number(room.occupied)

                      return (
                        <tr key={room.room_id}>
                          <td>{room.room_number}</td>
                          <td>{room.capacity}</td>
                          <td>{room.occupied}</td>
                          <td>{availableBeds}</td>
                          <td>
                            <span
                              className={
                                availableBeds > 0
                                  ? 'status-resolved'
                                  : 'status-pending'
                              }
                            >
                              {availableBeds > 0 ? 'Available' : 'Full'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
export default App
