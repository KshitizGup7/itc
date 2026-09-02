'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
// These CSS imports are required for text selection to work properly
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker to process the heavy PDF file in the background
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function CatalogViewer({ pdfUrl }: { pdfUrl: string }) {
  const [numPages, setNumPages] = useState<number>();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className="w-full flex flex-col items-center bg-zinc-100 p-4 md:p-8 rounded-lg">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex flex-col items-center gap-8"
        loading={<div className="animate-pulse text-zinc-500">Loading high-res catalog...</div>}
      >
        {/* This loops through every page and renders them stacked neatly */}
        {Array.from(new Array(numPages), (el, index) => (
          <div key={`page_${index + 1}`} className="shadow-xl rounded-sm overflow-hidden">
            <Page 
              pageNumber={index + 1} 
              width={800} // You can adjust this or make it responsive
              renderAnnotationLayer={false} 
            />
          </div>
        ))}
      </Document>
    </div>
  );
}