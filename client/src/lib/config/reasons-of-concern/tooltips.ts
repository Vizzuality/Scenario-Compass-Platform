export interface ReasonForConcernSummary {
  flagName: string;
  description: string;
  link: string;
}

export type ReasonsForConcernMap = Record<string, ReasonForConcernSummary>;

export const reasonsForConcernMap: ReasonsForConcernMap = {
  "Feasibility Concern|Hydropower Capacity|World|2030": {
    flagName: "Infeasible near-term hydropower expansion",
    description:
      "This scenario assumes a deployment of hydropower plants that is inconsistent with near-term projections. \n" +
      "\n" +
      "High concern: projected capacity is more than 10% below current global capacity or more than 45% above the projected 2030 capacity. \n" +
      "\n" +
      "Medium concern: projected capacity is 5% or more below or above the projected 2030 capacity. ",
    link: "https://philippverpoort.github.io/scenario-vetting-criteria/criteria_meta/",
  },
  "Feasibility Concern|Nuclear Capacity|World|2030": {
    flagName: "Infeasible near-term nuclear power expansion ",
    description:
      "This scenario assumes a deployment of nuclear power plants that is inconsistent with near-term projections. \n" +
      "\n" +
      "High concern: projected capacity is more than 30% below current global capacity or more than 10% above the highest estimate published by the IAEA (461 GW). \n" +
      "\n" +
      "Medium concern: projected capacity is more than 15% below current global capacity or more than 5% above current global capacity, assuming Japan’s retired plants return to service and 75% of plants under construction are completed. ",
    link: "https://philippverpoort.github.io/scenario-vetting-criteria/criteria_meta/",
  },
  "Feasibility Concern|Onshore Wind Capacity|World|2025": {
    flagName: "Infeasible current onshore wind power expansion ",
    description:
      "This scenario assumes a deployment of onshore wind that is inconsistent with near-term market outlooks. \n" +
      "\n" +
      "High concern: projected capacity is more than 10% below existing capacities, assuming a realization of 37.5% of the market outlook, or more than 10% above existing capacities, assuming a realization of 200% of the market outlook. \n" +
      "\n" +
      "Medium concern: projected capacity is more than 5% below existing capacities, assuming a realization of 75% of the market outlook globally, or more than 5% above existing capacities, assuming a realization of 150% of the market outlook globally. ",
    link: "https://philippverpoort.github.io/scenario-vetting-criteria/criteria_meta/",
  },
  "Feasibility Concern|Solar PV Capacity|World|2030": {
    flagName: "Infeasible near-term solar PV expansion ",
    description:
      "This scenario assumes a deployment of solar PV capacity that is inconsistent with near-term market outlooks. \n" +
      "\n" +
      "High concern: projected capacity is more than 10% below existing capacities, assuming a realization of 37.5% of the market outlook, or more than 10% above existing capacities, assuming a realization of 200% of the market outlook. \n" +
      "\n" +
      "Medium concern: projected capacity is more than 5% below existing capacities, assuming a realization of 75% of the market outlook globally, or more than 5% above existing capacities, assuming a realization of 150% of the market outlook globally. ",
    link: "https://philippverpoort.github.io/scenario-vetting-criteria/criteria_meta/",
  },
  "Feasibility Concern|Wind Capacity|World|2025": {
    flagName: "Infeasible current wind power expansion ",
    description:
      "This scenario assumes wind capacity that is inconsistent with near-term market outlooks. \n" +
      "\n" +
      "High concern: projected total wind capacity is more than 10% below existing onshore capacities, assuming a realization of 37.5% of the market outlook. \n" +
      "\n" +
      "Medium concern: projected total wind capacity is more than 5% below existing onshore capacities, assuming a realization of 75% of the market outlook globally. ",
    link: "https://philippverpoort.github.io/scenario-vetting-criteria/criteria_meta/",
  },
  "Feasibility Concern|Wind Capacity|World|2030": {
    flagName: "Infeasible near-term wind power expansion ",
    description:
      "This scenario assumes wind capacity that is inconsistent with near-term market outlooks. \n" +
      "\n" +
      "High concern: projected total wind capacity is more than 10% below existing onshore capacities, assuming a realization of 37.5% of the market outlook. \n" +
      "\n" +
      "Medium concern: projected total wind capacity is more than 5% below existing onshore capacities, assuming a realization of 75% of the market outlook globally. ",
    link: "https://philippverpoort.github.io/scenario-vetting-criteria/criteria_meta/",
  },
  "Sustainability Concern|Exceeding Prudent Limit For Geological Carbon Storage|World": {
    flagName: "Unsustainable use of geological carbon storage ",
    description:
      "This scenario assumes geological carbon storage volumes that exceed prudent technical and sustainability limits as quantified by Gidden et al (2025). \n" +
      " \n" +
      "High concern: exceeding cumulative CCS of 1,460 Gt CO2 until the end of the century, which was identified as the median of the range when combining spatial risk layers. \n" +
      "\n" +
      "Medium concern: exceeding cumulative CCS of 1,290 Gt CO2 until the end of the century, which was identified as the lower bound of the range when combining spatial risk layers. ",
    link: "https://philippverpoort.github.io/scenario-vetting-criteria/criteria_meta/",
  },
  "Sustainability Concern|Unsustainable Bioenergy Use|World": {
    flagName: "Unsustainable use of bioenergy ",
    description:
      "This scenario assumes levels of bioenergy use that raise sustainability concerns. \n" +
      "\n" +
      "High concern: projected primary bioenergy use exceeds 160245 EJ per year in at least one period until the end of the century. \n" +
      "\n" +
      "Medium concern: projected primary bioenergy supply exceeds 100 EJ per year in at least one period until the end of the century. ",
    link: "https://philippverpoort.github.io/scenario-vetting-criteria/criteria_meta/",
  },
  "Feasibility Concern|Onshore Wind Capacity|World|2030": {
    flagName: "Infeasible near-term onshore wind power expansion",
    description:
      "This scenario assumes a deployment of on-shore wind that is inconsistent with near-term market outlooks. \n" +
      "High concern: projected capacity is more than 10% below existing capacities, assuming a realization of 37.5% of the market outlook, or  more than 10% above existing capacities, assuming a realization of 200% of the market outlook. \n" +
      "Medium concern: projected capacity is more than 5% below existing capacities, assuming a realization of 75% of the market outlook globally, or more than 5% above existing capacities, assuming a realization of 150% of the market outlook globally. ",
    link: "https://philippverpoort.github.io/scenario-vetting-criteria/criteria_meta/",
  },
  "Feasibility Concern|Solar PV Capacity|World|2025": {
    flagName: "Infeasible current solar PV expansion",
    description:
      "This scenario assumes a deployment of solar PV capacity that is inconsistent with near-term market outlooks. \n" +
      "\n" +
      "High concern: projected capacity is more than 10% below existing capacities, assuming a realization of 37.5% of the market outlook, or  more than 10% above existing capacities, assuming a realization of 200% of the market outlook. \n" +
      "\n" +
      "Medium concern: projected capacity is more than 5% below existing capacities, assuming a realization of 75% of the market outlook globally, or more than 5% above existing capacities, assuming a realization of 150% of the market outlook globally. ",
    link: "https://philippverpoort.github.io/scenario-vetting-criteria/criteria_meta/",
  },
};
