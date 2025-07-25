import { Eye, Edit, Info, ChevronDown } from "lucide-react";

interface Flag {
  id: string;
  title: string;
  count?: number;
  color: "red" | "yellow" | "purple";
  items: string[];
}

interface ScenarioFlagsProps {
  scenarios?: number;
  models?: number;
  flags?: Flag[];
}

const defaultFlags: Flag[] = [
  {
    id: "major",
    title: "MAJOR FEASIBILITY CONCERN",
    count: 2,
    color: "red",
    items: [
      "Annual gross loss of primary and secondary forest area",
      "Global Sustainable Use of Bioenergy in 2050 is higher than 300 EJ/yr",
    ],
  },
  {
    id: "intermediate",
    title: "INTERMEDIATE FEASIBILITY CONCERN",
    count: 16,
    color: "yellow",
    items: [
      "Future near-term expansion of hydropower",
      "Global Sustainable Use of Bioenergy in 2050 is higher than 100 EJ/yr",
    ],
  },
  {
    id: "sustainability",
    title: "SUSTAINABILITY CONCERN",
    count: 1,
    color: "purple",
    items: ["Sustainability concerns due to excessive biomass use"],
  },
];

const FlagIcon: React.FC<{ color: "red" | "yellow" | "purple" }> = ({ color }) => {
  const colorClasses = {
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
  };

  return (
    <div
      className={`h-12 w-12 rounded-full ${colorClasses[color]} flex items-center justify-center text-white`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    </div>
  );
};

const ActionButton: React.FC<{ icon: React.ReactNode; onClick?: () => void }> = ({
  icon,
  onClick,
}) => (
  <button
    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
    onClick={onClick}
  >
    {icon}
  </button>
);

export default function ScenarioFlags({
  scenarios = 8,
  models = 4,
  flags = defaultFlags,
}: ScenarioFlagsProps) {
  const displayedFlags = flags.slice(0, 2);

  return (
    <div className="mx-auto max-w-2xl p-6">
      {/* Compare Button */}
      <button className="mb-6 flex w-full items-center justify-between rounded-lg bg-gray-800 px-4 py-3 text-white hover:bg-gray-700">
        <span className="font-medium">Compare this scenario set to</span>
        <span className="text-xl">+</span>
      </button>

      {/* Scenario Metrics */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Scenario metrics</h2>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="mr-3 h-2 w-2 rounded-full bg-gray-800"></span>
            <span className="text-gray-700">Scenarios: {scenarios}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-3 h-2 w-2 rounded-full bg-gray-800"></span>
            <span className="text-gray-700">Models: {models}</span>
          </div>
        </div>
      </div>

      {/* Flags Section */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Flags</h2>
          <div className="flex space-x-2">
            <ActionButton icon={<Eye size={16} />} />
            <ActionButton icon={<Edit size={16} />} />
            <ActionButton icon={<Info size={16} />} />
          </div>
        </div>

        {/* Flag Items */}
        <div className="space-y-6">
          {displayedFlags.map((flag) => (
            <div key={flag.id}>
              {/* Flag Header */}
              <div className="mb-4 flex items-start space-x-4">
                <FlagIcon color={flag.color} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold tracking-wide text-gray-900 uppercase">
                      {flag.title} ({flag.count})
                    </h3>
                    <div className="flex space-x-2">
                      <ActionButton icon={<Eye size={16} />} />
                      <ActionButton icon={<Edit size={16} />} />
                      <ActionButton icon={<Info size={16} />} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Flag Items */}
              <div className="ml-16 space-y-3">
                {flag.items.map((item, index) => (
                  <div key={index} className="flex items-start justify-between py-2">
                    <p className="flex-1 pr-4 text-gray-700">{item}</p>
                    <div className="flex flex-shrink-0 space-x-2">
                      <ActionButton icon={<Eye size={16} />} />
                      <ActionButton icon={<Edit size={16} />} />
                      <ActionButton icon={<Info size={16} />} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Show All Button */}
        {flags.length > 2 && (
          <button className="mt-6 flex items-center space-x-2 border-b border-gray-300 pb-1 text-gray-600 hover:text-gray-800">
            <span className="font-medium">Show all</span>
            <div className="flex h-6 w-6 items-center justify-center rounded bg-green-500">
              <ChevronDown
                size={14}
                className={"rotate-180 transform text-white transition-transform"}
              />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
