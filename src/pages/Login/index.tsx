import React from 'react';
import { authUri } from '../../constants/Uri/config';
import makeRequest from '../../utils/makeRequest';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

interface LoginProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const routeChange = () =>{ 
    const path = '/home'; 
    navigate(path);
  };
  const [register, setRegister] = React.useState(false);
  const [empNo, setEmpNo] = React.useState('');
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState('');
  const [contact, setContact] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleEmpNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmpNo(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact(e.target.value);
  };

  const LoginRequest = async (email: string, password: string) => {
    const response = await makeRequest(
      authUri.login,
      'POST',
      {
        email,
        password,
      },
    );
    setRegister(false);
    return response;
  };
  
  const RegisterRequest = async (
    email: string,
    password: string,
    empNo: string,
    name: string,
    role: string,
    contact: string) => {
    makeRequest(
      authUri.register,
      'POST',
      {
        email,
        password,
        empNo,
        name,
        role,
        contact,
      },
    ).then((response) => {
      if(!response.error){
        setRegister(false);
        toast.success('Successfully registered! You can now log in.');
      }
      else {
        toast.error('Please fill all the fields');
      }
    }
    ).catch((error) => {
      console.log(error);
    }
    );
  };

  const registerHandler = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    return await RegisterRequest(
      email,
      password,
      empNo,
      name,
      role,
      contact
    );
  };
    
  const loginHandler = async () => {
    const response = await LoginRequest(email, password);
    if (response.success) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('email', JSON.stringify(response.email));
      setIsLoggedIn(true);
      routeChange();
    } else {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div>
      { !register ? (
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-[90vh] lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
                </h1>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" 
                    onChange={handleEmailChange}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    onChange={handlePasswordChange}
                  />
                </div>
                <button type="submit" className="w-full text-black bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  onClick={loginHandler}
                >Sign in</button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  <button type='submit' className="font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={() => {
                    // setPassword('');
                    // setEmail('');
                    setRegister(true);
                  }}>Don`t have an account yet? </button>
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-[90vh] lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create an account
                </h1>
                <div className='flex flex-row gap-x-10'>
                  <div className=''>
                    <span className="text-s font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                  Account Details
                    </span>
                    <div className='pb-5'>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" 
                        onChange={handleEmailChange}
                      />
                    </div>
                    <div className='pb-5'>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className='pb-5'>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                      <input type="password" name="confirmpassword" id="confirmpassword" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        onChange={handleConfirmPasswordChange}
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-m font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                  Work Details
                    </h2>
                    <div className='pb-5'>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Employee No</label>
                      <input type="empno" name="empno" id="empno" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123456789" 
                        onChange={handleEmpNoChange}
                      />
                    </div>
                    <div className='pb-5'>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
                      <input type="name" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Firstname Lastname" 
                        onChange={handleNameChange}
                      />
                    </div>
                    <div className='pb-5'>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                      <input type="role" name="role" id="role" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Engineer I" 
                        onChange={handleRoleChange}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact No</label>
                      <input type="contact" name="contact" id="contact" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="9876543210" 
                        onChange={handleContactChange}
                      />
                    </div>
                  </div>
                </div>
                <button type="submit" className="bg-gray-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={registerHandler}
                >Sign up</button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                   Already have an account? <button type="submit" className="font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={() => {
                    // setEmpNo('');
                    // setName('');
                    // setRole('');
                    // setContact('');
                    // setEmail('');
                    // setPassword('');
                    // setConfirmPassword('');
                    setRegister(false);
                    window.location.reload();
                  }}>Login here</button>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
      <ToastContainer/>
    </div>
  );
};