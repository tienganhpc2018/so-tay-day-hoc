import React from 'react';
import { Modal } from '../common/Modal';
import { ExternalLink, FileText, Download } from 'lucide-react';

export const MaterialViewer = ({ isOpen, onClose, material }) => {
  if (!isOpen || !material) return null;

  const renderContent = () => {
    if (material.file_type === 'iframe_link') {
      return (
        <div className="w-full h-[600px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
          <iframe
            src={material.file_url}
            title={material.title}
            className="w-full h-full border-none"
            allowFullScreen
          />
        </div>
      );
    }

    if (material.file_type === 'pdf') {
      return (
        <div className="w-full h-[600px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-6 text-center">
          <iframe
            src={material.file_url}
            title={material.title}
            className="w-full h-full border-none"
          />
        </div>
      );
    }

    if (material.file_type === 'video') {
      return (
        <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
          <video src={material.file_url} controls className="w-full h-full" />
        </div>
      );
    }

    return (
      <div className="py-12 text-center space-y-4">
        <FileText className="w-16 h-16 text-brand-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">{material.title}</h3>
        <p className="text-xs text-slate-400">Định dạng file: {material.file_type.toUpperCase()}</p>
        <div className="flex justify-center gap-3">
          <a
            href={material.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-button-primary text-sm px-4 py-2"
          >
            <ExternalLink className="w-4 h-4" />
            Mở Liên Kết Trực Tiếp
          </a>
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={material.title} maxWidth="max-w-4xl">
      <div className="space-y-4">
        {renderContent()}
      </div>
    </Modal>
  );
};
