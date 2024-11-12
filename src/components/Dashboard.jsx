import React from 'react'
import AdminDashboard from './AdminDashboard'
import ClientDashboard from './ClientDashboard'
import NotLoggedIn from './NotLoggedIn'

function Dashboard() {
  
  return (
    <>
    {localStorage.getItem('role') == undefined && <NotLoggedIn/>}
    {(localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'accountant') && <AdminDashboard userName={localStorage.getItem('userName')} loggedInUser={localStorage.getItem('loggedInUser')} role={localStorage.getItem('role')}/>}
    {localStorage.getItem('role') === 'client' && <ClientDashboard userName={localStorage.getItem('userName')} loggedInUser={localStorage.getItem('loggedInUser')}/>}
    </>
  )
}

export default Dashboard