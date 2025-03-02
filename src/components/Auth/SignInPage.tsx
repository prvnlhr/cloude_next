"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { login } from "@/actions/auth";
import { Spinner } from "@heroui/spinner";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "mrtnmickael@gmail.com",
      password: "mrtn@123",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const formdata = new FormData();
      formdata.append("email", data.email);
      formdata.append("password", data.password);
      await login(formdata);
    } catch (error) {
      console.log(error);
    }
  };

  const isError: boolean = false;

  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* ---------------------------- form --------------------------- */}
      <form
        className="h-[auto] w-[300px] p-[10px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Form Message group */}
        <div className="w-[full] h-[60px] flex items-center justify-center">
          <p
            className={`text-[0.8rem] ${
              isError ? "text-red-600" : "text-green-600"
            } ${
              isError ? "bg-red-200" : "bg-green-200"
            } font-semibold  px-[10px] py-[2px] rounded`}
          >
            Registration sucessfull
          </p>
        </div>

        {/* EMAIL ------------------------------------------------------------- */}
        <div className="w-full h-[auto] mb-[0px]">
          <div className="w-full h-[30px] flex items-center justify-start">
            <p className="text-[0.7rem] text-[#1C3553] font-semibold">EMAIL</p>
          </div>
          <div className="w-full h-[40px] border-[2px] border-[#E4E7EC] overflow-hidden rounded-[5px] bg-[#FAFAFA]">
            <input
              className="w-full h-full bg-transparent outline-none border-none px-[10px] text-[0.85rem]"
              type="email"
              {...register("email")}
            />
          </div>
          <div className="w-full h-[30px] flex items-center justify-start">
            {errors.email && (
              <p className="text-[0.7rem] text-[#F0142F] font-medium ml-[0px]">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* PASSWORD ----------------------------------------------------------- */}
        <div className="w-full h-[auto] mb-[0px] ">
          <div className="w-full h-[30px] flex items-center justify-start">
            <p className="text-[0.7rem] text-[#1C3553] font-semibold">
              PASSWORD
            </p>
          </div>
          <div className="w-full h-[40px] border-[2px] border-[#E4E7EC] overflow-hidden rounded-[5px] bg-[#FAFAFA]">
            <input
              className="w-full h-full bg-transparent outline-none border-none px-[10px] text-[0.85rem]"
              type="password"
              {...register("password")}
            />
          </div>
          <div className="w-full h-[30px] flex items-center justify-start">
            {errors.password && (
              <p className="text-[0.7rem] text-[#F0142F] font-medium ml-[0px]">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON ---------------------------------------------------------- */}
        <div className="w-full h-[100px] mb-[0px] flex flex-col justify-evenly items-center">
          <button
            className="w-[100%] h-[30px] border-none bg-[#635DB0] text-white text-[0.8rem] flex  justify-center items-center"
            type="submit"
          >
            {isSubmitting ? (
              <Spinner variant="gradient" color="default" size="sm" />
            ) : (
              "Sign In"
            )}
          </button>
          <p className="text-[0.8rem] text-[#1C3553] font-medium">
            Not yet registered?
            <Link
              href="/cloude/auth/sign-up"
              className="hover:text-[#635DB0] underline ml-[2px]"
            >
              SignUp
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignInPage;
