DROP POLICY IF EXISTS "Landlords can insert properties" ON public.properties;

CREATE POLICY "Landlords can insert properties"
ON public.properties
FOR INSERT
WITH CHECK (
  auth.uid() = landlord_id
  AND public.has_role(auth.uid(), 'landlord')
  AND EXISTS (
    SELECT 1
    FROM public.landlords l
    WHERE l.user_id = auth.uid()
      AND l.pan_verified IS TRUE
  )
);

DROP POLICY IF EXISTS "Tenants can create applications" ON public.applications;

CREATE POLICY "Tenants can create applications"
ON public.applications
FOR INSERT
WITH CHECK (
  auth.uid() = tenant_id
  AND public.has_role(auth.uid(), 'tenant')
  AND EXISTS (
    SELECT 1
    FROM public.tenants t
    WHERE t.user_id = auth.uid()
      AND (COALESCE(t.pan_verified, FALSE) OR COALESCE(t.aadhaar_verified, FALSE))
  )
);
