import React, { useState } from 'react';
import {
    Maximize2,
    Minimize2,
    Play,
    Pause,
    RotateCcw,
    Activity,
    Zap,
    Wind,
    Eye,
    ChevronRight,
    ChevronLeft,
    Settings2
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ControlsPanel({
    playing,
    setPlaying,
    pointSize,
    setPointSize,
    isFullscreen,
    toggleFullscreen,
    showXray,
    setShowXray,
    thinking,
    setThinking,
    burbleUp,
    setBurbleUp,
    onReset
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={cn(
            "absolute top-6 right-6 z-50 transition-all duration-500 ease-in-out",
            isCollapsed ? "w-14" : "w-72"
        )}>
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-zinc-200 shadow-xl overflow-hidden flex flex-col">
                {/* Header / Collapse Toggle */}
                <div className={cn(
                    "flex items-center justify-between border-b border-zinc-100 p-3 bg-zinc-50/50",
                    isCollapsed && "border-none flex-col gap-4 py-4"
                )}>
                    <div className={cn(
                        "flex items-center gap-2",
                        isCollapsed && "flex-col"
                    )}>
                        <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 shadow-sm">
                            <Activity size={16} />
                        </div>
                        {!isCollapsed && (
                            <span className="text-[10px] font-bold font-sora uppercase tracking-[0.2em] text-zinc-500">Neural HUD</span>
                        )}
                    </div>

                    <div className={cn(
                        "flex items-center gap-1",
                        isCollapsed && "flex-col"
                    )}>
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-all"
                            title={isCollapsed ? "Expand HUD" : "Collapse HUD"}
                        >
                            {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                        </button>
                    </div>
                </div>

                {!isCollapsed && (
                    <div className="p-5 space-y-6">
                        {/* Secondary Header Controls */}
                        <div className="flex items-center justify-end gap-2 -mt-2">
                            <button
                                onClick={toggleFullscreen}
                                className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-100 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-all"
                                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                            >
                                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                            </button>
                        </div>

                        {/* Main Toggles */}
                        <div className="grid grid-cols-2 gap-2 relative z-10">
                            <button
                                onClick={() => setPlaying(!playing)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-1.5",
                                    playing
                                        ? "bg-sky-50 border-sky-200 text-sky-700"
                                        : "bg-zinc-50 border-zinc-100 text-zinc-400"
                                )}
                            >
                                {playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                                <span className="text-[9px] font-bold font-sora uppercase tracking-tight">{playing ? "Active" : "Static"}</span>
                            </button>

                            <button
                                onClick={() => setShowXray(!showXray)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-1.5",
                                    showXray
                                        ? "bg-sky-50 border-sky-200 text-sky-700"
                                        : "bg-zinc-50 border-zinc-100 text-zinc-400"
                                )}
                            >
                                <Eye size={14} />
                                <span className="text-[9px] font-bold font-sora uppercase tracking-tight">X-Ray Mode</span>
                            </button>

                            <button
                                onClick={() => setThinking(!thinking)}
                                className={cn(
                                    "col-span-2 flex items-center justify-center p-2.5 rounded-xl border transition-all gap-3",
                                    thinking
                                        ? "bg-amber-50 border-amber-200 text-amber-700"
                                        : "bg-zinc-50 border-zinc-100 text-zinc-400"
                                )}
                            >
                                <Zap size={13} className={thinking ? "animate-pulse" : ""} fill={thinking ? "currentColor" : "none"} />
                                <span className="text-[10px] font-bold font-sora uppercase tracking-wider">Neural Synthesis</span>
                            </button>
                        </div>

                        {/* Sliders */}
                        <div className="space-y-5 relative z-10 pt-1">
                            <div className="space-y-2.5">
                                <div className="flex justify-between items-center text-[10px] font-bold font-sora uppercase text-zinc-500 tracking-wide">
                                    <span className="flex items-center gap-1.5"><Wind size={10} /> Burble Flow</span>
                                    <span className="text-sky-600 font-mono">{(burbleUp * 100).toFixed(0)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.0"
                                    max="1.0"
                                    step="0.01"
                                    value={burbleUp}
                                    onChange={(e) => setBurbleUp(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-sky-600"
                                />
                            </div>

                            <div className="space-y-2.5">
                                <div className="flex justify-between items-center text-[10px] font-bold font-sora uppercase text-zinc-500 tracking-wide">
                                    <span>Voxel Scale</span>
                                    <span className="text-sky-600 font-mono">{(pointSize).toFixed(1)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="5.0"
                                    step="0.1"
                                    value={pointSize}
                                    onChange={(e) => setPointSize(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-sky-600"
                                />
                            </div>
                        </div>

                        {/* Recalibrate */}
                        <div className="pt-2 relative z-10">
                            <button
                                onClick={onReset}
                                className="w-full h-11 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center gap-2 text-[10px] font-bold font-sora text-zinc-400 uppercase tracking-widest hover:bg-zinc-100 hover:text-zinc-600 transition-all active:scale-[0.98]"
                            >
                                <RotateCcw size={12} /> Sync Core
                            </button>
                        </div>
                    </div>
                )}

                {isCollapsed && (
                    <div className="flex flex-col items-center py-4 gap-4 bg-zinc-50/20">
                        <button
                            onClick={() => setPlaying(!playing)}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                playing ? "text-sky-600 bg-sky-50" : "text-zinc-400 hover:bg-zinc-100"
                            )}
                            title={playing ? "Pause" : "Play"}
                        >
                            {playing ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <button
                            onClick={() => setShowXray(!showXray)}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                showXray ? "text-sky-600 bg-sky-50" : "text-zinc-400 hover:bg-zinc-100"
                            )}
                            title="X-Ray Mode"
                        >
                            <Eye size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
