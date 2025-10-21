
import React from 'react';

interface ResultDisplayProps {
  content: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ content }) => {
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    let isList = false;
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
        if (isList) {
            isList = false;
            return <ul key={`ul-${Math.random()}`} className="list-disc pl-5 space-y-1 my-2">{listItems}</ul>;
        }
        return null;
    };
    
    const elements = lines.flatMap((line, index) => {
      let flushed = null;
      if (!line.startsWith('* ') && isList) {
          flushed = flushList();
          listItems = [];
      }

      if (line.startsWith('### ')) {
        return [flushed, <h3 key={index} className="text-xl font-semibold mt-6 mb-2 text-sky-400 border-b border-slate-700 pb-1">{line.substring(4)}</h3>];
      }
      if (line.startsWith('## ')) {
        return [flushed, <h2 key={index} className="text-2xl font-bold mt-8 mb-3 text-sky-300">{line.substring(3)}</h2>];
      }
      if (line.startsWith('* ')) {
        isList = true;
        listItems.push(<li key={index} className="text-slate-300">{line.substring(2)}</li>);
        return [flushed];
      }
      if (line.match(/(\*\*|__)(.*?)\1/)) { // Bold text
        const parts = line.split(/(\*\*|__)(.*?)\1/g);
        return [<p key={index} className="my-1 text-slate-300">{parts.map((part, i) => i % 4 === 2 ? <strong key={i} className="font-bold text-slate-100">{part}</strong> : part)}</p>]
      }
      if (line.trim() === '') {
        return [flushed, <br key={index} />];
      }
      
      return [flushed, <p key={index} className="my-1 text-slate-300">{line}</p>];
    });

    if (isList) {
        elements.push(flushList());
    }

    return elements.filter(Boolean);
  };

  return (
    <div className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-6 animate-fade-in">
        {renderMarkdown(content)}
    </div>
  );
};
