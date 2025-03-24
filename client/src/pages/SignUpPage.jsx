import SignUpAuthForm from "../components/SignupAuthForm";
import { Link } from "react-router-dom";
import LeafIcon from "../assets/images/leaf.svg";
import PageTransition from "../components/PageTransition";
import { useEffect } from "react";

function SignUpPage() {
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <PageTransition>
      <div className="h-screen relative bg-gradient-to-b from-[#DCFFFB] via-[#F6FFF1] to-white overflow-hidden">
        <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs">
          <div className="flex items-center justify-center">
            <h1 className="logo text-[36px] mr-1">
              Refra:<span className="logo-highlight font-thin">me</span>
            </h1>
            <img
              src={LeafIcon}
              alt="leaf icon"
              className="w-[36px] self-center -mt-1"
            />
          </div>

          <h2 className="slogan font-figtree text-[14px] my-4 text-center">
            Your journey to a positive mindset
          </h2>

          <img
            src={LeafIcon}
            alt="leaf icon"
            className="w-[80px] mx-auto mb-6"
          />

          <div className="w-full px-6">
            <h2 className="text-left text-[20px] mb-8">Sign Up</h2>
            <SignUpAuthForm />
          </div>

          <div className="mt-4 text-center">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-[#4D8B67] underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default SignUpPage;
