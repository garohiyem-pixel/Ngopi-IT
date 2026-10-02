import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FlowNode, FlowEdge, BranchDecision, NodeType } from '../types/flowchart';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Crosshair } from 'lucide-react';

interface HolographicCanvasProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  currentStep: number;
  branchDecision: BranchDecision;
  isPausedAtDecision: boolean;
  selectedNodeId: string | null;
  highlightedType: NodeType | null;
  language: 'id' | 'en' | 'dual';
  isMobile?: boolean;
  onSelectNode: (nodeId: string) => void;
  onChooseBranch: (branch: 'ya' | 'tidak') => void;
  onToggleHighlightType: (type: NodeType | null) => void;
}

export const HolographicCanvas: React.FC<HolographicCanvasProps> = ({
  nodes,
  edges,
  currentStep,
  branchDecision,
  isPausedAtDecision,
  selectedNodeId,
  highlightedType,
  language,
  isMobile = false,
  onSelectNode,
  onChooseBranch,
  onToggleHighlightType,
}) => {
  // Zoom & Pan interactive state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  // Auto-focus active node (enabled by default on mobile)
  const [autoTrack, setAutoTrack] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Auto-zoom & focus on active node for mobile screens
  useEffect(() => {
    if (!autoTrack) return;

    // Check if on mobile or if tracking is requested
    const isSmallScreen =
      isMobile ||
      (typeof window !== 'undefined' && window.innerWidth < 768);

    if (currentStep === 11 || currentStep <= 0) {
      // Complete or reset: smooth zoom back out to 1.0x (Fit on Screen)
      setZoom(1);
      setPan({ x: 0, y: 0 });
      return;
    }

    if (isSmallScreen && currentStep >= 1 && currentStep <= 10) {
      const activeNode = nodes.find((n) => n.stepIndex === currentStep);
      if (activeNode && containerRef.current) {
        const W = containerRef.current.clientWidth || 360;
        const H = containerRef.current.clientHeight || 500;
        const scale = Math.min(W / 1000, H / 1290);

        const nodeCenterX = activeNode.x + activeNode.width / 2;
        const nodeCenterY = activeNode.y + activeNode.height / 2;

        // Target zoom for mobile readability
        const targetZoom = 1.7;
        // Calculate offset from SVG center (500, 645)
        const targetPanX = (500 - nodeCenterX) * scale * targetZoom;
        const targetPanY = (645 - nodeCenterY) * scale * targetZoom;

        setZoom(targetZoom);
        setPan({ x: targetPanX, y: targetPanY });
      }
    }
  }, [currentStep, autoTrack, isMobile, nodes]);

  const handleZoomIn = () => {
    setAutoTrack(false);
    setZoom((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setAutoTrack(false);
    setZoom((prev) => {
      const next = Math.max(prev - 0.25, 0.75);
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetFit = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleToggleAutoTrack = () => {
    const nextState = !autoTrack;
    setAutoTrack(nextState);
    if (!nextState) {
      handleResetFit();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Helper to test if a node is visible/illuminated based on currentStep and branchDecision
  const getNodeState = useCallback(
    (node: FlowNode) => {
      if (node.branch === 'ya' && branchDecision === 'tidak') {
        return { isVisible: false, isScanning: false, isIlluminated: false };
      }

      const isVisible = currentStep >= node.stepIndex;
      const isScanning = currentStep === node.stepIndex;
      const isIlluminated = currentStep >= node.stepIndex;

      return {
        isVisible,
        isScanning,
        isIlluminated,
      };
    },
    [currentStep, branchDecision]
  );

  // Helper to check if an edge is active
  const isEdgeActive = useCallback(
    (edge: FlowEdge) => {
      if (edge.branch === 'ya' && branchDecision === 'tidak') return false;
      if (edge.branch === 'tidak' && branchDecision === 'ya') return false;
      return currentStep >= edge.activeAtStep;
    },
    [currentStep, branchDecision]
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden p-0 select-none ${
        zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Zoom / Fit Floating Controls (Corner, unobtrusive) */}
      <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 p-1 rounded-lg bg-[#090d1c]/85 border border-slate-800/80 backdrop-blur-md shadow-lg pointer-events-auto">
        <button
          onClick={handleToggleAutoTrack}
          title={autoTrack ? 'Auto-Track: Active' : 'Auto-Track: Off'}
          className={`p-1 rounded text-xs transition-colors flex items-center gap-1 ${
            autoTrack
              ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          aria-label="Toggle Auto-Focus Tracking"
        >
          <Crosshair size={12} className={autoTrack ? 'animate-spin' : ''} />
          <span className="hidden xs:inline text-[9px] font-mono">
            {autoTrack ? 'FOCUS' : 'FREE'}
          </span>
        </button>

        <div className="h-3 w-[1px] bg-slate-800" />

        <button
          onClick={handleResetFit}
          title="Fit on Screen"
          className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-colors"
          aria-label="Fit on Screen"
        >
          <Maximize2 size={12} />
        </button>

        <button
          onClick={handleZoomOut}
          disabled={zoom <= 0.75}
          title="Zoom Out"
          className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Zoom Out"
        >
          <ZoomOut size={12} />
        </button>
        <span className="text-[10px] font-mono font-bold text-cyan-400 px-1 min-w-[32px] text-center tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 2.5}
          title="Zoom In"
          className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Zoom In"
        >
          <ZoomIn size={12} />
        </button>
        {zoom !== 1 && (
          <button
            onClick={handleResetFit}
            title="Reset Zoom"
            className="p-1 rounded text-amber-400 hover:bg-slate-800/60 transition-colors"
            aria-label="Reset Zoom"
          >
            <RotateCcw size={11} />
          </button>
        )}
      </div>

      {/* Scalable Canvas Container with Smooth Transition */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-500 ease-out"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          transformOrigin: 'center center',
        }}
      >
        {/* SVG Flowchart Stage - Fits 100% on Screen Without Any Obstruction */}
        <svg
          viewBox="0 0 1000 1290"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full max-w-full max-h-full drop-shadow-[0_0_40px_rgba(6,182,212,0.12)] select-none pointer-events-auto"
        >
          <defs>
            {/* Holographic Glowing Filters */}
            <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="violetGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="amberGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="emeraldGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Linear Gradients for Nodes */}
            <linearGradient id="gradTerminator" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.08" />
            </linearGradient>

            <linearGradient id="gradProcess" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.08" />
            </linearGradient>

            <linearGradient id="gradInputOutput" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.08" />
            </linearGradient>

            <linearGradient id="gradDecision" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.10" />
            </linearGradient>

            {/* Scanning Beam Linear Gradient */}
            <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0" />
              <stop offset="45%" stopColor="#00f0ff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="55%" stopColor="#00f0ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </linearGradient>

            {/* Arrow Head Markers */}
            <marker
              id="arrowhead-dormant"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#334155" opacity="0.6" />
            </marker>

            <marker
              id="arrowhead-active-cyan"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#06b6d4" filter="url(#cyanGlow)" />
            </marker>

            <marker
              id="arrowhead-active-amber"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" filter="url(#amberGlow)" />
            </marker>

            <marker
              id="arrowhead-active-violet"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#a78bfa" filter="url(#violetGlow)" />
            </marker>
          </defs>

          {/* ========================================================================= */}
          {/* FLOWCHART HEADER TITLE (Identical to original diagram image)              */}
          {/* ========================================================================= */}
          <g transform="translate(500, 28)">
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill="#e0f2fe"
              fontSize="21"
              fontWeight="bold"
              fontFamily="system-ui, sans-serif"
              letterSpacing="0.5"
            >
              Flowchart Membuat / Menyeduh Kopi
            </text>
            <text
              x="0"
              y="16"
              textAnchor="middle"
              fill="#38bdf8"
              fontSize="10"
              fontFamily="monospace"
              letterSpacing="2"
              opacity="0.8"
            >
              ALGORITMA MEMBUAT KOPI // ARIF ROHMAN
            </text>
          </g>

          {/* ========================================================================= */}
          {/* IN-SVG LEGEND CARD ("Keterangan Simbol" - Exactly matches diagram layout)  */}
          {/* Placed at x: 710, y: 55, NEVER obstructs any node or line                 */}
          {/* ========================================================================= */}
          <g transform="translate(710, 55)">
            {/* Card Frame */}
            <rect
              x="0"
              y="0"
              width="260"
              height="250"
              rx="8"
              fill="#080c1a"
              stroke="#1e293b"
              strokeWidth="1.5"
            />
            {/* Legend Header */}
            <text
              x="16"
              y="24"
              fill="#f1f5f9"
              fontSize="13"
              fontWeight="bold"
              fontFamily="system-ui, sans-serif"
            >
              Keterangan Simbol
            </text>
            <line x1="16" y1="32" x2="244" y2="32" stroke="#1e293b" strokeWidth="1" />

            {/* 1. Terminator */}
            <g
              transform="translate(16, 44)"
              className="cursor-pointer"
              onClick={() =>
                onToggleHighlightType(
                  highlightedType === 'terminator' ? null : 'terminator'
                )
              }
            >
              <rect
                x="0"
                y="0"
                width="64"
                height="28"
                rx="14"
                fill="rgba(16, 185, 129, 0.15)"
                stroke="#10b981"
                strokeWidth="1.5"
                filter={highlightedType === 'terminator' ? 'url(#emeraldGlow)' : undefined}
              />
              <text x="76" y="13" fill="#f1f5f9" fontSize="12" fontWeight="600">
                Terminator
              </text>
              <text x="76" y="25" fill="#64748b" fontSize="10" fontFamily="sans-serif">
                (Mulai / Selesai)
              </text>
            </g>

            {/* 2. Proses */}
            <g
              transform="translate(16, 84)"
              className="cursor-pointer"
              onClick={() =>
                onToggleHighlightType(
                  highlightedType === 'process' ? null : 'process'
                )
              }
            >
              <rect
                x="0"
                y="0"
                width="64"
                height="28"
                rx="3"
                fill="rgba(139, 92, 246, 0.15)"
                stroke="#8b5cf6"
                strokeWidth="1.5"
                filter={highlightedType === 'process' ? 'url(#violetGlow)' : undefined}
              />
              <text x="76" y="13" fill="#f1f5f9" fontSize="12" fontWeight="600">
                Proses
              </text>
              <text x="76" y="25" fill="#64748b" fontSize="10" fontFamily="sans-serif">
                (Langkah kegiatan)
              </text>
            </g>

            {/* 3. Input / Output */}
            <g
              transform="translate(16, 124)"
              className="cursor-pointer"
              onClick={() =>
                onToggleHighlightType(
                  highlightedType === 'input_output' ? null : 'input_output'
                )
              }
            >
              <polygon
                points="10,0 64,0 54,28 0,28"
                fill="rgba(6, 182, 212, 0.15)"
                stroke="#06b6d4"
                strokeWidth="1.5"
                filter={highlightedType === 'input_output' ? 'url(#cyanGlow)' : undefined}
              />
              <text x="76" y="13" fill="#f1f5f9" fontSize="12" fontWeight="600">
                Input / Output
              </text>
              <text x="76" y="25" fill="#64748b" fontSize="10" fontFamily="sans-serif">
                (Data / Informasi)
              </text>
            </g>

            {/* 4. Decision */}
            <g
              transform="translate(16, 164)"
              className="cursor-pointer"
              onClick={() =>
                onToggleHighlightType(
                  highlightedType === 'decision' ? null : 'decision'
                )
              }
            >
              <polygon
                points="32,0 64,14 32,28 0,14"
                fill="rgba(245, 158, 11, 0.18)"
                stroke="#f59e0b"
                strokeWidth="1.5"
                filter={highlightedType === 'decision' ? 'url(#amberGlow)' : undefined}
              />
              <text x="76" y="13" fill="#f1f5f9" fontSize="12" fontWeight="600">
                Decision
              </text>
              <text x="76" y="25" fill="#64748b" fontSize="10" fontFamily="sans-serif">
                (Percabangan)
              </text>
            </g>

            {/* 5. Alur proses */}
            <g transform="translate(16, 204)">
              <line
                x1="4"
                y1="14"
                x2="52"
                y2="14"
                stroke="#06b6d4"
                strokeWidth="2"
                markerEnd="url(#arrowhead-active-cyan)"
              />
              <text x="76" y="13" fill="#f1f5f9" fontSize="12" fontWeight="600">
                Alur proses
              </text>
              <text x="76" y="25" fill="#64748b" fontSize="10" fontFamily="sans-serif">
                (Panjang panah)
              </text>
            </g>
          </g>

          {/* ========================================================================= */}
          {/* CONNECTING ENERGY FLOW ARROWS                                             */}
          {/* ========================================================================= */}
          <g className="edges-layer">
            {edges.map((edge) => {
              const active = isEdgeActive(edge);
              const pathData = edge.points
                .map((p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
                .join(' ');

              let activeColor = '#06b6d4';
              let markerUrl = 'url(#arrowhead-active-cyan)';
              if (edge.branch === 'ya') {
                activeColor = '#a78bfa';
                markerUrl = 'url(#arrowhead-active-violet)';
              } else if (edge.branch === 'tidak') {
                activeColor = '#f59e0b';
                markerUrl = 'url(#arrowhead-active-amber)';
              }

              return (
                <g key={edge.id} className="transition-all duration-500">
                  {/* Conduit Line */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={active ? 'rgba(255,255,255,0.12)' : 'rgba(51, 65, 85, 0.45)'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    markerEnd={active ? markerUrl : 'url(#arrowhead-dormant)'}
                  />

                  {/* Luminous Energy Stream Core */}
                  {active && (
                    <>
                      <path
                        d={pathData}
                        fill="none"
                        stroke={activeColor}
                        strokeWidth="5"
                        strokeOpacity="0.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#cyanGlow)"
                      />
                      <path
                        d={pathData}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="12 18"
                        style={{
                          animation: 'energyPulse 2s ease-in-out infinite',
                        }}
                      />
                    </>
                  )}

                  {/* Branch Labels (Ya / Tidak) */}
                  {edge.label && edge.labelPosition && (
                    <g
                      transform={`translate(${edge.labelPosition.x}, ${edge.labelPosition.y})`}
                      className="cursor-pointer"
                      onClick={() => {
                        if (edge.branch === 'ya' || edge.branch === 'tidak') {
                          onChooseBranch(edge.branch);
                        }
                      }}
                    >
                      <rect
                        x="-24"
                        y="-16"
                        width="48"
                        height="24"
                        rx="4"
                        fill="#070a14"
                        stroke={
                          edge.branch === 'ya'
                            ? branchDecision === 'tidak'
                              ? '#334155'
                              : '#8b5cf6'
                            : branchDecision === 'ya'
                            ? '#334155'
                            : '#f59e0b'
                        }
                        strokeWidth={
                          (edge.branch === 'ya' && branchDecision !== 'tidak') ||
                          (edge.branch === 'tidak' && branchDecision !== 'ya')
                            ? '1.5'
                            : '1'
                        }
                        filter={
                          active || isPausedAtDecision
                            ? edge.branch === 'ya'
                              ? 'url(#violetGlow)'
                              : 'url(#amberGlow)'
                            : undefined
                        }
                      />
                      <text
                        x="0"
                        y="1"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontFamily="system-ui, sans-serif"
                        fontWeight="bold"
                        fontSize="12"
                        fill={
                          edge.branch === 'ya'
                            ? branchDecision === 'tidak'
                              ? '#64748b'
                              : '#c4b5fd'
                            : branchDecision === 'ya'
                            ? '#64748b'
                            : '#fcd34d'
                        }
                      >
                        {edge.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* ========================================================================= */}
          {/* FLOWCHART NODES LAYER                                                     */}
          {/* ========================================================================= */}
          <g className="nodes-layer">
            {nodes.map((node) => {
              const { isVisible, isScanning, isIlluminated } = getNodeState(node);
              const isSelected = selectedNodeId === node.id;
              const isHighlightedByLegend = highlightedType === node.type;

              return (
                <g
                  key={node.id}
                  className="transition-all duration-300 cursor-pointer"
                  onClick={() => onSelectNode(node.id)}
                  opacity={
                    !isVisible
                      ? 0.2
                      : isHighlightedByLegend
                      ? 1
                      : highlightedType !== null
                      ? 0.4
                      : 1
                  }
                >
                  {/* Selection Reticles */}
                  {isSelected && (
                    <g className="transition-all">
                      <path
                        d={`M ${node.x - 8} ${node.y + 12} L ${node.x - 8} ${node.y - 8} L ${
                          node.x + 12
                        } ${node.y - 8}`}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2"
                      />
                      <path
                        d={`M ${node.x + node.width + 8} ${node.y + 12} L ${
                          node.x + node.width + 8
                        } ${node.y - 8} L ${node.x + node.width - 12} ${node.y - 8}`}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2"
                      />
                      <path
                        d={`M ${node.x - 8} ${node.y + node.height - 12} L ${
                          node.x - 8
                        } ${node.y + node.height + 8} L ${node.x + 12} ${
                          node.y + node.height + 8
                        }`}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2"
                      />
                      <path
                        d={`M ${node.x + node.width + 8} ${
                          node.y + node.height - 12
                        } L ${node.x + node.width + 8} ${
                          node.y + node.height + 8
                        } L ${node.x + node.width - 12} ${
                          node.y + node.height + 8
                        }`}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2"
                      />
                    </g>
                  )}

                  {/* 1. TERMINATOR - Pill Shape */}
                  {node.type === 'terminator' && (
                    <g>
                      <rect
                        x={node.x}
                        y={node.y}
                        width={node.width}
                        height={node.height}
                        rx={node.height / 2}
                        fill={isIlluminated ? 'url(#gradTerminator)' : '#070a14'}
                        stroke={isIlluminated ? '#10b981' : '#334155'}
                        strokeWidth={isIlluminated ? '2' : '1.5'}
                        filter={isIlluminated ? 'url(#emeraldGlow)' : undefined}
                      />

                      {/* Laser Sweep */}
                      {isScanning && (
                        <g clipPath={`url(#clip-pill-${node.id})`}>
                          <clipPath id={`clip-pill-${node.id}`}>
                            <rect
                              x={node.x}
                              y={node.y}
                              width={node.width}
                              height={node.height}
                              rx={node.height / 2}
                            />
                          </clipPath>
                          <rect
                            x={node.x - 10}
                            y={node.y}
                            width={node.width + 20}
                            height="24"
                            fill="url(#laserBeamGrad)"
                            className="animate-laser-sweep"
                          />
                        </g>
                      )}

                      <text
                        x={node.x + node.width / 2}
                        y={node.y + node.height / 2 + 1}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={isIlluminated ? '#ecfdf5' : '#64748b'}
                        fontWeight="bold"
                        fontSize="17"
                        fontFamily="system-ui, sans-serif"
                      >
                        {language === 'en' ? node.titleEn : node.titleId}
                      </text>
                    </g>
                  )}

                  {/* 2. INPUT / OUTPUT - Parallelogram */}
                  {node.type === 'input_output' && (
                    <g>
                      {(() => {
                        const skew = 28;
                        const x1 = node.x + skew;
                        const y1 = node.y;
                        const x2 = node.x + node.width;
                        const y2 = node.y;
                        const x3 = node.x + node.width - skew;
                        const y3 = node.y + node.height;
                        const x4 = node.x;
                        const y4 = node.y + node.height;
                        const polyPoints = `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`;

                        return (
                          <>
                            <polygon
                              points={polyPoints}
                              fill={isIlluminated ? 'url(#gradInputOutput)' : '#070a14'}
                              stroke={isIlluminated ? '#06b6d4' : '#334155'}
                              strokeWidth={isIlluminated ? '2' : '1.5'}
                              filter={isIlluminated ? 'url(#cyanGlow)' : undefined}
                            />

                            {isScanning && (
                              <g clipPath={`url(#clip-poly-${node.id})`}>
                                <clipPath id={`clip-poly-${node.id}`}>
                                  <polygon points={polyPoints} />
                                </clipPath>
                                <rect
                                  x={node.x - 20}
                                  y={node.y}
                                  width={node.width + 40}
                                  height="28"
                                  fill="url(#laserBeamGrad)"
                                  className="animate-laser-sweep"
                                />
                              </g>
                            )}

                            {node.itemsId ? (
                              <g transform={`translate(${node.x + 40}, ${node.y + 24})`}>
                                <text
                                  x="0"
                                  y="0"
                                  fill={isIlluminated ? '#38bdf8' : '#64748b'}
                                  fontWeight="bold"
                                  fontSize="14"
                                  fontFamily="system-ui, sans-serif"
                                >
                                  {language === 'en' ? node.titleEn : node.titleId}
                                </text>
                                {(language === 'en' ? node.itemsEn : node.itemsId)?.map(
                                  (item, i) => (
                                    <text
                                      key={i}
                                      x="6"
                                      y={22 + i * 20}
                                      fill={isIlluminated ? '#e2e8f0' : '#64748b'}
                                      fontSize="12.5"
                                      fontFamily="system-ui, sans-serif"
                                      fontWeight="500"
                                    >
                                      {item}
                                    </text>
                                  )
                                )}
                              </g>
                            ) : (
                              <text
                                x={node.x + node.width / 2}
                                y={node.y + node.height / 2 + 1}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill={isIlluminated ? '#ecfeff' : '#64748b'}
                                fontWeight="bold"
                                fontSize="16"
                                fontFamily="system-ui, sans-serif"
                              >
                                {language === 'en' ? node.titleEn : node.titleId}
                              </text>
                            )}
                          </>
                        );
                      })()}
                    </g>
                  )}

                  {/* 3. PROSES - Lavender Rectangle */}
                  {node.type === 'process' && (
                    <g>
                      <rect
                        x={node.x}
                        y={node.y}
                        width={node.width}
                        height={node.height}
                        rx="4"
                        fill={isIlluminated ? 'url(#gradProcess)' : '#070a14'}
                        stroke={isIlluminated ? '#8b5cf6' : '#334155'}
                        strokeWidth={isIlluminated ? '1.8' : '1.5'}
                        filter={isIlluminated ? 'url(#violetGlow)' : undefined}
                      />

                      {isScanning && (
                        <g clipPath={`url(#clip-rect-${node.id})`}>
                          <clipPath id={`clip-rect-${node.id}`}>
                            <rect
                              x={node.x}
                              y={node.y}
                              width={node.width}
                              height={node.height}
                              rx="4"
                            />
                          </clipPath>
                          <rect
                            x={node.x - 10}
                            y={node.y}
                            width={node.width + 20}
                            height="24"
                            fill="url(#laserBeamGrad)"
                            className="animate-laser-sweep"
                          />
                        </g>
                      )}

                      {node.subtitleId ? (
                        <g transform={`translate(${node.x + node.width / 2}, ${node.y + node.height / 2})`}>
                          <text
                            x="0"
                            y="-9"
                            textAnchor="middle"
                            fill={isIlluminated ? '#f5f3ff' : '#64748b'}
                            fontWeight="bold"
                            fontSize="15"
                            fontFamily="system-ui, sans-serif"
                          >
                            {language === 'en' ? node.titleEn : node.titleId}
                          </text>
                          <text
                            x="0"
                            y="12"
                            textAnchor="middle"
                            fill={isIlluminated ? '#c4b5fd' : '#475569'}
                            fontSize="13"
                            fontFamily="system-ui, sans-serif"
                          >
                            {language === 'en' ? node.subtitleEn : node.subtitleId}
                          </text>
                        </g>
                      ) : (
                        <text
                          x={node.x + node.width / 2}
                          y={node.y + node.height / 2 + 1}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={isIlluminated ? '#f5f3ff' : '#64748b'}
                          fontWeight="bold"
                          fontSize="15"
                          fontFamily="system-ui, sans-serif"
                        >
                          {language === 'en' ? node.titleEn : node.titleId}
                        </text>
                      )}
                    </g>
                  )}

                  {/* 4. DECISION - Amber Diamond */}
                  {node.type === 'decision' && (
                    <g>
                      {(() => {
                        const cx = node.x + node.width / 2;
                        const cy = node.y + node.height / 2;
                        const halfW = node.width / 2;
                        const halfH = node.height / 2;
                        const diamondPoints = `${cx},${cy - halfH} ${cx + halfW},${cy} ${cx},${cy + halfH} ${cx - halfW},${cy}`;

                        return (
                          <>
                            <polygon
                              points={diamondPoints}
                              fill={isIlluminated ? 'url(#gradDecision)' : '#070a14'}
                              stroke={isIlluminated ? '#f59e0b' : '#334155'}
                              strokeWidth={isIlluminated ? '2' : '1.5'}
                              filter={isIlluminated ? 'url(#amberGlow)' : undefined}
                            />

                            {isScanning && (
                              <g clipPath={`url(#clip-diamond-${node.id})`}>
                                <clipPath id={`clip-diamond-${node.id}`}>
                                  <polygon points={diamondPoints} />
                                </clipPath>
                                <rect
                                  x={node.x - 20}
                                  y={node.y}
                                  width={node.width + 40}
                                  height="28"
                                  fill="url(#laserBeamGrad)"
                                  className="animate-laser-sweep"
                                />
                              </g>
                            )}

                            {isPausedAtDecision && (
                              <g className="animate-pulse">
                                <circle cx={cx - halfW} cy={cy} r="6" fill="#8b5cf6" filter="url(#violetGlow)" />
                                <circle cx={cx + halfW} cy={cy} r="6" fill="#f59e0b" filter="url(#amberGlow)" />
                              </g>
                            )}

                            <text
                              x={cx}
                              y={cy + 1}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill={isIlluminated ? '#fffbeb' : '#64748b'}
                              fontWeight="bold"
                              fontSize="16"
                              fontFamily="system-ui, sans-serif"
                            >
                              {language === 'en' ? node.titleEn : node.titleId}
                            </text>
                          </>
                        );
                      })()}
                    </g>
                  )}

                  {/* Micro badge */}
                  {isIlluminated && (
                    <g transform={`translate(${node.x + node.width - 24}, ${node.y - 8})`}>
                      <rect
                        x="0"
                        y="0"
                        width="32"
                        height="16"
                        rx="3"
                        fill="#070a14"
                        stroke={node.type === 'decision' ? '#f59e0b' : node.type === 'terminator' ? '#10b981' : '#06b6d4'}
                        strokeWidth="1"
                      />
                      <text
                        x="16"
                        y="11"
                        textAnchor="middle"
                        fill="#38bdf8"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {node.telemetry.metric.slice(0, 3)}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};
