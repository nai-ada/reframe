import LoginAuthForm from "../components/LoginAuthForm";
import { Link } from "react-router-dom";
import LeafIcon from "../assets/images/leaf.svg";
import PageTransition from "../components/PageTransition";

function LoginPage() {
  return (
    <>
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-b from-[#DCFFFB] via-[#F6FFF1] to-white overflow-x-hidden">
          <div className="justify-center flex-column">
            <div className="logo-container flex justify-center">
              <h1 className="logo mt-20">
                Refra:<span className="logo-highlight font-extralight">me</span>
              </h1>
            </div>
            <div className="slogan-container flex justify-center">
              <h2 className="slogan text-center text-[18px]">
                Your journey to a positive mindset
              </h2>
            </div>
            <div className="leaf-icon flex justify-center mt-10">
              <img
                src={LeafIcon}
                alt="leaf icon"
                className="w-[150px] max-w-full"
              ></img>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-xs px-7">
                <h2 className="create-title mt-16 text-left text-[26px]">
                  Login
                </h2>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <LoginAuthForm />
            </div>
          </div>
          <div className="mb-32 mt-10 flex justify-center">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#A7CFB8] underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </PageTransition>
    </>
  );
}

export default LoginPage;
