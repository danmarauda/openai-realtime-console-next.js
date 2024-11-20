import { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;
  const notebookId = Date.now().toString();
  
  try {
    // Create a new Marimo notebook
    const notebook = spawn('marimo', ['edit', '--headless'], {
      env: { ...process.env, MARIMO_CODE: code }
    });

    // Get notebook URL from Marimo output
    const url = await new Promise((resolve) => {
      notebook.stdout.on('data', (data) => {
        const match = data.toString().match(/http:\/\/localhost:(\d+)/);
        if (match) {
          resolve(`http://localhost:${match[1]}`);
        }
      });
    });

    return res.status(200).json({ url });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create notebook' });
  }
} 