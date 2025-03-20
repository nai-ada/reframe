import CloseIcon from "../assets/images/close.svg";
import { Button } from "@heroui/react";
import { supabase } from "../supabaseClient";

function DeleteEntry({ setDeleteEntry, id, entryNum, onDeleteSuccess }) {
  const handleDelete = async () => {
    try {
      const { error } = await supabase.from("entries").delete().eq("id", id);

      if (error) throw error;

      setDeleteEntry(false);
      onDeleteSuccess();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="delete__overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="delete bg-white rounded-lg p-6 w-[90%] max-w-md relative shadow-xl">
        <div className="absolute top-3 right-3">
          <img
            src={CloseIcon}
            alt="close icon"
            className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => setDeleteEntry(false)}
          />
        </div>

        <h1 className="delete__prompt text-xl font-semibold mt-4 mb-3 text-center">
          Delete Entry {entryNum}?
        </h1>

        <p className="delete__info text-gray-600 text-sm mb-6 text-center">
          Please confirm that you'd like to delete Entry {entryNum}. You won't
          be able to undo this action.
        </p>

        <div className="delete__actions flex justify-center gap-4 mt-8">
          <Button
            style={{ backgroundColor: "#A7CFB8" }}
            radius="full"
            variant="solid"
            className="px-6 py-2"
            onPress={() => setDeleteEntry(false)}
          >
            Cancel
          </Button>

          <Button
            style={{ backgroundColor: "#ef4444", color: "white" }}
            radius="full"
            variant="solid"
            className="px-6 py-2"
            onPress={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteEntry;
