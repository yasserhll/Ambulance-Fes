import { Ambulance, HeartPulse, Clock, Shield, Stethoscope, Truck } from "lucide-react";
import { motion } from "framer-motion";
import servicesImg from "@/assets/services-equipment.jpg";
import emergencyImg from "@/assets/emergency-response.jpg";
import { useLang } from "@/contexts/AppContexts";
import type { TranslationKey } from "@/i18n/translations";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ServicesSection = () => {
  const { t } = useLang();

  const services: { icon: any; titleKey: TranslationKey; descKey: TranslationKey }[] = [
    { icon: Ambulance,    titleKey: "svc1Title", descKey: "svc1Desc" },
    { icon: HeartPulse,   titleKey: "svc2Title", descKey: "svc2Desc" },
    { icon: Clock,        titleKey: "svc3Title", descKey: "svc3Desc" },
    { icon: Shield,       titleKey: "svc4Title", descKey: "svc4Desc" },
    { icon: Stethoscope,  titleKey: "svc5Title", descKey: "svc5Desc" },
    { icon: Truck,        titleKey: "svc6Title", descKey: "svc6Desc" },
  ];

  return (
    <section id="services" className="section-padding bg-background dark:bg-gray-950">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t("servicesTitle1")}{t("servicesTitle1") && t("servicesTitle2") ? " " : ""}
            <span className="text-primary">{t("servicesTitle2")}</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">{t("servicesSubtitle")}</p>
        </motion.div>

        <motion.div
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {services.map((s) => (
            <motion.div key={s.titleKey} variants={itemVariants}
              className="glass-card p-6 group hover:border-primary/30 transition-all duration-300 dark:bg-gray-800/50 dark:border-gray-700">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{t(s.titleKey)}</h3>
              <p className="font-body text-sm text-muted-foreground">{t(s.descKey)}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-2xl overflow-hidden shadow-xl">
            <img src={servicesImg} alt={t("svc2Title")} className="w-full h-72 object-cover" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-2xl overflow-hidden shadow-xl">
            <img src={emergencyImg} alt={t("svc1Title")} className="w-full h-72 object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
