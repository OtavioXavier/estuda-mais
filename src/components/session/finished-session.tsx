"use client";

import { Topic } from "@prisma/client";

interface PageProp {
  topics: Topic[];
}

export default function FinishedSession({ topics }: PageProp) {
  return (
    <div className="animate-fadeIn">
      <p>🎉 Congratulations you finished your study session 🎉</p>
      {topics.length > 0 ? (
        <div>
          <h2 className='text-start text-lg font-black mb-4 mt-8'>Missed Topics:</h2>
          <ul className='flex flex-col gap-4 text-neutral-600 items-start'>
            {topics.map((topic) => {
              return <li className='text-sm font-semibold'>{topic.title}</li>
            })}
            
          </ul>
        </div>
      ) : (
        null
      )}
    </div>
  );
}
