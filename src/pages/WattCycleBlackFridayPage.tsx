import { SEO } from "../components/SEO";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  WC_COUPON_CODE,
  WC_BF_URL,
  WC_OG_IMAGE,
  WC_BLACK_FRIDAY,
  wcBfDescription,
} from "../data/wattcycle-black-friday-content.mjs";
import { WattCycleBlackFridayMain } from "./WattCycleBlackFridayMain";
import { useIsDarkMode, LIGHT, DARK } from "./SignatureSolarCouponMain";

/**
 * Page shell for /wattcycle-black-friday: meta tags, Header, Footer.
 * All crawlable content is in WattCycleBlackFridayMain, which the build prerenders.
 */
export function WattCycleBlackFridayPage() {
  const isDark = useIsDarkMode();
  const c = isDark ? DARK : LIGHT;

  return (
    <>
      <SEO
        title={`WattCycle Black Friday ${WC_BLACK_FRIDAY.year} – ${WC_COUPON_CODE} Stacks 8% Off Sale Prices`}
        description={wcBfDescription()}
        keywords={`wattcycle black friday, wattcycle black friday sale, wattcycle black friday ${WC_BLACK_FRIDAY.year}, wattcycle cyber monday, wattcycle coupon code, wattcycle discount code, ${WC_COUPON_CODE}, lifepo4 battery black friday`}
        url={WC_BF_URL}
        image={WC_OG_IMAGE}
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
        <WattCycleBlackFridayMain />
        <Footer />
      </div>
    </>
  );
}
