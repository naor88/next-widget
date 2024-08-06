import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const formsDir = path.join(process.cwd(), 'forms');
    fs.readdir(formsDir, (err, files) => {
      if (err) {
        console.error('Error reading forms directory', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      const formIds = files.map(file => path.basename(file, '.json'));
      return res.status(200).json({ forms: formIds });
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
