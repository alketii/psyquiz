import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request, { params }) {
  const { semesterId, classId } = params;

  try {
    // Validate IDs
    if (!semesterId || !classId) {
      return NextResponse.json(
        { error: "Invalid semester or class ID" },
        { status: 400 }
      );
    }

    // Construct paths
    const semesterPath = path.join(process.cwd(), "data", semesterId);
    const classPath = path.join(semesterPath, classId);
    const materialPath = path.join(classPath, "main.md");

    // Check if material file exists
    try {
      await fs.access(materialPath);
    } catch (error) {
      return NextResponse.json(
        { error: "Material not found" },
        { status: 404 }
      );
    }

    // Read the material content
    const content = await fs.readFile(materialPath, "utf-8");

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error fetching material:", error);
    return NextResponse.json(
      { error: "Failed to load material" },
      { status: 500 }
    );
  }
}
