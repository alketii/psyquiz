import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request, { params }) {
  const { semesterId } = params;

  try {
    // Validate semester id format
    if (!semesterId || !semesterId.startsWith("sem-")) {
      return NextResponse.json(
        { error: "Invalid semester ID format" },
        { status: 400 }
      );
    }

    // Construct the path to the semester directory
    const semesterPath = path.join(process.cwd(), "data", semesterId);

    // Check if directory exists
    try {
      await fs.access(semesterPath);
    } catch (error) {
      return NextResponse.json(
        { error: "Semester not found" },
        { status: 404 }
      );
    }

    // Read the classes in the semester directory
    const entries = await fs.readdir(semesterPath, { withFileTypes: true });
    const classDirs = entries.filter((entry) => entry.isDirectory());

    // Extract semester number for the response
    const semNumber = semesterId.split("-")[1];

    // Format the response
    const classes = classDirs.map((dir) => ({
      id: dir.name,
      name: formatClassName(dir.name),
    }));

    return NextResponse.json({
      semester: {
        id: semesterId,
        name: `Semester ${semNumber}`,
      },
      classes,
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { error: "Failed to load classes" },
      { status: 500 }
    );
  }
}

// Helper function to format class name from directory name
function formatClassName(dirName) {
  // Convert kebab-case to title case
  return dirName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
