import { Phone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm"
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Ambulance Fès" className="h-10 w-10" />
          <span className="font-display font-bold text-xl text-secondary">
            Ambulance <span className="text-primary">Fès</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-body text-sm font-medium text-foreground/80">
          <a href="#services" className="hover:text-primary transition-colors">Services</a>
          <a href="#coverage" className="hover:text-primary transition-colors">Couverture</a>
          <a href="#collaborators" className="hover:text-primary transition-colors">Collaborateurs</a>
          <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="tel:+212776892710"
            className="btn-emergency flex items-center gap-2 !text-sm !px-4 !py-2 pulse-emergency"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Urgence</span>
          </a>
          <a
            href="https://wa.me/212776892710"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp flex items-center gap-2 !text-sm !px-4 !py-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
