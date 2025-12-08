"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast, Toaster } from "sonner";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />;
      case "account":
        return <AccountSettings />;
      case "application":
        return <ApplicationSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full mx-auto p-2 md:p-3 lg:p-4 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="flex flex-col md:flex-row">
        <aside className="w-full md:w-1/4 lg:w-1/5 p-3">
          <h2 className="text-2xl font-bold mb-6">Settings</h2>
          <nav className="flex flex-row md:flex-col gap-2">
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              onClick={() => setActiveTab("profile")}
              className="justify-start w-full"
            >
              Profile
            </Button>
            <Button
              variant={activeTab === "account" ? "default" : "ghost"}
              onClick={() => setActiveTab("account")}
              className="justify-start w-full"
            >
              Account
            </Button>
            <Button
              variant={activeTab === "application" ? "default" : "ghost"}
              onClick={() => setActiveTab("application")}
              className="justify-start w-full"
            >
              Application
            </Button>
          </nav>
        </aside>
        <main className="w-full md:w-3/4 lg:w-4/5 p-3 md:p-4 lg:p-5">
         
        </main>
      </div>
      <Toaster />
    </div>
  );
};

const ProfileSettings = () => {
  const handleSave = () => {
    toast.success("Profile settings saved successfully!");
  };
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Profile Settings</h3>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue="John Doe" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue="john.doe@example.com" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            className="w-full p-2 border rounded-md bg-neutral-100 dark:bg-neutral-900"
            defaultValue="I am a content creator."
          />
        </div>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};

const AccountSettings = () => {
  const handleSave = () => {
    toast.success("Account settings saved successfully!");
  };
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" defaultValue="johndoe" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Button variant="outline" className="w-fit">
            Change Password
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Two-Factor Authentication</h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Keep your account secure.
            </p>
          </div>
          <Switch />
        </div>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};

const ApplicationSettings = () => {
  const handleSave = () => {
    toast.success("Application settings saved successfully!");
  };
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Application Settings</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Dark Mode</h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Toggle the dark mode theme.
            </p>
          </div>
          <Switch />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="language">Language</Label>
          <Select>
            <SelectTrigger className="w-full md:w-1/2 lg:w-1/3">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Email Notifications</h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Receive email notifications for important events.
            </p>
          </div>
          <Switch />
        </div>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};

export default Settings;
