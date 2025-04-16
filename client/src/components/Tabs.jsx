import { Tab } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs({ tabs, setSelected, children }) {
  return (
    <div className="w-full px-1 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-6 rounded-xl p-1 bg-[#252A36] border border-[#546E7A]">
          {tabs.map((tab, index) => (
            <Tab
              key={tab.title}
              onClick={() => setSelected(index)}
              className={({ selected }) =>
                classNames(
                  "w-fit flex items-center outline-none gap-2 px-3 py-2.5 text-base font-medium leading-5 font-orbitron",
                  selected
                    ? "text-[#FFFFFF] border-b-2 border-[#40C4FF]"
                    : "text-[#CFD8DC] hover:text-[#40C4FF]"
                )
              }
            >
              {tab.icon}
              <span>{tab.title}</span>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="w-full mt-2">{children}</Tab.Panels>
      </Tab.Group>
    </div>
  );
}