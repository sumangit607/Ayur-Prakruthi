import { useState } from "react";
import { Upload, Leaf, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import LeafResults from "@/components/LeafResults";
import heroBotanical from "@/assets/hero-botanical.jpg";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResults(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeLeaf = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-leaf`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ image: selectedImage }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Analysis failed");
      }

      const data = await response.json();
      setResults(data);
      toast({
        title: "Analysis Complete!",
        description: "Leaf identification successful",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResults(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Animated Background Decoration */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
        <img 
          src={heroBotanical} 
          alt="" 
          className="w-full h-full object-cover scale-110 animate-gradient"
        />
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>
      
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-12 md:py-16 relative z-10 animate-fade-in-up">
        <div className="flex flex-col items-center justify-center gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse-glow"></div>
            <div className="relative flex items-center justify-center gap-4">
              <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl backdrop-blur-sm border border-primary/20 shadow-glow">
                <Leaf className="w-12 h-12 md:w-16 md:h-16 text-primary animate-float" />
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent animate-gradient">
                Ayur-Prakruthi
              </h1>
            </div>
          </div>
          <p className="text-center text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
            Discover the wisdom of nature through Deep learning and AI-powered leaf identification. 
            <span className="block mt-2 text-base md:text-lg">
              Learn about medicinal properties, food uses, and botanical classification with a single click.
            </span>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20 relative z-10">
        {!results ? (
          <div className="max-w-3xl mx-auto animate-scale-in">
            <Card className="p-8 md:p-10 shadow-[var(--shadow-large)] border-2 border-primary/10 bg-gradient-to-br from-card via-card to-muted/5 backdrop-blur-sm relative overflow-hidden">
              {/* Shimmer effect */}
              <div className="absolute inset-0 animate-shimmer pointer-events-none"></div>
              
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-primary/30 rounded-2xl p-12 md:p-16 text-center hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 bg-gradient-to-br from-background/50 to-muted/20 relative group"
              >
                {selectedImage ? (
                  <div className="space-y-8 relative z-10">
                    <div className="relative inline-block mx-auto group">
                      <div className="absolute -inset-2 bg-gradient-to-r from-primary via-primary-light to-accent rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                      <img
                        src={selectedImage}
                        alt="Selected leaf"
                        className="relative max-h-72 md:max-h-80 mx-auto rounded-xl shadow-2xl object-contain border-4 border-white/50"
                      />
                    </div>
                    <div className="flex gap-4 justify-center flex-wrap">
                      <Button
                        onClick={analyzeLeaf}
                        disabled={isAnalyzing}
                        size="lg"
                        className="bg-gradient-to-r from-primary via-primary-light to-accent hover:shadow-glow-lg text-white font-semibold px-8 py-6 text-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Analyzing Leaf...
                          </>
                        ) : (
                          <>
                            <Leaf className="mr-2 h-5 w-5" />
                            Identify Leaf
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => setSelectedImage(null)}
                        variant="outline"
                        size="lg"
                        disabled={isAnalyzing}
                        className="px-8 py-6 text-lg border-2 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
                      >
                        Choose Different Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 relative z-10">
                    <div className="relative inline-block mx-auto">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse-glow"></div>
                      <div className="relative w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mx-auto border-2 border-primary/30 shadow-glow">
                        <Upload className="w-12 h-12 md:w-14 md:h-14 text-primary animate-float" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                        Upload Leaf Image
                      </h3>
                      <p className="text-muted-foreground mb-8 text-base md:text-lg max-w-md mx-auto">
                        Drag and drop your leaf image here, or click the button below to browse from your device
                      </p>
                    </div>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="file-upload">
                      <Button asChild size="lg" className="bg-gradient-to-r from-primary via-primary-light to-accent hover:shadow-glow-lg text-white font-semibold px-10 py-6 text-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
                        <span className="cursor-pointer flex items-center">
                          <Upload className="mr-2 h-5 w-5" />
                          Select Image
                        </span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            </Card>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-16">
              {[
                {
                  title: "Instant Identification",
                  description: "Deep-learning and AI-powered recognition of thousands of leaf species",
                  icon: "🔍",
                },
                {
                  title: "Medicinal Knowledge",
                  description: "Learn about traditional and modern medicinal uses",
                  icon: "🌿",
                },
                {
                  title: "Botanical Details",
                  description: "Classification, habitat, and geographical information",
                  icon: "🌳",
                },
              ].map((feature, index) => (
                <Card 
                  key={index} 
                  className="p-8 text-center hover:shadow-[var(--shadow-large)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border-2 border-primary/10 bg-gradient-to-br from-card to-muted/10 group relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-primary group-hover:text-primary-light transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <LeafResults
            results={results}
            image={selectedImage}
            onReset={() => {
              setResults(null);
              setSelectedImage(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
