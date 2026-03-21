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
            <div className="w-[min(92vw,640px)] rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white/95 via-slate-50/90 to-cyan-50/70 p-3 shadow-[0_10px_30px_rgba(2,6,23,0.14)] backdrop-blur-xl">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2.5">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">Burble Flow</span>
                                <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[11px] font-mono font-bold text-cyan-700">{Math.round(burbleUp * 100)}%</span>
                            </div>
                            <input
                                aria-label="Burble flow"
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={burbleUp}
                                onChange={e => setBurbleUp(parseFloat(e.target.value))}
                                className="h-1.5 w-full cursor-pointer accent-cyan-600"
                            />
                        </div>

                        <div className="rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2.5">
                            <span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">Voxel Scale</span>
                            <div className="flex items-center justify-between gap-2">
                                <button
                                    aria-label="decrease voxel"
                                    onClick={decVoxel}
                                    className="h-8 w-8 rounded-lg border border-slate-200 bg-slate-50 text-lg leading-none text-slate-700 transition hover:bg-slate-100"
                                >
                                    -
                                </button>
                                <div className="min-w-[56px] rounded-lg border border-cyan-100 bg-cyan-50 px-2 py-1 text-center text-sm font-bold font-mono text-cyan-800">
                                    {pointSize.toFixed(1)}
                                </div>
                                <button
                                    aria-label="increase voxel"
                                    onClick={incVoxel}
                                    className="h-8 w-8 rounded-lg border border-slate-200 bg-slate-50 text-lg leading-none text-slate-700 transition hover:bg-slate-100"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={onReset}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-3 py-2 text-[12px] font-semibold text-white shadow-sm transition hover:brightness-105"
                            aria-label="Sync Core"
                        >
                            <RotateCcw size={14} />
                            <span>Sync Core</span>
                        </button>

                        <button
                            onClick={() => setIsAdvancedOpen(s => !s)}
                            className="rounded-xl border border-slate-200 bg-white/80 p-2 text-slate-600 transition hover:bg-slate-100"
                            aria-expanded={isAdvancedOpen}
                            aria-controls="neural-hud-advanced"
                            title="Advanced HUD"
                        >
                            <Settings2 size={14} />
                        </button>

                        <button
                            onClick={toggleFullscreen}
                            className="rounded-xl border border-slate-200 bg-white/80 p-2 text-slate-600 transition hover:bg-slate-100"
                            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                        >
                            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                        </button>
                    </div>
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
