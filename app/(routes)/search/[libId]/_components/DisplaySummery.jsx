import React from 'react';
import ReactMarkdown from 'react-markdown';

function DisplaySummary({ aiResp }) {
  return (
    <div className='mt-7'>
      {!aiResp && (
        <div role="status" aria-busy="true">
          <div className='w-full h-5 bg-accent animate-pulse rounded-md'></div>
          <div className='w-1/2 mt-2 h-5 bg-accent animate-pulse rounded-md'></div>
          <div className='w-[70%] mt-2 h-5 bg-accent animate-pulse rounded-md'></div>
        </div>
      )}
      <ReactMarkdown
        components={{
          h1: (props) => <h1 className="text-4xl font-bold text-blue-800 mb-4 leading-snug" {...props} />,
          h2: (props) => <h2 className="text-3xl font-semibold text-blue-700 mb-3 leading-snug" {...props} />,
          h3: (props) => <h3 className="text-2xl font-semibold text-blue-600 mt-4 mb-2 leading-tight" {...props} />,
          p: (props) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
          a: (props) => (
            <a className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noreferrer" {...props} />
          ),
          ul: ({ ordered, ...props }) => (
            <ul className="list-disc list-inside space-y-2 leading-relaxed" {...props} />
          ),
          li: ({ ordered, ...props }) => (
            <li className="mb-1" {...props} />
          ),
          blockquote: (props) => (
            <blockquote className="bg-gray-100 p-4 rounded-lg text-gray-700 leading-relaxed mb-6" {...props} />
          ),
          table: (props) => (
            <table className="table-auto w-full text-sm text-gray-700 border-collapse border border-gray-300" {...props} />
          ),
          th: (props) => (
            <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left" {...props} />
          ),
          td: (props) => (
            <td className="border border-gray-300 px-4 py-2" {...props} />
          ),
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <div>{children}</div>
            ) : (
              <code className="bg-gray-100 p-1 rounded-md" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {aiResp}
      </ReactMarkdown>
    </div>
  );
}

export default DisplaySummary;