// src/_core/server/routes.ts
import { exec, spawn } from 'child_process';
import express from 'express';
import { ref, serverTimestamp, set } from 'firebase/database'; // Firebase Realtime Database methods
import { cleanFirebaseData } from '../../../utils/clean-doublon';
import { getAllFiles } from '../../../utils/get-all-files';
import { getAllContentFromFirebase, getContentById, updateNewsTimestamps } from '../../../utils/get-data';
import { getLatestFile } from '../../../utils/get-latest-file';
import { postNewsDataToFirebase, previewProcessedData, ProcessedDataPost, updateLastProcessedData, UpdateProcess } from '../../../utils/post-data';
import { packageJson } from '../../utils/utils'; // Utility to load package.json
import { database } from '../firebase/firebase'; // Import Firebase configuration
const fs = require('fs').promises;

const path = require('path');

const router = express.Router();
const base = '/api_v1';
// Ping route
router.get('/ping', (_req, res) => {
	res.send('pong');
});

// Version route
router.get(base + '/version', (_req, res) => {
	res.json({
		name: packageJson.name,
		version: packageJson.version
	});
});

// Write test data to Firebase Realtime Database
router.post(base + '/write-test-data', async (_req, res) => {
	try {
		// Define the reference path in your database
		const dbRef = ref(database, 'test/data');

		// Write test data
		await set(dbRef, {
			testKey: 'testValue',
			timestamp: serverTimestamp()
		});

		res.status(200).json({ message: 'Test data written successfully!' });
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});



// Route to retrieve all news data
router.get(base + '/get-all-news-data', async (_req, res) => {
    try {
        // Fetch all news data from Firebase
        const newsData = await getAllContentFromFirebase();
        
        // Return the data as a JSON response
        res.status(200).json({ message: 'News data retrieved successfully!', data: newsData });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});


router.get(base + '/get-by-new-id', async (req, res) => {
    try {
        const id = req.query.id as string;
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }
        const content = await getContentById(id);
        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }
        res.status(200).json({ data: content });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});


router.post(base + '/analyze-news', async (req, res) => {
    const newsId = req.body.newsId;
    
    if (!newsId) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'News ID is required' 
        });
    }

    try {
        const scriptPath = path.join(process.cwd(), 'src', 'scripts', "openai", 'analyze_news.py');
        
        const pythonProcess = spawn('python', [scriptPath, newsId]);
        
        let result = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Analysis process failed',
                    error: error
                });
            }

            try {
                const analysisResult = JSON.parse(result);
                
                if (analysisResult.status === 'skip') {
                    return res.json({
                        status: 'success',
                        message: 'Analysis already exists',
                        data: analysisResult.data
                    });
                }
                
                if (analysisResult.status === 'success') {
                    return res.json({
                        status: 'success',
                        message: 'Analysis completed successfully',
                        data: analysisResult.data
                    });
                }
                
                return res.status(400).json(analysisResult);
                
            } catch (e : any) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Failed to parse analysis result',
                    error: e.message
                });
            }
        });

    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to start analysis process',
            error: error.message
        });
    }
});


// Route to post new data to Firebase
router.post(base + '/post-news-data', async (_req, res) => {
    try {
        const postData = await postNewsDataToFirebase() as ProcessedDataPost;
        res.status(200).json({ 
            message: 'New data successfully posted to Firebase!',
            timestamp: new Date().toISOString(),
            postData: postData
        });
    } catch (error) {
        console.error('Error in post-news-data route:', error);
        res.status(500).json({ 
            error: (error as Error).message,
            timestamp: new Date().toISOString()
        });
    }
});

// Route to post new data to Firebase
router.get(base + '/preview-process-news-data', async (_req, res) => {
    try {
        const postData = await previewProcessedData()  as ProcessedDataPost;
        res.status(200).json({ 
            message: 'get New data preview successfully!',
            timestamp: new Date().toISOString(),
            postData: postData
        });
    } catch (error) {
        console.error('Error in post-news-data route:', error);
        res.status(500).json({ 
            error: (error as Error).message,
            timestamp: new Date().toISOString()
        });
    }
});


// Route to post new data to Firebase
router.post(base + '/update-process-news-data', async (_req, res) => {
    try {
        const process = await updateLastProcessedData() as UpdateProcess;
        res.status(200).json({ 
            message: 'get New data preview successfully!',
            process: process,
        });
    } catch (error) {
        console.error('Error in post-news-data route:', error);
        res.status(500).json({ 
            error: (error as Error).message,
        });
    }
});

