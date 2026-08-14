import { PLANS } from "./plans";

export type CheckoutSession = {
  url: string;
  // true when the url is an external host (Stripe) the browser should
  // navigate to directly; false when it's one of our own mock-checkout
  // routes, which complete via /api/checkout/complete instead of a webhook.
  external: boolean;
};

export interface BillingProvider {
  createCheckoutSession(input: {
    planId: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<CheckoutSession>;
}

/**
 * Zero-setup provider: sends the user to our own mock checkout screen,
 * which completes the "purchase" by calling /api/checkout/complete
 * directly (no webhook involved). Good enough to demo and build the rest
 * of the product against without a Stripe account.
 */
class MockBillingProvider implements BillingProvider {
  async createCheckoutSession({ planId }: { planId: string }): Promise<CheckoutSession> {
    return { url: `/onboarding/checkout/mock?plan=${planId}`, external: false };
  }
}

/**
 * Real Stripe Checkout integration. Requires STRIPE_SECRET_KEY.
 *
 * Note: unlike the mock provider, a real integration should mark
 * checkoutCompletedAt from a Stripe webhook
 * (checkout.session.completed), not from the success_url redirect alone —
 * the redirect can fire without payment having actually settled. Wire that
 * webhook at app/api/webhooks/stripe/route.ts before going live.
 */
class StripeBillingProvider implements BillingProvider {
  async createCheckoutSession({
    planId,
    successUrl,
    cancelUrl,
  }: {
    planId: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<CheckoutSession> {
    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) throw new Error(`Unknown plan: ${planId}`);

    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `${plan.name} plan — Recreate Studio` },
            unit_amount: plan.price * 100,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "usd",
            product_data: { name: "One-time studio setup" },
            unit_amount: plan.setupFee * 100,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return { url: session.url!, external: true };
  }
}

export function getBillingProvider(): BillingProvider {
  return process.env.STRIPE_SECRET_KEY ? new StripeBillingProvider() : new MockBillingProvider();
}
