import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request, { params }) {
  const { semesterId } = params;

  try {
    // Read the classes.json file
    const dataPath = path.join(process.cwd(), "data", "classes.json");
    const content = await fs.readFile(dataPath, "utf-8");
    const data = JSON.parse(content);

    // Check if semester exists
    if (!data.semesters[semesterId]) {
      return NextResponse.json(
        { error: "Semester not found" },
        { status: 404 }
      );
    }

    const semester = data.semesters[semesterId];

    return NextResponse.json({
      semester: {
        id: semester.id,
        name: semester.name,
      },
      classes: semester.classes.map((classItem) => ({
        id: classItem.id,
        name: classItem.title,
        professor: classItem.professor,
        description: classItem.description,
        credits: classItem.credits,
      })),
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
