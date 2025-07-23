import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { success: false, error: "No file provided." },
      { status: 400 }
    );
  }

  // Read the file buffer
  const arrayBuf = await file.arrayBuffer();
  const resourceType = file.type.startsWith("video/") ? "video" : "image";
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = "adhd-journal-media";

  // Generate SHA-1 signature using Web Crypto API
  const signatureBase = `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
  const signatureBuffer = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(signatureBase)
  );
  const signatureHex = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const cloudinaryData = new FormData();
  // Append the file directly from the client's FormData
  cloudinaryData.append("file", file);
  cloudinaryData.append("folder", folder);
  cloudinaryData.append("timestamp", timestamp);
  cloudinaryData.append("api_key", process.env.CLOUDINARY_API_KEY!);
  cloudinaryData.append("signature", signatureHex);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

  try {
    const cloudRes = await fetch(uploadUrl, {
      method: "POST",
      body: cloudinaryData,
    });

    if (!cloudRes.ok) {
      const errText = await cloudRes.text();
      return NextResponse.json(
        { success: false, error: errText },
        { status: cloudRes.status }
      );
    }

    const result = await cloudRes.json();
    return NextResponse.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        type: resourceType,
      },
    });
  } catch (err: any) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Upload failed." },
      { status: 500 }
    );
  }
}
