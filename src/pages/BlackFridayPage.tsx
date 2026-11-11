import { SEO } from "../components/SEO";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  COUPON_CODE,
  BF_URL,
  BLACK_FRIDAY,
  bfDescription,
} from "../data/black-friday-content.mjs";
import { BlackFridayMain } from "./BlackFridayMain";
import { useIsDarkMode, LIGHT, DARK } from "./SignatureSolarCouponMain";

/**
 * Page shell for /signature-solar-black-friday — meta tags, Header, Footer.
 * All crawlable content is in BlackFridayMain, which the build prerenders.
 */
export function BlackFridayPage() {
  const isDark = useIsDarkMode();
  const c = isDark ? DARK : LIGHT;

  return (
    <>
      <SEO
        title={`Signature Solar Black Friday ${BLACK_FRIDAY.year} – ${COUPON_CODE} Stacks on Sale Prices`}
        description={bfDescription()}
        keywords={`signature solar black friday, signature solar black friday sale, signature solar black friday ${BLACK_FRIDAY.year}, signature solar cyber monday, EG4 black friday, signature solar coupon code, ${COUPON_CODE}`}
        url={BF_URL}
        image="https://mobiledwellings.media/og-signature-solar.png"
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
        <BlackFridayMain />
        <Footer />
      </div>
    </>
  );
}
