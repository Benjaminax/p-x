import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FiDownload, FiArrowLeft, FiPrinter, FiCalendar, FiActivity, FiShare2 } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import ThreeViewer from '../components/three/ThreeViewer';
import { getDiseaseInfo } from '../utils/brainDiseases';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export default function SummaryReport() {
    const reportRef = useRef();
    const navigate = useNavigate();
    const [reportData, setReportData] = useState(null);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        // Load data from local storage (set by Dashboard)
        const storedData = localStorage.getItem('diagnosticsModelResult');
        if (storedData) {
            setReportData(JSON.parse(storedData));
        }
    }, []);

    const handleDownloadPDF = async () => {
        if (!reportRef.current) return;
        setDownloading(true);

        try {
            const element = reportRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`NeuroVision_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (error) {
            console.error('PDF generation failed', error);
            alert('Failed to generate PDF');
        } finally {
            setDownloading(false);
        }
    };

    if (!reportData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">No Analysis Data Found</h2>
                    <p className="text-gray-500">Please run a diagnostic scan first.</p>
                    <Link to="/dashboard/doctor/neuro">
                        <Button>Return to Diagnostics</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const diseaseInfo = getDiseaseInfo(reportData.diagnosis);

    return (
        <div className="min-h-screen bg-[var(--color-surface)] py-8 px-4 sm:px-8 font-inter">
            {/* Header Actions */}
            <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center print:hidden">
                <Link to="/dashboard/doctor/neuro">
                    <Button variant="ghost" className="flex items-center gap-2 pl-0 hover:pl-2 transition-all">
                        <FiArrowLeft /> Back to Dashboard
                    </Button>
                </Link>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => window.print()}>
                        <FiPrinter className="mr-2" /> Print
                    </Button>
                    <Button
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        isLoading={downloading}
                    >
                        <FiDownload className="mr-2" /> Download PDF
                    </Button>
                </div>
            </div>

            {/* Report Content */}
            <div
                id="report-content"
                ref={reportRef}
                className="max-w-5xl mx-auto bg-white text-gray-900 shadow-xl rounded-none sm:rounded-xl overflow-hidden print:shadow-none print:m-0 print:w-full"
            >
                {/* Report Header */}
                <div className="bg-[#0f172a] text-white p-10 print:p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight font-outfit">NeuroVision<span className="text-blue-400">.AI</span></h1>
                            <p className="text-slate-400 text-sm mt-1 uppercase tracking-wider">Advanced Diagnostic Assessment</p>
                        </div>
                        <div className="text-right">
                            <div className="inline-flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full text-xs font-mono mb-2 border border-slate-700">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                VERIFIED BY AI
                            </div>
                            <p className="text-sm text-slate-400">Reference: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                        </div>
                    </div>
                </div>

                {/* Patient & Scan Info Row */}
                <div className="grid grid-cols-2 gap-8 p-8 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Patient Details</h3>
                        <div className="space-y-1">
                            <p className="font-bold text-lg text-gray-900">John Doe</p>
                            <p className="text-sm text-gray-600">ID: PT-2024-8492</p>
                            <p className="text-sm text-gray-600">DOB: 12/04/1980 (43y) • Male</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Examination Details</h3>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <FiCalendar className="text-blue-500" />
                                <span className="font-medium">{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <FiActivity className="text-blue-500" />
                                <span className="font-medium">MRI Brain - Multi-Sequence T2/FLAIR</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Scanner: Siemens 3T Magnetom</p>
                        </div>
                    </div>
                </div>

                {/* Diagnostic Summary */}
                <div className="p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-2">
                        Diagnostic Summary
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-2 space-y-6">
                            <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Primary Finding</span>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{reportData.diagnosis}</p>
                            </div>

                            {reportData.deepseek_analysis && (
                                <div className="text-sm text-gray-700 leading-relaxed">
                                    <strong className="block text-gray-900 mb-2 text-base">Clinical Interpretation:</strong>
                                    <p className="bg-gray-50 p-4 rounded-lg border border-gray-100">{reportData.deepseek_analysis}</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* Detailed Findings & 3D Model */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-t border-gray-200">
                    <div className="p-8 border-r border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Detailed Observations</h3>
                        {reportData.findings && reportData.findings.length > 0 ? (
                            <ul className="space-y-3">
                                {reportData.findings.map((finding, i) => (
                                    <li key={i} className="flex gap-3 items-start">
                                        <span className="mt-2 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                                        <span className="text-gray-700 text-sm leading-relaxed">{finding}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">No specific findings listed.</p>
                        )}

                        {diseaseInfo && (
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                                    Pathology Reference
                                </h4>
                                <div className="text-sm text-gray-600 space-y-3 bg-purple-50 p-4 rounded-lg">
                                    <p><strong>Common Symptoms:</strong> {diseaseInfo.symptoms?.join(', ')}</p>
                                    <p><strong>Imaging Characteristics:</strong> {diseaseInfo.imagingFindings?.join(', ')}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-900 relative min-h-[280px] sm:min-h-[400px] flex flex-col justify-end overflow-hidden print:min-h-[300px]">
                        <div className="absolute top-4 left-4 z-10 text-white/50 text-xs font-mono uppercase tracking-widest border border-white/20 px-2 py-1 rounded">
                            3D Visualization Render
                        </div>
                        {/* 3D Viewer inside PDF generation context */}
                        <div className="absolute inset-0">
                            <ThreeViewer
                                diagnosisArea={reportData.diagnosis}
                                bodyPart={reportData.diagnosis === 'no_tumor' ? null : reportData.brain_region}
                                severity={reportData.diagnosis === 'no_tumor' ? 'normal' : (reportData.severity || 'low')}
                                showControls={false}
                            />
                        </div>
                        <div className="relative z-10 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                            <p className="text-white font-bold">{reportData.brain_region || 'Whole Brain'}</p>
                            <p className="text-white/60 text-xs">Visual Representation of Affected Area</p>
                        </div>
                    </div>
                </div>

                {/* Legal Footer */}
                <div className="p-8 bg-gray-50 text-[10px] text-gray-400 border-t border-gray-200">
                    <p className="uppercase tracking-wider font-bold mb-2">Medical Disclaimer</p>
                    <p className="leading-relaxed">
                        This report is generated by an artificial intelligence system (NeuroVision v2.0) and is intended for use as a supportive diagnostic tool only.
                        The analysis provided herein does not constitute a definitive medical diagnosis and should not be used as the sole basis for treatment decisions.
                        All outputs must be reviewed and verified by a licensed physician or radiologist.
                    </p>
                    <div className="mt-4 flex justify-between items-center text-gray-300 font-mono">
                        <span>IMG-HASH: {Math.random().toString(16).substr(2, 12)}</span>
                        <span>CONFIDENTIAL - PATIENT RECORD</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
