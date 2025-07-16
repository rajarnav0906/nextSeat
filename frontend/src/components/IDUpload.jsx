import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import idCardImage from "../images/id_card.png";
import { Info, ShieldCheck, HelpCircle } from "lucide-react";
import { Dialog } from "@headlessui/react";

const IDUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const frontRef = useRef();
  const backRef = useRef();
  const [frontFileName, setFrontFileName] = useState("");
  const [backFileName, setBackFileName] = useState("");
  const [showFAQ, setShowFAQ] = useState(false);

  const navigate = useNavigate();
  const sidebarWidth = collapsed ? 72 : 240;

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

  const handleUpload = async () => {
    const frontFile = frontRef.current?.files[0];
    const backFile = backRef.current?.files[0];

    if (!frontFile || !backFile)
      return toast.error("Please upload both sides of ID card");

    if (!userId || userId.length !== 24)
      return toast.error("Invalid user ID. Please log in again.");

    const formData = new FormData();
    formData.append("frontImage", frontFile);
    formData.append("backImage", backFile);
    formData.append("userId", userId);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:8080/auth/upload-id", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.user?.declaredGender && res.data?.user?.branch) {
        toast.success("ID card processed successfully");
        const current = JSON.parse(localStorage.getItem("user-info"));
        localStorage.setItem("user-info", JSON.stringify({ ...current, ...res.data.user }));
        navigate("/dashboard");
      } else {
        toast.error("ID card is not clear. Please upload clearer images.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      <main
        className="transition-all duration-300 w-full"
        style={{ marginLeft: isDesktop ? `${sidebarWidth}px` : "0px" }}
      >
        <Navbar onMenuClick={() => setMobileSidebarOpen(true)} />

        <div className="flex flex-col-reverse lg:flex-row items-center justify-center min-h-[calc(100vh-80px)] gap-10 px-6 py-10">
          {/* Upload Form */}
          <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-center mb-4 text-[#2D2D2D]">
              Upload Your College ID Card
            </h2>

            {/* Trust + Instructions */}
            <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm p-4 rounded-md mb-6 space-y-3">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 mt-0.5" />
                <p>
                  Your ID is used only for verifying your <strong>gender</strong> and <strong>branch</strong>.
                  It is processed securely and never shared publicly.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 mt-0.5 text-blue-700" />
                <p>
                  Please upload <strong>clear, well-lit image files</strong>. Blurry or dark photos may be rejected.
                  Only <strong>image files (JPG, PNG)</strong> are accepted.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <HelpCircle className="w-5 h-5 mt-0.5 text-blue-700" />
                <p>
                  If you have any doubts or need clarification, feel free to contact the owner or developer of this website.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Front Side */}
              <div>
                <label className="flex items-center text-sm font-medium text-[#2D2D2D] mb-1">
                  Front Side
                  <button
                    onClick={() => setShowFAQ(true)}
                    type="button"
                    className="ml-1 text-blue-500 hover:text-blue-700"
                    title="Why is ID required?"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </label>
                <input
                  ref={frontRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => setFrontFileName(e.target.files[0]?.name || "")}
                  className="block w-full text-sm file:bg-[#4A90E2] file:text-white file:rounded-full file:px-4 file:py-2"
                />
                {frontFileName && (
                  <p className="text-xs mt-1 text-gray-600">Selected: {frontFileName}</p>
                )}
              </div>

              {/* Back Side */}
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1">Back Side</label>
                <input
                  ref={backRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => setBackFileName(e.target.files[0]?.name || "")}
                  className="block w-full text-sm file:bg-[#4A90E2] file:text-white file:rounded-full file:px-4 file:py-2"
                />
                {backFileName && (
                  <p className="text-xs mt-1 text-gray-600">Selected: {backFileName}</p>
                )}
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full py-2.5 bg-[#50C878] hover:bg-[#45B06D] text-white font-semibold rounded-md transition"
              >
                {uploading ? "Uploading..." : "Submit"}
              </button>
            </div>
          </div>

          {/* Illustration */}
          <div className="w-full max-w-md">
            <img src={idCardImage} alt="ID Upload Illustration" className="w-full h-auto" />
          </div>
        </div>

        {/* FAQ Modal */}
        <Dialog open={showFAQ} onClose={() => setShowFAQ(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white max-w-md w-full rounded-xl shadow-xl p-6 space-y-4">
              <Dialog.Title className="text-lg font-semibold text-[#2D2D2D]">
                Why Do We Ask for Your ID?
              </Dialog.Title>
              <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                <li>To verify you're a real student from a verified college.</li>
                <li>We extract only your gender and branch — not name, photo, or anything else.</li>
                <li>Your ID is securely processed and never shared publicly.</li>
              </ul>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowFAQ(false)}
                  className="text-sm text-blue-600 hover:text-blue-800 mt-4"
                >
                  Got it, thanks!
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        <Footer />
      </main>
    </div>
  );
};

export default IDUpload;
