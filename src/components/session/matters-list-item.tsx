import { Matter, Topic } from "@prisma/client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FormTopics from "./form-topics";

import { Checkbox } from "@/components/ui/checkbox";

type MatterWithTopics = {
  topics: Topic[];
} & Matter;

interface ItemProp {
  matter: MatterWithTopics;
  update: () => void;
}

export default function MattersListItem({ matter, update }: ItemProp) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>{matter.name}</AccordionTrigger>
        <AccordionContent>
          <ul>
            {matter.topics.map((topic) => {
              return (
                <li key={topic.id} className="flex items-center space-x-2 my-2">
                  <Checkbox id={topic.id} />
                  <label
                    htmlFor={topic.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {topic.title}
                  </label>
                </li>
              );
            })}
          </ul>
          <FormTopics matter={matter} update={update} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
