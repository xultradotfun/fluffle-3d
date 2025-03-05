export const DISCORD_ROLES = {
  MINIETH: "1227046192316285041",
  MEGALEVEL: "1245309734362288138",
  ORIGINAL_MAFIA: "1254432472180064286",
  FLUFFLE_HOLDER: "1333412653384728728",
  MEGAMIND: "1302317210160861185",
  CHUBBY_BUNNY: "1302277393616076811",
  BIG_SEQUENCER: "1234655118960365711",
} as const;

// Role tiers from lowest to highest
export const ROLE_TIERS = [
  {
    id: DISCORD_ROLES.MINIETH,
    name: "MiniETH",
    weight: 100,
  },
  {
    id: DISCORD_ROLES.MEGALEVEL,
    name: "MegaLevel",
    weight: 200,
  },
  {
    id: DISCORD_ROLES.ORIGINAL_MAFIA,
    name: "Original Mafia",
    weight: 300,
  },
  {
    id: DISCORD_ROLES.FLUFFLE_HOLDER,
    name: "Fluffle Holder",
    weight: 400,
  },
  {
    id: DISCORD_ROLES.MEGAMIND,
    name: "Megamind",
    weight: 500,
  },
  {
    id: DISCORD_ROLES.CHUBBY_BUNNY,
    name: "Chubby Bunny",
    weight: 600,
  },
  {
    id: DISCORD_ROLES.BIG_SEQUENCER,
    name: "Big Sequencer Energy",
    weight: 700,
  },
] as const;

export function getHighestRole(
  roles: string[]
): (typeof ROLE_TIERS)[number] | null {
  return ROLE_TIERS.reduce((highest, role) => {
    if (roles.includes(role.id) && (!highest || role.weight > highest.weight)) {
      return role;
    }
    return highest;
  }, null as (typeof ROLE_TIERS)[number] | null);
}
