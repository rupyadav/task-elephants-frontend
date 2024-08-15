import React from 'react'
import AdminDashboard from './AdminDashboard'
import ClientDashboard from './ClientDashboard'

function Dashboard({open, handleFullScreenModalClose, role, userName, userID}) {
  return (
    <>
    {role === 'admin' && <AdminDashboard open={open} onClose={handleFullScreenModalClose} userName={userName}/>}
    {role === 'user' && <ClientDashboard open={open} onClose={handleFullScreenModalClose} userName={userName} userID={userID}/>}
    </>
  )
}

export default Dashboard