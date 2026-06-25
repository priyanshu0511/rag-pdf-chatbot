import { LuUpload } from "react-icons/lu";

const UploadSection = () => {
  return (
    <div className="bg-card border-2 border-border rounded-3xl p-6">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary text-primary-foreground p-4 rounded-2xl text-2xl">
            <LuUpload />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Upload Documents
            </h2>

            <p className="text-muted-foreground text-sm">
              Supports PDF, CSV and text files
            </p>
          </div>
        </div>

        <label
          htmlFor="file-upload"
          className="
            cursor-pointer
            rounded-xl
            bg-primary
            px-5
            py-3
            text-primary-foreground
            font-medium
            transition
            hover:opacity-90
          "
        >
          Select Files
        </label>

        <input
          id="file-upload"
          type="file"
          className="hidden"
          multiple
        />
      </div>
    </div>
  );
};

export default UploadSection;