"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

export function TestLoginForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter an email");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await signIn("credentials", {
        email,
        redirect: true,
        callbackUrl: "/"
      });
      
      if (result?.error) {
        toast.error("Invalid test credentials");
      }
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm">Test Access</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}