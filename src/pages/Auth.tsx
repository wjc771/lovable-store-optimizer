
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase, SITE_URL } from "@/lib/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { EmailTester } from "@/components/auth/EmailTester";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [resetToken, setResetToken] = useState("");
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const { signIn } = useAuth();

  useEffect(() => {
    const checkForPasswordResetFlow = async () => {
      // Log full URL to help with debugging
      console.log("Full URL:", window.location.href);

      // Check URL parameters
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const tab = params.get('tab');
      const type = params.get('type');
      const diagnostics = params.get('diagnostics');
      
      console.log("URL params:", { token, tab, type, diagnostics });
      
      if (diagnostics === "true") {
        setShowDiagnostics(true);
      }
      
      // Check for invite token
      if (token) {
        setInviteToken(token);
      }
      
      // Handle Supabase recovery flow from URL parameters
      // This is for newer Supabase redirects
      if (tab === 'reset' || type === 'recovery') {
        console.log("Setting up password reset flow from URL parameters");
        setIsUpdatingPassword(true);
        setActiveTab('reset');
        
        // Look for access token in various places
        const accessToken = params.get('access_token');
        if (accessToken) {
          console.log("Access token found in URL parameters");
          setResetToken(accessToken);
        }
      }
      
      // Handle Supabase recovery flow from URL hash
      // This is for older Supabase redirects which use hash fragments
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const tokenType = hashParams.get('type');
        
        console.log("Hash params:", { accessToken, tokenType });
        
        if (accessToken && (tokenType === 'recovery' || tokenType === 'passwordReset')) {
          console.log("Setting up password update from hash with token:", accessToken.substring(0, 5) + "...");
          setIsUpdatingPassword(true);
          setResetToken(accessToken);
          setActiveTab('reset');
        }
      }
      
      // Additional check for recovery flow
      // Use the getSession method instead of parseHash
      if (window.location.hash) {
        try {
          // getSession is the recommended approach for newer Supabase versions
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error("Error getting session:", sessionError);
          } else if (sessionData.session) {
            console.log("Successfully got session!");
            setIsUpdatingPassword(true);
            setResetToken(sessionData.session.access_token);
            setActiveTab('reset');
          }
        } catch (err) {
          console.error("Exception parsing hash:", err);
        }
      }
    };
    
    checkForPasswordResetFlow();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    if (email.toLowerCase().includes("example.com")) {
      return "Please use a real email address (example.com is not allowed)";
    }
    return null;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const emailError = validateEmail(email);
    if (emailError) {
      toast.error(emailError);
      setIsSubmitting(false);
      return;
    }

    try {
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (signUpError) throw signUpError;

      if (inviteToken) {
        const { error: inviteError } = await supabase.from('store_invites')
          .update({ status: 'accepted' })
          .eq('token', inviteToken)
          .single();

        if (inviteError) throw inviteError;
      }
      
      toast.success("Please check your email to confirm your account");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign up");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const emailError = validateEmail(email);
    if (emailError) {
      toast.error(emailError);
      setIsSubmitting(false);
      return;
    }

    try {
      await signIn(email, password);
      toast.success("Successfully logged in");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const emailError = validateEmail(email);
    if (emailError) {
      toast.error(emailError);
      setIsSubmitting(false);
      return;
    }

    try {
      // Usar o SITE_URL em vez de window.location.origin
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${SITE_URL}/auth`,
      });
      
      if (error) throw error;
      
      setResetEmailSent(true);
      toast.success("Password reset instructions have been sent to your email");
      console.log("Password reset email requested for:", email);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send reset email");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (newPassword.length < 6) {
      toast.error("Password should be at least 6 characters long");
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Updating password, token exists:", !!resetToken);
      
      let error;
      
      if (resetToken) {
        // Try to set the session first with the token
        console.log("Setting session with token...");
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: resetToken,
          refresh_token: "",
        });
        
        if (sessionError) {
          console.error("Error setting session:", sessionError);
          throw sessionError;
        }
        
        console.log("Session set successfully, updating password...");
        // Now update the password - the session is already set with the token
        const result = await supabase.auth.updateUser({ 
          password: newPassword 
        });
        
        error = result.error;
      } else {
        // User is already logged in, just update the password
        console.log("No token, updating password directly...");
        const result = await supabase.auth.updateUser({ 
          password: newPassword 
        });
        
        error = result.error;
      }
      
      if (error) {
        console.error("Error updating password:", error);
        throw error;
      }
      
      console.log("Password updated successfully!");
      toast.success("Your password has been updated successfully");
      
      // Redirect to sign in after a successful password update
      setIsUpdatingPassword(false);
      setActiveTab("signin");
    } catch (error) {
      console.error("Update password error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForgotPassword = () => {
    if (resetEmailSent) {
      return (
        <div className="text-center mt-4">
          <h3 className="text-lg font-semibold mb-2">Email Sent!</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Check your email for the password reset link. If you don't see it, please check your spam folder.
          </p>
          <Alert className="mb-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <AlertDescription>
              Due to email delivery settings, the password reset email might be delayed or go to your spam folder.
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            onClick={() => {
              setIsResettingPassword(false);
              setResetEmailSent(false);
            }}
          >
            Back to Sign In
          </Button>
        </div>
      );
    }

    return (
      <form onSubmit={handleResetPassword} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium" htmlFor="reset-email">
            Email
          </Label>
          <Input
            id="reset-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Reset Instructions"}
        </Button>

        <p className="text-sm text-center">
          <button
            type="button"
            onClick={() => setIsResettingPassword(false)}
            className="text-primary hover:underline"
          >
            Back to Sign In
          </button>
        </p>
      </form>
    );
  };

  const renderUpdatePassword = () => {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Set New Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Please enter your new password below.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-100 dark:border-gray-700">
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="new-password">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full"
                  placeholder="Enter your new password"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="confirm-password">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full"
                  placeholder="Confirm your new password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const toggleDiagnostics = () => {
    setShowDiagnostics(!showDiagnostics);
  };

  if (isUpdatingPassword) {
    return renderUpdatePassword();
  }

  if (isResettingPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-100 dark:border-gray-700">
            {renderForgotPassword()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {inviteToken ? "Accept Invitation" : "Welcome"}
        </h2>
        {inviteToken && (
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            You've been invited to join a store. Please sign up to accept the invitation.
          </p>
        )}
        {email === 'wjc771@gmail.com' && (
          <p className="mt-2 text-center text-sm text-purple-600 dark:text-purple-400 font-semibold">
            Logging in as SaaS Administrator
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-100 dark:border-gray-700">
          <Tabs 
            defaultValue={inviteToken ? "signup" : "signin"} 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-md">
              <TabsTrigger 
                value="signin"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-md"
                disabled={!!inviteToken}
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-md"
              >
                {inviteToken ? "Accept Invite" : "Sign Up"}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium" htmlFor="signin-email">
                    Email
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium" htmlFor="signin-password">
                    Password
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setIsResettingPassword(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div>
                  <Label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <Label htmlFor="full-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </Label>
                  <Input
                    id="full-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <Label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing Up..." : (inviteToken ? "Accept Invitation" : "Sign Up")}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <button 
              onClick={toggleDiagnostics}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {showDiagnostics ? "Hide Diagnostics" : "Show Diagnostics"}
            </button>
          </div>
        </div>
      </div>
      
      {showDiagnostics && (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <EmailTester />
        </div>
      )}
    </div>
  );
};

export default Auth;
