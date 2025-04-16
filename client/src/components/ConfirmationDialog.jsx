import { Dialog } from "@headlessui/react";
import clsx from "clsx";
import { FaQuestion } from "react-icons/fa";
import { Button, ModalWrapper } from "./";

export default function ConfirmatioDialog({
  open,
  setOpen,
  msg,
  onClick = () => {},
  type = "delete",
  setMsg = () => {},
  setType = () => {},
}) {
  const closeDialog = () => {
    setType("delete");
    setMsg(null);
    setOpen(false);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={closeDialog}>
        <div className="form-container">
          <div className="py-4 w-full flex flex-col gap-4 items-center justify-center">
            <Dialog.Title as="h3" className="">
              <p
                className={clsx(
                  "p-3 rounded-full",
                  type === "restore" || type === "restoreAll"
                    ? "text-[#FFCA28] bg-[#FFCA28]/20"
                    : "text-[#EF5350] bg-[#EF5350]/20"
                )}
              >
                <FaQuestion size={60} />
              </p>
            </Dialog.Title>

            <p className="text-center text-[#CFD8DC] cosmic-text-large">
              {msg ?? "Are you sure you want to delete the selected record?"}
            </p>

            <div className="bg-[#1A1F2B] py-3 sm:flex sm:flex-row-reverse gap-4">
              <Button
                type="button"
                className={clsx(
                  "px-8 text-sm font-semibold text-[#252A36] sm:w-auto font-orbitron cosmic-button-glow",
                  type === "restore" || type === "restoreAll"
                    ? "bg-[#FFCA28] hover:bg-[#FFB300]"
                    : "bg-[#EF5350] hover:bg-[#D81B60]"
                )}
                onClick={onClick}
                label={type === "restore" ? "Restore" : "Delete"}
              />
              <Button
                type="button"
                className="bg-[#1A1F2B] px-8 text-sm font-semibold text-[#CFD8DC] sm:w-auto border border-[#546E7A] hover:bg-[#546E7A]/20 font-orbitron"
                onClick={() => closeDialog()}
                label="Cancel"
              />
            </div>
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}

export function UserAction({ open, setOpen, onClick = () => {} }) {
  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={closeDialog}>
        <div className="form-container">
          <div className="py-4 w-full flex flex-col gap-4 items-center justify-center">
            <Dialog.Title as="h3" className="">
              <p className={clsx("p-3 rounded-full", "text-[#EF5350] bg-[#EF5350]/20")}>
                <FaQuestion size={60} />
              </p>
            </Dialog.Title>

            <p className="text-center text-[#CFD8DC] cosmic-text-large">
              {"Are you sure you want to activate or deactivate this account?"}
            </p>

            <div className="bg-[#1A1F2B] py-3 sm:flex sm:flex-row-reverse gap-4">
              <Button
                type="button"
                className={clsx(
                  "px-8 text-sm font-semibold text-[#252A36] sm:w-auto font-orbitron cosmic-button-glow",
                  "bg-[#EF5350] hover:bg-[#D81B60]"
                )}
                onClick={onClick}
                label="Yes"
              />
              <Button
                type="button"
                className="bg-[#1A1F2B] px-8 text-sm font-semibold text-[#CFD8DC] sm:w-auto border border-[#546E7A] hover:bg-[#546E7A]/20 font-orbitron"
                onClick={() => closeDialog()}
                label="No"
              />
            </div>
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}