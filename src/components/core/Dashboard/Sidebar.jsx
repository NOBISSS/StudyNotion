import React from 'react'
import { sidebarLinks } from '../../../data/dashboard-links'
import { logout } from '../../../services/operations/authAPI'
import { useSelector } from 'react-redux'
import SideBarLink from './SideBarLink'

const Sidebar = () => {

  const {user,loading:profileLoading}=useSelector((state)=>state.profile)
  const {loading:authLoading}=useSelector((state)=>state.auth);

  if(profileLoading || authLoading){
        return (
            <div className='mt-10'>
                Loading...
            </div>
        )
    }

  return (
    <div className='w-[16.5%]'>
    <div className='flex m-w-[250px] flex-col border-r-[1px] border-r-[#000917] h-[calc(100vh-3.5rem)] bg-[#161D29] py-10 '
    >
      <div className='flex flex-col'>
          {
            sidebarLinks.map((link,index)=>{
              if(link.type && user?.accountType !== link.type)return null;
              return(
                <SideBarLink link={link} iconName={link.icon} key={link.id}/>
              )
            })
          }
      </div>
      <div className='mx-auto mt-5 mb-6 h-[1px] w-10/12 bg-[#000917]'></div>
      <div className='flex flex-col'>
          <SideBarLink
          link={{name:"settings",path:"/dashboard/settings"}}
          iconName="VscSettingsGear"
          />
      </div>
    </div>
    </div>
  )
}

export default Sidebar