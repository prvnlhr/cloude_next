"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { signup } from "@/actions/auth";
import { Spinner } from "@heroui/spinner";
import { useState } from "react";

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
      fullName: "Martin Mickael",
      email: "mrtnmickael@gmail.com",
      password: "mrtn@123",
      confirmPassword: "mrtn@123",
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
    <div className="w-full h-full flex items-center justify-center">
      {/* ---------------------------- form --------------------------- */}
      <form
        className="h-[auto] w-[85%] sm:w-[300px]  p-[15px] border rounded
        shadow-[0px_8px_24px_rgba(149,157,165,0.2)]
        "
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Form Message group */}
        <div className="w-[full] h-[60px] flex items-center justify-center">
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

        {/* FULLNAME -------------------------------------------------------- */}
        <div className="w-full h-[auto] mb-[0px]">
          <div className="w-full h-[30px] flex items-center justify-start">
            <p className="text-[0.7rem] text-[#1C3553] font-semibold">
              FULLNAME
            </p>
          </div>
          <div className="w-full h-[40px] border-[2px] border-[#E4E7EC] overflow-hidden rounded-[5px] bg-[#FAFAFA]">
            <input
              type="text"
              className="w-full h-full bg-transparent outline-none border-none px-[0.625rem] text-[0.85rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1rem]"
              {...register("fullName")}
            />
          </div>
          <div className="w-full h-[30px] flex items-center justify-start">
            {errors.fullName && (
              <p className="text-[0.7rem] text-[#F0142F]">
                {errors.fullName.message}
              </p>
            )}
          </div>
        </div>

        {/* EMAIL ------------------------------------------------------------- */}
        <div className="w-full h-[auto] mb-[0px]">
          <div className="w-full h-[30px] flex items-center justify-start">
            <p className="text-[0.7rem] text-[#1C3553] font-semibold">EMAIL</p>
          </div>
          <div className="w-full h-[40px] border-[2px] border-[#E4E7EC] overflow-hidden rounded-[5px] bg-[#FAFAFA]">
            <input
              type="email"
              className="w-full h-full bg-transparent outline-none border-none px-[0.625rem] text-[0.85rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1rem]"
              {...register("email")}
            />
          </div>
          <div className="w-full h-[30px] flex items-center justify-start">
            {errors.email && (
              <p className="text-[0.7rem] text-[#F0142F]">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="w-full h-[auto] flex justify-between items-center mb-[0px]">
          {/* PASSWORD ----------------------------------------------------------- */}
          <div className="w-[48%] h-[auto]">
            <div className="w-full h-[30px] flex items-center justify-start">
              <p className="text-[0.7rem] text-[#1C3553] font-semibold">
                PASSWORD
              </p>
            </div>
            <div className="w-full h-[40px] border-[2px] border-[#E4E7EC] overflow-hidden rounded-[5px] bg-[#FAFAFA]">
              <input
                className="w-full h-full bg-transparent outline-none border-none px-[0.625rem] text-[0.85rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1rem]"
                type="password"
                {...register("password")}
              />
            </div>
            <div className="w-full h-[30px] flex items-center justify-start">
              {errors.password && (
                <p className="text-[0.7rem] text-[#F0142F]">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* CONFIRM PASSWORD --------------------------------------------------- */}
          <div className="w-[48%] h-[auto]">
            <div className="w-full h-[30px] flex items-center justify-start">
              <p className="text-[0.7rem] text-[#1C3553] font-semibold">
                CONFIRM PASSWORD
              </p>
            </div>
            <div className="w-full h-[40px] border-[2px] border-[#E4E7EC] overflow-hidden rounded-[5px] bg-[#FAFAFA]">
              <input
                className="w-full h-full bg-transparent outline-none border-none px-[0.625rem] text-[0.85rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1rem]"
                type="password"
                {...register("confirmPassword")}
              />
            </div>
            <div className="w-full h-[30px] flex items-center justify-start">
              {errors.confirmPassword && (
                <p className="text-[0.7rem] text-[#F0142F]">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON ---------------------------------------------------------- */}
        <div className="w-full h-[100px] mb-[0px] flex flex-col justify-evenly items-center">
          <button
            className="w-full h-[30px] rounded border-none bg-[#635DB0] text-white text-[1rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1rem] xl:text-[1rem] flex justify-center items-center"
            type="submit"
          >
            {isSubmitting ? (
              <Spinner variant="gradient" color="default" size="sm" />
            ) : (
              "Sign Up"
            )}
          </button>
          <p className="text-[0.85rem] sm:text-[0.875rem] md:text-[0.85rem] lg:text-[0.85rem] xl:text-[0.85rem] text-[#1C3553] font-medium">
            Already registered?
            <Link
              href="/cloude/auth/sign-in"
              className="hover:text-[#635DB0] underline ml-[2px]"
            >
              SignIn
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
