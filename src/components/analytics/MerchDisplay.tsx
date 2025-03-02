import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface MerchItem {
  name: string;
  category: string;
  image: string;
}

const MERCH_ITEMS: MerchItem[] = [
  {
    name: "Cropped Tee",
    category: "tops",
    image:
      "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/merch/megaeth_t_cropped.png",
  },
  {
    name: "Tee",
    category: "tops",
    image:
      "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/merch/megaeth_t.png",
  },
  {
    name: "Measure Then Build Tee",
    category: "tops",
    image:
      "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/merch/mesure_then_build_t.png",
  },
  {
    name: "Pans And Shoes",
    category: "bottoms",
    image:
      "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/merch/pants_and_shoes.png",
  },
  {
    name: "World Computer Day Necklace",
    category: "necklaces",
    image:
      "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/merch/world_computer_day_necklace.png",
  },
];

export function MerchDisplay() {
  // Group items by category
  const itemsByCategory = MERCH_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MerchItem[]>);

  return (
    <Card className="bg-card dark:bg-transparent border border-border dark:border-white/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Available Merch
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Exclusive wearables for your avatar
            </p>
          </div>
          <Badge variant="secondary">{MERCH_ITEMS.length} items</Badge>
        </div>

        <div className="space-y-6">
          {Object.entries(itemsByCategory).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-muted-foreground capitalize mb-3">
                {category}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((item) => (
                  <div
                    key={item.name}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-white dark:from-black/40 dark:to-black/60 ring-1 ring-border dark:ring-white/10 hover:ring-blue-500/20 transition-all"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-sm font-medium text-white truncate">
                        {item.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
