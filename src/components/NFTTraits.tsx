"use client";

import type { NFTTrait } from "@/utils/nftLoader";

interface NFTTraitsProps {
  id: string;
  traits: NFTTrait;
}

export default function NFTTraits({ traits }: NFTTraitsProps) {
  const traitsList = [
    { name: "Tribe", value: traits.tribe_display_name },
    { name: "Skin", value: traits.skin_display_name },
    { name: "Hair", value: traits.hair_display_name },
    { name: "Eyes", value: traits.eyeball_display_name },
    { name: "Eyeliner", value: traits.eyeliner_display_name },
    { name: "Head", value: traits.head_display_name },
    { name: "Ear", value: traits.ear_display_name },
    { name: "Face", value: traits.face_display_name },
  ].filter((trait) => trait.value !== -1);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#ededed]">Traits</h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-sm text-gray-400">
            {traitsList.length} attributes
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {traitsList.map(({ name, value }) => (
          <div
            key={name}
            className="bg-white/[0.03] rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.05]"
          >
            <div className="text-blue-400 text-sm font-medium mb-1">{name}</div>
            <div className="text-[#ededed] font-medium truncate">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
