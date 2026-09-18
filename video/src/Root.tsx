import "./index.css";
import { Composition } from "remotion";
import { Promo, promoSchema } from "./promo/Promo";
import { Wepack, wepackSchema } from "./wepack/Wepack";
import { TOTAL as WEPACK_TOTAL } from "./wepack/theme";
import { FPS, TOTAL } from "./promo/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Film produit 16:9 — npx remotion render PompePeristaltique */}
      <Composition
        id="PompePeristaltique"
        component={Promo}
        durationInFrames={TOTAL}
        fps={FPS}
        width={1920}
        height={1080}
        schema={promoSchema}
        defaultProps={{
          brand: "ASERTI",
          product: "Pompe péristaltique compacte",
          reference: "PP4001P0001",
          website: "www.wepack-machinery.com",
        }}
      />

      {/* Film de gamme WEPACK — npx remotion render WepackMotoreducteurs */}
      <Composition
        id="WepackMotoreducteurs"
        component={Wepack}
        durationInFrames={WEPACK_TOTAL}
        fps={FPS}
        width={1920}
        height={1080}
        schema={wepackSchema}
        defaultProps={{
          brand: "WEPACK",
          claim: "Motoréducteurs haute performance",
          warranty: "Garantie 2 ans",
          signature: "Une offre exclusive signée WEPACK.",
        }}
      />
    </>
  );
};
