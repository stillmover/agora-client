import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, Suspense } from "react";
import { ROUTES } from "@/shared/config";
import {
  User,
  Bell,
  Shield,
  Palette,
  LogOut,
  ChevronRight,
  Settings,
  Lock,
  Mail,
  Globe,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { useIsAuthenticated, useSessionUser, useLogout } from "@/entities/session";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Textarea,
  ImageUpload,
  FormField,
  Badge,
  Spinner,
} from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

export const Route = createFileRoute("/_main/settings")({
  component: SettingsPage,
});

type SettingsSection = "profile" | "account" | "notifications" | "privacy" | "appearance";

const settingsSections = [
  {
    description: "Manage your public profile",
    icon: User,
    id: "profile" as const,
    label: "Profile",
  },
  {
    description: "Email, password, and security",
    icon: Settings,
    id: "account" as const,
    label: "Account",
  },
  {
    description: "Email and push notifications",
    icon: Bell,
    id: "notifications" as const,
    label: "Notifications",
  },
  {
    description: "Control your visibility",
    icon: Shield,
    id: "privacy" as const,
    label: "Privacy & Safety",
  },
  {
    description: "Theme and display settings",
    icon: Palette,
    id: "appearance" as const,
    label: "Appearance",
  },
];

function SettingsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <SettingsPageContent />
    </Suspense>
  );
}

function SettingsPageContent() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const user = useSessionUser();
  const { logout } = useLogout();
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");

  if (!isAuthenticated || !user) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Settings className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Sign in to access settings</h2>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to manage your settings.
          </p>
          <Button variant="brand" onClick={() => navigate({ to: ROUTES.HOME })}>
            Go to Home
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleLogout = async () => {
    await logout();
    window.location.assign(ROUTES.LOGIN);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left",
                    "transition-colors duration-150",
                    activeSection === section.id
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <section.icon className="h-5 w-5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{section.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{section.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </button>
              ))}

              <hr className="my-2" />

              <button
                onClick={handleLogout}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left",
                  "text-destructive hover:bg-destructive/10",
                  "transition-colors duration-150"
                )}
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Sign out</span>
              </button>
            </nav>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {activeSection === "profile" && <ProfileSettings user={user} />}
          {activeSection === "account" && <AccountSettings user={user} />}
          {activeSection === "notifications" && <NotificationSettings />}
          {activeSection === "privacy" && <PrivacySettings />}
          {activeSection === "appearance" && <AppearanceSettings />}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings({ user }: { user: { username: string; email?: string } }) {
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [bannerUrl, setBannerUrl] = useState<string>();
  const [displayName, setDisplayName] = useState(user.username);
  const [bio, setBio] = useState("");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            This information will be displayed publicly on your profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <ImageUpload
              value={bannerUrl}
              onChange={setBannerUrl}
              variant="banner"
              placeholder="Add a banner image"
              className="w-full"
            />
            <div className="-mt-10 ml-4 relative z-10">
              <div className="inline-block rounded-full bg-background p-1 shadow-lg">
                <ImageUpload
                  value={avatarUrl}
                  onChange={setAvatarUrl}
                  variant="circle"
                  size="lg"
                  placeholder="Avatar"
                />
              </div>
            </div>
          </div>

          <FormField
            label="Display name"
            hint="This is how your name will appear on the site."
            htmlFor="displayName"
          >
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              maxLength={30}
            />
          </FormField>

          <FormField
            label="Username"
            hint="Your unique username cannot be changed."
            htmlFor="username"
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                u/
              </span>
              <Input id="username" value={user.username} disabled className="pl-8 bg-muted" />
            </div>
          </FormField>

          <FormField
            label="About"
            hint="A brief description that appears on your profile."
            charCount={bio.length}
            charMax={200}
            htmlFor="bio"
          >
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              maxLength={200}
              className="resize-none"
            />
          </FormField>

          <div className="flex justify-end">
            <Button variant="brand">Save changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Social links</CardTitle>
          <CardDescription>Add links to your other social profiles.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Website" htmlFor="website">
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="website" placeholder="https://example.com" className="pl-10" />
            </div>
          </FormField>

          <div className="flex justify-end">
            <Button variant="outline">Add social link</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AccountSettings({ user }: { user: { username: string; email?: string } }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
          <CardDescription>Manage your email address and verification status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Email address" htmlFor="email">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={user.email || ""}
                placeholder="your@email.com"
                className="pl-10"
              />
            </div>
          </FormField>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-success border-success">
              Verified
            </Badge>
            <span className="text-sm text-muted-foreground">Your email is verified</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Current password" htmlFor="currentPassword">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                className="pl-10"
              />
            </div>
          </FormField>

          <FormField label="New password" htmlFor="newPassword">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                className="pl-10"
              />
            </div>
          </FormField>

          <div className="flex justify-end">
            <Button variant="outline">Update password</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>Irreversible actions that affect your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
            <div>
              <p className="font-medium">Delete account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data.
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Delete account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification preferences</CardTitle>
        <CardDescription>Choose what notifications you want to receive.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <NotificationToggle
          title="Comments"
          description="Get notified when someone comments on your posts."
          defaultChecked
        />
        <NotificationToggle
          title="Replies"
          description="Get notified when someone replies to your comments."
          defaultChecked
        />
        <NotificationToggle
          title="Mentions"
          description="Get notified when someone mentions you."
          defaultChecked
        />
        <NotificationToggle title="Upvotes" description="Get notified about upvote milestones." />
        <NotificationToggle
          title="Followers"
          description="Get notified when someone follows you."
          defaultChecked
        />
        <NotificationToggle
          title="Community updates"
          description="Get updates from communities you've joined."
        />
      </CardContent>
    </Card>
  );
}

function NotificationToggle({
  title,
  description,
  defaultChecked = false,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          checked ? "bg-brand" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

function PrivacySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy settings</CardTitle>
        <CardDescription>Control who can see your content and interact with you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <NotificationToggle
          title="Public profile"
          description="Allow anyone to view your profile."
          defaultChecked
        />
        <NotificationToggle
          title="Show online status"
          description="Let others see when you're active."
          defaultChecked
        />
        <NotificationToggle
          title="Allow direct messages"
          description="Let others send you direct messages."
          defaultChecked
        />
        <NotificationToggle
          title="Show in search results"
          description="Allow your profile to appear in search."
          defaultChecked
        />
        <NotificationToggle
          title="Content visibility"
          description="Show your posts in r/all and popular feeds."
          defaultChecked
        />
      </CardContent>
    </Card>
  );
}

function AppearanceSettings() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize how the app looks on your device.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="font-medium mb-3">Theme</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Sun, label: "Light", value: "light" as const },
              { icon: Moon, label: "Dark", value: "dark" as const },
              { icon: Monitor, label: "System", value: "system" as const },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                  theme === option.value
                    ? "border-brand bg-brand/5"
                    : "border-border hover:border-muted-foreground/30"
                )}
              >
                <option.icon
                  className={cn(
                    "h-6 w-6",
                    theme === option.value ? "text-brand" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    theme === option.value ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <NotificationToggle
          title="Reduce motion"
          description="Minimize animations throughout the app."
        />
        <NotificationToggle
          title="Compact mode"
          description="Use a more compact view for post cards."
        />
      </CardContent>
    </Card>
  );
}
