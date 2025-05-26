"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { updateUserProfile } from "@/action/user.actions";

export function OnboardingPage() {
  const { data: session, update } = useSession();
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!city && !country && !location) {
      toast.error("Please fill at least one field");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await updateUserProfile({
        city: city || undefined,
        country: country || undefined,
        location: location || undefined,
        onBoard: true,
      });
      
      if (result.status === 200) {
        await update({
          ...session,
          user: {
            ...session?.user,
            city,
            country,
            location,
            onBoard: true,
          },
        });
        
        toast.success("Profile updated successfully");
        setShowModal(false);
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSkip = async () => {
    setShowModal(false);
  };
  
  if (!showModal) return null;
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Complete Your Profile</CardTitle>
            <Button variant="ghost" size="icon" onClick={onSkip} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Help us personalize your experience by sharing your location information.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Enter your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="Enter your country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Address</Label>
              <Input
                id="location"
                placeholder="Describe your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onSkip}>
              Skip for now
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}