import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
} from "react-share";
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  TelegramIcon,
} from "react-share";
import { X } from "lucide-react";
import { toast } from "react-toastify";

export const ShareButton = ({ url, setIsOpen }) => {
  const copyToClipBoard = async (url) => {
    await navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard !");
  };
  console.log(url);
  return (
    <div className="w-full h-full bg-black bg-opacity-60 fixed top-0 left-0 z-50 animate-fadeIn">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-base-100 shadow-md px-16 py-8 rounded-md flex flex-col gap-4 justify-center items-center border-2 border-base-300 z-100">
        <button
          className="absolute top-3 right-3 text-red-600 border border-red-600 rounded-full hover:text-white hover:bg-red-600 p-0.5 transition-all duration-300 ease-in-out"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <X size={20} />
        </button>
        <h1 className="text-lg font-semibold">Share this post</h1>
        <div className="flex gap-2.5">
          <FacebookShareButton url={url}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={url}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <LinkedinShareButton url={url}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
          <WhatsappShareButton url={url}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <TelegramShareButton url={url}>
            <TelegramIcon size={32} round />
          </TelegramShareButton>
        </div>
        <input
          type="text"
          value={`${url.slice(0, 25)}...`}
          readOnly
          className="w-full py-2 px-8 bg-base-200 rounded-md text-base-content font-medium text-sm cursor-pointer focus:outline-none border border-base-300"
        />
        <button
          onClick={() => copyToClipBoard(url)}
          className="mt-2 bg-success text-white py-1 px-6 rounded hover:bg-primary-dark 
				 transition duration-300 disabled:opacity-50 font-medium flex items-center justify-center gap-1"
        >
          Copy
        </button>
      </div>
    </div>
  );
};
