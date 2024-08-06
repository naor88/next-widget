import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Form ID is required' });
    }

    const filePath = path.join(process.cwd(), 'forms', `${id}.json`);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return res.status(404).json({ message: 'Form not found' });
        }
        console.error('Error reading form file', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      const form = JSON.parse(data);
      return res.status(200).json(form);
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
