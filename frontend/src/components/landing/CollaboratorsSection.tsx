import { Building2, Heart, Shield } from "lucide-react";
import { motion } from "framer-motion";
import teamImg from "@/assets/team-collab.jpg";
import { useLang } from "@/contexts/AppContexts";
import type { TranslationKey } from "@/i18n/translations";

const CollaboratorsSection = () => {
  const { t } = useLang();

  const collaborators: { icon: any; nameKey: TranslationKey; typeKey: TranslationKey; descKey: TranslationKey }[] = [
    { icon: Building2, nameKey: "collab1Name", typeKey: "collab1Type", descKey: "collab1Desc" },
    { icon: Heart,     nameKey: "collab2Name", typeKey: "collab2Type", descKey: "collab2Desc" },
    { icon: Shield,    nameKey: "collab3Name", typeKey: "collab3Type", descKey: "collab3Desc" },
    { icon: Building2, nameKey: "collab4Name", typeKey: "collab4Type", descKey: "collab4Desc" },
  ];

  return (
    <section id="collaborators" className="section-padding bg-background dark:bg-gray-950">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t("collabTitle1")}{" "}
            {t("collabTitle2") && <span className="text-primary">{t("collabTitle2")}</span>}
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">{t("collabSubtitle")}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <img src={teamImg} alt="Team" className="w-full h-80 object-cover" />
          </motion.div>

          <div className="space-y-4">
            {collaborators.map((c, i) => (
              <motion.div key={c.nameKey}
                initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}
                className="glass-card p-5 flex items-start gap-4 hover:border-primary/30 transition-all dark:bg-gray-800/50 dark:border-gray-700"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">{t(c.nameKey)}</h3>
                  <span className="font-body text-xs text-primary font-medium">{t(c.typeKey)}</span>
                  <p className="font-body text-sm text-muted-foreground mt-1">{t(c.descKey)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollaboratorsSection;
