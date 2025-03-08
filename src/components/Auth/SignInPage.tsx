"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { login } from "@/actions/auth";
import { Spinner } from "@heroui/spinner";
import { useState } from "react";
import BannerSvg from "./BannerSvg";
import AppLogo from "../Layout/Sidebar/AppLogo";
const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: SignInFormData) => {
    try {
      const formdata = new FormData();
      formdata.append("email", data.email);
      formdata.append("password", data.password);
      const result = await login(formdata);
      if (result && !result.success) {
        setErrorMessage(result.message);
        setSuccessMessage(null);
      } else {
        setSuccessMessage(result.message);
        setErrorMessage(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickDemoCredentials = () => {
    setValue("email", "johndoe@gmail.com");
    setValue("password", "jjdoe@123");
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#F3F7FA]">
      <div className="w-[90%] h-[65%] bg-white flex sm:w-[75%] sm:h-[75%]">
        <div className="hidden sm:flex w-auto h-full items-center justify-center p-[10px] flex-shrink-0">
          <BannerSvg />
        </div>
        <div className="flex-grow h-full p-[10px]">
          <div className="w-full h-[80px] flex flex-col items-start justify-center">
            <div className="w-auto h-[50%] flex items-center">
              <AppLogo />
            </div>
          </div>
          <div className="w-full h-[calc(100%-80px)] flex justify-center">
            <form
              className="flex flex-col w-[95%] sm:w-[75%] items-center justify-start"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="w-full h-[10%] flex items-center justify-center">
                {errorMessage && (
                  <p className="text-[0.8rem] text-red-600 bg-red-200 font-semibold px-[10px] py-[2px] rounded">
                    {errorMessage}
                  </p>
                )}
                {successMessage && (
                  <p className="text-[0.8rem] text-green-600 bg-green-200 font-semibold px-[10px] py-[2px] rounded">
                    {successMessage}
                  </p>
                )}
              </div>

              <div className="w-full h-[20%]">
                <div className="w-full h-[calc(100%-20px)] bg-[#E7EFFC] px-[10px] rounded-[8px]">
                  <div className="w-full h-[40%] flex items-end">
                    <p className="text-[0.65rem] font-medium">EMAIL</p>
                  </div>
                  <div className="w-full h-[60%]">
                    <input
                      type="email"
                      className="w-full h-full bg-transparent outline-none border-none text-[0.85rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1rem]"
                      {...register("email")}
                    />
                  </div>
                </div>
                <div className="w-full h-[20px] flex items-center justify-start">
                  {errors.email && (
                    <p className="text-[0.7rem] text-[#F0142F]">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full h-[20%]">
                <div className="w-full h-[calc(100%-20px)] bg-[#E7EFFC] px-[10px] rounded-[8px]">
                  <div className="w-full h-[40%] flex items-end">
                    <p className="text-[0.65rem] font-medium">PASSWORD</p>
                  </div>
                  <div className="w-full h-[60%]">
                    <input
                      type="password"
                      className="w-full h-full bg-transparent outline-none border-none text-[0.85rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1rem]"
                      {...register("password")}
                    />
                  </div>
                </div>
                <div className="w-full h-[20px] flex items-center justify-start">
                  {errors.password && (
                    <p className="text-[0.7rem] text-[#F0142F]">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-[95%] h-[15%] flex flex-col items-center justify-between">
                <button
                  className="w-full h-[30px] rounded border-none bg-[#4F85F3] text-white text-[0.9rem] sm:text-[0.8rem] md:text-[0.9rem] lg:text-[0.9rem] xl:text-[0.9rem] flex justify-center items-center"
                  type="submit"
                >
                  {isSubmitting ? (
                    <Spinner variant="gradient" color="default" size="sm" />
                  ) : (
                    "Sign In"
                  )}
                </button>
                <p className="text-[0.85rem] sm:text-[0.875rem] md:text-[0.85rem] lg:text-[0.85rem] xl:text-[0.85rem] text-[#1C3553] font-medium">
                  Not yet registered?
                  <Link
                    href="/cloude/auth/sign-up"
                    className="hover:text-[#4F85F3] underline ml-[2px]"
                  >
                    SignUp
                  </Link>
                </p>
              </div>
              <div className="w-full h-[15%] flex flex-col items-center justify-evenly">
                <button
                  type="button"
                  onClick={handleClickDemoCredentials}
                  className="w-auto h-[30px] ml-auto mr-auto bg-[#F7F7F7] justify-center items-center text-[0.8rem] font-medium px-[15px] text-[#4F85F3] rounded"
                >
                  Demo Account Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
