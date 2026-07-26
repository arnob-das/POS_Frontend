import React from "react";
import { FaCreditCard, FaLock, FaExternalLinkAlt, FaTimes, FaCopy } from "react-icons/fa";

const SSLCommerzModal = ({ gatewayUrl, onClose, onDirectRedirect }) => {
  const [copiedField, setCopiedField] = React.useState("");

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(""), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#1f1f1f] border border-[#333] text-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl cursor-pointer"
        >
          <FaTimes />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#2a2a2a] pb-4 mb-4">
          <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400 text-2xl">
            <FaCreditCard />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              SSLCommerz Sandbox Gateway
            </h3>
            <p className="text-xs text-gray-400">
              Use official dummy cards from SSLCommerz documentation below
            </p>
          </div>
        </div>

        {/* Dummy Cards Credentials Box */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 mb-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider flex items-center gap-1.5">
              <FaLock className="text-xs" /> SSLCommerz Test Cards
            </span>
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold">
              Sandbox Test Mode
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#1f1f1f] p-2.5 rounded-lg border border-[#2a2a2a] flex justify-between items-center">
              <div>
                <span className="text-gray-400 block text-[10px]">VISA Card Number</span>
                <span className="font-mono font-bold text-white">4000 0012 3456 7890</span>
              </div>
              <button
                onClick={() => copyToClipboard("4000001234567890", "visa")}
                className="text-gray-400 hover:text-yellow-500 p-1 cursor-pointer"
                title="Copy VISA"
              >
                {copiedField === "visa" ? <span className="text-green-400 text-[10px]">Copied!</span> : <FaCopy />}
              </button>
            </div>

            <div className="bg-[#1f1f1f] p-2.5 rounded-lg border border-[#2a2a2a] flex justify-between items-center">
              <div>
                <span className="text-gray-400 block text-[10px]">Mastercard Number</span>
                <span className="font-mono font-bold text-white">5105 1051 0510 5100</span>
              </div>
              <button
                onClick={() => copyToClipboard("5105105105105100", "master")}
                className="text-gray-400 hover:text-yellow-500 p-1 cursor-pointer"
                title="Copy Mastercard"
              >
                {copiedField === "master" ? <span className="text-green-400 text-[10px]">Copied!</span> : <FaCopy />}
              </button>
            </div>

            <div className="bg-[#1f1f1f] p-2.5 rounded-lg border border-[#2a2a2a] flex justify-between items-center">
              <div>
                <span className="text-gray-400 block text-[10px]">Card Expiry / CVV</span>
                <span className="font-mono font-bold text-white">12/30 &bull; CVV: 123</span>
              </div>
              <button
                onClick={() => copyToClipboard("123", "cvv")}
                className="text-gray-400 hover:text-yellow-500 p-1 cursor-pointer"
              >
                {copiedField === "cvv" ? <span className="text-green-400 text-[10px]">Copied!</span> : <FaCopy />}
              </button>
            </div>

            <div className="bg-[#1f1f1f] p-2.5 rounded-lg border border-[#2a2a2a] flex justify-between items-center">
              <div>
                <span className="text-gray-400 block text-[10px]">3D Secure OTP</span>
                <span className="font-mono font-bold text-white">123456</span>
              </div>
              <button
                onClick={() => copyToClipboard("123456", "otp")}
                className="text-gray-400 hover:text-yellow-500 p-1 cursor-pointer"
              >
                {copiedField === "otp" ? <span className="text-green-400 text-[10px]">Copied!</span> : <FaCopy />}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 italic text-center pt-1">
            Tip: You can also select the <strong className="text-white">"TEST CARDS"</strong> tab inside the SSLCommerz gateway page!
          </p>
        </div>

        {/* Action button to open SSLCommerz Payment Gateway */}
        <div className="space-y-2">
          <a
            href={gatewayUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (onDirectRedirect) onDirectRedirect();
            }}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
          >
            <FaExternalLinkAlt /> Open SSLCommerz Sandbox Payment Page
          </a>
          <button
            onClick={onClose}
            className="w-full bg-[#2a2a2a] hover:bg-[#333] text-gray-300 font-semibold py-2.5 text-xs rounded-xl transition-colors cursor-pointer"
          >
            Cancel Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SSLCommerzModal;
