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

    // Check if paths exist
    try {
      await fs.access(classPath);
    } catch (error) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    // Check what files are available in the class directory
    const files = await fs.readdir(classPath);

    // Format the response
    const semNumber = semesterId.split("-")[1];

    // Format class name from directory
    const className = classId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return NextResponse.json({
      semester: {
        id: semesterId,
        name: `Semester ${semNumber}`,
      },
      classId,
      className,
      hasMainMaterial: files.includes("main.md"),
      hasVocabulary: files.includes("vocabulary.md"),
      hasQuiz: files.includes("quiz.json"),
    });
  } catch (error) {
    console.error("Error fetching class details:", error);
    return NextResponse.json(
      { error: "Failed to load class details" },
      { status: 500 }
    );
  }
}
