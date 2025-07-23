"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useJournal } from "./journal-provider";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CollectionManager: React.FC = () => {
  const { collections, addCollection, updateCollection, deleteCollection } =
    useJournal();
  const [newCollectionName, setNewCollectionName] = useState("");
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(
    null
  );
  const [editingCollectionName, setEditingCollectionName] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [collectionToDeleteId, setCollectionToDeleteId] = useState<
    string | null
  >(null);

  const handleAddCollection = () => {
    if (newCollectionName.trim()) {
      addCollection(newCollectionName.trim());
      setNewCollectionName("");
      setIsAddDialogOpen(false);
      toast({
        title: "Collection Added!",
        description: `"${newCollectionName.trim()}" has been added.`,
      });
    } else {
      toast({
        title: "Input Required",
        description: "Please enter a collection name.",
        variant: "destructive",
      });
    }
  };

  const handleEditCollection = () => {
    if (editingCollectionId && editingCollectionName.trim()) {
      updateCollection(editingCollectionId, editingCollectionName.trim());
      setEditingCollectionId(null);
      setEditingCollectionName("");
      setIsEditDialogOpen(false);
      toast({
        title: "Collection Updated!",
        description: `Collection name updated to "${editingCollectionName.trim()}".`,
      });
    } else {
      toast({
        title: "Input Required",
        description: "Please enter a collection name.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCollection = () => {
    if (collectionToDeleteId) {
      deleteCollection(collectionToDeleteId);
      setCollectionToDeleteId(null);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Collection Deleted!",
        description: "Collection and its associated entries have been updated.",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-2 border-[#d04f99] shadow-lg rounded-3xl bg-[#fdedc9]">
      <CardHeader className="flex flex-row items-center justify-between pb-4 bg-[#d04f99] text-white rounded-t-3xl shadow">
        <CardTitle className="text-2xl text-white">Collections</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="gap-1 bg-[#d04f99] hover:bg-[#d04f99]/90 text-white rounded-2xl shadow-md px-6 py-2 text-lg font-semibold"
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-2xl border-2 border-[#d04f99] bg-[#fdedc9] shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-[#d04f99]">
                Add New Collection
              </DialogTitle>
              <DialogDescription className="text-[#d04f99]/80">
                Give your new collection a name.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="new-collection-name"
                  className="text-right text-[#d04f99]"
                >
                  Name
                </Label>
                <Input
                  id="new-collection-name"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="col-span-3 rounded-2xl border-2 border-[#d04f99] h-12 text-lg bg-[#fdedc9] focus:border-[#d04f99] focus:ring-2 focus:ring-[#d04f99]/30 shadow"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="rounded-2xl border-2 border-[#d04f99] bg-white text-[#d04f99] h-12 px-8 text-lg font-semibold shadow hover:bg-[#d04f99]/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddCollection}
                className="bg-[#d04f99] hover:bg-[#d04f99]/90 text-white rounded-2xl h-12 px-8 text-lg font-semibold shadow"
              >
                Add Collection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {collections.length === 0 ? (
          <p className="text-muted-foreground text-lg py-8 text-center">
            No collections yet. Add one to get started!
          </p>
        ) : (
          <ul className="space-y-2">
            {collections.map((collection) => (
              <li
                key={collection.id}
                className="flex items-center justify-between rounded-2xl bg-[#fdedc9] p-4 border-2 border-[#d04f99]/40 shadow"
              >
                <span className="font-semibold text-[#d04f99] text-lg">
                  {collection.name}
                </span>
                <div className="flex gap-2">
                  <Dialog
                    open={
                      isEditDialogOpen && editingCollectionId === collection.id
                    }
                    onOpenChange={setIsEditDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingCollectionId(collection.id);
                          setEditingCollectionName(collection.name);
                          setIsEditDialogOpen(true);
                        }}
                        className="rounded-2xl text-[#d04f99] hover:bg-[#d04f99]/10"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit collection</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-2xl border-2 border-[#d04f99] bg-[#fdedc9] shadow-lg">
                      <DialogHeader>
                        <DialogTitle className="text-[#d04f99]">
                          Edit Collection
                        </DialogTitle>
                        <DialogDescription className="text-[#d04f99]/80">
                          Update the name of your collection.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="edit-collection-name"
                            className="text-right text-[#d04f99]"
                          >
                            Name
                          </Label>
                          <Input
                            id="edit-collection-name"
                            value={editingCollectionName}
                            onChange={(e) =>
                              setEditingCollectionName(e.target.value)
                            }
                            className="col-span-3 rounded-2xl border-2 border-[#d04f99] h-12 text-lg bg-[#fdedc9] focus:border-[#d04f99] focus:ring-2 focus:ring-[#d04f99]/30 shadow"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditDialogOpen(false)}
                          className="rounded-2xl border-2 border-[#d04f99] bg-white text-[#d04f99] h-12 px-8 text-lg font-semibold shadow hover:bg-[#d04f99]/10"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleEditCollection}
                          className="bg-[#d04f99] hover:bg-[#d04f99]/90 text-white rounded-2xl h-12 px-8 text-lg font-semibold shadow"
                        >
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog
                    open={
                      isDeleteDialogOpen &&
                      collectionToDeleteId === collection.id
                    }
                    onOpenChange={setIsDeleteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCollectionToDeleteId(collection.id);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="rounded-2xl text-[#d04f99] hover:bg-[#d04f99]/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete collection</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl border-2 border-[#d04f99] bg-[#fdedc9] shadow-lg">
                      <DialogHeader>
                        <DialogTitle className="text-[#d04f99]">
                          Are you sure you want to delete this collection?
                        </DialogTitle>
                        <DialogDescription className="text-[#d04f99]/80">
                          This action cannot be undone. All entries associated
                          with this collection will have their collection
                          removed.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsDeleteDialogOpen(false)}
                          className="rounded-2xl border-2 border-[#d04f99] bg-white text-[#d04f99] h-12 px-8 text-lg font-semibold shadow hover:bg-[#d04f99]/10"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteCollection}
                          className="rounded-2xl bg-[#d04f99] text-white h-12 px-8 text-lg font-semibold shadow hover:bg-[#d04f99]/90"
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default CollectionManager;
