import { Phone, MessageCircle, MapPin, Mail } from "lucide-react";
import logo from "@/assets/logo.png";
import { useLang } from "@/contexts/AppContexts";

const Footer = () => {
  const { t } = useLang();

  return (
    <footer id="contact" className="gradient-navy text-secondary-foreground dark:bg-gray-900">
      <div className="container mx-auto section-padding !py-12">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Logo" className="h-8 w-8" />
              <span className="font-display font-bold text-lg">Ambulance Fès</span>
            </div>
            <p className="font-body text-sm text-secondary-foreground/70 mb-4">
              {t("footerDesc")}
            </p>
          </div>

          {/* Emergency contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">{t("footerEmergencyContact")}</h4>
            <div className="space-y-3">
              <a href="tel:+212661706933" className="flex items-center gap-3 text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                <Phone className="h-4 w-4 text-primary" /> +212661706933
              </a>
              <a href="https://wa.me/212661706933" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-secondary-foreground/80 hover:text-accent transition-colors">
                <MessageCircle className="h-4 w-4 text-accent" /> WhatsApp
              </a>
              <div className="flex items-center gap-3 text-sm text-secondary-foreground/80">
                <MapPin className="h-4 w-4 text-primary" /> Fès, Maroc
              </div>
              <div className="flex items-center gap-3 text-sm text-secondary-foreground/80">
                <Mail className="h-4 w-4 text-primary" /> contact@ambulancefes.ma
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display font-semibold mb-4">{t("footerQuickLinks")}</h4>
            <div className="space-y-2 font-body text-sm text-secondary-foreground/70">
              <a href="#services"      className="block hover:text-primary transition-colors">{t("services")}</a>
              <a href="#coverage"      className="block hover:text-primary transition-colors">{t("footerCoverage")}</a>
              <a href="#collaborators" className="block hover:text-primary transition-colors">{t("collaborators")}</a>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-10 pt-6 flex items-center justify-center">
          <p className="font-body text-xs text-secondary-foreground/50">
            © {new Date().getFullYear()} Ambulance Fès. {t("footerRights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
