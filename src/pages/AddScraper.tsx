import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Play, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddScraper = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (!url.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // --- Send URL to backend ---
      const response = await fetch("http://127.0.0.1:8000/api/scrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error("Failed to scrape website");

      // --- Get JSON file as blob ---
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // --- Trigger download ---
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "scraped_data.json";
      a.click();

      toast({
        title: "Success",
        description: "Website scraped successfully! JSON downloaded.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong while scraping",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="glass-card border-b border-border/50 px-6 py-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="hover:scale-110 transition-transform"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gradient">Add New Scraper</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card rounded-3xl p-8 md:p-12 border border-border/50 shadow-elegant animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-primary mb-6 animate-glow-pulse">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Start Scraping</h2>
              <p className="text-muted-foreground">
                Enter a website URL to start scraping automatically.
              </p>
            </div>

            <div className="space-y-6">
              {/* URL Input */}
              <div className="space-y-2">
                <label htmlFor="url" className="text-sm font-medium">
                  Website URL
                </label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-14 text-lg border-border/50 focus:border-primary transition-colors"
                />
              </div>

              {/* Start Button */}
              <Button
                onClick={handleProcess}
                disabled={isProcessing}
                className="w-full h-14 text-lg gradient-primary text-white hover:opacity-90 transition-all group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      Start
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddScraper;
