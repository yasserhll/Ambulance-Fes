import { Ambulance, HeartPulse, Clock, Shield, Stethoscope, Truck } from "lucide-react";
import { motion } from "framer-motion";
import servicesImg from "@/assets/services-equipment.jpg";
import emergencyImg from "@/assets/emergency-response.jpg";

const services = [
  { icon: Ambulance, title: "Transport d'Urgence", desc: "Intervention rapide pour les cas d'urgence médicale dans toute la ville de Fès." },
  { icon: HeartPulse, title: "Soins Pré-Hospitaliers", desc: "Équipements médicaux avancés et personnel qualifié à bord de chaque ambulance." },
  { icon: Clock, title: "Disponibilité 24/7", desc: "Service continu jour et nuit, week-ends et jours fériés inclus." },
  { icon: Shield, title: "Sécurité Maximale", desc: "Véhicules entretenus et inspectés régulièrement pour votre sécurité." },
  { icon: Stethoscope, title: "Équipe Médicale", desc: "Paramédicaux et ambulanciers certifiés avec des années d'expérience." },
  { icon: Truck, title: "Transport Inter-Villes", desc: "Transferts médicaux entre les villes du Maroc avec tout le confort nécessaire." },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ServicesSection = () => {
  return (
    <section id="services" className="section-padding bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Nos <span className="text-primary">Services</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Un service d'ambulance complet et professionnel adapté à tous vos besoins médicaux d'urgence.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="glass-card p-6 group hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{service.title}</h3>
              <p className="font-body text-sm text-muted-foreground">{service.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <img src={servicesImg} alt="Équipements médicaux" className="w-full h-72 object-cover" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <img src={emergencyImg} alt="Intervention d'urgence" className="w-full h-72 object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
