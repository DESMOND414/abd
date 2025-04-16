import { Dialog } from "@headlessui/react";
import React from "react";
import { useForm } from "react-hook-form";

import { useCreateSubTaskMutation } from "../../redux/slices/api/taskApiSlice";
import Button from "../Button";
import Loading from "../Loading";
import ModalWrapper from "../ModalWrapper";
import Textbox from "../Textbox";

const AddSubTask = ({ open, setOpen, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [addSbTask, { isLoading }] = useCreateSubTaskMutation();

  const handleOnSubmit = async (data) => {
    try {
      const res = await addSbTask({ data, id }).unwrap();
      console.log("Sub-task added successfully:", res.message);

      setTimeout(() => {
        setOpen(false);
      }, 500);
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
            ADD SUB-TASK
          </Dialog.Title>
          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Sub-Task title"
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

            <div className="flex items-center gap-4">
              <Textbox
                placeholder="Date"
                type="date"
                name="date"
                label="Task Date"
                className="w-full rounded bg-[#1A1F2B] text-[#CFD8DC] border-[#546E7A] focus:ring-[#40C4FF]"
                labelClass="text-[#FFFFFF] cosmic-text-large"
                register={register("date", {
                  required: "Date is required!",
                })}
                error={errors.date ? errors.date.message : ""}
                errorClass="text-[#EF5350]"
              />
              <Textbox
                placeholder="Tag"
                type="text"
                name="tag"
                label="Tag"
                className="w-full rounded bg-[#1A1F2B] text-[#CFD8DC] border-[#546E7A] focus:ring-[#40C4FF]"
                labelClass="text-[#FFFFFF] cosmic-text-large"
                register={register("tag", {
                  required: "Tag is required!",
                })}
                error={errors.tag ? errors.tag.message : ""}
                errorClass="text-[#EF5350]"
              />
            </div>
          </div>
          {isLoading ? (
            <div className="mt-8">
              <Loading />
            </div>
          ) : (
            <div className="py-3 mt-4 flex sm:flex-row-reverse gap-4">
              <Button
                type="submit"
                className="bg-[#40C4FF] px-8 text-sm font-semibold text-[#252A36] hover:bg-[#26A69A] sm:w-auto font-orbitron cosmic-button-glow"
                label="Add Task"
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

export default AddSubTask;