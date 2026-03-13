import { GoogleGenAI, Type } from "@google/genai";

export interface UXAnalysis {
  harshnessExplanation: string;
  harshnessScore: number; // 0-100, where 100 is very harsh
  triggerWords: string[]; // Specific words that contribute to the harsh tone
  alternatives: {
    direct: string;
    empathetic: string;
    encouraging: string;
  };
}

export async function analyzeNotification(notification: string): Promise<UXAnalysis> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an expert UX Writer. Analyze the following user notification: "${notification}"
    
    Follow this style for your analysis based on these examples:

    Example 1: The Failed Payment (High Stress)
    Input: "Credit card declined. Update payment method immediately or lose access."
    Output:
    - Why it's harsh: It uses threatening language ("immediately or lose access") and induces panic during an already stressful moment.
    - Harshness Score: 85
    - Trigger Words: ["immediately", "lose access", "declined"]
    - Alternatives:
      1. Direct: Your payment didn't go through. Please update your card details.
      2. Empathetic: We couldn't process your payment this time. Please check your billing details so we can keep your account active.
      3. Encouraging: Oops, a quick billing hiccup! Let's get your payment info updated so you can keep enjoying the platform without interruption.

    Example 2: Form Validation (Frustration)
    Input: "Invalid email format. You must enter a real email."
    Output:
    - Why it's harsh: It's accusatory ("You must") and implying the user doesn't have a "real" email is condescending.
    - Alternatives:
      1. Direct: Please enter a valid email address (e.g., name@email.com).
      2. Empathetic: It looks like there might be a typo in your email. Could you double-check it for us?
      3. Encouraging: Almost there! Just make sure your email includes an '@' symbol and we'll get you signed up.

    Example 3: Empty State (Disappointment)
    Input: "No results found. Try again."
    Output:
    - Why it's harsh: It's blunt, unhelpful, and gives a command without offering any actual guidance on how to succeed.
    - Alternatives:
      1. Direct: We couldn't find any matches for this search.
      2. Empathetic: We didn't find anything matching your search this time. Could you try using different keywords?
      3. Encouraging: Looks like we came up empty! Try tweaking your filters or search terms, and we'll look again.

    Example 4: Session Timeout (Confusion)
    Input: "Session expired due to inactivity. Log in again."
    Output:
    - Why it's harsh: It's robotic and essentially blames the user ("due to inactivity") for what is actually a system security measure.
    - Alternatives:
      1. Direct: Your session has timed out. Please log back in.
      2. Empathetic: To keep your information secure, we log you out after a while. Please sign in again to continue.
      3. Encouraging: Welcome back! For your security, please log in once more to pick up exactly where you left off.

    Example 5: Paywall / Upsell (Annoyance)
    Input: "Action forbidden. Upgrade your plan to access this feature."
    Output:
    - Why it's harsh: "Forbidden" sounds like a punishment, and it abruptly demands an upgrade without establishing value.
    - Alternatives:
      1. Direct: This feature is only available on our Premium plan.
      2. Empathetic: This feature isn't included in your current plan. Would you like to view our upgrade options?
      3. Encouraging: Ready to unlock this feature? Upgrading your plan gives you full access to this tool to help you work even faster!

    Provide your analysis in the following JSON format:
    - harshnessExplanation: A concise explanation of why the original text sounds harsh or robotic.
    - harshnessScore: A number from 0 to 100 representing the severity of the harshness.
    - triggerWords: An array of strings containing the specific words or phrases that make the text sound harsh.
    - alternatives:
      - direct: A clear, polite alternative.
      - empathetic: An alternative that acknowledges user context or feelings.
      - encouraging: A positive, solution-oriented alternative.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          harshnessExplanation: {
            type: Type.STRING,
            description: "Explanation of why the original text sounds harsh.",
          },
          harshnessScore: {
            type: Type.NUMBER,
            description: "Severity score from 0-100.",
          },
          triggerWords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of harsh words.",
          },
          alternatives: {
            type: Type.OBJECT,
            properties: {
              direct: { type: Type.STRING },
              empathetic: { type: Type.STRING },
              encouraging: { type: Type.STRING },
            },
            required: ["direct", "empathetic", "encouraging"],
          },
        },
        required: ["harshnessExplanation", "harshnessScore", "triggerWords", "alternatives"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as UXAnalysis;
}
