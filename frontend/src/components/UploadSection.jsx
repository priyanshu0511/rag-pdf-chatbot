import { LucideCheckCircle } from "lucide-react";
import { useState } from "react";
import { LuLoader, LuUpload } from "react-icons/lu";

const UploadSection = () => {

  const [status,setStatus] = useState("idle");
  const [fileName, setFileName] = useState("");
  const [error,setError]=useState("");

  const handleFileChange=async(e)=>{
    const file = e.target.files[0];
    if(!file){
      return;
    }
    setFileName(file.name);
    setStatus("uploading");
    setError("");
    const formData = new FormData();
    formData.append("pdf", file);
    try{
      const res=await fetch("http://localhost:5000/upload",{
        method:"POST",
        body:formData
      });

      const data=await res.json();
      if(data.success){
        setStatus("success");
      } else {
        setError(data.error || "Upload failed");
        setStatus("error");
      }
    } catch (err) {
      setError("An error occurred while uploading the file");
      setStatus("error");
    }
  }

  return (
    <div className="bg-card border-2 border-border rounded-3xl p-6">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary text-primary-foreground p-4 rounded-2xl text-2xl">
            {status === "uploading" ? (
              <LuLoader className="animate-spin" />
            ) : status === "success" ? (
              <LucideCheckCircle />
            ) : (
              <LuUpload />
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Upload Documents
            </h2>

             <p className="text-muted-foreground text-sm">
              {status === "idle" && "Supports PDF files"}
              {status === "uploading" && `Uploading ${fileName}...`}
              {status === "success" && `${fileName} ready`}
              {status === "error" && (
                <span className="text-red-500">{error}</span>
              )}
            </p>
          </div>
        </div>
{status !== "success" && (
          <label
            htmlFor="file-upload"
            className="cursor-pointer rounded-xl bg-primary px-5 py-3 text-primary-foreground font-medium transition hover:opacity-90"
          >
            {status === "uploading" ? "Uploading..." : "Select File"}
          </label>
        )}

        <input
          id="file-upload"
          type="file"
          className="hidden"
          multiple
          onChange={handleFileChange}
          disabled={status==="uploading"}
        />
      </div>
    </div>
  );
};

export default UploadSection;