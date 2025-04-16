import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button, Loading, Textbox } from "../components";
import { useLoginMutation } from "../redux/slices/api/authApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import bgImage from "/src/bg.jpg";

const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [showVideo, setShowVideo] = useState(false);

  const handleLogin = async (data) => {
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials(res));

      // Show the video before navigating
      setShowVideo(true);

      // Video duration before redirection
      setTimeout(() => {
        navigate("/dashboard");
      }, 5000); // Adjust time based on video length
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row cosmic-container"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {showVideo ? (
        // Show video if showVideo is true
        <div className="w-full h-screen flex items-center justify-center bg-[#1A1F2B]">
          <video
            autoPlay
            onEnded={() => navigate("/dashboard")} // Redirect after video ends
            className="w-full h-full object-cover"
          >
            <source src="/solar.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
          <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
            <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
              <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-[#546E7A] text-[#CFD8DC] bg-[#252A36]/70 backdrop-blur-sm">
                Manage all your tasks in one place!
              </span>
              <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-[#FFFFFF] drop-shadow-[0_1px_3px_rgba(64,196,255,0.5)]">
                <span>Mission Control</span>
                <span>Task Manager</span>
              </p>
              <div className="cell">
                <div className="circle rotate-in-up-left cosmic-circle"></div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
            <form
              onSubmit={handleSubmit(handleLogin)}
              className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-[#252A36]/80 backdrop-blur-sm border border-[#546E7A]/50 px-10 pt-14 pb-14 rounded-xl shadow-lg cosmic-card"
            >
              <div>
                <p className="text-[#40C4FF] text-3xl font-bold text-center drop-shadow-md">
                  Welcome back!
                </p>
                <p className="text-center text-base text-[#CFD8DC] mt-2">
                  Keep all your credentials safe!
                </p>
              </div>
              <div className="flex flex-col gap-y-5">
                <Textbox
                  placeholder="you@example.com"
                  type="email"
                  name="email"
                  label="Email Address"
                  labelClassName="text-[#CFD8DC]"
                  className="w-full rounded-lg bg-[#1A1F2B] border-[#546E7A] text-white focus:ring-2 focus:ring-[#40C4FF]"
                  register={register("email", {
                    required: "Email Address is required!",
                  })}
                  error={errors.email ? errors.email.message : ""}
                />
                <Textbox
                  placeholder="password"
                  type="password"
                  name="password"
                  label="Password"
                  labelClassName="text-[#CFD8DC]"
                  className="w-full rounded-lg bg-[#1A1F2B] border-[#546E7A] text-white focus:ring-2 focus:ring-[#40C4FF]"
                  register={register("password", {
                    required: "Password is required!",
                  })}
                  error={errors.password ? errors.password?.message : ""}
                />
                <span className="text-sm text-[#CFD8DC] hover:text-[#40C4FF] transition-colors cursor-pointer">
                  Forgot Password?
                </span>
              </div>
              {isLoading ? (
                <Loading />
              ) : (
                <Button
                  type="submit"
                  label="Log in"
                  className="w-full h-12 bg-[#40C4FF] hover:bg-[#26A69A] text-white rounded-lg transition-all shadow-md hover:shadow-[#40C4FF]/50"
                />
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;