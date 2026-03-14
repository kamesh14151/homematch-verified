import { useEffect, useMemo, useState, useRef } from "react";
import { Building2, Home, PlusCircle, ListChecks, MessageSquare, UserCircle, Send, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";

const navItems = [
  { title: "Overview", url: "/landlord/dashboard", icon: Home },
  { title: "Add Property", url: "/landlord/add-property", icon: PlusCircle },
  { title: "My Listings", url: "/landlord/listings", icon: Building2 },
  { title: "Tenant Requests", url: "/landlord/requests", icon: ListChecks },
  { title: "Messages", url: "/landlord/messages", icon: MessageSquare },
  { title: "Profile", url: "/landlord/profile", icon: UserCircle },
];

type Thread = {
  id: string;
  status: string;
  propertyTitle: string;
  tenantName: string;
  tenantId: string;
};

type Message = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
};

export default function LandlordMessages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const selectedAppFromQuery = searchParams.get("app");
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(selectedAppFromQuery);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadPreviews, setThreadPreviews] = useState<Map<string, string>>(new Map());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadThreads = async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);

    const { data: props } = await supabase.from("properties").select("id, title").eq("landlord_id", user.id);
    if (!props?.length) { setThreads([]); setLoading(false); return; }

    const propMap = new Map(props.map((p) => [p.id, p.title]));
    const propIds = props.map((p) => p.id);

    const { data: apps } = await supabase
      .from("applications")
      .select("id, property_id, tenant_id, status")
      .in("property_id", propIds)
      .order("updated_at", { ascending: false });

    if (!apps?.length) { setThreads([]); setLoading(false); return; }

    const tenantIds = [...new Set(apps.map((a) => a.tenant_id))];
    const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", tenantIds);
    const tenantMap = new Map((profiles ?? []).map((p) => [p.user_id, p.full_name || "Tenant"]));

    const mapped = apps.map((a) => ({
      id: a.id,
      status: a.status,
      propertyTitle: propMap.get(a.property_id) || "Property",
      tenantName: tenantMap.get(a.tenant_id) || "Tenant",
      tenantId: a.tenant_id,
    }));

    setThreads(mapped);
    if (!activeId && mapped.length > 0) setActiveId(mapped[0].id);

    const previews = new Map<string, string>();
    for (const t of mapped) {
      const { data: lastMsg } = await supabase
        .from("messages")
        .select("content")
        .eq("application_id", t.id)
        .order("created_at", { ascending: false })
        .limit(1);
      previews.set(t.id, lastMsg?.[0]?.content || "No messages yet");
    }
    setThreadPreviews(previews);
    setLoading(false);
  };

  const loadMessages = async (appId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("id, sender_id, content, created_at")
      .eq("application_id", appId)
      .order("created_at", { ascending: true });

    setMessages(
      (data ?? []).map((m) => ({
        id: m.id,
        senderId: m.sender_id,
        content: m.content,
        createdAt: m.created_at,
      }))
    );
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  useEffect(() => { void loadThreads(); }, [user]);

  useEffect(() => {
    if (selectedAppFromQuery) setActiveId(selectedAppFromQuery);
  }, [selectedAppFromQuery]);

  useEffect(() => {
    if (!activeId) return;
    void loadMessages(activeId);

    const channel = supabase
      .channel(`messages-${activeId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `application_id=eq.${activeId}` },
        (payload) => {
          const m = payload.new as any;
          setMessages((prev) => [...prev, { id: m.id, senderId: m.sender_id, content: m.content, createdAt: m.created_at }]);
          setThreadPreviews((prev) => new Map(prev).set(activeId, m.content));
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeId]);

  const activeThread = useMemo(() => threads.find((t) => t.id === activeId) || null, [threads, activeId]);

  const handleSend = async () => {
    if (!activeId || !newMessage.trim() || !user) return;
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      application_id: activeId,
      sender_id: user.id,
      content: newMessage.trim(),
    });
    setSending(false);
    if (error) {
      toast({ title: "Failed to send", description: error.message, variant: "destructive" });
      return;
    }
    setNewMessage("");
  };

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <DashboardLayout navItems={navItems} title="Landlord">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Chat with tenants in real-time</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : threads.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 font-semibold">No messages yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Messages from tenants will appear here</p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
            <div className="max-h-[560px] space-y-2 overflow-y-auto rounded-lg border bg-card p-2">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setActiveId(thread.id)}
                  className={`w-full rounded-md border p-3 text-left transition-colors ${
                    thread.id === activeId ? "bg-accent border-primary/20" : "bg-background hover:bg-accent/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium line-clamp-1">{thread.tenantName}</p>
                    <Badge variant="secondary" className="text-[10px]">{thread.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{thread.propertyTitle}</p>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                    {threadPreviews.get(thread.id) || "No messages"}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex h-[560px] flex-col rounded-lg border bg-card">
              <div className="border-b p-4">
                <p className="font-semibold">{activeThread?.tenantName}</p>
                <p className="text-xs text-muted-foreground">{activeThread?.propertyTitle}</p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">No messages yet. Say hello!</p>
                )}
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                      msg.senderId === user?.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}>
                      <p>{msg.content}</p>
                      <p className={`mt-1 text-[10px] ${
                        msg.senderId === user?.id ? "text-primary-foreground/60" : "text-muted-foreground"
                      }`}>{formatTime(msg.createdAt)}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex gap-2 border-t p-3">
                <Input
                  placeholder="Type your reply..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void handleSend(); } }}
                  disabled={sending}
                />
                <Button size="icon" onClick={() => void handleSend()} disabled={sending || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
