
-- Create messages table for proper chat
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages for applications they're part of
CREATE POLICY "Users can view their messages" ON public.messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM applications a
    WHERE a.id = messages.application_id
    AND (
      a.tenant_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM properties p WHERE p.id = a.property_id AND p.landlord_id = auth.uid()
      )
    )
  )
);

-- Users can send messages to applications they're part of
CREATE POLICY "Users can send messages" ON public.messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM applications a
    WHERE a.id = messages.application_id
    AND (
      a.tenant_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM properties p WHERE p.id = a.property_id AND p.landlord_id = auth.uid()
      )
    )
  )
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
