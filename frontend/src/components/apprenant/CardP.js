import React from 'react'
import ava from '../../assets/image/student/ava.jpg'
import "../../pages/ApprenantPage/dashboard.css"

  const userData = {
    name: 'Elrhouat chaima',
    role: 'Student',
    avatar: ava,
  }
const CardP = () => {
  return (
    <div>
      <div className="apprenant-profil-section" style={{marginTop:"20px"}}>
            <div className="apprenant-profil-content">
              <img src={userData.avatar} alt="Profile" className="apprenant-profil-avatar" />
              <div className="apprenant-profil-info">
                <h1>{userData.name}</h1>
                <span className="apprenant-student-badge">Student</span>
              </div>
            </div>
          </div>
    </div>
  )
}

export default CardP
