import { Dialog } from "@headlessui/react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BiImages } from "react-icons/bi";
import axios from "axios";

import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import { dateFormatter } from "../../utils";
import { app } from "../../utils/firebase";
import Button from "../Button";
import Loading from "../Loading";
import ModalWrapper from "../ModalWrapper";
import SelectList from "../SelectList";
import Textbox from "../Textbox";
import UserList from "./UsersSelect";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const uploadedFileURLs = [];

const uploadFile = async (file) => {
  const storage = getStorage(app);

  const name = new Date().getTime() + file.name;
  const storageRef = ref(storage, name);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log("Uploading");
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            uploadedFileURLs.push(downloadURL);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      }
    );
  });
};

const AddTask = ({ open, setOpen, task }) => {
  const defaultValues = {
    title: task?.title || "",
    date: dateFormatter(task?.date || new Date()),
    team: [],
    group: null,
    stage: "",
    priority: "",
    assets: [],
    description: "",
    links: "",
    assignType: "individual", // new field for assignment type
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [team, setTeam] = useState(task?.team || []);
  const [group, setGroup] = useState(task?.group || null);
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORIRY[2]
  );
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [assignType, setAssignType] = useState("individual"); // new state for assignment type

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const URLS = task?.assets ? [...task.assets] : [];

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const { data } = await axios.get("/api/group", config);
        setGroups(data);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      }
    };
    fetchGroups();
  }, []);

  const handleOnSubmit = async (data) => {
    for (const file of assets) {
      setUploading(true);
      try {
        await uploadFile(file);
      } catch (error) {
        console.error("Error uploading file:", error.message);
        return;
      } finally {
        setUploading(false);
      }
    }

    try {
      const newData = {
        ...data,
        assets: [...URLS, ...uploadedFileURLs],
        team: assignType === "individual" ? team : [],
        group: assignType === "group" ? group : null,
        stage,
        priority,
        assignType,
      };
      console.log(data, newData);
      const res = task?._id
        ? await updateTask({ ...newData, _id: task._id }).unwrap()
        : await createTask(newData).unwrap();

      console.log("Task operation successful:", res.message);

      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (err) {
      console.error("Error:", err?.data?.message || err.error);
    }
  };

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="form-container">
          <Dialog.Title
            as="h2"
            className="text-xl font-bold leading-6 text-[#FFFFFF] mb-4 font-orbitron cosmic-text-large"
          >
            {task ? "UPDATE MISSION" : "ADD MISSION"}
          </Dialog.Title>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Mission title"
              type="text"
              name="title"
              label="Mission Title"
              className="w-full rounded bg-[#1A1F2B] text-[#CFD8DC] border-[#546E7A] focus:ring-[#40C4FF]"
              labelClass="text-[#FFFFFF] cosmic-text-large"
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
              errorClass="text-[#EF5350]"
            />
            <SelectList
              label="Assign to"
              lists={["Individual", "Group"]}
              selected={assignType === "individual" ? "Individual" : "Group"}
              setSelected={(val) => {
                setAssignType(val.toLowerCase());
                if (val.toLowerCase() === "individual") {
                  setGroup(null);
                } else {
                  setTeam([]);
                }
              }}
              className="cosmic-select"
              labelClass="text-[#FFFFFF] cosmic-text-large"
            />
            {assignType === "individual" ? (
              <UserList setTeam={setTeam} team={team} />
            ) : (
              <SelectList
                label="Assign to Group"
                lists={groups.map((g) => g.name)}
                selected={group ? groups.find((g) => g._id === group)?.name : ""}
                setSelected={(name) => {
                  const selectedGroup = groups.find((g) => g.name === name);
                  setGroup(selectedGroup ? selectedGroup._id : null);
                }}
                className="cosmic-select"
                labelClass="text-[#FFFFFF] cosmic-text-large"
              />
            )}
            <div className="flex gap-4">
              <SelectList
                label="Mission Stage"
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
                className="cosmic-select"
                labelClass="text-[#FFFFFF] cosmic-text-large"
              />
              <SelectList
                label="Priority Level"
                lists={PRIORIRY}
                selected={priority}
                setSelected={setPriority}
                className="cosmic-select"
                labelClass="text-[#FFFFFF] cosmic-text-large"
              />
            </div>
            <div className="flex gap-4">
              <div className="w-full">
                <Textbox
                  placeholder="Date"
                  type="date"
                  name="date"
                  label="Mission Date"
                  className="w-full rounded bg-[#1A1F2B] text-[#CFD8DC] border-[#546E7A] focus:ring-[#40C4FF]"
                  labelClass="text-[#FFFFFF] cosmic-text-large"
                  register={register("date", {
                    required: "Date is required!",
                  })}
                  error={errors.date ? errors.date.message : ""}
                  errorClass="text-[#EF5350]"
                />
              </div>
              <div className="w-full flex items-center justify-center mt-4">
                <label
                  className="flex items-center gap-1 text-base text-[#CFD8DC] hover:text-[#40C4FF] cursor-pointer my-4 cosmic-file-label"
                  htmlFor="imgUpload"
                >
                  <input
                    type="file"
                    className="hidden"
                    id="imgUpload"
                    onChange={(e) => handleSelect(e)}
                    accept=".jpg, .png, .jpeg"
                    multiple={true}
                  />
                  <BiImages />
                  <span>Add Assets</span>
                </label>
              </div>
            </div>

            <div className="w-full">
              <p className="text-[#FFFFFF] cosmic-text-large">Mission Description</p>
              <textarea
                name="description"
                {...register("description")}
                className="w-full bg-[#1A1F2B] px-3 py-1.5 2xl:py-3 border border-[#546E7A] text-[#CFD8DC] outline-none text-base focus:ring-2 ring-[#40C4FF] rounded"
              ></textarea>
            </div>

            <div className="w-full">
              <p className="text-[#FFFFFF] cosmic-text-large">
                Add Links{" "}
                <span className="text-sm text-[#CFD8DC]">
                  separated by comma (,)
                </span>
              </p>
              <textarea
                name="links"
                {...register("links")}
                className="w-full bg-[#1A1F2B] px-3 py-1.5 2xl:py-3 border border-[#546E7A] text-[#CFD8DC] outline-none text-base focus:ring-2 ring-[#40C4FF] rounded"
              ></textarea>
            </div>
          </div>

          {isLoading || isUpdating || uploading ? (
            <div className="py-4">
              <Loading />
            </div>
          ) : (
            <div className="mt-6 mb-4 sm:flex sm:flex-row-reverse gap-4">
              <Button
                label="Submit"
                type="submit"
                className="bg-[#40C4FF] px-8 text-sm font-semibold text-[#252A36] hover:bg-[#26A69A] sm:w-auto font-orbitron cosmic-button-glow"
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

export default AddTask;
