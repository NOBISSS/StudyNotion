import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CountryCode from "../../../data/countrycode.json";
import toast from "react-hot-toast";
import { ContactUs } from "../../../services/operations/contactAPI";

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitContactForm = async (data) => {
    if (data) {
      await ContactUs(data, setLoading)();
    } else {
      toast.error("Please Fill Details First");
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  return (
    <form
      onSubmit={handleSubmit(submitContactForm)}
      className="w-full max-w-[800px] mx-auto"
    >
      {/* First + Last Name */}
      <div className="flex flex-col sm:flex-row gap-5 mt-6">
        <label className="w-full">
          <span className="text-sm">First Name</span>
          <input
            type="text"
            placeholder="Enter First Name"
            autoComplete="given-name"
            className="p-3 w-full rounded-lg mt-1 bg-[#2c3139]"
            {...register("firstname", { required: true })}
          />
          {errors.firstname && (
            <span className="text-red-500 text-sm">Enter your name</span>
          )}
        </label>

        <label className="w-full">
          <span className="text-sm">Last Name</span>
          <input
            type="text"
            placeholder="Enter Last Name"
            autoComplete="family-name"
            className="p-3 w-full rounded-lg mt-1 bg-[#2c3139]"
            {...register("lastname")}
          />
        </label>
      </div>

      {/* Email */}
      <div className="mt-6">
        <label className="w-full">
          <span className="text-sm">Email Address</span>
          <input
            type="email"
            placeholder="Enter email address"
            autoComplete="email"
            className="p-3 w-full rounded-lg mt-1 bg-[#2c3139]"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">Enter your email</span>
          )}
        </label>
      </div>

      {/* Phone Number */}
      <div className="mt-6">
        <label className="text-sm">Phone Number</label>

        <div className="flex flex-col sm:flex-row gap-3 mt-1">
          {/* Country Code */}
          <select
            autoComplete="tel-country-code"
            {...register("countrycode", { required: true })}
            className="p-3 w-full sm:w-[30%] rounded-lg bg-[#2c3139]"
          >
            {CountryCode.map((element, index) => (
              <option value={element.code} key={index}>
                {element.code} - {element.country}
              </option>
            ))}
          </select>

          {/* Phone Input */}
          <input
            type="number"
            placeholder="Enter Contact Number"
            autoComplete="tel"
            className="p-3 w-full rounded-lg bg-[#2c3139]"
            {...register("phoneNo", {
              required: { value: true, message: "Enter phone number" },
              maxLength: { value: 10, message: "Invalid phone number" },
              minLength: { value: 8, message: "Invalid phone number" },
            })}
          />
        </div>

        {errors.phoneNo && (
          <span className="text-red-500 text-sm">{errors.phoneNo.message}</span>
        )}
      </div>

      {/* Message */}
      <div className="mt-6">
        <label className="text-sm">Message</label>
        <textarea
          rows={5}
          placeholder="Enter your message here"
          autoComplete="off"
          {...register("message")}
          className="resize-none p-3 w-full rounded-lg mt-1 bg-[#2c3139]"
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full mt-6 text-[16px] px-4 py-3 rounded-md font-bold 
        bg-[#FFD60A] text-black transition-all duration-200
        ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-95"}`}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactUsForm;
