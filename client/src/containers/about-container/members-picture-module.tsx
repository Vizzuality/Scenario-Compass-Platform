import Image from "next/image";
import { coChairs, otherPeople } from "@/lib/config/about/iiasa-members";

export const MembersPictureModule = () => {
  const getLastName = (name: string) => {
    const parts = name.split(" ");
    // Handle prefixed surnames like "van Vuuren", "van Ruijven"
    const prefixes = ["van", "de", "von", "den", "der"];
    const prefixIndex = parts.findIndex((p) => prefixes.includes(p.toLowerCase()));
    if (prefixIndex > 0) {
      return parts.slice(prefixIndex).join(" ");
    }
    return parts.at(-1) ?? name;
  };

  const leads = [...otherPeople]
    .filter((m) => !!m.role)
    .sort((a, b) => getLastName(a.name).localeCompare(getLastName(b.name)));

  const nonLeads = [...otherPeople]
    .filter((m) => !m.role)
    .sort((a, b) => getLastName(a.name).localeCompare(getLastName(b.name)));

  const members = [...coChairs, ...leads, ...nonLeads];

  return (
    <div className="content-container grid w-full grid-cols-2 flex-col gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
      {members.map((member, i) => (
        <div className="flex h-full w-full flex-col gap-2" key={i}>
          {member.image ? (
            <Image
              src={member.image}
              alt=""
              width={300}
              height={400}
              className="pointer-events-none h-[300px] w-full object-cover select-none"
              unoptimized
            />
          ) : (
            <div className="bg-lilac/30 flex h-[300px] w-full items-center justify-center">
              <Image
                width={100}
                height={100}
                src="/images/illustrations/member-icon.png"
                alt=""
                className="pointer-events-none scale-150 select-none"
                unoptimized
              />
            </div>
          )}
          <div>
            <p className="text-foreground leading-6 font-bold">{member.name}</p>
            <p>{member.organization}</p>
            <span>
              <p className="text-burgundy font-semibold">
                {member.group}
                {member?.role && ` (${member.role})`}
              </p>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
