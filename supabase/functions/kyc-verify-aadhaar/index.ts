const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ProviderAadhaarResponse = {
  verified?: boolean;
  status?: string;
  fullName?: string;
  name?: string;
  last4?: string;
  data?: {
    verified?: boolean;
    status?: string;
    fullName?: string;
    name?: string;
    last4?: string;
  };
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { aadhaarNumber } = await req.json();
    const normalized = String(aadhaarNumber || "").replace(/\D/g, "").slice(0, 12);

    if (normalized.length !== 12) {
      return new Response(JSON.stringify({ verified: false, message: "Invalid Aadhaar format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const providerBaseUrl = Deno.env.get("KYC_PROVIDER_BASE_URL");
    const providerApiKey = Deno.env.get("KYC_PROVIDER_API_KEY");
    const providerAadhaarPath = Deno.env.get("KYC_PROVIDER_AADHAAR_PATH") || "/verify/aadhaar";

    if (!providerBaseUrl || !providerApiKey) {
      return new Response(JSON.stringify({ verified: false, message: "KYC provider is not configured" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch(`${providerBaseUrl}${providerAadhaarPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${providerApiKey}`,
      },
      body: JSON.stringify({ aadhaarNumber: normalized }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ verified: false, message: errorText || "Provider verification failed" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const providerData = (await response.json()) as ProviderAadhaarResponse;
    const resolved = providerData.data ?? providerData;
    const verified = Boolean(resolved.verified || String(resolved.status || "").toLowerCase() === "verified");

    return new Response(
      JSON.stringify({
        verified,
        fullName: resolved.fullName || resolved.name || null,
        last4: resolved.last4 || normalized.slice(-4),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ verified: false, message: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
