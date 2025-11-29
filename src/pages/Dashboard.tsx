import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Plus, FileText, Eye, Edit, LogOut, LayoutDashboard } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

interface Project {
  filename: string;
  data: any;
  uploadedAt: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Fetch user projects
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setProjects(data.user.uploadedJSON || []);
        } else {
          toast({ title: "Error", description: data.message, variant: "destructive" });
        }
      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "Failed to load projects", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProjects();
    else navigate("/login");
  }, [token, navigate, toast]);

  // Handle preview
  const handleView = async (project: Project) => {
    try {
      const formData = new FormData();
      const blob = new Blob([JSON.stringify(project.data)], { type: "application/json" });
      formData.append("file", blob, project.filename);

      const res = await fetch("http://127.0.0.1:8000/api/live_preview", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Preview failed");

      const result = await res.json();
      if (result.preview_url) window.open(result.preview_url, "_blank");
      else toast({ title: "Info", description: "No preview available" });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err.message || "Failed to preview", variant: "destructive" });
    }
  };

  // Handle rebuild/edit
// Inside your Dashboard component

// Optional: you can use a loading/message state
const [loadingRebuild, setLoadingRebuild] = useState(false);
const [message, setMessage] = useState("");

const handleEdit = async (project: Project) => {
  setLoadingRebuild(true);
  setMessage("Rebuilding website...");

  try {
    const formData = new FormData();
    // Convert project data to a Blob
    const blob = new Blob([JSON.stringify(project.data)], { type: "application/json" });
    formData.append("file", blob, project.filename);

    const response = await fetch("http://127.0.0.1:8000/api/rebuild", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to rebuild website");

    const result = await response.json();
    if (result.preview_url) {
      window.open(result.preview_url, "_blank"); // Open preview
      toast({ title: "Success", description: "Website rebuilt successfully!" });
    } else {
      toast({ title: "Warning", description: "Rebuild complete, but no preview URL returned." });
    }
  } catch (error) {
    console.error(error);
    toast({ title: "Error", description: "❌ Error rebuilding website.", variant: "destructive" });
  } finally {
    setLoadingRebuild(false);
    setMessage("");
  }
};


  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <Sidebar className="border-r border-border/50">
          <div className="p-6 border-b border-border/50">
            <h1 className="text-2xl font-bold text-gradient">ScraperAI</h1>
          </div>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => navigate("/dashboard")}>
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupContent className="space-y-3">
                <Button
                  onClick={() => navigate("/add-scraper")}
                  className="w-full gradient-primary text-white flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add New Scraper
                </Button>
                <Button
                  onClick={() => navigate("/customize-website")}
                  className="w-full gradient-secondary text-white flex items-center justify-center gap-2"
                >
                  <FileText className="h-5 w-5" />
                  Customize Website
                </Button>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <div className="mt-auto p-4 border-t border-border/50">
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1">
          <header className="glass-card border-b border-border/50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h2 className="text-2xl font-bold">My Projects</h2>
            </div>
            <ThemeToggle />
          </header>

          <div className="p-8">
            {loading ? (
              <p>Loading projects...</p>
            ) : projects.length === 0 ? (
              <p>No projects uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl glass-card border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-elegant animate-fade-in"
                  >
                    <div className="p-5">
                      <h3 className="text-lg font-semibold mb-2">{`Project ${index + 1}`}</h3>
                      <p className="text-muted-foreground truncate">{project.filename}</p>
                      <div className="text-xs text-muted-foreground mt-2">
                        Uploaded: {new Date(project.uploadedAt).toLocaleString()}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button size="icon" className="glass-card" onClick={() => handleView(project)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" className="glass-card" onClick={() => handleEdit(project)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
