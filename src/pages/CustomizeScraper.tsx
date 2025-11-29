import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Play, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CustomizeScraper = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // -------------------- File Upload --------------------
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".json")) {
      setJsonFile(file);
      toast({ title: "File Selected", description: file.name });
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a valid JSON file",
        variant: "destructive",
      });
    }
  };

  // -------------------- Send to Backend & Rebuild --------------------
  const handleProcess = async () => {
    if (!jsonFile) {
      toast({
        title: "Input Required",
        description: "Please upload a JSON file",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token"); // JWT token
      if (!token) throw new Error("User not authenticated");

      const formData = new FormData();
      formData.append("file", jsonFile);

      // 1️⃣ Store in database
      const storeResponse = await fetch("http://localhost:5000/customize-scraper", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!storeResponse.ok) throw new Error("Failed to store JSON in database");
      const storeResult = await storeResponse.json();
      toast({
        title: "Stored",
        description: `File "${storeResult.filename}" stored successfully!`,
      });
      console.log(`✅ Stored JSON file: ${storeResult.filename}`);

      // 2️⃣ Call rebuild API (optional preview)
      const rebuildResponse = await fetch("http://127.0.0.1:8000/api/rebuild", {
        method: "POST",
        body: formData,
      });

      if (rebuildResponse.ok) {
        const rebuildResult = await rebuildResponse.json();
        if (rebuildResult.preview_url) window.open(rebuildResult.preview_url, "_blank");
        toast({ title: "Rebuilt", description: "Website rebuilt successfully!" });
      } else {
        console.warn("⚠️ Rebuild API failed, but file stored successfully");
      }
    } catch (error: any) {
      console.error(error);
      toast({ title: "Error", description: error.message || "Something went wrong", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  // -------------------- JSX --------------------
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
          <h1 className="text-2xl font-bold text-gradient">Customize New Website</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card rounded-3xl p-8 md:p-12 border border-border/50 shadow-elegant animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-primary mb-6 animate-glow-pulse">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Upload JSON File</h2>
              <p className="text-muted-foreground">
                Upload your JSON file to store in database and rebuild the website.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="file" className="text-sm font-medium">JSON File</label>
                <Input
                  id="file"
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="h-14 text-lg border-border/50 focus:border-primary transition-colors"
                />
              </div>

              <Button
                onClick={handleProcess}
                disabled={isProcessing}
                className="w-full h-14 text-lg gradient-primary text-white hover:opacity-90 transition-all group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  )}
                  {isProcessing ? "Processing..." : "Start"}
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

export default CustomizeScraper;
