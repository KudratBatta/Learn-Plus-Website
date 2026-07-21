import React, { useRef } from 'react';

const Certificate = ({ certificate }) => {
  const canvasRef = useRef(null);

  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Canvas size (standard certificate aspect ratio ~ 4:3 or 16:9, let's use 1120x800 for high-res)
    canvas.width = 1120;
    canvas.height = 800;

    // ─── Draw Certificate Background ───
    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(1, '#f1f5f9');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative Borders
    ctx.strokeStyle = '#6366f1'; // Indigo border
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.strokeStyle = '#0f172a'; // Slate secondary border
    ctx.lineWidth = 2;
    ctx.strokeRect(34, 34, canvas.width - 68, canvas.height - 68);

    // Corner Accents
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(20, 20, 60, 14);
    ctx.fillRect(20, 20, 14, 60);

    ctx.fillRect(canvas.width - 80, 20, 60, 14);
    ctx.fillRect(canvas.width - 34, 20, 14, 60);

    ctx.fillRect(20, canvas.height - 34, 60, 14);
    ctx.fillRect(20, canvas.height - 80, 14, 60);

    ctx.fillRect(canvas.width - 80, canvas.height - 34, 60, 14);
    ctx.fillRect(canvas.width - 34, canvas.height - 80, 14, 60);

    // ─── Typography & Content ───
    // Branding Header
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 24px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LEARN PLUS ONLINE ACADEMY', canvas.width / 2, 90);

    // Gold Medal seal outline/image placeholder
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 160, 36, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = '#fef08a';
    ctx.fill();
    ctx.fillStyle = '#ca8a04';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('VERIFIED', canvas.width / 2, 166);

    // Title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'italic 46px serif';
    ctx.fillText('Certificate of Completion', canvas.width / 2, 240);

    // Presentation text
    ctx.fillStyle = '#64748b';
    ctx.font = '18px sans-serif';
    ctx.fillText('This is proudly presented to', canvas.width / 2, 300);

    // Student Name
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(certificate.student?.name || 'Jane Doe', canvas.width / 2, 355);

    // Course statement
    ctx.fillStyle = '#64748b';
    ctx.font = '18px sans-serif';
    ctx.fillText(
      `for successfully completing the online learning curriculum for`,
      canvas.width / 2,
      415
    );

    // Course Title
    ctx.fillStyle = '#4f46e5';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(certificate.course?.title || 'Web Stack Engineering', canvas.width / 2, 470);

    // Course stats details
    ctx.fillStyle = '#64748b';
    ctx.font = '15px sans-serif';
    ctx.fillText(
      `A free course consisting of ${certificate.course?.duration || '4 weeks'} of structured syllabus, assessments and code projects.`,
      canvas.width / 2,
      515
    );

    // Signature Block
    // ───────────────── Signature Block ─────────────────
const sigY = 640;

// LEFT SIDE - Mentor Signature
ctx.save();
ctx.fillStyle = '#0f172a';
ctx.font = 'italic 40px "Brush Script MT", "Segoe Script", cursive';
ctx.textAlign = 'center';

ctx.fillText(
  certificate.course?.mentor?.name || 'Dr. Sarah Jenkins',
  300,
  sigY
);

ctx.restore();

// Left signature line
ctx.strokeStyle = '#94a3b8';
ctx.lineWidth = 1;

ctx.beginPath();
ctx.moveTo(170, sigY + 20);
ctx.lineTo(430, sigY + 20);
ctx.stroke();

// Mentor details
ctx.fillStyle = '#0f172a';
ctx.font = 'bold 17px sans-serif';
ctx.textAlign = 'center';
ctx.fillText(
  certificate.course?.mentor?.name || 'Dr. Sarah Jenkins',
  300,
  sigY + 48
);

ctx.fillStyle = '#64748b';
ctx.font = '13px sans-serif';
ctx.fillText(
  'Lead Instructor',
  300,
  sigY + 68
);


// CENTER - Learn Plus Seal
ctx.fillStyle = '#4f46e5';
ctx.font = 'bold 24px sans-serif';
ctx.fillText('LEARN+', canvas.width / 2, sigY + 18);

ctx.fillStyle = '#94a3b8';
ctx.font = '12px sans-serif';
ctx.fillText('OFFICIAL PLATFORM', canvas.width / 2, sigY + 38);


// RIGHT SIDE - Director Signature
ctx.save();
ctx.fillStyle = '#0f172a';
ctx.font = 'italic 40px "Brush Script MT", "Segoe Script", cursive';
ctx.textAlign = 'center';

ctx.fillText('Prof. Alex Mercer', 820, sigY);

ctx.restore();

// Right signature line
ctx.beginPath();
ctx.moveTo(690, sigY + 20);
ctx.lineTo(950, sigY + 20);
ctx.stroke();

// Director details
ctx.fillStyle = '#0f172a';
ctx.font = 'bold 17px sans-serif';
ctx.fillText('Prof. Alex Mercer', 820, sigY + 48);

ctx.fillStyle = '#64748b';
ctx.font = '13px sans-serif';
ctx.fillText('Academic Director', 820, sigY + 68);
    // Footer Metadata (guard against missing fields)
    const issuedAtRaw = certificate?.issuedAt;
    const issueDate = issuedAtRaw
      ? new Date(issuedAtRaw).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : '—';

    const certificateId = certificate?.certificateId || 'LP-XXXX';

    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px monospace';
    ctx.fillText(`Issued: ${issueDate}`, 300, sigY + 80);
    ctx.fillText(`ID: ${certificateId}`, 820, sigY + 80);

    // Save/Download Action
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Certificate-${certificate.course?.title.replace(/\s+/g, '-')}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto p-6 sm:p-8 bg-white border border-slate-100 rounded-2xl shadow-sm">

      
      {/* Visual Screen Preview (CSS-based layout mirroring canvas output) */}
      <div className="w-full border-[6px] md:border-[8px] border-indigo-600 p-4 sm:p-6 relative bg-gradient-to-br from-white to-slate-50 shadow-inner rounded-xl overflow-hidden">


        
        {/* Subtle decorative elements */}
        <div className="absolute top-2 left-2 right-2 bottom-2 border border-slate-900/10 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-600"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-600"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-600"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-600"></div>

        {/* Header */}
        <div className="text-center">
          <p className="text-[10px] sm:text-xs font-bold text-indigo-600 tracking-[0.2em] uppercase">
            Learn Plus Online Academy
          </p>
          <div className="mx-auto w-8 h-8 rounded-full bg-yellow-100 border-2 border-yellow-400 flex items-center justify-center mt-2">
            <span className="text-[7px] font-bold text-yellow-700 leading-none">SEAL</span>
          </div>
        </div>

        {/* Certificate Text */}
        <div className="text-center my-2">
          <h2 className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-slate-800">
            Certificate of Completion
          </h2>
          <p className="text-xs text-slate-400 mt-2">This is proudly presented to</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5 underline decoration-indigo-400 decoration-2 underline-offset-4">
            {certificate?.student?.name || 'Jane Doe'}

          </p>
          <p className="text-xs text-slate-400 mt-2.5">
            for successfully completing the online learning curriculum for
          </p>
          <p className="text-base sm:text-xl font-bold text-indigo-600 mt-1.5 uppercase tracking-wide">
            {certificate.course?.title}
          </p>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-end border-t border-slate-100 pt-4">
          <div className="text-left">
            <p className="text-[9px] text-slate-400">INSTRUCTOR</p>
            <p className="text-xs font-bold text-slate-800 border-t border-slate-300 mt-1 pt-0.5">
              {certificate.course?.mentor?.name}
            </p>
          </div>
          <div className="text-center pb-1">
            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded">LEARN+</span>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-slate-400">CERTIFICATE ID</p>
            <p className="text-xs font-mono font-bold text-slate-800 border-t border-slate-300 mt-1 pt-0.5">
              {certificate?.certificateId || 'LP-XXXX'}

            </p>
          </div>
        </div>
      </div>

      {/* Hidden Download Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Download Action button */}
      <button
        onClick={downloadCertificate}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-lg shadow transition duration-200"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Official Certificate (PNG)
      </button>
    </div>
  );
};

export default Certificate;
