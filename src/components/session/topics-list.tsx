import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { MatterWithTopics } from "./types/types";
import axios from "axios";
import { Topic } from "@prisma/client";
import { useToast } from "../ui/use-toast";
import { Loader2Icon, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface ListProps {
  matters: MatterWithTopics[];
}

export default function TopicsList({ matters }: ListProps) {
  const [loadingTopicId, setLoadingTopicId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleComplete = (topic: Topic, value: boolean) => {
    setLoadingTopicId(topic.id);
    const newTopic = {
      ...topic,
      status: value,
    };
    axios
      .put(`api/topic/${topic.id}`, { topic: newTopic })
      .then((response) => {
        if (response.data.status === 200 && value) {
          toast({
            title: "Congratulations",
            description: "Topic finished with success",
          });
        }
        if (response.data.status === 400 || response.data.status === 500) {
          toast({
            title: "Error",
            description: "Something is wrong",
          });
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoadingTopicId(null);
      });
  };

  const handleDelete = (topic: Topic) => {
    setLoadingTopicId(topic.id);
    axios
      .delete(`api/topic/${topic.id}`)
      .then((response) => {
        if (response.data.status === 200) {
          toast({
            title: "Sad",
            description: "Topic deleted with success",
          });
        } else {
          toast({
            title: "Error",
            description: "Something is wrong",
          });
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoadingTopicId(null);
      });
  };

  return (
    <div>
      {matters.map((matter, matterIndex) => (
        <div key={`matter-${matterIndex}`}>
          {matter.topics.map((topic) => (
            <div className="flex items-center space-x-2 my-2" key={topic.id}>
              <Checkbox
                id={topic.id}
                disabled={loadingTopicId === topic.id}
                onCheckedChange={(checked) => {
                  handleComplete(
                    topic,
                    typeof checked === "boolean" ? checked : false
                  );
                }}
              />
              <label
                htmlFor={topic.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {topic.title}
              </label>
              <Button variant={"ghost"} className="p-0 m-0 text-red-400">
                <Trash2 size={20} onClick={() => handleDelete(topic)} />
              </Button>
              {loadingTopicId === topic.id && (
                <Loader2Icon className="animate-spin" />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
