
import React from "react";
import { Container } from "@/components/ui/container";

const Contact = () => {
  return (
    <Container className="py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-4">
              Have questions about our solar vendor rankings or need help with your solar project? 
              Our team is here to assist you.
            </p>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="first-name" className="text-sm font-medium">
                    First name
                  </label>
                  <input
                    id="first-name"
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="last-name" className="text-sm font-medium">
                    Last name
                  </label>
                  <input
                    id="last-name" 
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  className="w-full p-2 border rounded-md min-h-[120px]"
                  placeholder="How can we help you?"
                />
              </div>
              
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Send Message
              </button>
            </form>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-3">
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:contact@solargrade.com" className="text-primary hover:underline">
                  contact@solargrade.com
                </a>
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <a href="tel:+15555555555" className="hover:underline">
                  (555) 555-5555
                </a>
              </p>
              <p>
                <strong>Address:</strong> 123 Solar Street, Sunny City, SC 12345
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Contact;
