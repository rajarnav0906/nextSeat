import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Layout
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Images
import idCardImage from "../images/id_card.png";
import dummyFront from "../assets/dummy-id/dummy_front.jpg";
import dummyBack from "../assets/dummy-id/dummy_back.jpg";

// Icons
import {
  Info,
  ShieldCheck,
  HelpCircle,
  Upload,
  CheckCircle2,
  Image as ImageIcon,
  TestTube2,
} from "lucide-react";

const IDUpload = () => {
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState(null);

  const [collapsed, setCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const sidebarWidth = collapsed ? 72 : 240;

  // ✅ Source of truth
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);

  const [frontFileName, setFrontFileName] = useState("");
  const [backFileName, setBackFileName] = useState("");

  const [consentGiven, setConsentGiven] = useState(false);

  /* -------------------- EFFECT -------------------- */
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user-info"));
    if (userInfo?._id) {
      setUserId(userInfo._id);
      if (userInfo.declaredGender && userInfo.branch) {
        navigate("/dashboard");
      }
    }

    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  /* -------------------- DUMMY FILE -------------------- */
  const useDummyFile = async (src, name, setter, nameSetter) => {
    const res = await fetch(src);
    const blob = await res.blob();
    const file = new File([blob], name, { type: blob.type });
    setter(file);
    nameSetter(name);
  };

  /* -------------------- UPLOAD -------------------- */
  const handleUpload = async () => {
    if (!frontFile || !backFile) {
      toast.error("Please upload both sides of ID card");
      return;
    }

    if (!consentGiven) {
      toast.error("You must give consent to continue");
      return;
    }

    if (!userId) {
      toast.error("Session expired. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("frontImage", frontFile);
    formData.append("backImage", backFile);
    formData.append("userId", userId);

    try {
      setUploading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/upload-id`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data?.user?.declaredGender && res.data?.user?.branch) {
        toast.success("ID verified successfully");
        const current = JSON.parse(localStorage.getItem("user-info"));
        localStorage.setItem(
          "user-info",
          JSON.stringify({ ...current, ...res.data.user })
        );
        navigate("/dashboard");
      } else {
        toast.error("ID not clear. Please upload clearer images.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* -------------------- UPLOAD BOX -------------------- */
  const UploadBox = ({ title, fileName, onChange }) => (
    <label
      className={`block border rounded-xl p-4 cursor-pointer transition
        ${
          fileName
            ? "border-green-500 bg-green-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        }`}
    >
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(file);
        }}
      />

      <div className="flex items-center gap-4">
        {fileName ? (
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        ) : (
          <ImageIcon className="w-8 h-8 text-gray-400" />
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          {fileName ? (
            <p className="text-xs text-green-700 truncate">
              {fileName} (click to replace)
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              Click to choose image from your device
            </p>
          )}
        </div>

        <Upload className="w-4 h-4 text-gray-400" />
      </div>
    </label>
  );

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      <main
        className="w-full transition-all"
        style={{ marginLeft: isDesktop ? `${sidebarWidth}px` : "0px" }}
      >
        <Navbar />

        <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10 px-6 py-10">
          <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-lg border">
            <h2 className="text-2xl font-semibold text-center mb-4">
              Upload Your College ID
            </h2>

            {/* INFO */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6 space-y-3 text-sm">
              <div className="flex gap-2">
                <ShieldCheck className="w-5 h-5" />
                Used only to verify branch & gender
              </div>
              <div className="flex gap-2">
                <Info className="w-5 h-5" />
                Clear JPG / PNG images only
              </div>
              <div className="flex gap-2">
                <HelpCircle className="w-5 h-5" />
                Blurry images will be rejected
              </div>
            </div>

            {/* DUMMY IDS */}
            <div className="border rounded-xl p-5 bg-gray-50 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <TestTube2 className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-sm">
                  Dummy IDs (For Testing)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    useDummyFile(
                      dummyFront,
                      "dummy_front.jpg",
                      setFrontFile,
                      setFrontFileName
                    )
                  }
                  className="border rounded-lg p-3 hover:bg-white transition"
                >
                  <img
                    src={dummyFront}
                    alt="Dummy Front"
                    className="h-28 mx-auto mb-2 object-contain"
                  />
                  <p className="text-xs font-medium text-center">
                    Use Dummy Front
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    useDummyFile(
                      dummyBack,
                      "dummy_back.jpg",
                      setBackFile,
                      setBackFileName
                    )
                  }
                  className="border rounded-lg p-3 hover:bg-white transition"
                >
                  <img
                    src={dummyBack}
                    alt="Dummy Back"
                    className="h-28 mx-auto mb-2 object-contain"
                  />
                  <p className="text-xs font-medium text-center">
                    Use Dummy Back
                  </p>
                </button>
              </div>
            </div>

            {/* UPLOAD BOXES */}
            <div className="space-y-4 mb-6">
              <UploadBox
                title="Upload Front Side"
                fileName={frontFileName}
                onChange={(file) => {
                  setFrontFile(file);
                  setFrontFileName(file.name);
                }}
              />

              <UploadBox
                title="Upload Back Side"
                fileName={backFileName}
                onChange={(file) => {
                  setBackFile(file);
                  setBackFileName(file.name);
                }}
              />
            </div>

            {/* CONSENT */}
            <label className="flex gap-2 text-sm mb-4">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
              />
              I agree to the terms & conditions
            </label>

            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition"
            >
              {uploading ? "Uploading..." : "Submit"}
            </button>
          </div>

          <img
            src={idCardImage}
            alt="ID Illustration"
            className="max-w-md w-full"
          />
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default IDUpload;
