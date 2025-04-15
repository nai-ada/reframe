import CloseIcon from "../assets/images/close.svg";
import { Button } from "@heroui/react";
import { supabase } from "../supabaseClient";

function DeleteAllEntries({ setDeleteAllEntries, onDeleteSuccess }) {
  const handleDeleteAll = async () => {
    try {
      const { error } = await supabase.from("entries").delete().neq("id", 0);

      if (error) throw error;

      setDeleteAllEntries(false);
      onDeleteSuccess();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="delete__overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="delete bg-white rounded-lg p-6 w-[90%] max-w-sm relative shadow-xl">
        <div className="absolute top-3 right-3">
          <img
            src={CloseIcon}
            alt="close icon"
            className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => setDeleteAllEntries(false)}
          />
        </div>

        <h1 className="delete__prompt text-xl font-semibold mt-4 mb-3 text-center">
          Delete All Entries?
        </h1>

        <p className="delete__info text-gray-600 text-sm mb-6 text-center">
          Please confirm that you'd like to delete all entries. This action
          cannot be undone.
        </p>

        <div className="delete__actions flex justify-center gap-4 mt-8">
          <Button
            className="bg-[#bae0b6] text-[#3a3a3a] font-medium shadow-lg"
            radius="xl"
            variant="solid"
            onPress={() => setDeleteAllEntries(false)}
          >
            Cancel
          </Button>

          <Button
            className="bg-[#ef4444] text-white font-medium shadow-lg"
            radius="xl"
            variant="solid"
            onPress={handleDeleteAll}
          >
            Delete All
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAllEntries;
