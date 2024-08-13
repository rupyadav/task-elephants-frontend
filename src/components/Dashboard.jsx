import React from 'react'
import AdminDashboard from './AdminDashboard'
import ClientDashboard from './ClientDashboard'

function Dashboard({open, handleFullScreenModalClose, role}) {
  return (
    <>
    {role === 'admin' && <AdminDashboard open={open} onClose={handleFullScreenModalClose} role={role} />}
    {role === 'user' && <ClientDashboard open={open} onClose={handleFullScreenModalClose} role={role} />}
    </>
  )
}

export default Dashboard