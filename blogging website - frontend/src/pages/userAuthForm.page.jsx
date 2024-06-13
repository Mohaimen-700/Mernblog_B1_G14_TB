import React, { useContext } from 'react';
import AnimationWrapper from '../common/page-animation';
import InputBox from '../components/input.component';
import googleIcon from '../imgs/google.png';
import { Link, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { storeInSession } from '../common/session';
import { UserContext } from "../App";
const UserAuthForm = ({ type }) => {
    const authForm =useRef();
    let {userAuth:{access_token},setUserAuth} =useContext(UserContext);
    console.log(access_token);
   
    const userAuththroughServer = (serverRoute, formData) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
            .then(({ data }) => {
                storeInSession("User", JSON.stringify(data));
                console.log(sessionStorage);
                setUserAuth(data)
            })
            .catch(({ response }) => {
                toast.error(response.data.error);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const serverRoute = type === "sign-in" ? "/signin" : "/signup";

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        const formElement = document.getElementById("formElement");
        const form = new FormData(formElement);
        const formData = {};
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        if (formData.fullname) {
            if (formData.fullname.length < 3) {
                return toast.error("Fullname must be at least 3 letters");
            }
        }

        if (!formData.email.length) {
            return toast.error("Enter the email");
        }

        if (!emailRegex.test(formData.email)) {
            return toast.error("Invalid email format");
        }

        if (!passwordRegex.test(formData.password)) {
            return toast.error("Password should be 6 to 20 characters long with at least one numeric digit, one lowercase, and one uppercase letter");
        }

        userAuththroughServer(serverRoute, formData);
    };

    return (
        access_token?
        <Navigate to ="/"/>
        :
        <AnimationWrapper>
            <section className="h-cover flex items-center justify-center">
                <Toaster />
                <form id="formElement" className="w-[80%] max-w-[400px]" onSubmit={handleSubmit}>
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                        {type === "sign-in" ? "Welcome back" : "Join us today"}
                    </h1>
                    {type !== "sign-in" && (
                        <InputBox
                            name="fullname"
                            type="text"
                            placeholder="Full Name"
                            icon="f1-rr-user"
                        />
                    )}
                    <InputBox
                        name="email"
                        type="email"
                        placeholder="Email"
                        icon="f1-rr-envelop"
                    />
                    <InputBox
                        name="password"
                        type="password"
                        placeholder="Password"
                        icon="f1-rr-key"
                    />
                    <button
                        className="btn-dark center mt-14"
                        type="submit"
                    >
                        {type.replace("-", " ")}
                    </button>
                    <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black" />
                        <p>or</p>
                        <hr className="w-1/2 border-black" />
                    </div>
                    <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
                        <img src={googleIcon} className="w-5" alt="Google Icon" />
                        continue with google
                    </button>
                    {type === "sign-in" ? (
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Don't have an account?
                            <Link to="/signup" className="underline text-black text-x1 ml-1">
                                Join us today
                            </Link>
                        </p>
                    ) : (
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Already a member?
                            <Link to="/signin" className="underline text-black text-x1 ml-1">
                                Sign in here
                            </Link>
                        </p>
                    )}
                </form>
            </section>
        </AnimationWrapper>
    );
}

export default UserAuthForm;
