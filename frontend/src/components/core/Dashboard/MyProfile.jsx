import { useSelector } from 'react-redux'
import { IconBtn } from '../../common/IconBtn';

const MyProfile = () => {
    const { user } = useSelector((state) => state.profile);
    return (
        <div className='OUTTER DIV text-white py-5 px-7 md:px-10 lg:w-[80vw] '>
            <div className='INNER-DIV flex flex-col gap-10 py-5 px-10'>
                <h1 className='text-2xl mb-5 md:text-3xl   font-semibold'>
                    My Profile
                </h1>

  return (
    <div className="text-white py-6 px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1200px] mx-auto">
      <div className="flex flex-col gap-8">
        {/* TITLE */}
        <h1 className="text-2xl md:text-3xl font-semibold">My Profile</h1>

        {/* PROFILE CARD */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6 bg-[#161D29] rounded-md">
          <div className="flex items-center gap-4">
            <img
              src={user?.additionalDetails?.profilePicture}
              alt={`profile-${user?.firstName}`}
              className="w-[60px] sm:w-[75px] aspect-square rounded-full object-cover"
            />

            <div>
              <h3 className="text-lg sm:text-xl font-semibold">
                {user?.firstName + " " + user?.lastName}
              </h3>
              <p className="text-[#838894] text-sm sm:text-base">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="self-start sm:self-auto">
            <IconBtn
              text="Edit"
              iconName="VscEdit"
              active={1}
              linkto={"/dashboard/settings"}
            />
          </div>
        </div>

        {/* ABOUT */}
        <div className="flex flex-col gap-6 p-6 bg-[#161D29] rounded-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-lg sm:text-xl font-semibold">About</h3>

            <IconBtn
              text="Edit"
              iconName="VscEdit"
              active={1}
              linkto={"/dashboard/settings"}
            />
          </div>

          <p className="text-[#838894] text-sm sm:text-base">
            {user?.additionalDetails?.about || "Write something about yourself"}
          </p>
        </div>

        {/* PERSONAL DETAILS */}
        <div className="flex flex-col gap-6 p-6 bg-[#161D29] rounded-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-lg sm:text-xl font-semibold">
              Personal Details
            </h3>

            <IconBtn
              text="Edit"
              iconName="VscEdit"
              active={1}
              linkto={"/dashboard/settings"}
            />
          </div>

          {/* GRID LAYOUT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[#6E727F] text-sm">First Name</p>
                <p>{user?.firstName ?? "Add Your First Name"}</p>
              </div>

              <div>
                <p className="text-[#6E727F] text-sm">Email</p>
                <p>{user?.email ?? "Add Your Email"}</p>
              </div>

              <div>
                <p className="text-[#6E727F] text-sm">Gender</p>
                <p>{user?.additionalDetails?.gender || "Add Your Gender"}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[#6E727F] text-sm">Last Name</p>
                <p>{user?.lastName ?? "Add Your Last Name"}</p>
              </div>

              <div>
                <p className="text-[#6E727F] text-sm">Phone Number</p>
                <p>
                  {user?.additionalDetails?.contactNumber ??
                    "Add Your Contact Number"}
                </p>
              </div>

              <div>
                <p className="text-[#6E727F] text-sm">Date Of Birth</p>
                <p>
                  {user?.additionalDetails?.birthdate?.split("T")[0] ??
                    "Add Date Of Birth"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
