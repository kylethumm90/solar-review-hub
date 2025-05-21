
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
}

export const FAQ: React.FC<FAQProps> = ({ question, answer }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={question}>
        <AccordionTrigger className="text-left">{question}</AccordionTrigger>
        <AccordionContent>
          <p className="text-muted-foreground">{answer}</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
