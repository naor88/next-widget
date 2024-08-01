import React from 'react';
import type { NextApiRequest, NextApiResponse } from 'next';
import { renderToStaticMarkup } from 'react-dom/server';
import Option1Form from '../../components/forms/Option1Form';
import Option2Form from '../../components/forms/Option2Form';

interface SubFormRequest {
  selectedValue: string;
}

interface SubFormResponse {
  data: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SubFormResponse>) {
  const { selectedValue } = req.body as SubFormRequest;

  let subFormHtml: string;

  if (selectedValue === 'option1') {
    subFormHtml = renderToStaticMarkup(React.createElement(Option1Form))
  } else if (selectedValue === 'option2') {
    subFormHtml = renderToStaticMarkup(React.createElement(Option2Form))
  } else {
    return res.status(400).json({ data: 'Invalid option' });
  }

  try {
    res.status(200).json({ data: subFormHtml });
  } catch (error) {
    res.status(500).json({ data: 'Error reading HTML file' });
  }
}
