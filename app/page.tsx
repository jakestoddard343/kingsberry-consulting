import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Problems from "@/components/Problems";
import AutomationFlow from "@/components/AutomationFlow";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Statement from "@/components/Statement";
import Packages from "@/components/Packages";
import Edge from "@/components/Edge";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

export default function Page() {
  return (
    <>
      <JsonLd />
      <Nav />
      <main>
        <Hero />
        <Problems />
        <AutomationFlow />
        <Services />
        <Process />
        <Statement />
        <Packages />
        <Edge />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
