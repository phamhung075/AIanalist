const path = require('path');
const fs = require('fs').promises;
// Function to get all files recursively
export async function getAllFiles(dirPath: string): Promise<any[]> {
    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        const files = await Promise.all(entries.map(async (entry: any) => {
            const fullPath = path.join(dirPath, entry.name);
            
            if (entry.isDirectory()) {
                // If it's a directory, recurse into it
                const subFiles = await getAllFiles(fullPath);
                return {
                    type: 'directory',
                    name: entry.name,
                    path: fullPath,
                    files: subFiles
                };
            } else {
                // If it's a file, get its stats
                const stats = await fs.stat(fullPath);
                return {
                    type: 'file',
                    name: entry.name,
                    path: fullPath,
                    size: stats.size,
                    created: stats.birthtime,
                    modified: stats.mtime
                };
            }
        }));

        return files;
    } catch (error) {
        console.error(`Error reading directory: ${dirPath}`, error);
        throw error;
    }
}