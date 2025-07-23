"use client";

import type React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useJournal } from "./journal-provider";

interface CollectionSelectorProps {
  selectedCollectionId: string | null;
  onSelectCollection: (collectionId: string | null) => void;
}

const CollectionSelector: React.FC<CollectionSelectorProps> = ({
  selectedCollectionId,
  onSelectCollection,
}) => {
  const { collections } = useJournal();

  return (
    <Select
      value={selectedCollectionId || "no-collection"}
      onValueChange={(value) =>
        onSelectCollection(value === "no-collection" ? null : value)
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Collection" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="no-collection">No Collection</SelectItem>
        {collections.map((collection) => (
          <SelectItem key={collection.id} value={collection.id}>
            {collection.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CollectionSelector;
