import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log("Signup button clicked"); // Browser console

  if (formData.password !== formData.confirmPassword) {
    toast({
      title: "Error",
      description: "Passwords do not match",
      variant: "destructive",
    });
    return;
  }

  try {
    setLoading(true);

    console.log("Sending request to backend...");
    const response = await api.post("/auth/signup", {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    console.log("Backend response:", response.data); // Backend response

    toast({
      title: "Account created!",
      description: "Please login to continue",
    });

    // ✅ Redirect to login page after successful signup
    navigate("/login");

  } catch (err: any) {
    console.error("Error sending request:", err);
    const msg = err?.response?.data?.message || err.message || "Something went wrong";
    toast({
      title: "Signup failed",
      description: msg,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  const handleGoogleSignup = () => {
    toast({
      title: "Google Sign-Up",
      description: "Google authentication would be implemented here",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="glass-card p-8 rounded-2xl animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gradient mb-2">Create Account</h1>
            <p className="text-muted-foreground">Start your automation journey today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <InputField
              id="name"
              label="Full Name"
              value={formData.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
              placeholder="John Doe"
            />

            <InputField
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={(v) => setFormData({ ...formData, email: v })}
              placeholder="your@email.com"
            />

            <InputField
              id="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={(v) => setFormData({ ...formData, password: v })}
              placeholder="Create a strong password"
            />

            <InputField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(v) => setFormData({ ...formData, confirmPassword: v })}
              placeholder="Re-enter your password"
            />

            {/* ✅ Submit button */}
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>

            <DividerWithText text="Or continue with" />

            <Button type="button" variant="glass" size="lg" className="w-full" onClick={handleGoogleSignup}>
              <GoogleIcon />
              Continue with Google
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-primary hover:underline font-medium">
              Sign in
            </button>
          </p>

          <p className="text-center text-xs text-muted-foreground mt-4">
            By signing up, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

// ----------------------- Helper Components -----------------------
const InputField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium mb-2">{label}</label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required
      className="bg-background/50"
    />
  </div>
);

const DividerWithText = ({ text }: { text: string }) => (
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-border"></div>
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-4 bg-card text-muted-foreground">{text}</span>
    </div>
  </div>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);
