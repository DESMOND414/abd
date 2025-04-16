import { Dialog } from "@headlessui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
import { useUpdateUserMutation } from "../redux/slices/api/userApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { Button, Loading, ModalWrapper, Textbox } from "./";

const AddUser = ({ open, setOpen, userData }) => {
  let defaultValues = userData ?? {};
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const dispatch = useDispatch();

  const [addNewUser, { isLoading }] = useRegisterMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const handleOnSubmit = async (data) => {
    try {
      if (userData) {
        const res = await updateUser(data).unwrap();
        console.log("User updated successfully:", res?.message);
        if (userData?._id === user?._id) {
          dispatch(setCredentials({ ...res?.user }));
        }
      } else {
        const res = await addNewUser({
          ...data,
          password: data?.email,
        }).unwrap();
        console.log("New User added successfully:", res?.message);
      }

      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (err) {
      console.error("Error:", err?.data?.message || err.error);
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="form-container">
          <Dialog.Title
            as="h2"
            className="text-xl font-bold leading-6 text-[#FFFFFF] mb-4 font-orbitron cosmic-text-large"
          >
            {userData ? "UPDATE PROFILE" : "ADD NEW CREW MEMBER"}
          </Dialog.Title>
          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Full name"
              type="text"
              name="name"
              label="Full Name"
              className="w-full rounded bg-[#1A1F2B] text-[#CFD8DC] border-[#546E7A] focus:ring-[#40C4FF]"
              labelClass="text-[#FFFFFF] cosmic-text-large"
              register={register("name", {
                required: "Full name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
              errorClass="text-[#EF5350]"
            />
            <Textbox
              placeholder="Title"
              type="text"
              name="title"
              label="Title"
              className="w-full rounded bg-[#1A1F2B] text-[#CFD8DC] border-[#546E7A] focus:ring-[#40C4FF]"
              labelClass="text-[#FFFFFF] cosmic-text-large"
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
              errorClass="text-[#EF5350]"
            />
            <Textbox
              placeholder="Email Address"
              type="email"
              name="email"
              label="Email Address"
              className="w-full rounded bg-[#1A1F2B] text-[#CFD8DC] border-[#546E7A] focus:ring-[#40C4FF]"
              labelClass="text-[#FFFFFF] cosmic-text-large"
              register={register("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
              errorClass="text-[#EF5350]"
            />
            <Textbox
              placeholder="Role"
              type="text"
              name="role"
              label="Role"
              className="w-full rounded bg-[#1A1F2B] text-[#CFD8DC] border-[#546E7A] focus:ring-[#40C4FF]"
              labelClass="text-[#FFFFFF] cosmic-text-large"
              register={register("role", {
                required: "User role is required!",
              })}
              error={errors.role ? errors.role.message : ""}
              errorClass="text-[#EF5350]"
            />
          </div>

          {isLoading || isUpdating ? (
            <div className="py-5">
              <Loading />
            </div>
          ) : (
            <div className="py-3 mt-4 sm:flex sm:flex-row-reverse gap-4">
              <Button
                type="submit"
                className="bg-[#40C4FF] px-8 text-sm font-semibold text-[#252A36] hover:bg-[#26A69A] sm:w-auto font-orbitron cosmic-button-glow"
                label="Submit"
              />
              <Button
                type="button"
                className="bg-[#1A1F2B] px-8 text-sm font-semibold text-[#CFD8DC] sm:w-auto border border-[#546E7A] hover:bg-[#546E7A]/20 font-orbitron"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddUser;