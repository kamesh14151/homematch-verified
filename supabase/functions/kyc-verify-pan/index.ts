const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ProviderPanResponse = {
  verified?: boolean;
  status?: string;
  fullName?: string;
  name?: string;
  data?: {
    verified?: boolean;
    status?: string;
    fullName?: string;
    name?: string;
  };
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { panNumber } = await req.json();

    if (!panNumber || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(String(panNumber).toUpperCase())) {
      return new Response(JSON.stringify({ verified: false, message: "Invalid PAN format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const providerBaseUrl = Deno.env.get("KYC_PROVIDER_BASE_URL");
    const providerApiKey = Deno.env.get("KYC_PROVIDER_API_KEY");
    const providerPanPath = Deno.env.get("KYC_PROVIDER_PAN_PATH") || "/verify/pan";

    if (!providerBaseUrl || !providerApiKey) {
      return new Response(JSON.stringify({ verified: false, message: "KYC provider is not configured" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch(`${providerBaseUrl}${providerPanPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${providerApiKey}`,
      },
      body: JSON.stringify({ panNumber: String(panNumber).toUpperCase() }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ verified: false, message: errorText || "Provider verification failed" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const providerData = (await response.json()) as ProviderPanResponse;
    const resolved = providerData.data ?? providerData;
    const verified = Boolean(resolved.verified || String(resolved.status || "").toLowerCase() === "verified");

    return new Response(
      JSON.stringify({
        verified,
        fullName: resolved.fullName || resolved.name || null,
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
