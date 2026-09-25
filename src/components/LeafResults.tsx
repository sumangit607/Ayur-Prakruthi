import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Leaf,
  FlaskConical,
  UtensilsCrossed,
  TreePine,
  MapPin,
  ArrowLeft,
} from "lucide-react";

interface LeafResultsProps {
  results: {
    name: string;
    scientificName: string;
    medicinalUses: string[];
    foodUses: string[];
    classification: string;
    geographicalLocation: string[];
  };
  image: string | null;
  onReset: () => void;
}

const LeafResults = ({ results, image, onReset }: LeafResultsProps) => {
  const classificationColor = {
    herb: "bg-accent",
    shrub: "bg-secondary",
    tree: "bg-primary",
  };

  const classificationType = results.classification.toLowerCase();
  const badgeColor =
    classificationColor[classificationType as keyof typeof classificationColor] ||
    "bg-primary";

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Button
        onClick={onReset}
        variant="outline"
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Analyze Another Leaf
      </Button>

      {/* Header Card with Image */}
      <Card className="p-6 shadow-[var(--shadow-medium)]">
        <div className="grid md:grid-cols-2 gap-8">
          {image && (
            <div className="flex items-center justify-center">
              <img
                src={image}
                alt={results.name}
                className="max-h-80 rounded-lg shadow-lg object-contain"
              />
            </div>
          )}
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <Badge className={`${badgeColor} text-white mb-3`}>
                <TreePine className="mr-1 h-3 w-3" />
                {results.classification}
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {results.name}
              </h2>
              <p className="text-xl text-muted-foreground italic">
                {results.scientificName}
              </p>
            </div>

            <Separator />

            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Geographical Distribution</h3>
                <p className="text-muted-foreground">
                  {results.geographicalLocation.join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Medicinal Uses */}
      <Card className="p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold">Medicinal Uses</h3>
        </div>
        <ul className="space-y-3">
          {results.medicinalUses.map((use, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground">{use}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Food Uses */}
      <Card className="p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-2 mb-4">
          <UtensilsCrossed className="h-6 w-6 text-secondary" />
          <h3 className="text-2xl font-bold">Food Uses</h3>
        </div>
        <ul className="space-y-3">
          {results.foodUses.map((use, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
              <span className="text-muted-foreground">{use}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Botanical Information Footer */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-muted/30">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Leaf className="h-4 w-4 text-primary" />
          <p>
            This information is provided for educational purposes. Always consult with
            qualified healthcare professionals before using plants medicinally.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LeafResults;
