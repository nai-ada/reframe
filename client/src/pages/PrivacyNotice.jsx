import React from "react";
import LeafIcon from "../assets/images/leaf.svg";

function PrivacyNotice() {
  return (
    <div className="m-4">
      <h1 className="text-center text-[40px] text-[#83af7d] font-medium mb-4">
        Refra:me Privacy Notice
      </h1>
      <p className="text-[16px] text-center mb-4 underline">
        <strong>
          By creating an account and using Refra:me, you automatically agree to
          this Privacy Notice and all terms described below.
        </strong>
      </p>
      <p className="mb-4 font-medium text-center">
        Thank you for using Refra:me. Your privacy is important to us. This
        Privacy Notice explains how your information is handled when you use
        Refra:me, especially while the App is in Beta.
      </p>
      <h2 className="mb-2">1. What Information We Collect</h2>
      <p className="mb-4">
        When you use Refra:me, you may enter journal entries that could include
        sensitive or personal information. These entries are processed by the
        Gemini API to provide you with a positive reframe of your original text.
      </p>
      <h2 className="mb-2">2. How Your Information is Used</h2>
      <p className="mb-4">
        <strong>Processing:</strong> Your journal entries are sent to the Gemini
        API for reframing.
        <br />
        <strong>Storage:</strong> Your original and reframed entries are stored
        in our database.
        <br />
        <strong>Access:</strong> The owner and creator of Refra:me may be able
        to view your entries.
      </p>
      <h2 className="mb-2">3. Data Security and Limitations</h2>
      <p className="mb-4">
        <strong>No Encryption:</strong> Please note that your data is not
        encrypted or hashed in our database at this time.
        <br />
        <strong>Beta Disclaimer:</strong> Refra:me is currently in Beta.
        Security features are still being developed and improved.
        <br />
        <strong>No Liability:</strong> By using Refra:me, you acknowledge and
        agree that the owner and creator is not liable for any unauthorized
        access, disclosure, or loss of your information, including in the event
        of a database breach or hack.
        <br />
        <strong>Owner Access:</strong> You also acknowledge the owner may be
        able to view your journal entries and any personal or sensitive
        information you provide.
      </p>
      <h2 className="mb-2">4. Your Responsibility</h2>
      <p className="mb-4">
        Please do not enter any information you consider highly sensitive or
        confidential while using Refra:me in its Beta phase.
      </p>
      <h2 className="mb-2">5. Changes to This Notice</h2>
      <p className="mb-4">
        This Privacy Notice may be updated as the App evolves and security
        measures are improved. We will notify users of any significant changes.
      </p>
      <h2 className="mb-2">6. Contact</h2>
      <p className="mb-4">
        If you have any questions or concerns about your privacy, please
        contact:{" "}
        <a
          href="mailto:nadiavespalec00@gmail.com"
          className="text-[#83af7d] font-bold underline"
        >
          nadiavespalec00@gmail.com
        </a>
      </p>
      <div className="logo-container flex items-center justify-center mt-10 overflow-x-hidden">
        <h1 className="logo text-[26px] mr-1">
          Refra:<span className="logo-highlight font-thin">me</span>
        </h1>
        <img
          src={LeafIcon}
          alt="leaf icon"
          className="w-[26px] max-w-full self-center -mt-1"
        />
      </div>{" "}
    </div>
  );
}

export default PrivacyNotice;
