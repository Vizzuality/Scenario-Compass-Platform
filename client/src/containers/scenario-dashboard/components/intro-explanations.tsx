const explanationsArray = [
  {
    title: "What information does the Scenario Compass Explorer provide?",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ",
  },
  {
    title: "Which scenarios can be explored?",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ",
  },
  {
    title: "Which sources does the Scenario Compass Explorer rely on?",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ",
  },
];

export default function IntroExplanations() {
  return (
    <div className="w-full bg-white pt-16">
      <div className="container mx-auto flex w-full gap-16">
        {explanationsArray.map((explanation, index) => (
          <div key={index} className="flex flex-col gap-3">
            <h3 className="text-primary text-2xl leading-8 font-semibold">{explanation.title}</h3>
            <p className="text-stone-700">{explanation.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
