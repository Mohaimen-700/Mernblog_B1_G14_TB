import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import logo from '../imgs/logo.png';

const Navbar = () => {
    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);

    return (
        <>
            <nav className="navbar relative">
                {/* Logo */}
                <Link to="/" className="flex-none w-10">
                    <img src={logo} className="w-full" alt="Logo" />
                </Link>

                {/* Search Box */}
                <div className={`absolute bg-white w-full left-0 top-full mt-0 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto ${searchBoxVisibility ? 'block' : 'hidden'} md:block`}>
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
                    />
                    <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 transform -translate-y-1/2 text-xl text-dark-grey"></i>
                </div>

                {/* Buttons and Links */}
                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    {/* Button for toggling search box visibility */}
                    <button
                        className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
                        onClick={() => setSearchBoxVisibility(currentVal => !currentVal)}
                    >
                        <i className="fi fi-rr-search text-xl"></i>
                    </button>

                    {/* Links for writing/editing */}
                    <Link to="/editor" className="hidden md:flex gap-2 link">
                        <i className='fi fi-rr-file-edit'></i>
                        <p>Write</p>
                    </Link>

                    {/* Sign In link */}
                    <Link to="/signin" className="btn-dark py-2">
                        Sign In
                    </Link>

                    {/* Sign Up link */}
                    <Link to="/signup" className="btn-light py-2 hidden md:block">
                        Sign Up
                    </Link>
                </div>
            </nav>
            <Outlet />
        </>
    );
}

export default Navbar;
