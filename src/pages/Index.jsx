import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

function Index() {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchTopStories() {
      try {
        const response = await fetch(
          "https://hacker-news.firebaseio.com/v0/topstories.json"
        );
        const storyIds = await response.json();
        const top100Ids = storyIds.slice(0, 100);

        const storyPromises = top100Ids.map(async (id) => {
          const storyResponse = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`
          );
          return storyResponse.json();
        });

        const stories = await Promise.all(storyPromises);
        setStories(stories);
        setFilteredStories(stories);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      }
    }

    fetchTopStories();
  }, []);

  useEffect(() => {
    const filtered = stories.filter((story) =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStories(filtered);
  }, [searchTerm, stories]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <Input
        type="text"
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {loading ? (
        <Skeleton className="w-full h-10 mb-4" count={10} />
      ) : (
        <ul>
          {filteredStories.map((story) => (
            <li key={story.id} className="mb-4">
              <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                {story.title}
              </a>
              <p>Upvotes: {story.score}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default Index;