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
    const vocabularyPath = path.join(classPath, "vocabulary.md");

    // Check if vocabulary file exists
    try {
      await fs.access(vocabularyPath);
    } catch (error) {
      return NextResponse.json(
        { error: "Vocabulary not found" },
        { status: 404 }
      );
    }

    // Read the vocabulary content
    const content = await fs.readFile(vocabularyPath, "utf-8");

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error fetching vocabulary:", error);
    return NextResponse.json(
      { error: "Failed to load vocabulary" },
      { status: 500 }
    );
  }
}
