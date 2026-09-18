import "./index.css";
import { Composition } from "remotion";
import { Promo, promoSchema } from "./promo/Promo";
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
    </>
  );
};