router.post(base + '/clean-news-data', async (_req, res) => {
    try {
        await cleanFirebaseData();
        res.status(200).json({ message: 'Firebase news data cleaned successfully!' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});


// Add a route handler for the new function
router.post(base + '/update-timestamps', async (_req, res) => {
    try {
        const result = await updateNewsTimestamps();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ 
            error: (error as Error).message,
            timestamp: new Date().toISOString()
        });
    }
});


router.post(base + '/start-fetch', async (_req, res) => {
    const scriptPath = path.join(process.cwd(), 'src', 'scripts', 'bot', 'fetch-single-url-html-background.py');
    const url = 'https://tradingeconomics.com/stream';
    
    console.log(`[${new Date().toISOString()}] Starting fetch script...`);
    
    // Use explicit encoding
    exec(`python "${scriptPath}" "${url}"`, { encoding: 'utf8' }, (error, stdout, stderr) => {
        // Log everything for debugging
        if (stdout) console.log(`[${new Date().toISOString()}] stdout:`, stdout);
        if (stderr) console.error(`[${new Date().toISOString()}] stderr:`, stderr);
        
        if (error) {
            console.error(`[${new Date().toISOString()}] Error:`, error);
            res.status(500).json({ 
                status: 'error',
                message: 'Failed to execute fetch script',
                error: {
                    code: error.code,
                    message: error.message
                },
                details: {
                    stdout: stdout?.trim(),
                    stderr: stderr?.trim()
                }
            });
            return;
        }

        // Check if stdout contains success message
        if (stdout.includes('[SUCCESS]')) {
            res.json({ 
                status: 'success',
                message: 'Fetch completed successfully',
                output: stdout.trim()
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Fetch completed but no success message found',
                output: stdout.trim(),
                stderr: stderr?.trim()
            });
        }
    });
});


router.get(base + '/fetch-files', async (_req, res) => {
    try {
        const fetchDataPath = path.join(process.cwd(), 'fetch-data');
		console.log(`[${new Date().toISOString()}] Fetching files from: ${fetchDataPath}`);

        // Check if directory exists
        try {
            await fs.access(fetchDataPath);
        } catch {
            console.log(`[${new Date().toISOString()}] Directory doesn't exist, creating it`);
            await fs.mkdir(fetchDataPath, { recursive: true });
        }

        // Get all files
        const files = await getAllFiles(fetchDataPath);

        // Count total files
        let totalFiles = 0;
        const countFiles = (items: any[]) => {
            items.forEach(item => {
                if (item.type === 'file') totalFiles++;
                else if (item.type === 'directory' && item.files) {
                    countFiles(item.files);
                }
            });
        };
        countFiles(files);

        res.json({
            status: 'success',
            message: `Found ${totalFiles} files`,
            basePath: fetchDataPath,
            files: files
        });

    } catch (error : any) {
        console.error(`[${new Date().toISOString()}] Error:`, error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to read directory',
            error: error.message
        });
    }
});


router.get(base + '/fetch-content', async (req, res) => {
    try {
        const filePath = req.query.path ?? getLatestFile();;
        
        if (!filePath) {
            return res.status(400).json({
                status: 'error',
                message: 'File path is required'
            });
        }

        // Security check - ensure the file path is within the fetch-data directory
        const fetchDataPath = path.join(process.cwd(), 'fetch-data');
        const absolutePath = path.resolve(filePath);
        
        if (!absolutePath.startsWith(fetchDataPath)) {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied: File is outside of fetch-data directory'
            });
        }

        // Read file content
        const content = await fs.readFile(filePath, 'utf8');
        
        // Parse JSON content
        const jsonContent = JSON.parse(content);

        res.json({
            status: 'success',
            file: {
                path: filePath,
                name: path.basename(filePath)
            },
            content: jsonContent
        });

    } catch (error:any) {
        console.error(`[${new Date().toISOString()}] Error reading file:`, error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to read file',
            error: error.message
        });
    }
});

// Option 2: Get file by structured parameters
router.get(base + '/fetch-content/:domain/:date/:hour', async (req, res) => {
    try {
        const { domain, date, hour } = req.params;
        const fileName = `${domain}-${date}-${hour}.txt`;
        const filePath = path.join(
            process.cwd(),
            'fetch-data',
            domain,
            date,
            hour,
            fileName
        );

        // Check if file exists
        try {
            await fs.access(filePath);
        } catch {
            return res.status(404).json({
                status: 'error',
                message: 'File not found'
            });
        }

        // Read file content
        const content = await fs.readFile(filePath, 'utf8');
        
        // Parse JSON content
        const jsonContent = JSON.parse(content);

        res.json({
            status: 'success',
            file: {
                domain,
                date,
                hour,
                path: filePath,
                name: fileName
            },
            content: jsonContent
        });

    } catch (error:any) {
        console.error(`[${new Date().toISOString()}] Error reading file:`, error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to read file',
            error: error.message
        });
    }
});


export default router;  // Ensure the router is exported as default
