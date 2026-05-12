import React from "react";
import NavBar from "./NavBar";
import ContactForm from "./ContactForm";
import Footer from "./Footer";

const Contact = () => (
  <div className="flex flex-col min-h-screen">
    <NavBar />
    <main className="grow p-6 bg-base-100">
      
      <ContactForm />
    </main>
    
  </div>
);

export default Contact;