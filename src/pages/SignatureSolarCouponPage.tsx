import { SEO } from "../components/SEO";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  SIGNATURE_SOLAR_LAST_VERIFIED,
  SIGNATURE_SOLAR_LAST_VERIFIED_DATE,
} from "../data/coupon-verification";
import { COUPON_CODE, verifiedMonthLabel } from "../data/signature-solar-content.mjs";
import {
  SignatureSolarCouponMain,
  useIsDarkMode,
  LIGHT,
  DARK,
} from "./SignatureSolarCouponMain";

/**
 * Page shell for /signature-solar-coupon.
 *
 * Only the chrome lives here — meta tags, Header, Footer, and the themed
 * wrapper. All the actual content is in SignatureSolarCouponMain, which is kept
 * free of router hooks and browser globals so scripts/prerender-seo.js can
 * render it to a string in Node and bake it into the static HTML. Anything
 * added here is invisible to non-JS crawlers by design; anything that needs to
 * be crawlable belongs in the main component.
 */
export function SignatureSolarCouponPage() {
  const isDark = useIsDarkMode();
  const c = isDark ? DARK : LIGHT;

  return (
    <>
      <SEO
        title={`Signature Solar Coupon Code ${verifiedMonthLabel(SIGNATURE_SOLAR_LAST_VERIFIED_DATE)} – ${COUPON_CODE} Gets $50 Off`}
        description={`The current Signature Solar coupon code is ${COUPON_CODE}. It takes $50 off at signaturesolar.com and works on its own at checkout. Verified active on ${SIGNATURE_SOLAR_LAST_VERIFIED} by Justin Smith of Mobile Dwellings, who runs EG4 gear in a 40-foot skoolie.`}
        keywords="signature solar coupon code, signature solar discount code, signature solar promo code, MD50OFF, EG4 coupon code, EG4 promo code, EG4 discount code, signature solar deals, signature solar sale, signature solar off grid discount, skoolie solar discount, van life solar coupon, mobile dwellings coupon, EG4 battery discount, EG4 inverter coupon"
        url="https://mobiledwellings.media/signature-solar-coupon"
        image="https://mobiledwellings.media/og-signature-solar.jpg"
        type="article"
      />

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: c.pageBg,
          color: c.text,
          transition: "background-color 0.2s ease, color 0.2s ease",
        }}
      >
        <Header />

        <SignatureSolarCouponMain />

        <Footer />
      </div>
    </>
  );
}
