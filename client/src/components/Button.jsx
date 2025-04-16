import clsx from "clsx";

const Button = ({ className, label, type, onClick = () => {}, icon }) => {
  return (
    <button
      type={type || "button"}
      className={clsx(
        "px-3 py-2 outline-none rounded flex items-center gap-2 font-orbitron text-[#CFD8DC] hover:text-[#40C4FF] cosmic-button-glow",
        className
      )}
      onClick={onClick}
    >
      {icon && icon}
      <span>{label}</span>
    </button>
  );
};

export default Button;