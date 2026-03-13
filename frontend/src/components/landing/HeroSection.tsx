import { Phone, MessageCircle, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-ambulance.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="Ambulance Fès" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/40" />
      </div>

      <div className="container mx-auto relative z-10 px-4 lg:px-8 py-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-body text-sm font-medium text-primary-foreground/80">
                Fès, Maroc — Disponible 24h/24, 7j/7
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Service d'Ambulance{" "}
              <span className="text-primary">Urgent</span>{" "}
              à Fès
            </h1>

            <p className="font-body text-lg text-primary-foreground/80 mb-10 max-w-lg">
              Transport médical d'urgence rapide et professionnel. 
              Une équipe qualifiée prête à intervenir à tout moment pour sauver des vies.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="tel:+212776892710"
              className="btn-emergency flex items-center justify-center gap-3 text-xl pulse-emergency"
            >
              <Phone className="h-6 w-6" />
              Appel Direct
            </a>
            <a
              href="https://wa.me/212776892710"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp flex items-center justify-center gap-3 text-xl"
            >
              <MessageCircle className="h-6 w-6" />
              WhatsApp +212 776-892710
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 flex items-center gap-8"
          >
            {[
              { value: "24/7", label: "Disponibilité" },
              { value: "<15min", label: "Temps de réponse" },
              { value: "100%", label: "Professionnalisme" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl font-bold text-primary">{stat.value}</div>
                <div className="font-body text-xs text-primary-foreground/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
