import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportText } = await req.json();
    
    if (!reportText) {
      throw new Error('Report text is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Analyzing medical report...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are VEEVA's medical report analyzer. Your role is to:
            
            1. Read and understand medical reports (blood tests, lab results, imaging reports, etc.)
            2. Explain medical terminology in simple, easy-to-understand language
            3. Highlight key findings and what they mean
            4. Identify values that are outside normal ranges
            5. Provide context about what the results might indicate
            6. Suggest follow-up actions or when to consult a doctor
            
            IMPORTANT GUIDELINES:
            - Use simple, non-technical language
            - Break down complex medical terms
            - Organize your analysis clearly with sections
            - Always emphasize that this is educational information only
            - Never provide definitive diagnoses
            - Always recommend consulting with healthcare professionals for proper interpretation
            - Be sensitive and supportive in your communication
            
            Format your response with clear sections:
            1. Summary Overview
            2. Key Findings
            3. Explanation of Values
            4. Recommendations
            5. When to Seek Medical Attention`
          },
          {
            role: 'user',
            content: `Please analyze this medical report and explain it in simple terms:\n\n${reportText}`
          }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AI API error:', error);
      throw new Error('Failed to analyze report');
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    console.log('Report analysis completed successfully');

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-report function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        analysis: "I'm sorry, I couldn't analyze your report at this time. Please make sure the report text is clear and try again."
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
