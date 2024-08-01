import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const css = `
#label_1 {
    color: red;
}
  `;
  res.setHeader('Content-Type', 'text/css');
  res.send(css);
}