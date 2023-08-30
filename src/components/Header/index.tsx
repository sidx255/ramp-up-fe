import React from 'react'; 

interface HeaderProps {
  loggedIn: boolean;
  setIsLoggedIn: any
}

export const Header: React.FC<HeaderProps> = ({ loggedIn, setIsLoggedIn }) => {
  const handleLogOut = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <div>
      <div className='bg-gray-200 p-4 pl-4 pr-4 flex justify-between items-center'>
        <div className='font-bold text-2xl'>
          <span className=''>GetARoom</span>
          
        </div>
        {
          loggedIn &&
          <div className='flex space-x-1'>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            Home
            </button>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            Teams
            </button>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            Rooms
            </button>
            <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
              onClick={handleLogOut}
            >
            Logout
            </button>

          </div>
        }

      </div>
    </div>  
  );
};

