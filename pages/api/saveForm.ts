import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { formId, formElements } = req.body;

    if (!formId) {
      return res.status(400).json({ message: 'Form ID is required' });
    }

    const filePath = path.join(process.cwd(), 'forms', `${formId}.json`);

    fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating directory', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      fs.writeFile(filePath, JSON.stringify({ formId, formElements }, null, 2), (err) => {
        if (err) {
          console.error('Error writing file', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        return res.status(200).json({ message: 'Form saved successfully' });
      });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
