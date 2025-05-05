// filepath: src/renderer/components/Icons.tsx
import React from 'react';

export const MicrophoneIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 384 512" 
    className={className}>
    <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/></svg>
);

export const StopIcon = ({ className }: { className?: string }) => (
    
    <svg xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 512 512"
    className={className}>
    <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192zm0 224a128 128 0 1 0 0-256 128 128 0 1 0 0 256zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
    );


