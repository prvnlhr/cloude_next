"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { signup } from "@/actions/auth";
import { Spinner } from "@heroui/spinner";
import { useState } from "react";
import BannerSvg from "./BannerSvg";
import AppLogo from "../Layout/Sidebar/AppLogo";

const signUpSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const formdata = new FormData();
      formdata.append("email", data.email);
      formdata.append("password", data.password);
      formdata.append("fullName", data.fullName);
      const result = await signup(formdata);

      if (result && !result.success) {
        setErrorMessage(result.message);
        setSuccessMessage(null);
      } else {
        setSuccessMessage(result.message);
        setErrorMessage(null);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setSuccessMessage(null);
    }
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
                    <p className="text-[0.65rem] font-medium">FULLNAME</p>
                  </div>
                  <div className="w-full h-[60%]">
                    <input
                      type="text"
                      className="w-full h-full bg-transparent outline-none border-none text-[0.85rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1rem]"
                      {...register("fullName")}
                    />
                  </div>
                </div>
                <div className="w-full h-[20px] flex items-center justify-start">
                  {errors.fullName && (
                    <p className="text-[0.7rem] text-[#F0142F]">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
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
              <div className="w-full h-[22%] flex mb-[5px]">
                <div className="w-[48%] h-full flex flex-col mr-[2%]">
                  <div className="w-full h-[calc(100%-25px)] bg-[#E7EFFC] px-[10px] rounded-[8px]">
                    <div className="w-full h-[40%] flex items-end">
                      <p className="text-[0.65rem] font-medium">PASSWORD</p>
                    </div>
                    <div className="w-full h-[60%]">
                      <input
                        className="w-full h-full bg-transparent outline-none border-none text-[0.85rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1rem]"
                        type="password"
                        {...register("password")}
                      />
                    </div>
                  </div>
                  <div className="w-full h-[25px] flex items-center justify-start">
                    {errors.password && (
                      <p className="text-[0.7rem] text-[#F0142F]">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-[48%] h-full flex flex-col ml-[2%]">
                  <div className="w-full h-[calc(100%-25px)] bg-[#E7EFFC] px-[10px] rounded-[8px]">
                    <div className="w-full h-[40%] flex items-end">
                      <p className="text-[0.65rem] font-medium whitespace-nowrap">
                        CONFIRM PASSWORD
                      </p>
                    </div>
                    <div className="w-full h-[60%]">
                      <input
                        className="w-full h-full bg-transparent outline-none border-none text-[0.85rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1rem]"
                        type="password"
                        {...register("confirmPassword")}
                      />
                    </div>
                  </div>
                  <div className="w-full h-[25px] flex items-center justify-start">
                    {errors.confirmPassword && (
                      <p className="text-[0.7rem] text-[#F0142F]">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full h-[15%] flex flex-col items-center justify-between">
                <button
                  className="w-[95%] h-[30px] rounded border-none bg-[#4F85F3] text-white text-[0.9rem] sm:text-[0.8rem] md:text-[0.9rem] lg:text-[0.9rem] xl:text-[0.9rem] flex justify-center items-center"
                  type="submit"
                >
                  {isSubmitting ? (
                    <Spinner
                    variant="dots"
                    color="default"
                    classNames={{ dots: "bg-white" }}
                  />
                  ) : (
                    "Sign Up"
                  )}
                </button>
                <p className="text-[0.85rem] sm:text-[0.875rem] md:text-[0.85rem] lg:text-[0.85rem] xl:text-[0.85rem] text-[#1C3553] font-medium">
                  Already registered?
                  <Link
                    href="/cloude/auth/sign-in"
                    className="hover:text-[#4F85F3] underline ml-[2px]"
                  >
                    SignIn
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
