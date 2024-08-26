import React from 'react'
import AdminDashboard from './AdminDashboard'
import ClientDashboard from './ClientDashboard'

function Dashboard({open, handleFullScreenModalClose, role, userName, userID}) {
  return (
    <>
    {(role === 'admin' || role === 'accountant') && <AdminDashboard open={open} onClose={handleFullScreenModalClose} userName={userName} userID={userID} role={role}/>}
    {role === 'client' && <ClientDashboard open={open} onClose={handleFullScreenModalClose} userName={userName} userID={userID}/>}
    </>
  )
}

export default Dashboard