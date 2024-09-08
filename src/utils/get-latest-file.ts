import fs from 'fs';
import path from 'path';

/**
 * Get the latest file in the fetch-data/tradingeconomics_com directory
 */
export function getLatestFile() {
	const baseDir = path.join(__dirname, '../../fetch-data/tradingeconomics_com'); // Adjust the path accordingly

	// Get all date folders
	const dateFolders = fs.readdirSync(baseDir).filter((folder) => {
		return fs.statSync(path.join(baseDir, folder)).isDirectory();
	});

	if (dateFolders.length === 0) {
		throw new Error('No date folders found');
	}

	// Sort date folders in descending order to get the latest one
	const latestDateFolder = dateFolders.sort((a, b) => b.localeCompare(a))[0];
	const latestDateFolderPath = path.join(baseDir, latestDateFolder);

	// Get all hour folders inside the latest date folder
	const hourFolders = fs.readdirSync(latestDateFolderPath).filter((folder) => {
		return fs.statSync(path.join(latestDateFolderPath, folder)).isDirectory();
	});

	if (hourFolders.length === 0) {
		throw new Error('No hour folders found in latest date folder');
	}

	// Sort hour folders in descending order to get the latest one
	const latestHourFolder = hourFolders.sort((a, b) => b.localeCompare(a))[0];
	const latestHourFolderPath = path.join(latestDateFolderPath, latestHourFolder);

	// Find the .txt file in the latest hour folder
	const files = fs.readdirSync(latestHourFolderPath).filter((file) => file.endsWith('.txt'));

	if (files.length === 0) {
		throw new Error('No .txt files found in latest hour folder');
	}

	// Return the full path of the latest file
	const latestFile = files[0];
	return path.join(latestHourFolderPath, latestFile);
}

