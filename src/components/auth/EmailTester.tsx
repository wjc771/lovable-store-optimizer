
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const EmailTester = () => {
  const [email, setEmail] = useState("");
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"supabase" | "direct">("supabase");

  const testSupabaseEmail = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) {
        throw error;
      }

      toast.success("Password reset email requested, check email for results");
      setTestResult({
        success: true,
        message: "Password reset email requested successfully. Please check your inbox (and spam folder).",
        data
      });
    } catch (error: any) {
      console.error("Supabase email test error:", error);
      toast.error("Failed to send password reset email");
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
        error
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectEmail = async (type: "auth" | "general") => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/test-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          email,
          testType: type
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send test email");
      }

      toast.success(`Test email (${type}) sent successfully`);
      setTestResult({
        success: true,
        message: `Test email (${type}) sent successfully. Please check your inbox (including spam folder).`,
        data
      });
    } catch (error: any) {
      console.error("Direct email test error:", error);
      toast.error("Failed to send test email");
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
        error
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Email Configuration Tester</CardTitle>
        <CardDescription>
          Test your email configuration to diagnose issues with password reset emails
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "supabase" | "direct")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="supabase">Supabase Auth</TabsTrigger>
            <TabsTrigger value="direct">Direct Test</TabsTrigger>
          </TabsList>
          
          <TabsContent value="supabase" className="space-y-4 mt-4">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4"
              />
              <Button 
                onClick={testSupabaseEmail} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Sending..." : "Test Supabase Password Reset"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="direct" className="space-y-4 mt-4">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4"
              />
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={() => testDirectEmail("auth")} 
                  disabled={isLoading}
                  variant="outline"
                >
                  {isLoading ? "Sending..." : "Test Auth Email"}
                </Button>
                <Button 
                  onClick={() => testDirectEmail("general")} 
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Test General Email"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {testResult && (
          <Alert 
            className={`mt-4 ${testResult.success ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'}`}
          >
            <AlertDescription>
              <div>
                <p className="font-medium mb-2">{testResult.message}</p>
                <details className="text-xs">
                  <summary className="cursor-pointer">Technical Details</summary>
                  <pre className="mt-2 p-2 bg-black/10 dark:bg-white/10 rounded overflow-auto">
                    {JSON.stringify(testResult.data || testResult.error, null, 2)}
                  </pre>
                </details>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6 text-sm text-muted-foreground">
          <h4 className="font-medium text-foreground">Troubleshooting Tips:</h4>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Check your spam/junk folder</li>
            <li>Verify SMTP credentials in Supabase</li>
            <li>Confirm the email domain is correctly set up in Resend</li>
            <li>Try a different email address (e.g., Gmail, Outlook)</li>
            <li>Check Supabase Edge Function logs for errors</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
