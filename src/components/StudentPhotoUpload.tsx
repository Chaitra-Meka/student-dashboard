
import { useRef } from "react";

interface StudentPhotoUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export default function StudentPhotoUpload({
  value,
  onChange,
}: StudentPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file?: File) {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      window.alert("Choose a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 1024 * 1024) {
      window.alert("Image size must be 1 MB or less.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };

    reader.onerror = () => {
      window.alert("Unable to read this image.");
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="photo-upload">
      <div className="photo-preview">
        {value ? (
          <img src={value} alt="Student preview" />
        ) : (
          <span>👤</span>
        )}
      </div>

      <div className="photo-actions">
        <button
          type="button"
          className="button button-secondary"
          onClick={() => inputRef.current?.click()}
        >
          Upload photo
        </button>

        {value && (
          <button
            type="button"
            className="text-button"
            onClick={() => {
              onChange("");
              if (inputRef.current) inputRef.current.value = "";
            }}
          >
            Remove
          </button>
        )}

        <small>JPG, PNG, or WebP · Max 1 MB</small>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
    </div>
  );
}
