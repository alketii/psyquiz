import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    // Read the classes.json file
    const dataPath = path.join(process.cwd(), "data", "classes.json");
    const content = await fs.readFile(dataPath, "utf-8");
    const data = JSON.parse(content);

    // Transform the data to match the expected format
    const semesters = Object.values(data.semesters).map((semester) => ({
      id: semester.id,
      name: semester.name,
      classCount: semester.classes.length,
    }));

    // Sort semesters by number
    semesters.sort((a, b) => {
      const aNum = parseInt(a.id.split("-")[1]);
      const bNum = parseInt(b.id.split("-")[1]);
      return aNum - bNum;
    });

    return NextResponse.json(semesters);
  } catch (error) {
    console.error("Error fetching semesters:", error);
    return NextResponse.json(
      { error: "Failed to load semesters" },
      { status: 500 }
    );
  }
}
