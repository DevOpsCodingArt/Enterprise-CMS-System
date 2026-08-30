"use client";

import React from "react";
import { FileImage, FileText, Download, Eye, UploadCloud } from "lucide-react";
import { SubscriberRecord } from "@/mock/db";
import { useToast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";

export function DocumentsTab({ subscriber }: { subscriber: SubscriberRecord }) {
  const toast = useToast();

  const documents = [
    {
      id: 1,
      name: "CNIC Front Scan",
      type: "image/jpeg",
      size: "2.4 MB",
      date: subscriber.installedAt || "2025-06-14",
      icon: FileImage,
    },
    {
      id: 2,
      name: "CNIC Back Scan",
      type: "image/jpeg",
      size: "2.1 MB",
      date: subscriber.installedAt || "2025-06-14",
      icon: FileImage,
    },
    {
      id: 3,
      name: "Signed FTTH Service Agreement",
      type: "application/pdf",
      size: "4.8 MB",
      date: subscriber.installedAt || "2025-06-14",
      icon: FileText,
    },
  ];

  const handleUpload = () => {
    toast.success("Upload Modal", "Select document file to attach to subscriber record.");
  };

  const handlePreview = (name: string) => {
    toast.info("Document Preview", `Opening verified scan for ${name}.`);
  };

  const handleDownload = (name: string) => {
    toast.success("Download Started", `Downloading ${name}.`);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-xs">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-bold text-foreground tracking-tight">
            Subscriber KYC Scans & Legal Documents
          </h3>
          <p className="text-xs text-muted-foreground font-mono">
            Verified CNIC identity documents & signed subscriber contracts
          </p>
        </div>
        <button
          type="button"
          onClick={handleUpload}
          className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg shadow-xs hover:bg-primary/90 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <UploadCloud size={14} /> Upload New Scan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="group relative bg-muted/30 rounded-xl border border-border p-5 flex flex-col items-center justify-center hover:bg-muted/50 hover:border-primary/40 transition-all"
          >
            <div className="p-3.5 rounded-xl mb-3 bg-primary/10 text-primary shadow-xs group-hover:scale-105 transition-transform">
              <doc.icon size={36} strokeWidth={1.5} />
            </div>

            <h4 className="text-xs font-bold text-foreground tracking-tight text-center mb-1">
              {doc.name}
            </h4>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-muted-foreground uppercase">
              <span>{doc.type.split("/")[1]}</span>
              <span>•</span>
              <span>{doc.size}</span>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground mt-2 text-center">
              Verified: {doc.date}
            </p>

            {/* Hover Actions Overlay */}
            <div className="absolute inset-0 bg-background/90 backdrop-blur-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
              <Tooltip content="Preview Document" position="top">
                <button
                  type="button"
                  onClick={() => handlePreview(doc.name)}
                  className="p-2.5 bg-card border border-border text-foreground hover:text-primary rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Eye size={16} />
                </button>
              </Tooltip>
              <Tooltip content="Download File" position="top">
                <button
                  type="button"
                  onClick={() => handleDownload(doc.name)}
                  className="p-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Download size={16} />
                </button>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
