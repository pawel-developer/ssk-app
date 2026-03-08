"use client";

import { useRef, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import Cropper, { type Area } from "react-easy-crop";

export interface ImageUploadHandle {
  openCropper: () => void;
}

interface ImageUploadWithResizeProps {
  value: string;
  onChange: (path: string) => void;
  suggestedName?: string;
  outputWidth?: number;
  outputHeight?: number;
  cropShape?: "round" | "rect";
  aspect?: number;
  showPreview?: boolean;
  label?: string;
  compact?: boolean;
}

const btnSt = (bg: string, color: string): React.CSSProperties => ({
  padding: "6px 12px",
  border: "none",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  background: bg,
  color,
  transition: "all .15s",
  whiteSpace: "nowrap",
});

function resolveImgSrc(img: string): string {
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("/")) return img;
  return `/img/${img}.webp`;
}

async function getCroppedBlob(imageSrc: string, crop: Area): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
      "image/png",
      1,
    );
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (e) => reject(e));
    img.crossOrigin = "anonymous";
    img.src = url;
  });
}

const ImageUploadWithResize = forwardRef<ImageUploadHandle, ImageUploadWithResizeProps>(
  function ImageUploadWithResize(
    {
      value,
      onChange,
      suggestedName,
      outputWidth = 0,
      outputHeight = 0,
      cropShape = "rect",
      aspect,
      showPreview = true,
      label = "Obraz",
      compact = false,
    },
    ref,
  ) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [previousImg, setPreviousImg] = useState<string | null>(null);

    const [cropSrc, setCropSrc] = useState<string | null>(null);
    const [isExistingImage, setIsExistingImage] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);
    const [pendingFile, setPendingFile] = useState<File | null>(null);

    const effectiveAspect = aspect ?? (cropShape === "round" ? 1 : 16 / 9);

    const openCropperWithCurrentImage = useCallback(() => {
      const src = resolveImgSrc(value);
      if (!src) return;
      setCropSrc(src);
      setIsExistingImage(true);
      setPendingFile(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }, [value]);

    useImperativeHandle(ref, () => ({ openCropper: openCropperWithCurrentImage }), [openCropperWithCurrentImage]);

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
      setCroppedArea(croppedAreaPixels);
    }, []);

    const handleFileSelected = (file: File) => {
      const objectUrl = URL.createObjectURL(file);
      setCropSrc(objectUrl);
      setIsExistingImage(false);
      setPendingFile(file);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };

    const uploadCropped = async (blob: Blob, fileName: string) => {
      const croppedFile = new File([blob], fileName, { type: "image/png" });
      const formData = new FormData();
      formData.append("file", croppedFile);
      if (suggestedName) formData.append("filename", suggestedName);
      if (outputWidth > 0) formData.append("width", String(outputWidth));
      if (outputHeight > 0) formData.append("height", String(outputHeight));

      const res = await fetch("/api/upload-image", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Błąd uploadu");
      }
      return (await res.json()).path as string;
    };

    const handleCropConfirm = async () => {
      if (!cropSrc || !croppedArea) return;

      setUploading(true);
      setError("");

      try {
        const croppedBlob = await getCroppedBlob(cropSrc, croppedArea);
        const fileName = pendingFile?.name || "recrop.png";
        const newPath = await uploadCropped(croppedBlob, fileName);
        setPreviousImg(value);
        onChange(newPath);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Błąd sieci");
      }

      if (!isExistingImage && cropSrc) URL.revokeObjectURL(cropSrc);
      setCropSrc(null);
      setPendingFile(null);
      setIsExistingImage(false);
      setUploading(false);
    };

    const handleCropCancel = () => {
      if (!isExistingImage && cropSrc) URL.revokeObjectURL(cropSrc);
      setCropSrc(null);
      setPendingFile(null);
      setIsExistingImage(false);
    };

    const handleRevert = () => {
      if (previousImg != null) {
        const current = value;
        onChange(previousImg);
        setPreviousImg(current);
      }
    };

    const imgSrc = resolveImgSrc(value);

    const cropModal = cropSrc && (
      <div
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.6)",
          zIndex: 1000, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: 16,
        }}
        onClick={handleCropCancel}
      >
        <div
          style={{
            background: "#fff", borderRadius: 16, overflow: "hidden",
            width: "100%", maxWidth: 600, boxShadow: "0 8px 32px rgba(0,0,0,.2)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
              Przytnij obraz
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
              Przeciągnij i powiększ, aby wybrać widoczny fragment
            </p>
          </div>

          <div style={{ position: "relative", width: "100%", height: 400, background: "#1e293b" }}>
            <Cropper
              image={cropSrc}
              crop={crop}
              zoom={zoom}
              aspect={effectiveAspect}
              cropShape={cropShape}
              showGrid={cropShape === "rect"}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600, whiteSpace: "nowrap" }}>
              Powiększenie:
            </span>
            <input
              type="range" min={1} max={3} step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ flex: 1 }}
            />
          </div>

          <div style={{
            padding: "12px 20px", borderTop: "1px solid #e2e8f0",
            display: "flex", justifyContent: "flex-end", gap: 8,
          }}>
            <button onClick={handleCropCancel} style={btnSt("#e2e8f0", "#475569")}>
              Anuluj
            </button>
            <button
              onClick={handleCropConfirm}
              disabled={uploading}
              style={btnSt(uploading ? "#94a3b8" : "#16a34a", "#fff")}
            >
              {uploading ? "Przesyłanie..." : "Zatwierdź i prześlij"}
            </button>
          </div>
        </div>
      </div>
    );

    // ── Compact mode (board member rows) ──
    if (compact) {
      return (
        <>
          <div>
            <input
              ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelected(f); e.target.value = ""; }}
            />
            <div style={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
              <button type="button" onClick={() => fileRef.current?.click()} style={{ ...btnSt("#7c3aed", "#fff"), padding: "2px 6px", fontSize: 10, borderRadius: 4 }}>
                Zmień
              </button>
              {imgSrc && (
                <button type="button" onClick={openCropperWithCurrentImage} style={{ ...btnSt("#0369a1", "#fff"), padding: "2px 6px", fontSize: 10, borderRadius: 4 }} title="Przytnij obecny obraz">
                  Przytnij
                </button>
              )}
              {previousImg != null && (
                <button type="button" onClick={handleRevert} style={{ ...btnSt("#f59e0b", "#fff"), padding: "2px 6px", fontSize: 10, borderRadius: 4 }} title="Przywróć poprzedni obraz">
                  Cofnij
                </button>
              )}
            </div>
            {error && <p style={{ color: "#dc2626", fontSize: 11, margin: "4px 0 0" }}>{error}</p>}
          </div>
          {cropModal}
        </>
      );
    }

    // ── Full mode (events) ──
    return (
      <>
        <div style={{ marginBottom: 12 }}>
          {label && (
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#475569" }}>
              {label}
            </label>
          )}

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <input
              style={{
                flex: 1, minWidth: 140, padding: "8px 10px",
                border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 13,
                fontFamily: "inherit", outline: "none", boxSizing: "border-box",
              }}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/img/nazwa.webp"
            />
            <input
              ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelected(f); e.target.value = ""; }}
            />
            <button type="button" onClick={() => fileRef.current?.click()} style={btnSt("#7c3aed", "#fff")}>
              Prześlij
            </button>
            {previousImg != null && (
              <button type="button" onClick={handleRevert} style={btnSt("#f59e0b", "#fff")} title="Przywróć poprzedni obraz">
                Cofnij
              </button>
            )}
          </div>

          {error && <p style={{ color: "#dc2626", fontSize: 12, margin: "4px 0 0" }}>{error}</p>}

          {showPreview && imgSrc && (
            <div
              style={{ marginTop: 8, cursor: "pointer", display: "inline-block", position: "relative" }}
              onClick={openCropperWithCurrentImage}
              title="Kliknij, aby przyciąć obraz"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc}
                alt="podgląd"
                style={{
                  maxWidth: 200, maxHeight: 120, borderRadius: 8,
                  objectFit: "cover", border: "2px solid #e2e8f0",
                  transition: "border-color .15s",
                }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                onLoad={(e) => { (e.target as HTMLImageElement).style.display = "block"; }}
                onMouseEnter={(e) => { (e.target as HTMLImageElement).style.borderColor = "#7c3aed"; }}
                onMouseLeave={(e) => { (e.target as HTMLImageElement).style.borderColor = "#e2e8f0"; }}
              />
              <span style={{
                position: "absolute", bottom: 4, right: 4,
                background: "rgba(0,0,0,.6)", color: "#fff",
                fontSize: 10, fontWeight: 600, padding: "2px 6px",
                borderRadius: 4, pointerEvents: "none",
              }}>
                Przytnij
              </span>
            </div>
          )}
        </div>
        {cropModal}
      </>
    );
  },
);

export default ImageUploadWithResize;
