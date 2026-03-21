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
    // debug toggle: show points that were clipped against the brain mesh
    showClippedPoints,
    setShowClippedPoints,
    thinking,
    setThinking,
    burbleUp,
    setBurbleUp,
    onReset
}) {
    // `isAdvancedOpen` toggles the expanded, advanced controls popover.
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    // small helpers for voxel adjustments (used only in compact HUD)
    const decVoxel = () => setPointSize(p => Math.max(0.1, +(p - 0.1).toFixed(1)));
    const incVoxel = () => setPointSize(p => Math.min(5.0, +(p + 0.1).toFixed(1)));

    return (
        <div className="absolute top-4 right-4 z-50 sm:top-6 sm:right-6 w-auto">
            {/* Compact Neural HUD (basic controls only) */}
            <div className="flex items-center gap-4 bg-white/85 backdrop-blur-md border border-zinc-100 rounded-2xl px-3 py-2 shadow-lg">
                <div className="flex items-start gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wide">Burble Flow</span>
                        <div className="flex items-center gap-2 mt-1">
                            <input
                                aria-label="Burble flow"
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={burbleUp}
                                onChange={e => setBurbleUp(parseFloat(e.target.value))}
                                className="h-1 w-36 accent-sky-600"
                            />
                            <span className="text-xs font-mono text-sky-600">{Math.round(burbleUp * 100)}%</span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wide">Voxel Scale</span>
                        <div className="flex items-center gap-2 mt-1">
                            <button aria-label="decrease voxel" onClick={decVoxel} className="w-6 h-6 rounded-md bg-zinc-50 border border-zinc-100 text-zinc-600">-</button>
                            <div className="text-sm font-bold font-mono w-10 text-center">{pointSize.toFixed(1)}</div>
                            <button aria-label="increase voxel" onClick={incVoxel} className="w-6 h-6 rounded-md bg-zinc-50 border border-zinc-100 text-zinc-600">+</button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onReset}
                        className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-[12px] font-semibold shadow-sm"
                        aria-label="Sync Core"
                    >
                        <RotateCcw size={14} />
                        <span className="ml-2">Sync Core</span>
                    </button>

                    <button
                        onClick={() => setIsAdvancedOpen(s => !s)}
                        className="p-2 rounded-lg bg-zinc-50 border border-zinc-100 text-zinc-600 hover:bg-zinc-100"
                        aria-expanded={isAdvancedOpen}
                        aria-controls="neural-hud-advanced"
                        title="Advanced HUD"
                    >
                        <Settings2 size={14} />
                    </button>

                    <button
                        onClick={toggleFullscreen}
                        className="p-2 rounded-lg bg-zinc-50 border border-zinc-100 text-zinc-600 hover:bg-zinc-100"
                        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                    >
                        {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                </div>
            </div>

            {/* Advanced popover — no basic controls duplicated here */}
            {isAdvancedOpen && (
                <div id="neural-hud-advanced" className="mt-3 w-72 bg-white/95 backdrop-blur rounded-2xl border border-zinc-100 shadow-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 shadow-sm"><Activity size={14} /></div>
                            <div>
                                <div className="text-sm font-semibold">Advanced Controls</div>
                                <div className="text-xs text-zinc-400">More visual toggles</div>
                            </div>
                        </div>
                        <button onClick={() => setIsAdvancedOpen(false)} className="text-zinc-400 p-1 rounded hover:bg-zinc-50"><ChevronRight size={16} /></button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                        <button
                            onClick={() => setPlaying(!playing)}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-lg border",
                                playing ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-zinc-50 border-zinc-100 text-zinc-500'
                            )}
                        >
                            {playing ? <Pause size={14} /> : <Play size={14} />}
                            <span className="text-[10px] mt-1">{playing ? 'Pause' : 'Play'}</span>
                        </button>

                        <button
                            onClick={() => setShowXray(!showXray)}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-lg border",
                                showXray ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-zinc-50 border-zinc-100 text-zinc-500'
                            )}
                        >
                            <Eye size={14} />
                            <span className="text-[10px] mt-1">X-Ray</span>
                        </button>

                        <button
                            onClick={() => setShowClippedPoints(!showClippedPoints)}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-lg border",
                                showClippedPoints ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-zinc-50 border-zinc-100 text-zinc-500'
                            )}
                            title="Show points that were clipped to the brain mesh"
                        >
                            <Wind size={14} />
                            <span className="text-[10px] mt-1">Clipping</span>
                        </button>
                    </div>

                    <div>
                        <button
                            onClick={() => setThinking(!thinking)}
                            className={cn(
                                "w-full flex items-center justify-center gap-2 py-2 rounded-lg border font-semibold",
                                thinking ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-zinc-50 border-zinc-100 text-zinc-500'
                            )}
                        >
                            <Zap size={14} /> Neural Synthesis
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
