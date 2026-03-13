import { useEffect, useMemo, useState } from "react";
import { Search, Bookmark, FileText, MessageSquare, UserCircle, Home } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";

const navItems = [
  { title: "Search Houses", url: "/tenant/dashboard", icon: Search },
  { title: "Saved Houses", url: "/tenant/saved", icon: Bookmark },
  { title: "Applications", url: "/tenant/applications", icon: FileText },
  { title: "My Bookings", url: "/tenant/bookings", icon: Home },
  { title: "Messages", url: "/tenant/messages", icon: MessageSquare },
  { title: "Profile", url: "/tenant/profile", icon: UserCircle },
];

export default function TenantMessages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const selectedAppFromQuery = searchParams.get("app");
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(selectedAppFromQuery);
  const [newMessage, setNewMessage] = useState("");
  const [threads, setThreads] = useState<
    Array<{
      id: string;
      status: string;
      propertyTitle: string;
      landlordName: string;
      transcript: string;
    }>
  >([]);

  const loadThreads = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data: applicationRows, error } = await supabase
      .from("applications")
      .select("id, property_id, status, message")
      .eq("tenant_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      toast({ title: "Unable to load messages", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const propertyIds = Array.from(new Set((applicationRows ?? []).map((item) => item.property_id)));
    const { data: propertyRows } = await supabase
      .from("properties")
      .select("id, title, landlord_id")
      .in("id", propertyIds);
    const propertyMap = new Map((propertyRows ?? []).map((item) => [item.id, item]));

    const landlordIds = Array.from(new Set((propertyRows ?? []).map((item) => item.landlord_id)));
    const { data: profileRows } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", landlordIds);
    const landlordMap = new Map((profileRows ?? []).map((item) => [item.user_id, item.full_name || "Landlord"]));

    const mapped = (applicationRows ?? []).map((item) => {
      const property = propertyMap.get(item.property_id);
      return {
        id: item.id,
        status: item.status,
        propertyTitle: property?.title || "Property",
        landlordName: property ? landlordMap.get(property.landlord_id) || "Landlord" : "Landlord",
        transcript: item.message || "",
      };
    });

    setThreads(mapped);
    setActiveId((current) => current || mapped[0]?.id || null);
    setLoading(false);
  };

  useEffect(() => {
    void loadThreads();
  }, [user]);

  useEffect(() => {
    if (selectedAppFromQuery) {
      setActiveId(selectedAppFromQuery);
    }
  }, [selectedAppFromQuery]);

  const activeThread = useMemo(() => threads.find((thread) => thread.id === activeId) || null, [threads, activeId]);

  const messages = useMemo(() => {
    if (!activeThread?.transcript) return [] as Array<{ sender: "tenant" | "landlord"; text: string }>;
    return activeThread.transcript
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        if (line.startsWith("Landlord:")) return { sender: "landlord" as const, text: line.replace("Landlord:", "").trim() };
        return { sender: "tenant" as const, text: line.replace("Tenant:", "").trim() };
      });
  }, [activeThread]);

  const handleSendMessage = async () => {
    if (!activeThread || !newMessage.trim()) return;
    const nextTranscript = `${activeThread.transcript ? `${activeThread.transcript}\n` : ""}Tenant: ${newMessage.trim()}`;
    const { error } = await supabase
      .from("applications")
      .update({ message: nextTranscript, updated_at: new Date().toISOString() })
      .eq("id", activeThread.id);

    if (error) {
      toast({ title: "Message failed", description: error.message, variant: "destructive" });
      return;
    }

    setNewMessage("");
    await loadThreads();
  };

  return (
    <DashboardLayout navItems={navItems} title="Tenant">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Chat with landlords</p>
        </div>

        {loading ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">Loading chats...</div>
        ) : threads.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 font-semibold">No messages yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Messages from landlords will appear here</p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
            <div className="max-h-[560px] space-y-2 overflow-y-auto rounded-lg border bg-card p-2">
              {threads.map((thread) => {
                const preview = thread.transcript.split("\n").filter(Boolean).slice(-1)[0] || "No messages";
                const active = thread.id === activeId;
                return (
                  <button
                    key={thread.id}
                    onClick={() => setActiveId(thread.id)}
                    className={`w-full rounded-md border p-3 text-left ${active ? "bg-accent" : "bg-background hover:bg-accent/50"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium line-clamp-1">{thread.landlordName}</p>
                      <Badge variant="secondary">{thread.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{thread.propertyTitle}</p>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{preview}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex h-[560px] flex-col rounded-lg border bg-card">
              <div className="border-b p-4">
                <p className="font-semibold">{activeThread?.landlordName}</p>
                <p className="text-xs text-muted-foreground">{activeThread?.propertyTitle}</p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((message, index) => (
                  <div key={`${message.sender}-${index}`} className={`flex ${message.sender === "tenant" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${message.sender === "tenant" ? "bg-primary text-primary-foreground" : "bg-accent text-foreground"}`}>
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 border-t p-3">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void handleSendMessage();
                    }
                  }}
                />
                <Button onClick={() => void handleSendMessage()}>Send</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
