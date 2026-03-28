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

  const uploadPayload = new FormData();
  // Append the file directly from the client's FormData
  uploadPayload.append("file", file);
  uploadPayload.append("folder", folder);
  uploadPayload.append("timestamp", timestamp);
  uploadPayload.append("api_key", process.env.CLOUDINARY_API_KEY!);
  uploadPayload.append("signature", signatureHex);

  const uploadEndpoint = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

  try {
    const apiResponse = await fetch(uploadEndpoint, {
      method: "POST",
      body: uploadPayload,
    });

    if (!apiResponse.ok) {
      const errorDetail = await apiResponse.text();
      return NextResponse.json(
        { success: false, error: errorDetail },
        { status: apiResponse.status }
      );
    }

    const artifactMetadata = await apiResponse.json();
    return NextResponse.json({
      success: true,
      data: {
        url: artifactMetadata.secure_url,
        publicId: artifactMetadata.public_id,
        type: resourceType,
      },
    });
  } catch (exception: unknown) {
    const errorMessage = exception instanceof Error ? exception.message : "Systemic upload failure.";
    console.error("Cloudinary integration failure:", exception);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
