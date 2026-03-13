import { Building2, Heart, Shield } from "lucide-react";
import { motion } from "framer-motion";
import teamImg from "@/assets/team-collab.jpg";

const collaborators = [
  { icon: Building2, name: "CHU Hassan II", type: "Hôpital Universitaire", desc: "Partenaire principal pour les urgences hospitalières." },
  { icon: Heart, name: "Clinique Atlas", type: "Clinique Privée", desc: "Collaboration pour les transferts médicaux spécialisés." },
  { icon: Shield, name: "Protection Civile Fès", type: "Service Public", desc: "Coordination des interventions d'urgence en ville." },
  { icon: Building2, name: "Hôpital Al Ghassani", type: "Hôpital Public", desc: "Prise en charge des cas d'urgence et transferts." },
];

const CollaboratorsSection = () => {
  return (
    <section id="collaborators" className="section-padding bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Nos <span className="text-primary">Collaborateurs</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Nous travaillons en étroite collaboration avec les principaux établissements de santé de Fès.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <img src={teamImg} alt="Notre équipe" className="w-full h-80 object-cover" />
          </motion.div>

          <div className="space-y-4">
            {collaborators.map((collab, i) => (
              <motion.div
                key={collab.name}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="glass-card p-5 flex items-start gap-4 hover:border-primary/30 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <collab.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">{collab.name}</h3>
                  <span className="font-body text-xs text-primary font-medium">{collab.type}</span>
                  <p className="font-body text-sm text-muted-foreground mt-1">{collab.desc}</p>
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
