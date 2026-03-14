create or replace function public.admin_users_overview()
returns table (
  user_id uuid,
  email text,
  full_name text,
  phone text,
  role text,
  auth_methods text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  landlord_pan_verified boolean,
  tenant_pan_verified boolean,
  tenant_aadhaar_verified boolean
)
language sql
security definer
set search_path = public, auth
as $$
  select
    u.id as user_id,
    u.email,
    p.full_name,
    p.phone,
    ur.role::text as role,
    coalesce(ids.providers, 'email') as auth_methods,
    u.created_at,
    u.last_sign_in_at,
    l.pan_verified as landlord_pan_verified,
    t.pan_verified as tenant_pan_verified,
    t.aadhaar_verified as tenant_aadhaar_verified
  from auth.users u
  left join public.profiles p on p.user_id = u.id
  left join public.user_roles ur on ur.user_id = u.id
  left join public.landlords l on l.user_id = u.id
  left join public.tenants t on t.user_id = u.id
  left join lateral (
    select string_agg(distinct i.provider, ', ' order by i.provider) as providers
    from auth.identities i
    where i.user_id = u.id
  ) ids on true
  order by u.created_at desc;
$$;

grant execute on function public.admin_users_overview() to anon, authenticated;
