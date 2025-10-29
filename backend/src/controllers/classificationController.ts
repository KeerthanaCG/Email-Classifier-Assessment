

import { Request, Response } from "express";
import { createOpenAI } from "../services/openaiService";

const systemPrompt = `You are an intelligent email classifier.
Assign each email to EXACTLY ONE of the following categories:

1. **Important** College/university notices, placement drives, exams, assignments, internship messages, delivery/shipment/order updates, or any urgent communication that needs user attention.
   - Examples: "Placement drive tomorrow", "Your order has been shipped", "Class cancelled", "Internshala message from recruiter", "Delivery arriving today".
   - Keywords: "placement", "college", "exam", "class", "university", "urgent", "internshala message", "requirement", "delivery", "shipped", "order update", "package", "arriving", "dispatched".

2. **Promotions**  Sales, discounts, deals, or coupons for products/services.
   - Examples: "Amazon Sale 50% Off", "Exclusive coupon for you".
   - Keywords: "offer", "discount", "deal", "coupon", "promo", "sale", "save", "limited-time".

3. **Social** notifications from social media or personal interactions.
   - Examples: "You have a new friend request on Facebook", "Someone liked your post".
   - Keywords: "Facebook", "Instagram", "Twitter", "LinkedIn connection", "friend", "follower", "social update".

4. **Marketing** newsletters, job alerts, app notifications, or product updates.
   - Examples: "Weekly newsletter from LinkedIn", "New job openings", "Swiggy offers", "Zomato recommendation".
   - Keywords: "LinkedIn jobs", "Internshala job", "newsletter", "subscription", "career alert", "Zomato", "Swiggy", "update", "product release".

5. **Spam** Suspicious, phishing, irrelevant, or unsolicited content.
   - Examples: "Win a lottery", "Click here to verify your account", "Get rich fast".
   - Keywords: "lottery", "win money", "click here", "verify account", "phishing", "claim prize".

6. **General** Everything else not covered above.

Respond with ONLY ONE of these words:
Important, Promotions, Social, Marketing, Spam, or General.

Be consistent and follow the keyword logic strictly.`;

export const classifyEmails = async (req: Request, res: Response) => {
    try {
        const { emails, openaiApiKey } = req.body;
        if (!openaiApiKey)
            return res
                .status(400)
                .json({ success: false, error: "OpenAI API key is required" });
        if (!emails || !Array.isArray(emails) || emails.length === 0)
            return res
                .status(400)
                .json({ success: false, error: "No emails provided" });

        const client = createOpenAI(openaiApiKey);
        const classifications: any[] = [];

        for (let i = 0; i < emails.length; i++) {
            const e = emails[i];
            const content = `From: ${e.from || "Unknown"}\nSubject: ${e.subject || "No Subject"
                }\nBody Preview: ${(e.snippet || e.body || "")
                    .replace(/\s+/g, " ")
                    .substring(0, 800)}`;

            try {
                const resp: any = await client.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `Classify this email:\n\n${content}` },
                    ],
                    max_tokens: 10,
                    temperature: 0.1,
                });

                let cat = (resp.choices?.[0]?.message?.content || "General").trim();
                cat = cat.replace(/[^a-zA-Z]/g, "");

                const map: Record<string, string> = {
                    important: "Important",
                    promotions: "Promotions",
                    promotion: "Promotions",
                    social: "Social",
                    marketing: "Marketing",
                    spam: "Spam",
                    general: "General",
                    newsletter: "Marketing",
                };

                const final = map[cat.toLowerCase()] || "General";
                classifications.push({ ...e, category: final });
            } catch (err) {
                console.warn("OpenAI error, using fallback rules:", err);

                const text = (
                    (e.subject || "") +
                    " " +
                    (e.from || "") +
                    " " +
                    (e.snippet || "") +
                    " " +
                    (e.body || "")
                ).toLowerCase();

                let fallback = "General";

                if (
                    /\b(class|placement|college|university|exam|assignment|internshala(?!.*job)|urgent|requirement|delivery|shipped|dispatched|package|arriving|order update|out for delivery)\b/.test(
                        text
                    )
                )
                    fallback = "Important";
                else if (
                    /\b(zomato|swiggy|linkedin.*job|internshala.*job|newsletter|subscription|career alert|updates|product update)\b/.test(
                        text
                    )
                )
                    fallback = "Marketing";
                else if (/\b(sale|discount|offer|deal|coupon|promo|save)\b/.test(text))
                    fallback = "Promotions";
                else if (
                    /\b(facebook|instagram|twitter|linkedin.*connect|friend|tagged|follower|social)\b/.test(
                        text
                    )
                )
                    fallback = "Social";
                else if (
                    /\b(spam|phishing|suspicious|verify your account|click here now|lottery|win money)\b/.test(
                        text
                    )
                )
                    fallback = "Spam";

                classifications.push({ ...e, category: fallback });
            }


            if (i < emails.length - 1) await new Promise((r) => setTimeout(r, 200));
        }

        const stats = classifications.reduce((acc: any, c: any) => {
            acc[c.category] = (acc[c.category] || 0) + 1;
            return acc;
        }, {});

        res.json({
            success: true,
            classifications,
            stats: { total: classifications.length, byCategory: stats },
        });
    } catch (err) {
        console.error("classifyEmails error", err);
        res.status(500).json({ success: false, error: "Classification failed" });
    }
};
