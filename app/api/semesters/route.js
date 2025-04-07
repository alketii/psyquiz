import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    // Read the data directory
    const dataPath = path.join(process.cwd(), "data");
    const entries = await fs.readdir(dataPath, { withFileTypes: true });

    // Filter out only directories that start with 'sem-'
    const semesterDirs = entries.filter(
      (entry) => entry.isDirectory() && entry.name.startsWith("sem-")
    );

    // Process each semester directory to count classes
    const semesters = await Promise.all(
      semesterDirs.map(async (dir) => {
        const semesterPath = path.join(dataPath, dir.name);
        const classEntries = await fs.readdir(semesterPath, {
          withFileTypes: true,
        });
        const classes = classEntries.filter((entry) => entry.isDirectory());

        // Extract semester number from directory name
        const semNumber = dir.name.split("-")[1];

        return {
          id: dir.name,
          name: `Semester ${semNumber}`,
          classCount: classes.length,
        };
      })
    );

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
