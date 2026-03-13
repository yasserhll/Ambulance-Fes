import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import fesImg from "@/assets/fes-city.webp";

const zones = [
  "Médina de Fès", "Ville Nouvelle", "Fès el-Bali", "Fès el-Jdid",
  "Route de Sefrou", "Route d'Imouzzer", "Ain Chkef", "Oued Fès",
  "Narjiss", "Les Mérinides", "Route de Meknès", "Bensouda",
];

const CoverageSection = () => {
  return (
    <section id="coverage" className="section-padding gradient-navy">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-secondary-foreground mb-4">
              Zone de <span className="text-primary">Couverture</span>
            </h2>
            <p className="font-body text-secondary-foreground/70 mb-8">
              Nous couvrons toute la ville de Fès et ses environs. Notre flotte est stratégiquement positionnée pour garantir un temps de réponse minimal.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {zones.map((zone, i) => (
                <motion.div
                  key={zone}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="flex items-center gap-2 text-secondary-foreground/80"
                >
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-body text-sm">{zone}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-2xl"
          >
            <img src={fesImg} alt="Ville de Fès" className="w-full h-96 object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CoverageSection;
