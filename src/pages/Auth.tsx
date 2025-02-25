
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const { signIn } = useAuth();

  // Corrigido o uso de useState para useEffect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setInviteToken(token);
    }
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
    
    const emailError = validateEmail(email);
    if (emailError) {
      toast.error(emailError);
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
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      toast.error(emailError);
      return;
    }

    try {
      await signIn(email, password);
      toast.success("Successfully logged in");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
    }
  };

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
        {email === 'admin@saasadmin.com' && (
          <p className="mt-2 text-center text-sm text-purple-600 dark:text-purple-400 font-semibold">
            Logging in as SaaS Administrator
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-100 dark:border-gray-700">
          <Tabs defaultValue={inviteToken ? "signup" : "signin"} className="w-full">
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
              <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                  <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <Input
                    id="signin-password"
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
                >
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
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
                  <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
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
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
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
                >
                  {inviteToken ? "Accept Invitation" : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
