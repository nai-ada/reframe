import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";
import BackArrow from "../assets/images/back-arrow.svg";
import { Textarea } from "@heroui/react";
import { Button } from "@heroui/react";

function NewEntryPage() {
  const currentDate = new Date();

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // get how many entries user has in total from all entries data to determine which entry the new one is
  const entryNum = 1;

  return (
    <div>
      <Navigation />
      <div className="flex justify-left m-4 mt-10">
        <Link to="/">
          <img src={BackArrow} alt="back arrow" className=""></img>
        </Link>
      </div>
      <div className="flex items-center justify-between m-4">
        <h1 className="text-[22px] pr-4">Entry {entryNum}</h1>
        <h2 className="text-[12px]">{formattedDate}</h2>
      </div>
      <div className="m-4">
        <Textarea
          label="New Entry"
          maxRows={50}
          placeholder="Tell me about your day..."
          className="[&>div]:h-[400px] [&>div]:border-2 [&>div]:border-green-500 [&>div]:rounded-lg [&>div]:p-4 [&_textarea]:!h-full [&_textarea]:w-full [&_textarea]:border-none [&_textarea]:resize-none"
        />
        <div className="mt-4 flex justify-end">
          <Button
            style={{ backgroundColor: "#A7CFB8", color: "" }}
            radius="full"
            variant="solid"
          >
            Reframe!
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NewEntryPage;
